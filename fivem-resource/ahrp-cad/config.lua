Config = {}

-- API Configuration
Config.WebsiteURL = "http://localhost:3000" -- Change to your production URL (no trailing slash)
Config.APIKey = "your-secure-api-key-here" -- Set this in your .env.local as FIVEM_API_KEY

-- UI Mode
Config.UseIFrame = true -- Opens website in overlay (recommended)
-- Set to false to use native browser (Steam overlay)
Config.Use3DTablet = true -- Show 3D tablet prop when opening CAD (false = invisible overlay)

-- Sync Settings
Config.LocationSyncInterval = 5000 -- Update location every 5 seconds
Config.StatusSyncInterval = 10000 -- Check for new calls/updates every 10 seconds
Config.AutoSync = true -- Automatically sync on resource start

-- Department Configuration
Config.Departments = {
    POLICE = {
        name = "Police Department",
        jobs = {"police", "sheriff", "state"}, -- Framework job names
        color = "#3b82f6" -- Blue
    },
    FIRE = {
        name = "Fire Department", 
        jobs = {"fire", "firefighter"},
        color = "#ef4444" -- Red
    },
    EMS = {
        name = "Emergency Medical Services",
        jobs = {"ambulance", "ems", "doctor"},
        color = "#10b981" -- Green
    }
}

-- Unit Status Colors
Config.StatusColors = {
    AVAILABLE = "#22c55e",
    BUSY = "#eab308",
    ENROUTE = "#3b82f6",
    ON_SCENE = "#f59e0b",
    OUT_OF_SERVICE = "#6b7280",
    PANIC = "#dc2626"
}

-- Call Priority Colors
Config.PriorityColors = {
    LOW = "#6b7280",
    MEDIUM = "#eab308",
    HIGH = "#f97316",
    CRITICAL = "#dc2626"
}

-- Keybinds
Config.Keybinds = {
    OpenCAD = "F5", -- Open CAD interface
    ToggleStatus = "F6", -- Quick status change
    Panic = "F9", -- Panic button
    TenCodes = "F7", -- Ten codes menu
    ScanPlate = "E" -- Scan vehicle plate (hold E near vehicle)
}

-- Ten Codes (Police/Fire/EMS codes)
Config.TenCodes = {
    ["10-4"] = "Acknowledged",
    ["10-8"] = "In Service/Available",
    ["10-7"] = "Out of Service",
    ["10-6"] = "Busy",
    ["10-23"] = "Arrived at Scene",
    ["10-76"] = "En Route",
    ["10-97"] = "Arrived on Scene",
    ["10-99"] = "Emergency/Officer in Distress",
    ["Code 2"] = "Routine Response",
    ["Code 3"] = "Emergency Response",
    ["Code 4"] = "Situation Under Control",
    ["Code 5"] = "Felony Stop"
}

-- Notification Settings
Config.Notifications = {
    ShowNewCalls = true,
    ShowUnitAssignments = true,
    ShowStatusChanges = true,
    ShowPanicAlerts = true,
    PlaySound = true
}

-- Framework Detection (auto-detect ESX/QB/Standalone)
Config.Framework = "standalone" -- Options: "esx", "qb", "standalone"
Config.AutoDetectFramework = true

-- Plate Scanner Settings
Config.AutoScanInterval = 5000 -- Auto-scan interval (5 seconds)
Config.AutoBOLOStolen = true -- Automatically create BOLO for stolen vehicles
Config.ScanRange = 10.0 -- Range to detect vehicles (meters)

-- Wraith ARS 2X Integration
Config.EnableWars2xIntegration = true -- Enable automatic integration with Wraith ARS 2X radar
Config.Wars2xAutoBoloStolen = true -- Auto-create BOLOs for stolen vehicles detected by ALPR
Config.Wars2xNotifications = true -- Show plate check notifications from Wraith scans

-- Voice Alert System (AI Text-to-Speech)
Config.VoiceAlerts = {
    Enabled = true, -- Enable voice alerts
    Provider = "webspeech", -- Options: "webspeech" (free, built-in), "google", "azure", "elevenlabs"
    Voice = "en-US", -- Voice ID/name (depends on provider)
    Rate = 1.0, -- Speech rate (0.5 - 2.0)
    Pitch = 1.0, -- Pitch (0.0 - 2.0)
    Volume = 0.8, -- Volume (0.0 - 1.0)
    SpeakClearPlates = false, -- Announce clear plates (can be spammy)
    
    -- API Keys (only needed for premium providers)
    APIKey = nil, -- Set your API key here for Google/Azure/ElevenLabs
    AzureRegion = nil, -- e.g., "eastus" (only for Azure)
    
    -- Alert Types (what events trigger voice alerts)
    AlertTypes = {
        BoloHits = true, -- BOLO plate detected
        StolenVehicles = true, -- Stolen vehicle detected
        Warrants = true, -- Vehicle owner has warrants
        PanicButtons = true, -- Officer panic button
        BackupRequests = true, -- Backup requested
        NewCalls = true, -- New dispatch calls (only if assigned to you)
        UnitAssignments = true, -- When you're assigned to a call
    }
}

-- Debug Mode
Config.Debug = false
