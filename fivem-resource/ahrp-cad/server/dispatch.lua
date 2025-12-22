-- Dispatch Module - Call management from in-game

-- Accept call
RegisterNetEvent('ahrp-cad:server:acceptCall')
AddEventHandler('ahrp-cad:server:acceptCall', function(callId)
    local source = source
    local unit = PlayerUnits[source]
    
    if not unit then
        return
    end
    
    -- Assign unit to call
    AssignUnitToCall(callId, unit.id, function(success)
        if success then
            -- Update unit status to ENROUTE
            UpdateUnitStatus(unit.id, 'ENROUTE', function()
                unit.status = 'ENROUTE'
                unit.callId = callId
                PlayerUnits[source] = unit
                
                TriggerClientEvent('ahrp-cad:client:updateStatus', source, 'ENROUTE')
                
                -- Get call details and send to client
                GetCallDetails(callId, function(callData)
                    TriggerClientEvent('ahrp-cad:client:assignedCall', source, callData)
                end)
            end)
        end
    end)
end)

-- Decline call
RegisterNetEvent('ahrp-cad:server:declineCall')
AddEventHandler('ahrp-cad:server:declineCall', function(callId)
    local source = source
    
    -- Just notify, don't change anything
    TriggerClientEvent('chat:addMessage', source, {
        args = {"^3[CAD]^7", "Call declined"}
    })
end)

-- Complete call
RegisterNetEvent('ahrp-cad:server:completeCall')
AddEventHandler('ahrp-cad:server:completeCall', function(callId)
    local source = source
    local unit = PlayerUnits[source]
    
    if not unit then
        return
    end
    
    -- Update call status to CLOSED
    UpdateCallStatus(callId, 'CLOSED', function(success)
        if success then
            -- Set unit back to AVAILABLE
            UpdateUnitStatus(unit.id, 'AVAILABLE', function()
                unit.status = 'AVAILABLE'
                unit.callId = nil
                PlayerUnits[source] = unit
                
                TriggerClientEvent('ahrp-cad:client:updateStatus', source, 'AVAILABLE')
                TriggerClientEvent('chat:addMessage', source, {
                    args = {"^2[CAD]^7", "Call completed - Status: AVAILABLE"}
                })
            end)
        end
    end)
end)

-- Add call note
RegisterNetEvent('ahrp-cad:server:addCallNote')
AddEventHandler('ahrp-cad:server:addCallNote', function(callId, note)
    local source = source
    local unit = PlayerUnits[source]
    
    if not unit then
        return
    end
    
    AddCallNote(callId, note, unit.callsign, function(success)
        if success then
            TriggerClientEvent('chat:addMessage', source, {
                args = {"^2[CAD]^7", "Note added to call"}
            })
        end
    end)
end)

-- Get call details
function GetCallDetails(callId, callback)
    MakeAPIRequest("/api/cad/calls/" .. callId, "GET", nil, function(success, call)
        if success then
            callback(call)
        else
            callback(nil)
        end
    end)
end

-- Create call from in-game
RegisterNetEvent('ahrp-cad:server:createCall')
AddEventHandler('ahrp-cad:server:createCall', function(callData)
    local source = source
    local unit = PlayerUnits[source]
    
    if not unit then
        return
    end
    
    -- Add reporter info
    callData.reporterName = callData.reporterName or unit.callsign
    
    MakeAPIRequest("/api/cad/calls", "POST", callData, function(success, call)
        if success then
            TriggerClientEvent('chat:addMessage', source, {
                args = {"^2[CAD]^7", "Call created: " .. call.callNumber}
            })
            
            -- Broadcast to all units
            TriggerClientEvent('ahrp-cad:client:callUpdate', -1, call)
        else
            TriggerClientEvent('chat:addMessage', source, {
                args = {"^1[CAD]^7", "Failed to create call"}
            })
        end
    end)
end)

-- BOLO (Be On the Lookout)
RegisterNetEvent('ahrp-cad:server:createBOLO')
AddEventHandler('ahrp-cad:server:createBOLO', function(boloData)
    local source = source
    local unit = PlayerUnits[source]
    
    if not unit then
        return
    end
    
    -- Create as a call with BOLO type
    local callData = {
        type = "BOLO",
        priority = boloData.priority or "MEDIUM",
        location = "Countywide",
        description = boloData.description,
        reporterName = unit.callsign
    }
    
    MakeAPIRequest("/api/cad/calls", "POST", callData, function(success, call)
        if success then
            -- Broadcast BOLO to all units
            TriggerClientEvent('chat:addMessage', -1, {
                args = {"^3[BOLO]^7", boloData.description}
            })
        end
    end)
end)

-- Traffic stop
RegisterNetEvent('ahrp-cad:server:trafficStop')
AddEventHandler('ahrp-cad:server:trafficStop', function(vehicleData)
    local source = source
    local unit = PlayerUnits[source]
    
    if not unit then
        return
    end
    
    -- Create traffic stop call
    local callData = {
        type = "TRAFFIC_STOP",
        priority = "LOW",
        location = unit.location or "Unknown",
        latitude = unit.latitude,
        longitude = unit.longitude,
        description = string.format(
            "Traffic stop - Vehicle: %s Plate: %s",
            vehicleData.model or "Unknown",
            vehicleData.plate or "Unknown"
        ),
        reporterName = unit.callsign
    }
    
    MakeAPIRequest("/api/cad/calls", "POST", callData, function(success, call)
        if success then
            -- Auto-assign to this unit
            AssignUnitToCall(call.id, unit.id, function()
                UpdateUnitStatus(unit.id, 'BUSY', function()
                    TriggerClientEvent('chat:addMessage', source, {
                        args = {"^2[CAD]^7", "Traffic stop logged: " .. call.callNumber}
                    })
                end)
            end)
        end
    end)
end)

-- Exports
exports('CreateCall', function(callData, callback)
    MakeAPIRequest("/api/cad/calls", "POST", callData, callback)
end)

exports('AssignCall', function(callId, unitId, callback)
    AssignUnitToCall(callId, unitId, callback)
end)
