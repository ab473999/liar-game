#!/bin/bash
# Restart script for Liar Game using tmux sessions

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Liar Game Restart Script (tmux) ===${NC}\n"

# Check if tmux is installed
if ! command -v tmux &> /dev/null; then
    echo -e "${RED}tmux is not installed. Installing...${NC}"
    apt-get update && apt-get install -y tmux
fi

# Function to kill tmux session
kill_tmux_session() {
    local session=$1
    if tmux has-session -t $session 2>/dev/null; then
        echo -e "${YELLOW}Killing existing tmux session: $session${NC}"
        tmux kill-session -t $session
        sleep 1
    else
        echo -e "${GREEN}No existing tmux session: $session${NC}"
    fi  
}

# Kill existing tmux sessions
kill_tmux_session "backend"
kill_tmux_session "frontend"
kill_tmux_session "frontend-vite"

# Kill any processes that might still be using the ports
echo -e "${YELLOW}Checking for any processes on ports...${NC}"
lsof -ti:8001 2>/dev/null | xargs -r kill -9 2>/dev/null
lsof -ti:3000 2>/dev/null | xargs -r kill -9 2>/dev/null
lsof -ti:5174 2>/dev/null | xargs -r kill -9 2>/dev/null

echo -e "\n${GREEN}Old sessions cleaned up!${NC}\n"

# Start backend in tmux
echo -e "${YELLOW}Starting backend server in tmux session 'backend'...${NC}"
tmux new-session -d -s backend -c /root/liar-game/backend "NODE_ENV=production npm start"
echo -e "${GREEN}Backend started in tmux session 'backend'${NC}"

# Wait for backend to start
echo -e "${YELLOW}Waiting for backend to initialize...${NC}"
sleep 3

# Start frontend in tmux
echo -e "${YELLOW}Starting frontend server in tmux session 'frontend'...${NC}"
tmux new-session -d -s frontend -c /root/liar-game/frontend "npm run dev"
echo -e "${GREEN}Frontend started in tmux session 'frontend'${NC}"

# Start frontend-vite in tmux
echo -e "${YELLOW}Starting Vite frontend server in tmux session 'frontend-vite'...${NC}"
tmux new-session -d -s frontend-vite -c /root/liar-game/frontend-vite "npm run dev"
echo -e "${GREEN}Vite frontend started in tmux session 'frontend-vite'${NC}"

echo -e "\n${GREEN}=== Services Started Successfully! ===${NC}"
echo -e "Frontend (Next.js): ${GREEN}https://liar.nyc${NC}"
echo -e "Frontend (Vite):    ${GREEN}https://liar.nyc:5173${NC}"
echo -e "Backend API:        ${GREEN}https://liar.nyc:3001${NC}"

echo -e "\n${YELLOW}=== tmux Commands ===${NC}"
echo -e "View backend logs:        ${GREEN}tmux attach -t backend${NC}"
echo -e "View frontend logs:       ${GREEN}tmux attach -t frontend${NC}"
echo -e "View Vite frontend logs:  ${GREEN}tmux attach -t frontend-vite${NC}"
echo -e "List sessions:            ${GREEN}tmux ls${NC}"
echo -e "Detach from session:      ${GREEN}Ctrl+B then D${NC}"

# Wait a bit more for services to fully initialize
echo -e "\n${YELLOW}Waiting for services to fully initialize...${NC}"
sleep 3

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

# HTTP endpoint checks
echo -e "\n${BLUE}--- Verifying Services ---${NC}"

# Test frontend (Next.js)
check_http_endpoint "https://liar.nyc" "Frontend Next.js (HTTPS)"

# Test frontend (Vite)
check_http_endpoint "https://liar.nyc:5173" "Frontend Vite (HTTPS)"

# Test backend
check_http_endpoint "https://liar.nyc:3001/health" "Backend Health (HTTPS)"
check_http_endpoint "https://liar.nyc:3001/api/themes" "Backend API (HTTPS)"

echo -e "\n${YELLOW}To stop services:${NC} Run ${GREEN}./stop.sh${NC}"
echo -e "${YELLOW}To check status:${NC} Run ${GREEN}./status.sh${NC}"
