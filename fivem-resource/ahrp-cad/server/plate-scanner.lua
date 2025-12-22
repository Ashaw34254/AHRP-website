-- Plate Scanner Server-Side

-- Handle plate check request
RegisterNetEvent('ahrp-cad:server:plateCheck')
AddEventHandler('ahrp-cad:server:plateCheck', function(data)
    local source = source
    
    if Config.Debug then
        print("^3[AHRP-CAD]^7 Plate check:", data.plate)
    end
    
    -- Search vehicle via API
    SearchVehicle(data.plate, function(success, vehicleData)
        if success and vehicleData then
            -- Send results back to client
            TriggerClientEvent('ahrp-cad:client:plateCheckResult', source, vehicleData)
            
            -- Log the plate check
            if Config.Debug then
                print("^2[AHRP-CAD]^7 Plate found:", vehicleData.plate, "Owner:", vehicleData.ownerName or "Unknown")
            end
        else
            -- Plate not found
            TriggerClientEvent('ahrp-cad:client:plateCheckResult', source, nil)
            
            if Config.Debug then
                print("^1[AHRP-CAD]^7 Plate not found:", data.plate)
            end
        end
    end)
end)
