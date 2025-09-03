#!/bin/bash
# Status script for Liar Game services

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Liar Game Services Status ===${NC}\n"

# Function to check HTTP endpoint
check_http_endpoint() {
    local url=$1
    local name=$2
    
    echo -e "${YELLOW}Testing $name: $url${NC}"
    
    # Use curl with timeout and follow redirects
    response=$(curl -s -o /dev/null -w "%{http_code}" -L --connect-timeout 5 "$url" 2>/dev/null)
    
    if [ "$response" == "200" ]; then
        echo -e "${GREEN}✓ HTTP 200 OK${NC}"
    elif [ "$response" == "301" ] || [ "$response" == "302" ] || [ "$response" == "307" ]; then
        echo -e "${YELLOW}✓ HTTP $response (Redirect)${NC}"
    elif [ "$response" == "000" ]; then
        echo -e "${RED}✗ Connection failed${NC}"
    else
        echo -e "${RED}✗ HTTP $response${NC}"
    fi
}

# Function to check tmux session
check_tmux_session() {
    local session=$1
    local port=$2
    
    echo -e "${BLUE}--- $session Status ---${NC}"
    
    if tmux has-session -t $session 2>/dev/null; then
        echo -e "${GREEN}✓ tmux session '$session' is running${NC}"
        
        # Check if port is actually listening
        if lsof -i:$port &>/dev/null; then
            echo -e "${GREEN}✓ Port $port is listening${NC}"
        else
            echo -e "${RED}✗ Port $port is NOT listening${NC}"
        fi
        
        # Show last few lines from tmux session
        echo -e "${YELLOW}Recent output:${NC}"
        tmux capture-pane -t $session -p | tail -n 5
    else
        echo -e "${RED}✗ tmux session '$session' is NOT running${NC}"
    fi
    echo ""
}

# Check backend
check_tmux_session "backend" 8001

# Check frontend (Next.js)
check_tmux_session "frontend" 3000

# Check frontend (Vite)
check_tmux_session "frontend-vite" 5174

# HTTP endpoint checks
echo -e "${BLUE}--- HTTP Endpoint Checks ---${NC}"

# Test frontend (Next.js)
check_http_endpoint "https://liar.nyc" "Frontend Next.js (HTTPS)"
check_http_endpoint "http://liar.nyc" "Frontend Next.js (HTTP)"

# Test frontend (Vite)
check_http_endpoint "https://liar.nyc:5173" "Frontend Vite (HTTPS)"

# Test backend
check_http_endpoint "https://liar.nyc:3001/health" "Backend Health (HTTPS)"
check_http_endpoint "http://liar.nyc:3001/health" "Backend Health (HTTP)"

# Test backend API endpoint
check_http_endpoint "https://liar.nyc:3001/api/themes" "Backend API (HTTPS)"

echo ""

# Show all tmux sessions
echo -e "${YELLOW}All tmux sessions:${NC}"
tmux ls 2>/dev/null || echo -e "${GRAY}No active tmux sessions${NC}"

# Show URLs
echo -e "\n${YELLOW}Service URLs:${NC}"
echo -e "Frontend (Next.js): ${GREEN}https://liar.nyc${NC}"
echo -e "Frontend (Vite):    ${GREEN}https://liar.nyc:5173${NC}"
echo -e "Backend API:        ${GREEN}https://liar.nyc:3001${NC}"

# Quick commands reminder
echo -e "\n${YELLOW}Quick Commands:${NC}"
echo -e "Attach to backend:        ${GREEN}tmux attach -t backend${NC}"
echo -e "Attach to frontend:       ${GREEN}tmux attach -t frontend${NC}"
echo -e "Attach to Vite frontend:  ${GREEN}tmux attach -t frontend-vite${NC}"
echo -e "Restart services:         ${GREEN}./restart.sh${NC}"
echo -e "Stop services:            ${GREEN}./stop.sh${NC}"
