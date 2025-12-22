--[[
    AHRP CAD - AI Voice Alert System
    
    Provides realistic voice alerts for critical events using text-to-speech.
    Supports multiple TTS providers: Browser Web Speech API, Google TTS, Azure TTS, ElevenLabs
]]

local voiceQueue = {}
local isSpeaking = false
local voiceEnabled = true

-- Voice alert templates
local VoiceTemplates = {
    -- Plate Scanner Alerts
    BOLO_HIT = "Attention, B-O-L-O alert. License plate {plate}. {vehicle}. Proceed with caution.",
    STOLEN_VEHICLE = "Alert. Stolen vehicle detected. Plate {plate}. {vehicle}. Request backup and proceed with caution.",
    WARRANT_HIT = "Alert. Vehicle owner has active warrants. Plate {plate}. Exercise caution on approach.",
    CLEAR_PLATE = "Plate {plate} clear. No flags.",
    
    -- Unit Alerts
    PANIC_BUTTON = "Emergency! Officer needs assistance. Unit {callsign} activated panic button at {location}.",
    BACKUP_REQUEST = "Backup requested. Unit {callsign} requesting {priority} priority assistance at {location}.",
    
    -- Dispatch Alerts
    NEW_CALL = "New {priority} priority call. {type} at {location}.",
    UNIT_ASSIGNED = "Unit {callsign}, you have been assigned to call {callNumber}.",
    
    -- Status Changes
    UNIT_ENROUTE = "Unit {callsign} en route.",
    UNIT_ON_SCENE = "Unit {callsign} on scene.",
    CODE_4 = "Code 4. Situation under control.",
}

-- Initialize voice system
function InitializeVoiceSystem()
    -- Check if voice is enabled in config
    if not Config.VoiceAlerts or not Config.VoiceAlerts.Enabled then
        voiceEnabled = false
        print("[AHRP-CAD Voice] Voice alerts disabled in config")
        return
    end
    
    voiceEnabled = true
    print("[AHRP-CAD Voice] Voice alert system initialized")
    
    -- Send initial config to NUI
    SendNUIMessage({
        type = 'initVoiceSystem',
        config = {
            provider = Config.VoiceAlerts.Provider or 'webspeech',
            voice = Config.VoiceAlerts.Voice or 'en-US-Standard-A',
            rate = Config.VoiceAlerts.Rate or 1.0,
            pitch = Config.VoiceAlerts.Pitch or 1.0,
            volume = Config.VoiceAlerts.Volume or 0.8,
            apiKey = Config.VoiceAlerts.APIKey
        }
    })
end

-- Speak text using TTS
function Speak(text, priority)
    if not voiceEnabled then
        return
    end
    
    priority = priority or 'normal'
    
    -- Add to queue
    table.insert(voiceQueue, {
        text = text,
        priority = priority,
        timestamp = GetGameTimer()
    })
    
    -- Process queue
    ProcessVoiceQueue()
end

-- Process voice queue
function ProcessVoiceQueue()
    if isSpeaking or #voiceQueue == 0 then
        return
    end
    
    -- Sort by priority (high priority first)
    table.sort(voiceQueue, function(a, b)
        local priorityValues = {critical = 4, high = 3, normal = 2, low = 1}
        return priorityValues[a.priority] > priorityValues[b.priority]
    end)
    
    -- Get next message
    local message = table.remove(voiceQueue, 1)
    
    if message then
        isSpeaking = true
        
        -- Send to NUI for TTS
        SendNUIMessage({
            type = 'speakText',
            text = message.text,
            priority = message.priority
        })
        
        if Config.Debug then
            print(string.format("[AHRP-CAD Voice] Speaking: %s", message.text))
        end
    end
end

-- NUI Callback when speech finishes
RegisterNUICallback('onSpeechEnd', function(data, cb)
    isSpeaking = false
    
    -- Wait a moment before next message
    Citizen.Wait(500)
    
    -- Process next in queue
    ProcessVoiceQueue()
    
    cb('ok')
end)

-- Template-based voice alert
function VoiceAlert(template, data, priority)
    if not VoiceTemplates[template] then
        print("[AHRP-CAD Voice] Unknown template: " .. template)
        return
    end
    
    local text = VoiceTemplates[template]
    
    -- Replace placeholders
    if data then
        for key, value in pairs(data) do
            text = string.gsub(text, "{" .. key .. "}", tostring(value))
        end
    end
    
    Speak(text, priority)
end

-- Plate scanner voice alerts
RegisterNetEvent('ahrp-cad:client:plateCheckResult')
AddEventHandler('ahrp-cad:client:plateCheckResult', function(data)
    if not data or not data.data then return end
    
    local vehicleData = data.data
    local plate = data.plate
    
    -- Format vehicle description
    local vehicleDesc = string.format("%s %s", 
        vehicleData.color or "Unknown color",
        vehicleData.model or "vehicle"
    )
    
    -- Determine alert type and speak
    if vehicleData.isStolen then
        VoiceAlert('STOLEN_VEHICLE', {
            plate = plate,
            vehicle = vehicleDesc
        }, 'critical')
    elseif vehicleData.boloActive then
        VoiceAlert('BOLO_HIT', {
            plate = plate,
            vehicle = vehicleDesc
        }, 'critical')
    elseif vehicleData.warrants and #vehicleData.warrants > 0 then
        VoiceAlert('WARRANT_HIT', {
            plate = plate
        }, 'high')
    elseif Config.VoiceAlerts and Config.VoiceAlerts.SpeakClearPlates then
        VoiceAlert('CLEAR_PLATE', {
            plate = plate
        }, 'low')
    end
end)

-- Panic button voice alert
RegisterNetEvent('ahrp-cad:client:panicAlert')
AddEventHandler('ahrp-cad:client:panicAlert', function(data)
    if not data then return end
    
    VoiceAlert('PANIC_BUTTON', {
        callsign = data.callsign or "Unknown unit",
        location = data.location or "unknown location"
    }, 'critical')
end)

-- Backup request voice alert
RegisterNetEvent('ahrp-cad:client:backupRequest')
AddEventHandler('ahrp-cad:client:backupRequest', function(data)
    if not data then return end
    
    VoiceAlert('BACKUP_REQUEST', {
        callsign = data.callsign,
        priority = data.priority or "routine",
        location = data.location or "unknown location"
    }, 'high')
end)

-- New call dispatch voice alert
RegisterNetEvent('ahrp-cad:client:newCall')
AddEventHandler('ahrp-cad:client:newCall', function(data)
    if not data then return end
    
    VoiceAlert('NEW_CALL', {
        priority = data.priority or "routine",
        type = data.type or "incident",
        location = data.location or "unknown location"
    }, data.priority == 'CRITICAL' and 'critical' or 'normal')
end)

-- Unit assignment voice alert
RegisterNetEvent('ahrp-cad:client:unitAssigned')
AddEventHandler('ahrp-cad:client:unitAssigned', function(data)
    if not data then return end
    
    VoiceAlert('UNIT_ASSIGNED', {
        callsign = data.callsign,
        callNumber = data.callNumber
    }, 'normal')
end)

-- Commands
RegisterCommand('togglevoice', function()
    voiceEnabled = not voiceEnabled
    
    ShowNotification({
        type = voiceEnabled and 'success' or 'warning',
        title = 'Voice Alerts',
        message = voiceEnabled and 'Voice alerts enabled' or 'Voice alerts disabled',
        duration = 3000
    })
    
    print(string.format("[AHRP-CAD Voice] Voice alerts %s", voiceEnabled and "enabled" or "disabled"))
end)

RegisterCommand('testvoice', function(source, args)
    local text = table.concat(args, " ")
    
    if text == "" then
        text = "This is a test of the CAD voice alert system. All systems operational."
    end
    
    Speak(text, 'normal')
end)

RegisterCommand('clearvoice', function()
    voiceQueue = {}
    isSpeaking = false
    
    SendNUIMessage({
        type = 'stopSpeaking'
    })
    
    ShowNotification({
        type = 'success',
        title = 'Voice Queue',
        message = 'Voice queue cleared',
        duration = 2000
    })
end)

-- Export functions
exports('Speak', Speak)
exports('VoiceAlert', VoiceAlert)
exports('ToggleVoice', function() voiceEnabled = not voiceEnabled return voiceEnabled end)
exports('IsVoiceEnabled', function() return voiceEnabled end)

-- Initialize on resource start
Citizen.CreateThread(function()
    Citizen.Wait(1000)
    InitializeVoiceSystem()
end)

print("[AHRP-CAD] Voice alert system loaded")
