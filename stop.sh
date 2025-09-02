#!/bin/bash
# Stop script for Liar Game tmux sessions

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}=== Stopping Liar Game Services ===${NC}\n"

# Function to kill tmux session
kill_tmux_session() {
    local session=$1
    if tmux has-session -t $session 2>/dev/null; then
        echo -e "${RED}Killing tmux session: $session${NC}"
        tmux kill-session -t $session
    else
        echo -e "${GREEN}No tmux session found: $session${NC}"
    fi
}

# Kill tmux sessions
kill_tmux_session "backend"
kill_tmux_session "frontend"

# Clean up any processes that might still be using the ports
echo -e "${YELLOW}Cleaning up any remaining processes on ports...${NC}"
lsof -ti:8001 2>/dev/null | xargs -r kill -9 2>/dev/null
lsof -ti:3000 2>/dev/null | xargs -r kill -9 2>/dev/null

echo -e "\n${GREEN}=== All services stopped! ===${NC}"

# Show current tmux sessions
echo -e "\n${YELLOW}Active tmux sessions:${NC}"
tmux ls 2>/dev/null || echo -e "${GREEN}No active tmux sessions${NC}"
