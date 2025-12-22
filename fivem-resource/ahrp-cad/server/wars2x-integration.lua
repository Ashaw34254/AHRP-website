--[[
    AHRP CAD - Wraith ARS 2X Integration
    
    This module integrates the Wraith ARS 2X radar/plate reader system with the AHRP CAD.
    It automatically checks plates scanned by the radar against the CAD database and
    creates BOLOs for wanted/stolen vehicles.
    
    Requirements:
    - wk_wars2x resource must be installed and running
    - Config.EnableWars2xIntegration must be set to true
]]

-- Listen for plate scans from Wraith ARS 2X
RegisterServerEvent('wk:onPlateScanned')
AddEventHandler('wk:onPlateScanned', function(cam, plate, index)
    if not Config.EnableWars2xIntegration then
        return
    end
    
    local source = source
    
    -- Clean up the plate text
    plate = string.gsub(plate, "^%s*(.-)%s*$", "%1") -- Trim whitespace
    
    if not plate or plate == "" then
        return
    end
    
    print(string.format("[AHRP-CAD] Wraith ARS 2X scanned plate: %s (%s camera)", plate, cam))
    
    -- Get the officer/unit who scanned the plate
    local unit = GetActiveUnit(source)
    if not unit then
        print("[AHRP-CAD] No active unit found for player " .. source)
        return
    end
    
    -- Check the plate against CAD database
    Citizen.CreateThread(function()
        local vehicleData = SearchVehicle(plate)
        local result = "CHECKED"
        
        if vehicleData then
            -- Determine result based on vehicle status
            if vehicleData.isStolen then
                result = "STOLEN"
            elseif vehicleData.warrants and #vehicleData.warrants > 0 then
                result = "WANTED"
            elseif vehicleData.boloActive then
                result = "BOLO_HIT"
            else
                result = "CLEAR"
            end
            
        -- Send the vehicle info to the officer who scanned it
        TriggerClientEvent('ahrp-cad:client:plateCheckResult', source, {
            plate = plate,
            camera = cam,
            data = vehicleData,
            source = 'wars2x'
        })
        
        -- Check if vehicle is stolen or has warrants
            local flags = {}
            
            if vehicleData.isStolen then
                table.insert(flags, "STOLEN")
            end
            
            if vehicleData.warrants and #vehicleData.warrants > 0 then
                table.insert(flags, string.format("WARRANTS (%d)", #vehicleData.warrants))
            end
            
            if vehicleData.notes and vehicleData.notes ~= "" then
                table.insert(flags, "HAS NOTES")
            end
            
            -- If vehicle has flags, notify the officer and optionally create BOLO
            if #flags > 0 then
                local flagsText = table.concat(flags, ", ")
                
                -- Send alert to officer
                TriggerClientEvent('ahrp-cad:client:notification', source, {
                    type = 'error',
                    title = '⚠️ PLATE ALERT',
                    message = string.format('Plate %s: %s', plate, flagsText),
                    duration = 10000
                })
                
                -- If stolen and auto-BOLO is enabled, create BOLO
                if vehicleData.isStolen and Config.Wars2xAutoBoloStolen then
                    CreateVehicleBOLO({
                        plate = plate,
                        model = vehicleData.model or "Unknown",
                        color = vehicleData.color or "Unknown",
                        reason = "Stolen Vehicle - Detected by ALPR",
                        officer = GetActiveUnit(source),
                        priority = "HIGH"
                    })
                    
                    -- Notify all units
                    BroadcastToAllUnits({
                        type = 'bolo',
                        title = '🚨 AUTOMATIC BOLO',
                        message = string.format('STOLEN VEHICLE: %s %s - Plate: %s', 
                            vehicleData.color or "Unknown", 
                            vehicleData.model or "Unknown", 
                            plate),
                        priority = 'HIGH'
                    })
                    
                    print(string.format("[AHRP-CAD] Auto-created BOLO for stolen vehicle: %s", plate))
                end
            else
                -- Clean plate, send green notification
                TriggerClientEvent('ahrp-cad:client:notification', source, {
                    type = 'success',
                    title = '✓ Plate Clear',
                    message = string.format('Plate %s: No flags', plate),
                    duration = 3000
                })
            end
            
            -- Log plate scan to CAD database
            LogPlateScan({
                plate = plate,
                officerId = unit.officerId or unit.id,
                unitId = unit.id,
                camera = "wars2x_" .. cam,
                location = unit.location,
                result = result,
                vehicleData = vehicleData
            })
        else
            -- Plate not in database - still log the scan
            LogPlateScan({
                plate = plate,
                officerId = unit.officerId or unit.id,
                unitId = unit.id,
                camera = "wars2x_" .. cam,
                location = unit.location,
                result = "NOT_FOUND"
            })
            
            -- Plate not in database
            TriggerClientEvent('ahrp-cad:client:notification', source, {
                type = 'warning',
                title = '⚠️ Unknown Plate',
                message = string.format('Plate %s not in database', plate),
                duration = 5000
            })
        end
    end)
end)

-- Function to create a BOLO in the CAD system
function CreateVehicleBOLO(data)
    local boloData = {
        type = 'VEHICLE',
        plate = data.plate,
        model = data.model,
        color = data.color,
        reason = data.reason,
        officer = data.officer,
        priority = data.priority or 'MEDIUM',
        timestamp = os.time()
    }
    
    -- Store BOLO in database via API
    MakeAPIRequest('POST', '/api/cad/bolo/create', boloData, function(success, response)
        if success then
            print(string.format("[AHRP-CAD] BOLO created for plate: %s", data.plate))
        else
            print(string.format("[AHRP-CAD] Failed to create BOLO for plate: %s", data.plate))
        end
    end)
    
    return boloData
end

-- Function to broadcast to all active units
function BroadcastToAllUnits(notification)
    local units = GetAllActiveUnits()
    
    for _, unit in ipairs(units) do
        if unit.playerId then
            TriggerClientEvent('ahrp-cad:client:notification', unit.playerId, notification)
        end
    end
end

-- Function to log plate scan to CAD database
function LogPlateScan(data)
    local scanData = {
        plate = data.plate,
        officerId = data.officerId,
        unitId = data.unitId,
        camera = data.camera,
        location = data.location,
        result = data.result
    }
    
    -- Send to CAD API
    MakeAPIRequest('POST', '/api/cad/plate-scans', scanData, function(success, response)
        if success then
            if Config.Debug then
                print(string.format("[AHRP-CAD] Logged plate scan: %s -> %s", data.plate, data.result))
            end
        else
            print(string.format("[AHRP-CAD] Failed to log plate scan: %s", data.plate))
        end
    end)
end

-- Export for other resources to create BOLOs
exports('CreateVehicleBOLO', CreateVehicleBOLO)

-- Export to manually trigger plate check (for other resources)
exports('CheckPlate', function(plate, source)
    TriggerEvent('wk:onPlateScanned', 'manual', plate, 0)
end)

-- Export to log plate scans from other resources
exports('LogPlateScan', LogPlateScan)

print("[AHRP-CAD] Wraith ARS 2X integration loaded")
