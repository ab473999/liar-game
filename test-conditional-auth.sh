#!/bin/bash

# Test conditional authentication in Liar Game
# This script tests both backend and frontend behavior with IS_AUTH_ENABLED on/off

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

echo -e "${BOLD}${BLUE}======================================"
echo -e "   Liar Game Conditional Auth Test"
echo -e "======================================${NC}\n"

# Function to check current auth status
check_auth_status() {
    echo -e "${YELLOW}Checking current authentication status...${NC}"
    
    # Check backend .env
    if [ -f "/root/liar-game/backend/.env" ]; then
        backend_auth=$(grep "^IS_AUTH_ENABLED=" /root/liar-game/backend/.env | cut -d'=' -f2 | tr -d '"' | tr -d "'")
        echo -e "Backend IS_AUTH_ENABLED: ${BOLD}$backend_auth${NC}"
    else
        echo -e "${RED}Backend .env not found${NC}"
        backend_auth=""
    fi
    
    # Check frontend .env
    if [ -f "/root/liar-game/frontend-vite/.env" ]; then
        frontend_auth=$(grep "^VITE_IS_AUTH_ENABLED=" /root/liar-game/frontend-vite/.env | cut -d'=' -f2 | tr -d '"' | tr -d "'")
        echo -e "Frontend VITE_IS_AUTH_ENABLED: ${BOLD}$frontend_auth${NC}"
    else
        echo -e "${RED}Frontend .env not found${NC}"
        frontend_auth=""
    fi
    
    echo ""
}

# Function to set auth enabled/disabled
set_auth_status() {
    local status=$1
    echo -e "${YELLOW}Setting IS_AUTH_ENABLED to: ${BOLD}$status${NC}"
    
    # Update backend .env
    if grep -q "^IS_AUTH_ENABLED=" /root/liar-game/backend/.env 2>/dev/null; then
        sed -i "s/^IS_AUTH_ENABLED=.*/IS_AUTH_ENABLED=$status/" /root/liar-game/backend/.env
        echo -e "${GREEN}✓ Updated backend .env${NC}"
    else
        echo "IS_AUTH_ENABLED=$status" >> /root/liar-game/backend/.env
        echo -e "${GREEN}✓ Added to backend .env${NC}"
    fi
    
    # Update frontend .env
    if [ ! -f "/root/liar-game/frontend-vite/.env" ]; then
        touch /root/liar-game/frontend-vite/.env
    fi
    
    if grep -q "^VITE_IS_AUTH_ENABLED=" /root/liar-game/frontend-vite/.env 2>/dev/null; then
        sed -i "s/^VITE_IS_AUTH_ENABLED=.*/VITE_IS_AUTH_ENABLED=$status/" /root/liar-game/frontend-vite/.env
        echo -e "${GREEN}✓ Updated frontend .env${NC}"
    else
        echo "VITE_IS_AUTH_ENABLED=$status" >> /root/liar-game/frontend-vite/.env
        echo -e "${GREEN}✓ Added to frontend .env${NC}"
    fi
    
    echo ""
}

# Function to test backend API with auth disabled
test_backend_no_auth() {
    echo -e "${YELLOW}Testing backend API with auth disabled...${NC}"
    
    # Test creating a theme without authentication
    echo -e "${BLUE}Creating theme without auth header:${NC}"
    response=$(curl -s -X POST http://localhost:8001/api/themes \
        -H "Content-Type: application/json" \
        -d '{"type": "test_noauth", "name": "Test No Auth"}' \
        -w "\nHTTP_STATUS:%{http_code}")
    
    http_status=$(echo "$response" | tail -n 1 | cut -d':' -f2)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_status" = "201" ] || [ "$http_status" = "409" ]; then
        echo -e "${GREEN}✓ Request succeeded without auth (status: $http_status)${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    else
        echo -e "${RED}✗ Request failed (status: $http_status)${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    fi
    
    echo ""
}

# Function to test backend API with auth enabled
test_backend_with_auth() {
    echo -e "${YELLOW}Testing backend API with auth enabled...${NC}"
    
    # Test creating a theme without authentication (should fail)
    echo -e "${BLUE}Creating theme without auth header (should fail):${NC}"
    response=$(curl -s -X POST http://localhost:8001/api/themes \
        -H "Content-Type: application/json" \
        -d '{"type": "test_auth1", "name": "Test Auth 1"}' \
        -w "\nHTTP_STATUS:%{http_code}")
    
    http_status=$(echo "$response" | tail -n 1 | cut -d':' -f2)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_status" = "401" ]; then
        echo -e "${GREEN}✓ Request correctly rejected without auth (status: $http_status)${NC}"
    else
        echo -e "${RED}✗ Request should have been rejected (status: $http_status)${NC}"
    fi
    
    # Test with authentication
    echo -e "\n${BLUE}Creating theme with auth header (should succeed):${NC}"
    response=$(curl -s -X POST http://localhost:8001/api/themes \
        -H "Content-Type: application/json" \
        -H "Authorization: Bearer ciao" \
        -d '{"type": "test_auth2", "name": "Test Auth 2"}' \
        -w "\nHTTP_STATUS:%{http_code}")
    
    http_status=$(echo "$response" | tail -n 1 | cut -d':' -f2)
    body=$(echo "$response" | head -n -1)
    
    if [ "$http_status" = "201" ] || [ "$http_status" = "409" ]; then
        echo -e "${GREEN}✓ Request succeeded with auth (status: $http_status)${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    else
        echo -e "${RED}✗ Request failed with auth (status: $http_status)${NC}"
        echo "$body" | python3 -m json.tool 2>/dev/null || echo "$body"
    fi
    
    echo ""
}

# Function to restart services
restart_services() {
    echo -e "${YELLOW}Restarting services to load new configuration...${NC}"
    cd /root/liar-game && ./restart.sh > /dev/null 2>&1
    echo -e "${GREEN}✓ Services restarted${NC}"
    echo -e "${YELLOW}Waiting for services to initialize...${NC}"
    sleep 5
    echo ""
}

# Main menu
show_menu() {
    echo -e "${BOLD}Choose a test option:${NC}"
    echo "1) Check current auth status"
    echo "2) Test with auth DISABLED"
    echo "3) Test with auth ENABLED"
    echo "4) Run full test suite (test both modes)"
    echo "0) Exit"
    echo -n "Enter choice: "
}

# Main execution
main() {
    while true; do
        show_menu
        read -r choice
        echo ""
        
        case $choice in
            1)
                check_auth_status
                ;;
            2)
                set_auth_status "false"
                restart_services
                check_auth_status
                test_backend_no_auth
                ;;
            3)
                set_auth_status "true"
                restart_services
                check_auth_status
                test_backend_with_auth
                ;;
            4)
                echo -e "${BOLD}${BLUE}=== Testing with Auth DISABLED ===${NC}\n"
                set_auth_status "false"
                restart_services
                check_auth_status
                test_backend_no_auth
                
                echo -e "${BOLD}${BLUE}=== Testing with Auth ENABLED ===${NC}\n"
                set_auth_status "true"
                restart_services
                check_auth_status
                test_backend_with_auth
                
                echo -e "${GREEN}${BOLD}✅ Full test suite completed!${NC}"
                ;;
            0)
                echo -e "${GREEN}Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid option. Please try again.${NC}\n"
                ;;
        esac
        
        echo -e "${YELLOW}Press Enter to continue...${NC}"
        read -r
        echo ""
    done
}

# Run main function
main
