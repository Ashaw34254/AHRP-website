-- Main Server Script
local PlayerUnits = {} -- [source] = unitData
local OnDutyPlayers = {} -- [source] = true/false

-- Initialize on resource start
AddEventHandler('onResourceStart', function(resourceName)
    if GetCurrentResourceName() ~= resourceName then return end
    
    print("^2[AHRP-CAD]^7 Server initialized")
    print("^2[AHRP-CAD]^7 API URL: " .. Config.WebsiteURL)
    
    if Config.AutoSync then
        print("^2[AHRP-CAD]^7 Auto-sync enabled")
    end
end)

-- Player loaded
RegisterNetEvent('ahrp-cad:server:playerLoaded')
AddEventHandler('ahrp-cad:server:playerLoaded', function()
    local source = source
    local identifier = GetPlayerIdentifier(source, 0)
    
    if Config.Debug then
        print("^2[AHRP-CAD]^7 Player loaded:", GetPlayerName(source), identifier)
    end
    
    -- Send player data to client
    TriggerClientEvent('ahrp-cad:client:updatePlayerData', source, {
        identifier = identifier,
        name = GetPlayerName(source)
    })
end)

-- Toggle duty
RegisterNetEvent('ahrp-cad:server:toggleDuty')
AddEventHandler('ahrp-cad:server:toggleDuty', function(department)
    local source = source
    local identifier = GetPlayerIdentifier(source, 0)
    
    if OnDutyPlayers[source] then
        -- Go off duty
        GoOffDuty(source)
    else
        -- Go on duty
        GoOnDuty(source, department, identifier)
    end
end)

-- Go on duty
function GoOnDuty(source, department, identifier)
    local name = GetPlayerName(source)
    
    -- Create/retrieve unit from API
    CreateOrGetUnit(source, department, identifier, name, function(success, unitData)
        if success then
            PlayerUnits[source] = unitData
            OnDutyPlayers[source] = true
            
            -- Notify client
            TriggerClientEvent('ahrp-cad:client:setUnitData', source, unitData)
            
            -- Broadcast to all units
            TriggerClientEvent('ahrp-cad:client:unitUpdate', -1, unitData, 'ON_DUTY')
            
            if Config.Debug then
                print("^2[AHRP-CAD]^7 Unit on duty:", json.encode(unitData))
            end
        else
            TriggerClientEvent('ahrp-cad:client:notify', source, 
                "Failed to go on duty. Check server console.", "error")
        end
    end)
end

-- Go off duty
function GoOffDuty(source)
    local unit = PlayerUnits[source]
    
    if unit then
        -- Update unit status via API
        UpdateUnitStatus(unit.id, 'OUT_OF_SERVICE', function(success)
            if success then
                PlayerUnits[source] = nil
                OnDutyPlayers[source] = false
                
                TriggerClientEvent('ahrp-cad:client:setUnitData', source, nil)
                TriggerClientEvent('ahrp-cad:client:unitUpdate', -1, unit, 'OFF_DUTY')
                
                if Config.Debug then
                    print("^2[AHRP-CAD]^7 Unit off duty:", unit.callsign)
                end
            end
        end)
    end
end

-- Update unit status
RegisterNetEvent('ahrp-cad:server:updateStatus')
AddEventHandler('ahrp-cad:server:updateStatus', function(newStatus)
    local source = source
    local unit = PlayerUnits[source]
    
    if not unit then
        return
    end
    
    UpdateUnitStatus(unit.id, newStatus, function(success)
        if success then
            unit.status = newStatus
            PlayerUnits[source] = unit
            
            TriggerClientEvent('ahrp-cad:client:updateStatus', source, newStatus)
            TriggerClientEvent('ahrp-cad:client:unitUpdate', -1, unit, 'STATUS_CHANGE')
            
            if Config.Debug then
                print("^2[AHRP-CAD]^7 Unit status updated:", unit.callsign, "->", newStatus)
            end
        end
    end)
end)

-- Update location
RegisterNetEvent('ahrp-cad:server:updateLocation')
AddEventHandler('ahrp-cad:server:updateLocation', function(locationData)
    local source = source
    local unit = PlayerUnits[source]
    
    if not unit then
        return
    end
    
    -- Update unit location via API
    UpdateUnitLocation(unit.id, locationData, function(success)
        if success then
            unit.location = locationData.location
            unit.latitude = locationData.latitude
            unit.longitude = locationData.longitude
            PlayerUnits[source] = unit
        end
    end)
end)

-- Panic button
RegisterNetEvent('ahrp-cad:server:panicButton')
AddEventHandler('ahrp-cad:server:panicButton', function()
    local source = source
    local unit = PlayerUnits[source]
    
    if not unit then
        return
    end
    
    -- Update status to PANIC
    UpdateUnitStatus(unit.id, 'PANIC', function(success)
        if success then
            unit.status = 'PANIC'
            PlayerUnits[source] = unit
            
            -- Broadcast panic alert to all units
            TriggerClientEvent('ahrp-cad:client:panicAlert', -1, unit)
            
            if Config.Debug then
                print("^1[AHRP-CAD PANIC]^7 Unit:", unit.callsign, "Location:", unit.location or "Unknown")
            end
        end
    end)
end)

-- Request backup
RegisterNetEvent('ahrp-cad:server:requestBackup')
AddEventHandler('ahrp-cad:server:requestBackup', function(backupType)
    local source = source
    local unit = PlayerUnits[source]
    
    if not unit then
        return
    end
    
    -- Create backup request call via API
    CreateBackupCall(unit, backupType, function(success, callData)
        if success then
            -- Broadcast to nearby units
            TriggerClientEvent('ahrp-cad:client:callUpdate', -1, callData)
        end
    end)
end)

-- Send ten code
RegisterNetEvent('ahrp-cad:server:sendTenCode')
AddEventHandler('ahrp-cad:server:sendTenCode', function(code, description)
    local source = source
    local unit = PlayerUnits[source]
    
    if not unit then
        return
    end
    
    -- Log ten code
    if Config.Debug then
        print("^3[AHRP-CAD TEN CODE]^7", unit.callsign, "->", code, "(" .. description .. ")")
    end
    
    -- Could send to dispatch/other units
    -- TriggerClientEvent('ahrp-cad:client:tenCodeReceived', -1, unit.callsign, code, description)
end)

-- Player disconnect
AddEventHandler('playerDropped', function(reason)
    local source = source
    
    if OnDutyPlayers[source] then
        GoOffDuty(source)
    end
    
    PlayerUnits[source] = nil
    OnDutyPlayers[source] = nil
end)

-- Get all active units
function GetActiveUnits()
    local units = {}
    for source, unit in pairs(PlayerUnits) do
        table.insert(units, unit)
    end
    return units
end

-- Exports
exports('GetActiveUnits', GetActiveUnits)
exports('GetUnitBySource', function(source)
    return PlayerUnits[source]
end)
exports('IsPlayerOnDuty', function(source)
    return OnDutyPlayers[source] == true
end)
