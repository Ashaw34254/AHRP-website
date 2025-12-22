# AHRP CAD - FiveM Resource

**Aurora Horizon Roleplay - Computer Aided Dispatch System**

Complete FiveM integration for the AHRP CAD system with real-time synchronization, location tracking, and emergency services management.

---

## 📋 Features

### Core Functionality
- **✅ Real-time Unit Management** - Track active units with live status updates
- **✅ Location Sync** - Automatic GPS tracking with postal code support
- **✅ Call Dispatch** - Create, assign, and manage emergency calls
- **✅ Status Management** - Quick status changes (Available, Busy, En Route, On Scene)
- **✅ Panic Button** - Emergency alert system with visual/audio notifications
- **✅ Ten Codes** - Quick communication via standardized codes
- **✅ Civil Records** - Search citizens and vehicles from in-game
- **✅ Backup Requests** - Request additional units with priority levels
- **✅ Traffic Stops** - Auto-log traffic stops with vehicle info
- **✅ Unit Blips** - See other units on map in real-time
- **✅ IFrame Integration** - Opens your actual CAD website in-game (no duplicate UI needed)
- **✅ 3D Tablet** - Immersive 3D tablet prop when accessing CAD
- **✅ Plate Scanner** - Automatic vehicle plate scanning with BOLO alerts
- **✅ Wraith ARS 2X Integration** - Full integration with popular police radar system (see [WARS2X-INTEGRATION.md](WARS2X-INTEGRATION.md))

### Framework Support
- ESX Legacy/Extended
- QB-Core
- Standalone (no framework required)

### Department Support
- Police Department (LSPD, BCSO, State Police)
- Fire Department
- Emergency Medical Services (EMS)

---

## 🚀 Installation

### Prerequisites
1. **FiveM Server** running build 2372 or higher
2. **AHRP CAD Website** running and accessible
3. **API Key** from your CAD system

### Step 1: Download & Extract
```bash
# Extract the ahrp-cad folder to your server's resources directory
server-data/
  resources/
    [ahrp]/
      ahrp-cad/
```

### Step 2: Configure
Edit `config.lua` and set your website URL and API key:

```lua
Config.WebsiteURL = "https://your-cad-website.com" -- Your CAD system URL (no trailing slash)
Config.APIKey = "your-secure-api-key" -- Get this from your .env.local
Config.UseIFrame = true -- Opens website in overlay (recommended)
```

**Important**: The F5 CAD interface opens your actual website in an overlay, so all features from your web CAD are available in-game. No duplicate UI files needed!

### Step 3: Add to server.cfg
```cfg
ensure ahrp-cad
```

### Step 4: Configure Framework (Optional)
If using ESX or QB-Core, the resource will auto-detect. To force a specific framework:

```lua
Config.Framework = "esx" -- Options: "esx", "qb", "standalone"
Config.AutoDetectFramework = false
```

### Step 5: Configure Jobs
Edit the job names in `config.lua` to match your framework:

```lua
Config.Departments = {
    POLICE = {
        jobs = {"police", "sheriff", "state"}, -- Your police job names
    },
    FIRE = {
        jobs = {"fire", "firefighter"},
    },
    EMS = {
        jobs = {"ambulance", "ems", "doctor"},
    }
}
```

---

## 🎮 Usage

### Commands

| Command | Description | Example |
|---------|-------------|---------|
| `/duty` | Toggle on/off duty | `/duty` |
| `/status [status]` | Change unit status | `/status BUSY` |
| `/panic` | Trigger panic button | `/panic` |
| `/backup [type]` | Request backup | `/backup CODE3` |
| `/calls` | Open CAD interface | `/calls` |
| `/callsign [sign]` | Set/view callsign | `/callsign A-12` |
| `/10-4` | Send ten code | `/10-4` |
| `/code4` | Situation under control | `/code4` |
| `/cadsync` | Manual sync (admin) | `/cadsync` |
| `/cadstatus` | View CAD status | `/cadstatus` |

### Keybinds

| Key | Action |
|-----|--------|
| `F5` | Open CAD Interface (with 3D tablet) |
| `F6` | Quick Status Toggle |
| `F7` | Ten Codes Menu |
| `F9` | Panic Button |
| `E` | Scan Vehicle Plate (hold near vehicle) |

*Keybinds can be changed in `config.lua` or via FiveM keybind settings*

### Status Values
- `AVAILABLE` - Ready for calls
- `BUSY` - Occupied with task
- `ENROUTE` - Responding to call
- `ON_SCENE` - At call location
- `OUT_OF_SERVICE` - Off duty/unavailable
- `PANIC` - Emergency situation

---

## 🔧 Configuration

### Location Sync
```lua
Config.LocationSyncInterval = 5000 -- Update every 5 seconds
```

### Status Sync
```lua
Config.StatusSyncInterval = 10000 -- Check for updates every 10 seconds
Config.AutoSync = true -- Auto-sync on resource start
```

### Notifications
```lua
Config.Notifications = {
    ShowNewCalls = true,
    ShowUnitAssignments = true,
    ShowStatusChanges = true,
    ShowPanicAlerts = true,
    PlaySound = true
}
```

### Discord Webhooks (Optional)
Add to your `server.cfg`:
```cfg
set cad_discord_webhook "https://discord.com/api/webhooks/..."
```

This will send panic alerts to Discord.

---

## 🔌 API Endpoints Required

Your CAD website must have these API endpoints:

### Units
- `GET /api/cad/units` - Get all units
- `GET /api/cad/units?playerId={id}` - Get specific unit
- `POST /api/cad/units` - Create unit
- `PATCH /api/cad/units/{id}` - Update unit status/location

### Calls
- `GET /api/cad/calls?status=PENDING,ACTIVE` - Get active calls
- `GET /api/cad/calls/{id}` - Get call details
- `POST /api/cad/calls` - Create call
- `PATCH /api/cad/calls/{id}` - Update call
- `POST /api/cad/calls/{id}/assign` - Assign unit to call
- `POST /api/cad/calls/{id}/notes` - Add note to call

### Civil Records
- `GET /api/cad/civil/citizen?q={query}` - Search citizen
- `GET /api/cad/civil/vehicle?plate={plate}` - Search vehicle

---

## 📡 Exports

### Client Exports
```lua
-- Get current unit data
local unit = exports['ahrp-cad']:GetCurrentUnit()

-- Get current status
local status = exports['ahrp-cad']:GetCurrentStatus()

-- Check if on duty
local isOnDuty = exports['ahrp-cad']:IsOnDuty()

-- Get assigned call
local call = exports['ahrp-cad']:GetAssignedCall()

-- Get current location string
local location = exports['ahrp-cad']:GetCurrentLocation()

-- Show notification
exports['ahrp-cad']:ShowNotification("Message", "info")
```

### Server Exports
```lua
-- Get all active units
local units = exports['ahrp-cad']:GetActiveUnits()

-- Get unit by player source
local unit = exports['ahrp-cad']:GetUnitBySource(source)

-- Check if player is on duty
local onDuty = exports['ahrp-cad']:IsPlayerOnDuty(source)

-- Create call programmatically
exports['ahrp-cad']:CreateCall({
    type = "TRAFFIC_ACCIDENT",
    priority = "HIGH",
    location = "Legion Square",
    description = "Multi-vehicle accident"
}, function(success, call)
    print("Call created:", call.callNumber)
end)

-- Make custom API request
exports['ahrp-cad']:MakeAPIRequest("/api/custom", "GET", nil, function(success, data)
    -- Handle response
end)

-- Search citizen
exports['ahrp-cad']:SearchCitizen("John Doe", function(success, results)
    -- Handle results
end)

-- Search vehicle
exports['ahrp-cad']:SearchVehicle("ABC123", function(success, results)
    -- Handle results
end)

-- Perform manual sync
exports['ahrp-cad']:PerformSync()
```

---

## 🎨 Customization

### Colors
Edit `config.lua` to change department and status colors:

```lua
Config.StatusColors = {
    AVAILABLE = "#22c55e",
    BUSY = "#eab308",
    -- etc...
}
```

### UI Styling
Edit `html/style.css` to customize the CAD interface appearance.

### Ten Codes
Add or modify ten codes in `config.lua`:

```lua
Config.TenCodes = {
    ["10-4"] = "Acknowledged",
    ["10-99"] = "Officer in Distress",
    -- Add your codes here
}
```

---

## 🐛 Troubleshooting

### CAD Won't Open
1. Check you're on duty: `/duty`
2. Verify you have an emergency services job
3. Check F8 console for errors

### Location Not Updating
1. Ensure `Config.LocationSyncInterval` is set
2. Check API endpoint is accessible
3. Verify API key is correct

### API Connection Failed
1. Check `Config.WebsiteURL` is correct
2. Verify `Config.APIKey` matches your `.env.local`
3. Check website is running and accessible from server
4. Test API manually: `https://your-site.com/api/cad/units`

### Units Not Syncing
1. Run `/cadsync` to force sync
2. Check `Config.AutoSync = true`
3. Verify server can reach website URL
4. Check server console for API errors

### Debug Mode
Enable debug logging:
```lua
Config.Debug = true
```

Then check console for detailed logs.

---

## 📝 Permissions

### Admin Commands
These commands require the ACE permission `command.cadsync`:

```cfg
# In server.cfg
add_ace group.admin command.cadsync allow
```

---

## 🔒 Security

### API Key Protection
- Never commit your API key to version control
- Use a strong, unique API key
- Store in environment variables on production

### API Authentication
The resource sends API key via Authorization header:
```
Authorization: Bearer your-api-key
```

Ensure your CAD system validates this token.

---

## 🚦 Performance

### Recommended Settings
- Location sync: 5-10 seconds
- Status sync: 10-15 seconds
- Max active units: 50-100

### Resource Usage
- **Idle**: ~0.01ms
- **Active (10 units)**: ~0.03ms
- **Peak (50 units)**: ~0.08ms

---

## 📄 License

MIT License - Aurora Horizon Roleplay

---

## 🆘 Support

- **Issues**: Report on GitHub
- **Discord**: Aurora Horizon RP Community
- **Documentation**: https://your-cad-website.com/docs

---

## 🔄 Updates

### Version 1.0.0 (Current)
- Initial release
- Full CAD integration
- Multi-framework support
- Real-time sync
- Panic system
- Civil records search

---

## 👥 Credits

Developed by Aurora Horizon RP Development Team
Inspired by Sonoran CAD and other dispatch systems

---

**Happy Dispatching! 🚔🚒🚑**
