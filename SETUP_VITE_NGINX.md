# Setting Up Vite with Nginx

## Quick Setup Instructions

### 1. Apply the nginx configuration

```bash
# Append the Vite server block to the existing nginx config
sudo cat /root/liar-game/nginx-vite.conf >> /etc/nginx/sites-available/liar.nyc

# Test nginx configuration
sudo nginx -t

# If test passes, reload nginx
sudo systemctl reload nginx
```

### 2. Open firewall port (if needed)

```bash
# Check if port 5173 is open
sudo ufw status

# If not open, add the rule
sudo ufw allow 5173/tcp
```

### 3. Start the Vite development server

```bash
# Navigate to the Vite frontend
cd /root/liar-game/frontend-vite

# Install dependencies (if not already done)
npm install

# Start the development server
npm run dev
```

### 4. Access the application

Once the server is running, you can access the Vite development server at:
- **https://liar.nyc:5173**

## What's Configured

1. **Vite Server**: Runs internally on port 5174 (to avoid conflicts)
2. **Nginx Proxy**: External port 5173 → Internal port 5174
3. **SSL/HTTPS**: Using existing Let's Encrypt certificates
4. **HMR WebSocket**: Configured for hot module replacement
5. **Environment Variables**: API URL points to production backend

## Troubleshooting

### If the site doesn't load:

1. **Check if Vite is running:**
   ```bash
   ps aux | grep vite
   ```

2. **Check nginx error logs:**
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

3. **Check if port is listening:**
   ```bash
   sudo netstat -tlnp | grep 5174
   ```

4. **Verify nginx configuration:**
   ```bash
   sudo nginx -t
   ```

### If HMR (Hot Module Replacement) isn't working:

1. Check browser console for WebSocket errors
2. Ensure port 5173 is accessible through firewall
3. Check that the Vite config has proper HMR settings

## Running Both Frontends Simultaneously

You can run both the current Next.js and new Vite frontends at the same time:

```bash
# Terminal 1: Current Next.js frontend
cd /root/liar-game/frontend
npm run dev  # Running on port 3000, accessible at https://liar.nyc

# Terminal 2: New Vite frontend  
cd /root/liar-game/frontend-vite
npm run dev  # Running on port 5174, accessible at https://liar.nyc:5173
```

## Next Steps

Once the Vite server is confirmed working:
1. Continue with Phase 2: Core Infrastructure (Zustand, React Router)
2. Begin migrating components one by one
3. Test each component in isolation before integration
