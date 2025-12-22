# Wraith ARS 2X Integration Guide

This guide explains how to integrate the Wraith ARS 2X radar/plate reader system with the AHRP CAD system.

## Overview

The AHRP CAD automatically integrates with [Wraith ARS 2X](https://github.com/WolfKnight98/wk_wars2x) to provide:

- **Automatic Plate Checks**: Every plate scanned by the radar is automatically checked against the CAD database
- **Real-time Notifications**: Officers receive instant alerts for stolen vehicles, warrants, and other flags
- **Automatic BOLOs**: Stolen vehicles detected by ALPR automatically create BOLOs in the CAD
- **BOLO Synchronization**: BOLOs created in the CAD are automatically set as BOLO plates in the radar
- **Enhanced Realism**: Seamless integration between patrol radar and dispatch system

## Installation

### Step 1: Install Wraith ARS 2X

1. Download the latest version from [GitHub Releases](https://github.com/WolfKnight98/wk_wars2x/releases)
2. Extract the `wk_wars2x` folder to your server's resources directory
3. Add `ensure wk_wars2x` to your `server.cfg` **BEFORE** `ensure ahrp-cad`

```cfg
# server.cfg
ensure wk_wars2x
ensure ahrp-cad
```

### Step 2: Configure AHRP CAD

Open `ahrp-cad/config.lua` and ensure these settings are enabled:

```lua
-- Wraith ARS 2X Integration
Config.EnableWars2xIntegration = true -- Enable automatic integration
Config.Wars2xAutoBoloStolen = true -- Auto-create BOLOs for stolen vehicles
Config.Wars2xNotifications = true -- Show plate check notifications
```

### Step 3: Configure Wraith ARS 2X (Optional)

The integration works out-of-the-box, but you can customize Wraith settings in `wk_wars2x/config.lua`:

```lua
-- Recommended settings for AHRP CAD integration
CONFIG.allow_fast_limit = true
CONFIG.use_sonorancad = false -- Keep false, AHRP CAD handles this
```

### Step 4: Restart Resources

```
restart wk_wars2x
restart ahrp-cad
```

## Features

### 1. Automatic Plate Checks

When an officer's radar scans a plate, the system automatically:
1. Sends plate to CAD API for lookup
2. Checks for stolen status, warrants, and notes
3. Displays results to the officer in real-time

**No manual action required** - it's completely automatic!

### 2. On-Screen Notifications

Officers receive color-coded notifications:

- **Green (✓)**: Plate clear, no flags
- **Yellow (⚠️)**: Warnings (unregistered, expired insurance)
- **Red (⚠️)**: Critical (stolen, warrants)

Notification shows:
- Plate number
- Flags (stolen, warrants, notes)
- Vehicle model and color
- Owner name

### 3. Automatic BOLO Creation

When a stolen vehicle is detected:
1. BOLO is automatically created in the CAD
2. All active units receive BOLO notification
3. Plate is set as BOLO in Wraith radar
4. Dispatcher sees BOLO in CAD interface

### 4. BOLO Synchronization

**From CAD → Radar:**
When a BOLO is created in the CAD system:
- The plate is automatically set in the officer's Wraith radar
- ALPR continuously scans for the BOLO plate
- Audible beep plays when BOLO plate is detected

**Manual Commands:**
```
/setbolo [plate]   - Manually set BOLO plate in radar
/clearbolo         - Clear BOLO plate from radar
```

### 5. Database Integration

All plate checks are logged and tracked:
- Search history in CAD
- Plate check timestamps
- Officer who performed the check
- Results and actions taken

## Usage

### For Officers

1. **Start Patrol:**
   - Get in a police vehicle
   - Open Wraith ARS 2X with `F5` (default)
   - Radar automatically scans front/rear

2. **Plate Scanning:**
   - Drive normally - radar scans automatically
   - Plates are checked against CAD in real-time
   - Notifications appear on-screen

3. **When Flags Are Detected:**
   - Red notification appears with details
   - BOLO created automatically if stolen
   - Check CAD for full vehicle/owner info

4. **Lock Suspicious Plates:**
   - Use Wraith controls to lock plate (Numpad 9/6)
   - Creates record in CAD for investigation
   - Plate remains visible in radar display

### For Dispatchers

1. **Create BOLO:**
   - Open CAD → BOLO tab
   - Enter vehicle details and plate
   - Click "Create BOLO"
   - All units' radars automatically set BOLO plate

2. **Monitor Hits:**
   - BOLO hits appear in CAD when detected
   - See which unit detected the plate
   - Track location and timestamp

3. **Manage BOLOs:**
   - View active BOLOs
   - Update or cancel BOLOs
   - Changes sync to all units in real-time

## Configuration Options

### AHRP CAD Settings

```lua
-- Enable/disable integration
Config.EnableWars2xIntegration = true

-- Automatically create BOLOs for stolen vehicles
Config.Wars2xAutoBoloStolen = true

-- Show notifications for all plate checks
Config.Wars2xNotifications = true
```

### Wraith ARS 2X Keybinds

Default keybinds (can be changed in GTA Settings → Keybinds → FiveM):

| Action | Key | Description |
|--------|-----|-------------|
| Open Radar | F5 | Open Wraith remote control |
| Lock Front Plate | Numpad 9 | Lock front camera plate |
| Lock Rear Plate | Numpad 6 | Lock rear camera plate |
| Lock Front Speed | Numpad 8 | Lock front antenna speed |
| Lock Rear Speed | Numpad 5 | Lock rear antenna speed |

## API Endpoints Used

The integration uses these CAD API endpoints:

```
GET  /api/cad/civil/vehicle?plate={plate}  - Lookup vehicle by plate
POST /api/cad/bolo/create                  - Create vehicle BOLO
GET  /api/cad/bolo/list                    - List active BOLOs
```

Ensure your API key is configured correctly in both systems.

## Troubleshooting

### Plates Not Being Checked

1. Check console for errors:
   ```
   [AHRP-CAD] Wraith ARS 2X detected and active
   [AHRP-CAD] Wraith ARS 2X scanned plate: ABC123 (front camera)
   ```

2. Verify integration is enabled:
   ```lua
   Config.EnableWars2xIntegration = true
   ```

3. Ensure resource load order:
   ```cfg
   ensure wk_wars2x
   ensure ahrp-cad
   ```

### No Notifications Appearing

1. Check notification setting:
   ```lua
   Config.Wars2xNotifications = true
   ```

2. Verify API connection - check for API errors in console

3. Test manual plate check:
   ```
   /checkplate ABC123
   ```

### BOLOs Not Syncing

1. Check if BOLOs exist in CAD database
2. Verify Wraith ARS 2X is running: `restart wk_wars2x`
3. Check for NUI errors in F8 console

### Performance Issues

If scanning causes lag:

1. Reduce Wraith sensitivity:
   ```lua
   CONFIG.menuDefaults["same"] = 0.4
   CONFIG.menuDefaults["opp"] = 0.4
   ```

2. Increase scan interval (in Wraith code):
   - Edit `cl_plate_reader.lua`, line ~315
   - Change `Citizen.Wait(500)` to `Citizen.Wait(1000)`

## Advanced Usage

### Custom Integrations

Other resources can use these exports:

```lua
-- Check a plate manually
exports['ahrp-cad']:CheckPlate('ABC123', source)

-- Create a BOLO programmatically
exports['ahrp-cad']:CreateVehicleBOLO({
    plate = 'XYZ789',
    model = 'Sultan',
    color = 'Blue',
    reason = 'Armed Robbery Suspect Vehicle',
    officer = 'Officer Smith',
    priority = 'HIGH'
})

-- Check if Wars2x is active
local isActive = exports['ahrp-cad']:IsWars2xActive()
```

### Event Triggers

Listen for these events in your custom resources:

```lua
-- When a plate is scanned by Wars2x
AddEventHandler('wk:onPlateScanned', function(cam, plate, index)
    -- Your custom logic
end)

-- When a BOLO is created
AddEventHandler('ahrp-cad:boloCreated', function(boloData)
    -- Your custom logic
end)
```

## Credits

- **Wraith ARS 2X**: Created by [WolfKnight](https://github.com/WolfKnight98)
- **AHRP CAD Integration**: Aurora Horizon RP Development Team

## Support

- **AHRP CAD Issues**: [GitHub Issues](https://github.com/Ashaw34254/AHRP-website/issues)
- **Wraith ARS 2X Issues**: [wk_wars2x GitHub](https://github.com/WolfKnight98/wk_wars2x/issues)
- **Discord**: Join Aurora Horizon RP Discord for support

## License

Integration code is licensed under MIT License. Wraith ARS 2X is licensed separately by WolfKnight.
