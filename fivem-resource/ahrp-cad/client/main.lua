-- Main Client Script
local PlayerData = {}
local CurrentUnit = nil
local IsOnDuty = false
local CurrentStatus = "OUT_OF_SERVICE"
local AssignedCall = nil
local UIOpen = false

-- Initialize on resource start
AddEventHandler('onClientResourceStart', function(resourceName)
    if (GetCurrentResourceName() ~= resourceName) then return end
    
    if Config.Debug then
        print("^2[AHRP-CAD]^7 Client initialized")
    end
    
    -- Auto-detect framework
    if Config.AutoDetectFramework then
        DetectFramework()
    end
    
    -- Wait for player to spawn
    Citizen.CreateThread(function()
        while not NetworkIsPlayerActive(PlayerId()) do
            Citizen.Wait(100)
        end
        
        -- Get player data
        TriggerServerEvent('ahrp-cad:server:playerLoaded')
    end)
end)

-- Framework detection
function DetectFramework()
    if GetResourceState('es_extended') == 'started' then
        Config.Framework = 'esx'
        if Config.Debug then
            print("^2[AHRP-CAD]^7 Detected ESX framework")
        end
    elseif GetResourceState('qb-core') == 'started' then
        Config.Framework = 'qb'
        if Config.Debug then
            print("^2[AHRP-CAD]^7 Detected QB-Core framework")
        end
    else
        Config.Framework = 'standalone'
        if Config.Debug then
            print("^2[AHRP-CAD]^7 Running in standalone mode")
        end
    end
end

-- Get current job
function GetPlayerJob()
    if Config.Framework == 'esx' then
        ESX = exports['es_extended']:getSharedObject()
        local playerData = ESX.GetPlayerData()
        return playerData.job.name, playerData.job.grade_label
    elseif Config.Framework == 'qb' then
        local QBCore = exports['qb-core']:GetCoreObject()
        local playerData = QBCore.Functions.GetPlayerData()
        return playerData.job.name, playerData.job.grade.name
    else
        -- Standalone - use server-side data
        return PlayerData.job or "civilian", PlayerData.rank or "Officer"
    end
end

-- Check if player is emergency services
function IsEmergencyJob()
    local job = GetPlayerJob()
    
    for department, config in pairs(Config.Departments) do
        for _, jobName in ipairs(config.jobs) do
            if job == jobName then
                return true, department
            end
        end
    end
    
    return false, nil
end

-- Set player unit data
RegisterNetEvent('ahrp-cad:client:setUnitData')
AddEventHandler('ahrp-cad:client:setUnitData', function(unitData)
    CurrentUnit = unitData
    IsOnDuty = unitData ~= nil
    
    if unitData then
        CurrentStatus = unitData.status or "AVAILABLE"
        AssignedCall = unitData.callId
        
        ShowNotification("You are now on duty as ~b~" .. unitData.callsign, "success")
        
        if Config.Debug then
            print("^2[AHRP-CAD]^7 Unit data set:", json.encode(unitData))
        end
    else
        ShowNotification("You are now off duty", "info")
    end
end)

-- Update unit status
RegisterNetEvent('ahrp-cad:client:updateStatus')
AddEventHandler('ahrp-cad:client:updateStatus', function(newStatus)
    CurrentStatus = newStatus
    
    if Config.Notifications.ShowStatusChanges then
        ShowNotification("Status updated to ~b~" .. newStatus, "info")
    end
end)

-- Receive new call assignment
RegisterNetEvent('ahrp-cad:client:assignedCall')
AddEventHandler('ahrp-cad:client:assignedCall', function(callData)
    AssignedCall = callData
    
    if Config.Notifications.ShowUnitAssignments then
        ShowNotification(
            "~r~NEW CALL ASSIGNED~s~\n" ..
            "Type: ~b~" .. callData.type .. "~s~\n" ..
            "Location: ~y~" .. callData.location,
            "warning",
            true -- Play sound
        )
    end
    
    -- Set GPS waypoint if location has coordinates
    if callData.latitude and callData.longitude then
        SetNewWaypoint(callData.latitude, callData.longitude)
    end
end)

-- Panic alert
RegisterNetEvent('ahrp-cad:client:panicAlert')
AddEventHandler('ahrp-cad:client:panicAlert', function(unitData)
    if Config.Notifications.ShowPanicAlerts then
        ShowNotification(
            "~r~⚠ PANIC BUTTON ACTIVATED ⚠~s~\n" ..
            "Unit: ~b~" .. unitData.callsign .. "~s~\n" ..
            "Location: ~y~" .. (unitData.location or "Unknown"),
            "error",
            true -- Play sound
        )
        
        -- Flash screen red
        Citizen.CreateThread(function()
            local flashCount = 0
            while flashCount < 3 do
                StartScreenEffect('Dont_tazeme_bro', 0, false)
                Citizen.Wait(300)
                StopScreenEffect('Dont_tazeme_bro')
                Citizen.Wait(300)
                flashCount = flashCount + 1
            end
        end)
    end
end)

-- Broadcast call update
RegisterNetEvent('ahrp-cad:client:callUpdate')
AddEventHandler('ahrp-cad:client:callUpdate', function(callData)
    if Config.Notifications.ShowNewCalls and IsEmergencyJob() then
        ShowNotification(
            "~y~CALL UPDATE~s~\n" ..
            "Type: ~b~" .. callData.type .. "~s~\n" ..
            "Priority: ~r~" .. callData.priority,
            "info"
        )
    end
end)

-- Update player data from server
RegisterNetEvent('ahrp-cad:client:updatePlayerData')
AddEventHandler('ahrp-cad:client:updatePlayerData', function(data)
    PlayerData = data
end)

-- Exports for other resources
exports('GetCurrentUnit', function()
    return CurrentUnit
end)

exports('GetCurrentStatus', function()
    return CurrentStatus
end)

exports('IsOnDuty', function()
    return IsOnDuty
end)

exports('GetAssignedCall', function()
    return AssignedCall
end)
