# Liar Game - Vite Features Implementation Plan

## Status Legend
- ✅ Completed
- 🚧 In Progress  
- 📋 Planned
- ❌ Blocked/Issues

## 1. Service Management Scripts ✅
**Status:** Completed
- ✅ Updated `status.sh` - removed port 3000 references and HTTP tests
- ✅ Updated `restart.sh` - removed Next.js frontend references
- ✅ Updated `stop.sh` - cleaned up old frontend session references
- ✅ Only HTTPS endpoints are tested now
- ✅ Removed all references to port 3000 (old Next.js frontend)

## 2. Togglable Authentication for Settings Page 📋
**Status:** Planned
**Description:** Allow enabling/disabling authentication requirement for the settings page
**Implementation Details:**
- Add environment variable: `REQUIRE_AUTH_FOR_SETTINGS` (default: true)
- Create auth toggle in admin panel
- Implement conditional auth middleware based on setting
- Store preference in database or config file
- Frontend: Add toggle UI in admin section
- Backend: Update auth middleware to check setting

## 3. First Player Liar Toggle 📋
**Status:** Planned
**Description:** Option to allow/prevent the first player from being the liar
**Implementation Details:**
- Add game setting: `ALLOW_FIRST_PLAYER_AS_LIAR` (default: false)
- Update game initialization logic to respect this setting
- Add toggle in game settings UI
- Store preference per game room or globally
- Modify liar selection algorithm accordingly

## 4. Skins Feature 🚧
**Status:** Partially Implemented
**Current Progress:**
- ✅ Skin constants defined in `/frontend-vite/src/constants/skins.ts`
- ✅ Skin store created in `/frontend-vite/src/stores/skinStore.ts`
- 📋 Need to complete skin selection UI
- 📋 Implement skin application to game interface
- 📋 Add skin preview functionality
- 📋 Persist skin selection per user/session

## 5. Slack Message Integrations ✅
**Status:** Completed
**Features Implemented:**
- ✅ Authentication success notifications
- ✅ New theme added notifications
- ✅ New word added notifications
- ✅ Word edited notifications
- ✅ Word deleted notifications (just added)
- ✅ New game started notifications
- ✅ Test endpoint for Slack integration

**Slack Service Location:** `/backend/services/slackService.js`

## 6. Cutover Strategy 📋
**Status:** Planned
**Description:** Full migration from Next.js to Vite frontend
**Steps:**
1. ✅ Remove Next.js frontend from service scripts
2. 📋 Update nginx/proxy configuration to redirect main domain to Vite
3. 📋 Ensure all features are working in Vite version
4. 📋 Test all API integrations
5. 📋 Update DNS/routing if needed
6. 📋 Archive or remove Next.js frontend code
7. 📋 Update documentation

## Environment Variables Required
```bash
# Backend (.env)
SLACK_BOT_TOKEN=xoxb-...
DEFAULT_CHANNEL_ID=C...
DEFAULT_CHANNEL_NAME=#liar-game

# Frontend Vite (.env)
VITE_API_URL=https://liar.nyc:3001
VITE_REQUIRE_AUTH_FOR_SETTINGS=true
VITE_ALLOW_FIRST_PLAYER_AS_LIAR=false
```

## Next Steps Priority
1. **High Priority:**
   - Complete cutover to Vite-only frontend
   - Finish skins feature implementation

2. **Medium Priority:**
   - Implement togglable auth for settings
   - Add first player liar toggle

3. **Low Priority:**
   - Additional Slack notifications
   - Performance optimizations

## Testing Checklist
- [ ] All Slack notifications working
- [ ] Skins properly apply to game interface
- [ ] Auth toggle works as expected
- [ ] First player liar setting respected
- [ ] Vite frontend handles all game scenarios
- [ ] Service scripts work reliably

## Notes
- All backend services run on port 8001
- Vite frontend runs on port 5174 (accessible via :5173 externally)
- HTTPS only for external access
- tmux sessions used for process management


