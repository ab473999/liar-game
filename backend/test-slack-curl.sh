#!/bin/bash

# Test Slack integration using curl commands
# Usage: ./test-slack-curl.sh

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Backend URL
BACKEND_URL="http://localhost:8001"

echo -e "${BOLD}${BLUE}======================================"
echo -e "   Liar Game Slack Service Tester"
echo -e "======================================${NC}\n"

# Function to check backend health
check_backend() {
    echo -e "${YELLOW}Checking backend health...${NC}"
    response=$(curl -s -w "\n%{http_code}" "${BACKEND_URL}/health" 2>/dev/null | tail -n 1)
    
    if [ "$response" == "200" ]; then
        echo -e "${GREEN}✅ Backend is running on port 8001${NC}\n"
        return 0
    else
        echo -e "${RED}❌ Backend is not responding on port 8001${NC}"
        echo -e "${YELLOW}Make sure the backend is running: cd backend && npm start${NC}\n"
        return 1
    fi
}

# Function to check Slack configuration status
check_slack_status() {
    echo -e "${YELLOW}Checking Slack configuration status...${NC}"
    echo -e "${BLUE}curl -X GET ${BACKEND_URL}/api/test/slack/status${NC}\n"
    
    response=$(curl -s -X GET "${BACKEND_URL}/api/test/slack/status")
    echo "$response" | jq . 2>/dev/null || echo "$response"
    echo ""
    
    # Check if Slack is enabled
    enabled=$(echo "$response" | jq -r '.enabled' 2>/dev/null)
    if [ "$enabled" == "true" ]; then
        echo -e "${GREEN}✅ Slack service is configured and enabled${NC}\n"
        return 0
    else
        echo -e "${RED}❌ Slack service is not configured${NC}"
        echo -e "${YELLOW}You need to set these environment variables in backend/.env:${NC}"
        echo -e "  SLACK_BOT_TOKEN=xoxb-your-token-here"
        echo -e "  DEFAULT_CHANNEL_ID=C1234567890"
        echo -e "  DEFAULT_CHANNEL_NAME=#your-channel-name\n"
        return 1
    fi
}

# Function to send a test message
send_test_message() {
    local message="${1:-Test message from curl}"
    
    echo -e "${YELLOW}Sending test message to Slack...${NC}"
    echo -e "${BLUE}curl -X POST ${BACKEND_URL}/api/test/slack \\
  -H 'Content-Type: application/json' \\
  -d '{\"message\": \"$message\"}'${NC}\n"
    
    response=$(curl -s -X POST "${BACKEND_URL}/api/test/slack" \
        -H "Content-Type: application/json" \
        -d "{\"message\": \"$message\"}")
    
    echo "$response" | jq . 2>/dev/null || echo "$response"
    echo ""
    
    # Check if message was sent successfully
    success=$(echo "$response" | jq -r '.success' 2>/dev/null)
    if [ "$success" == "true" ]; then
        echo -e "${GREEN}✅ Test message sent successfully!${NC}"
        echo -e "${YELLOW}Check your Slack channel for the message.${NC}\n"
        return 0
    else
        echo -e "${RED}❌ Failed to send test message${NC}"
        error=$(echo "$response" | jq -r '.error' 2>/dev/null)
        details=$(echo "$response" | jq -r '.details' 2>/dev/null)
        echo -e "${RED}Error: $error${NC}"
        echo -e "${RED}Details: $details${NC}\n"
        return 1
    fi
}

# Function to test direct Slack API call
test_direct_slack_api() {
    echo -e "${YELLOW}Testing direct Slack API call...${NC}"
    echo -e "${BLUE}This will send a message directly to Slack API (requires SLACK_BOT_TOKEN)${NC}\n"
    
    # Check if we have the token
    if [ -f "../.env" ]; then
        source ../.env
    elif [ -f ".env" ]; then
        source .env
    fi
    
    if [ -z "$SLACK_BOT_TOKEN" ]; then
        echo -e "${RED}❌ SLACK_BOT_TOKEN not found in environment${NC}"
        echo -e "${YELLOW}Set it in your .env file or export it:${NC}"
        echo -e "  export SLACK_BOT_TOKEN=xoxb-your-token-here${NC}\n"
        return 1
    fi
    
    if [ -z "$DEFAULT_CHANNEL_ID" ]; then
        echo -e "${RED}❌ DEFAULT_CHANNEL_ID not found in environment${NC}"
        echo -e "${YELLOW}Set it in your .env file or export it:${NC}"
        echo -e "  export DEFAULT_CHANNEL_ID=C1234567890${NC}\n"
        return 1
    fi
    
    echo -e "${BLUE}curl -X POST https://slack.com/api/chat.postMessage \\
  -H 'Authorization: Bearer \$SLACK_BOT_TOKEN' \\
  -H 'Content-Type: application/json' \\
  -d '{
    \"channel\": \"$DEFAULT_CHANNEL_ID\",
    \"text\": \"Direct API test from curl\",
    \"blocks\": [{
      \"type\": \"section\",
      \"text\": {
        \"type\": \"mrkdwn\",
        \"text\": \"🧪 *Direct Slack API Test*\\nThis message was sent directly to Slack API using curl.\"
      }
    }]
  }'${NC}\n"
    
    response=$(curl -s -X POST https://slack.com/api/chat.postMessage \
        -H "Authorization: Bearer $SLACK_BOT_TOKEN" \
        -H "Content-Type: application/json" \
        -d "{
            \"channel\": \"$DEFAULT_CHANNEL_ID\",
            \"text\": \"Direct API test from curl\",
            \"blocks\": [{
                \"type\": \"section\",
                \"text\": {
                    \"type\": \"mrkdwn\",
                    \"text\": \"🧪 *Direct Slack API Test*\\nThis message was sent directly to Slack API using curl.\"
                }
            }]
        }")
    
    echo "$response" | jq . 2>/dev/null || echo "$response"
    echo ""
    
    # Check if message was sent successfully
    ok=$(echo "$response" | jq -r '.ok' 2>/dev/null)
    if [ "$ok" == "true" ]; then
        echo -e "${GREEN}✅ Direct API call successful!${NC}\n"
        return 0
    else
        echo -e "${RED}❌ Direct API call failed${NC}"
        error=$(echo "$response" | jq -r '.error' 2>/dev/null)
        echo -e "${RED}Error: $error${NC}\n"
        return 1
    fi
}

# Main menu
show_menu() {
    echo -e "${BOLD}Choose a test option:${NC}"
    echo "1) Check Slack configuration status"
    echo "2) Send a test message via backend API"
    echo "3) Send a custom message via backend API"
    echo "4) Test direct Slack API call (requires env vars)"
    echo "5) Run all tests"
    echo "0) Exit"
    echo -n "Enter choice: "
}

# Main execution
main() {
    # Check if backend is running
    if ! check_backend; then
        exit 1
    fi
    
    while true; do
        show_menu
        read -r choice
        echo ""
        
        case $choice in
            1)
                check_slack_status
                ;;
            2)
                send_test_message "Test message sent at $(date)"
                ;;
            3)
                echo -n "Enter your custom message: "
                read -r custom_message
                send_test_message "$custom_message"
                ;;
            4)
                test_direct_slack_api
                ;;
            5)
                check_slack_status
                if [ $? -eq 0 ]; then
                    send_test_message "Automated test at $(date)"
                    test_direct_slack_api
                fi
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

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}Warning: jq is not installed. JSON output will not be formatted.${NC}"
    echo -e "${YELLOW}Install it with: apt-get install jq (or brew install jq on macOS)${NC}\n"
fi

# Run main function
main
