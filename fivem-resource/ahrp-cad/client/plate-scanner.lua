-- Plate Scanner System

local ScannerActive = false
local LastScannedPlate = nil

-- Scan nearby vehicle plate
function ScanNearbyVehicle()
    local ped = PlayerPedId()
    local vehicle = nil
    local plate = nil
    
    -- Check if player is in a vehicle
    if IsPedInAnyVehicle(ped, false) then
        vehicle = GetVehiclePedIsIn(ped, false)
    else
        -- Get vehicle player is aiming at or nearby
        local coords = GetEntityCoords(ped)
        vehicle = GetClosestVehicle(coords.x, coords.y, coords.z, 10.0, 0, 71)
    end
    
    if vehicle and vehicle ~= 0 then
        plate = GetVehicleNumberPlateText(vehicle)
        
        if plate then
            plate = string.gsub(plate, "^%s*(.-)%s*$", "%1") -- Trim whitespace
            
            if plate ~= LastScannedPlate then
                LastScannedPlate = plate
                RunPlateCheck(vehicle, plate)
            else
                ShowNotification("Plate already scanned: ~b~" .. plate, "info")
            end
        else
            ShowNotification("~r~No vehicle plate detected", "error")
        end
    else
        ShowNotification("~r~No vehicle nearby", "error")
    end
end

-- Run plate check via API
function RunPlateCheck(vehicle, plate)
    -- Show scanning animation
    ShowNotification("~y~Scanning plate: ~b~" .. plate, "info", true)
    
    -- Get vehicle info
    local model = GetDisplayNameFromVehicleModel(GetEntityModel(vehicle))
    local color = GetVehicleColor(vehicle)
    local coords = GetEntityCoords(vehicle)
    
    -- Send to server to check via API
    TriggerServerEvent('ahrp-cad:server:plateCheck', {
        plate = plate,
        model = model,
        color = color,
        location = LastStreetName or "Unknown",
        latitude = coords.x,
        longitude = coords.y
    })
end

-- Receive plate check results
RegisterNetEvent('ahrp-cad:client:plateCheckResult')
AddEventHandler('ahrp-cad:client:plateCheckResult', function(vehicleData)
    if not vehicleData then
        ShowNotification("~r~PLATE NOT FOUND~s~\nPlate: ~b~" .. LastScannedPlate .. "~s~\n~y~Unregistered Vehicle", "error", true)
        return
    end
    
    -- Display vehicle info
    local notification = string.format(
        "~g~PLATE FOUND~s~\n" ..
        "Plate: ~b~%s~s~\n" ..
        "Owner: ~y~%s~s~\n" ..
        "Model: ~b~%s~s~\n" ..
        "Status: %s",
        vehicleData.plate,
        vehicleData.ownerName or "Unknown",
        vehicleData.model or "Unknown",
        vehicleData.isStolen and "~r~STOLEN" or "~g~CLEAR"
    )
    
    if vehicleData.hasWarrant then
        notification = notification .. "\n~r~⚠ OWNER HAS ACTIVE WARRANT"
    end
    
    ShowNotification(notification, vehicleData.isStolen and "error" or "success", true)
    
    -- Create automatic BOLO if stolen
    if vehicleData.isStolen and Config.AutoBOLOStolen then
        CreateStolenVehicleBOLO(vehicleData)
    end
end)

-- Create BOLO for stolen vehicle
function CreateStolenVehicleBOLO(vehicleData)
    TriggerServerEvent('ahrp-cad:server:createBOLO', {
        priority = "HIGH",
        description = string.format(
            "STOLEN VEHICLE - %s Plate: %s - Owner: %s - Last seen: %s",
            vehicleData.model,
            vehicleData.plate,
            vehicleData.ownerName or "Unknown",
            LastStreetName or "Unknown"
        )
    })
    
    ShowNotification("~y~BOLO created for stolen vehicle", "warning")
end

-- Auto-scan mode (continuous scanning)
local AutoScanActive = false
function ToggleAutoScan()
    AutoScanActive = not AutoScanActive
    
    if AutoScanActive then
        ShowNotification("~g~Auto-scan ACTIVATED~s~\nAutomatically scanning nearby vehicles", "success")
        
        Citizen.CreateThread(function()
            while AutoScanActive do
                Citizen.Wait(Config.AutoScanInterval or 5000)
                
                if IsOnDuty then
                    local ped = PlayerPedId()
                    local coords = GetEntityCoords(ped)
                    local vehicle = GetClosestVehicle(coords.x, coords.y, coords.z, 15.0, 0, 71)
                    
                    if vehicle and vehicle ~= 0 then
                        local plate = GetVehicleNumberPlateText(vehicle)
                        if plate and plate ~= LastScannedPlate then
                            LastScannedPlate = plate
                            RunPlateCheck(vehicle, plate)
                        end
                    end
                end
            end
        end)
    else
        ShowNotification("~r~Auto-scan DEACTIVATED", "error")
    end
end

-- Manual plate entry
function ManualPlateEntry()
    -- This would open a text input dialog
    -- For now, using chat command
    ShowNotification("Use: ~b~/checkplate [plate]~s~ to manually enter plate", "info")
end

-- Exports
exports('ScanPlate', ScanNearbyVehicle)
exports('ToggleAutoScan', ToggleAutoScan)
exports('IsAutoScanActive', function() return AutoScanActive end)
