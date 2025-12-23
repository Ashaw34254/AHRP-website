-- Incident Report System for FiveM
-- Integrates with Aurora Horizon website admin dashboard

local Config = Config or {}

-- Report UI state
local reportUIOpen = false
local currentReportData = {
    title = "",
    location = "",
    type = "INCIDENT",
    narrative = "",
    suspects = "",
    victims = "",
    witnesses = "",
    evidence = ""
}

-- Report types for dropdown
local reportTypes = {
    "INCIDENT",
    "TRAFFIC_STOP",
    "ARREST",
    "ASSAULT",
    "ROBBERY",
    "BURGLARY",
    "VEHICLE_THEFT",
    "NARCOTICS",
    "WEAPONS",
    "DOMESTIC",
    "SUSPICIOUS",
    "OTHER"
}

-- Open report submission UI
function OpenReportUI()
    if not IsUnitOnDuty() then
        ShowNotification("~r~You must be on duty to submit reports")
        return
    end

    reportUIOpen = true
    SetNuiFocus(true, true)
    
    -- Get current player location
    local playerPed = PlayerPedId()
    local coords = GetEntityCoords(playerPed)
    local street1, street2 = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
    local streetName = GetStreetNameFromHashKey(street1)
    
    if street2 ~= 0 then
        streetName = streetName .. " / " .. GetStreetNameFromHashKey(street2)
    end
    
    local zoneName = GetLabelText(GetNameOfZone(coords.x, coords.y, coords.z))
    currentReportData.location = streetName .. ", " .. zoneName
    
    -- Send NUI message to open report form
    SendNUIMessage({
        action = "openReportForm",
        data = {
            location = currentReportData.location,
            reportTypes = reportTypes,
            officer = GetUnitInfo()
        }
    })
end

-- Close report UI
function CloseReportUI()
    reportUIOpen = false
    SetNuiFocus(false, false)
    
    SendNUIMessage({
        action = "closeReportForm"
    })
end

-- Submit report to website API
function SubmitReport(reportData)
    local unitInfo = GetUnitInfo()
    
    if not unitInfo then
        ShowNotification("~r~Unable to retrieve unit information")
        return
    end
    
    -- Get player identifiers
    local playerName = GetPlayerName(PlayerId())
    local steamId = GetSteamId()
    
    -- Prepare payload for API
    local payload = {
        title = reportData.title,
        reportedBy = unitInfo.callsign,
        officerBadge = unitInfo.badge or "N/A",
        officerId = unitInfo.id,
        occurredAt = os.date("!%Y-%m-%dT%H:%M:%SZ"), -- ISO 8601 format
        location = reportData.location,
        type = reportData.type,
        narrative = reportData.narrative,
        suspects = reportData.suspects ~= "" and reportData.suspects or nil,
        victims = reportData.victims ~= "" and reportData.victims or nil,
        witnesses = reportData.witnesses ~= "" and reportData.witnesses or nil,
        evidence = reportData.evidence ~= "" and reportData.evidence or nil,
        callId = unitInfo.currentCallId or nil,
        playerName = playerName,
        steamId = steamId
    }
    
    -- Send to server to forward to website API
    TriggerServerEvent("ahrp-cad:submitReport", payload)
    
    ShowNotification("~g~Report submitted successfully")
    CloseReportUI()
end

-- NUI Callbacks
RegisterNUICallback("closeReportForm", function(data, cb)
    CloseReportUI()
    cb("ok")
end)

RegisterNUICallback("submitReport", function(data, cb)
    SubmitReport(data)
    cb("ok")
end)

-- Command to open report UI
RegisterCommand("report", function()
    OpenReportUI()
end, false)

-- Keybind for opening reports (F7 by default)
RegisterKeyMapping("report", "Open Incident Report Form", "keyboard", "F7")

-- Helper function to get Steam ID
function GetSteamId()
    local steamId = nil
    for _, id in ipairs(GetPlayerIdentifiers(PlayerId())) do
        if string.sub(id, 1, 6) == "steam:" then
            steamId = id
            break
        end
    end
    return steamId or "unknown"
end

-- Check if unit is on duty (reuse from existing CAD system)
function IsUnitOnDuty()
    -- This should integrate with your existing duty system
    -- For now, check if callsign exists
    local unitInfo = GetUnitInfo()
    return unitInfo ~= nil and unitInfo.callsign ~= nil
end

-- Get unit info (integrate with existing CAD system)
function GetUnitInfo()
    -- This should pull from your existing CAD system
    -- Return format: { id = "unit_id", callsign = "A-12", badge = "1234", currentCallId = nil }
    
    -- Example implementation - adapt to your system
    if unitCallsign then
        return {
            id = unitId or "unknown",
            callsign = unitCallsign,
            badge = unitBadge,
            currentCallId = assignedCallId
        }
    end
    
    return nil
end

-- Show in-game notification
function ShowNotification(message)
    SetNotificationTextEntry("STRING")
    AddTextComponentString(message)
    DrawNotification(false, false)
end

-- Thread to handle ESC key to close UI
CreateThread(function()
    while true do
        Wait(0)
        
        if reportUIOpen then
            DisableControlAction(0, 1, true) -- Disable mouse look
            DisableControlAction(0, 2, true) -- Disable mouse look
            DisableControlAction(0, 142, true) -- Disable melee
            DisableControlAction(0, 18, true) -- Disable ENTER
            DisableControlAction(0, 322, true) -- Disable ESC
            DisableControlAction(0, 106, true) -- Disable VehicleMouseControlOverride
        else
            Wait(500)
        end
    end
end)

print("^2[AHRP-CAD] ^7Report system loaded. Use /report or F7 to submit incident reports")
