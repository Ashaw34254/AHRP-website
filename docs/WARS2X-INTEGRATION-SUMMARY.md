# Wraith ARS 2X → AHRP CAD Integration Summary

## ✅ What Was Implemented

### 1. Database Schema (Prisma)
**File**: `prisma/schema.prisma`

Added `PlateScan` model to log every plate scanned by the radar:
- Tracks plate, camera (front/rear/wars2x), location, result
- Links to Officer, Unit, and Vehicle records
- Indexed for fast searching by plate and officer

### 2. API Endpoint
**File**: `app/api/cad/plate-scans/route.ts`

Created REST API for plate scan logging:
- `GET /api/cad/plate-scans` - Retrieve scan history
- `POST /api/cad/plate-scans` - Log new plate scan
- Supports filtering by plate, officer, and time range

### 3. Server-Side Integration
**File**: `fivem-resource/ahrp-cad/server/wars2x-integration.lua`

Listens for `wk:onPlateScanned` event from Wraith ARS 2X:
- Automatically checks every scanned plate against CAD database
- Logs all scans to database via API
- Creates automatic BOLOs for stolen vehicles
- Broadcasts alerts to all active units
- Notifies scanning officer of results

### 4. Client-Side Integration
**File**: `fivem-resource/ahrp-cad/client/wars2x-integration.lua`

Handles officer-facing features:
- Displays on-screen notifications for plate results
- Shows color-coded alerts (green=clear, yellow=warning, red=critical)
- Syncs BOLOs from CAD to Wraith radar automatically
- Commands: `/setbolo [plate]`, `/clearbolo`
- Plays sound alerts for BOLO hits

### 5. Configuration
**File**: `fivem-resource/ahrp-cad/config.lua`

Added Wars2x-specific settings:
```lua
Config.EnableWars2xIntegration = true
Config.Wars2xAutoBoloStolen = true
Config.Wars2xNotifications = true
```

### 6. Documentation
**Files Created**:
- `WARS2X-INTEGRATION.md` - Complete setup and usage guide
- `PLATE-SCAN-MIGRATION.md` - Database migration instructions
- Updated `README.md` with Wars2x features

## 🔄 Data Flow

### When a Plate is Scanned:

```
1. Officer drives patrol vehicle with Wraith ARS 2X active
   ↓
2. Wraith scans plate and triggers: wk:onPlateScanned
   ↓
3. AHRP CAD receives event and queries vehicle database
   ↓
4. Plate scan logged to database via POST /api/cad/plate-scans
   ↓
5. Results sent back to scanning officer
   ↓
6. If STOLEN → Auto-create BOLO + Alert all units
   ↓
7. If BOLO exists → Update Wraith radar with BOLO plate
   ↓
8. Officer sees on-screen notification with vehicle details
```

## 📊 What Gets Logged

Every plate scan records:
- **Plate number** - The license plate scanned
- **Camera** - Which camera caught it (front/rear from wars2x)
- **Officer** - Who was driving the patrol vehicle
- **Unit** - Which unit's radar system
- **Location** - Where the scan occurred
- **Result** - CHECKED, CLEAR, STOLEN, WANTED, BOLO_HIT, NOT_FOUND
- **Timestamp** - When the scan happened
- **Vehicle** - Link to vehicle record if found in database

## 🎯 Features Enabled

### For Officers:
- ✅ **Automatic Plate Checking** - Every plate scanned is checked against CAD
- ✅ **Real-time Notifications** - Instant alerts for stolen/wanted vehicles
- ✅ **BOLO Alerts** - Audible beep + visual alert when BOLO plate detected
- ✅ **Vehicle Details** - See owner, model, color, registration status
- ✅ **Hands-Free** - No manual commands needed, fully automatic
- ✅ **Scan History** - All scans logged for review and auditing

### For Dispatchers:
- ✅ **View Plate Scans** - See all ALPR activity across department
- ✅ **BOLO Management** - Create BOLOs that sync to all radars
- ✅ **Hit Tracking** - Know when/where BOLO plates are detected
- ✅ **Officer Activity** - Monitor which units are actively patrolling
- ✅ **Vehicle Intelligence** - Build database of vehicle sightings

### For Administrators:
- ✅ **Audit Trail** - Complete log of all plate scans
- ✅ **Analytics** - Track patrol patterns and ALPR effectiveness
- ✅ **Compliance** - Record keeping for investigations
- ✅ **Integration** - Easy to extend with custom logic

## 🚀 Setup Requirements

### 1. Install Wraith ARS 2X
```cfg
# server.cfg - MUST be in this order
ensure wk_wars2x
ensure ahrp-cad
```

### 2. Run Database Migration
```bash
npx prisma migrate dev --name add_plate_scan_model
npx prisma generate
```

### 3. Configure AHRP CAD
Edit `fivem-resource/ahrp-cad/config.lua`:
```lua
Config.EnableWars2xIntegration = true
Config.Wars2xAutoBoloStolen = true
```

### 4. Restart Resources
```
restart wk_wars2x
restart ahrp-cad
```

## 🧪 Testing

### Test 1: Basic Scan
1. Get in police vehicle
2. Open Wraith radar (F5)
3. Drive near vehicles
4. Look for console message: `[AHRP-CAD] Wraith ARS 2X scanned plate: ABC123 (front camera)`
5. Should see on-screen notification with plate status

### Test 2: Stolen Vehicle
1. Mark a vehicle as stolen in CAD database
2. Drive near that vehicle
3. Should see RED alert + BOLO auto-created
4. All units should receive BOLO notification

### Test 3: BOLO Sync
1. Create BOLO in CAD with plate number
2. Check Wraith radar - plate should be set as BOLO
3. Drive near that vehicle
4. Should hear audible beep + see BOLO hit notification

### Test 4: Database Logging
1. Scan several plates
2. Check database: `npx prisma studio`
3. Look in `PlateScan` table
4. Should see all scans with timestamps and results

## 📈 Next Steps

### Immediate:
- Run database migration
- Test basic scanning
- Verify console logs show scans being logged

### Future Enhancements:
- Dashboard view for plate scan history
- Heat map of vehicle sightings
- Automatic pattern detection (same vehicle at multiple locations)
- Integration with traffic cameras
- Export scan reports for investigations
- AI-powered suspicious vehicle detection

## 🔧 Troubleshooting

### Plates not being logged?
- Check console for API errors
- Verify `Config.EnableWars2xIntegration = true`
- Ensure API key is correct in both systems

### Notifications not showing?
- Check `Config.Wars2xNotifications = true`
- Test with `/checkplate ABC123` command
- Look for client-side errors in F8 console

### Database errors?
- Run migration: `npx prisma migrate dev`
- Check Prisma client is up to date: `npx prisma generate`
- Verify Officer and Unit records exist

## 📝 Credits

- **Wraith ARS 2X**: [WolfKnight](https://github.com/WolfKnight98)
- **Integration**: Aurora Horizon RP Development Team
- **Inspired by**: Real-world ALPR systems and Sonoran CAD

## 🔗 Related Files

- [WARS2X-INTEGRATION.md](fivem-resource/ahrp-cad/WARS2X-INTEGRATION.md) - Full setup guide
- [PLATE-SCAN-MIGRATION.md](PLATE-SCAN-MIGRATION.md) - Database migration
- [server/wars2x-integration.lua](fivem-resource/ahrp-cad/server/wars2x-integration.lua) - Server code
- [client/wars2x-integration.lua](fivem-resource/ahrp-cad/client/wars2x-integration.lua) - Client code
- [app/api/cad/plate-scans/route.ts](app/api/cad/plate-scans/route.ts) - API endpoint

---

✅ **Integration Complete** - Wraith ARS 2X now sends all plate scans to AHRP CAD for logging and analysis!
