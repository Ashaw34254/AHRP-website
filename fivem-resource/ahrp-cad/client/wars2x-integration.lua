--[[
    AHRP CAD - Wraith ARS 2X Client Integration
    
    Handles client-side integration with Wraith ARS 2X radar system.
    Displays plate check results and manages BOLO notifications.
]]

local wars2xActive = false

-- Check if Wraith ARS 2X is installed and running
Citizen.CreateThread(function()
    Citizen.Wait(5000) -- Wait for resources to load
    
    -- Check if wk_wars2x resource exists
    local resourceName = "wk_wars2x"
    local resourceState = GetResourceState(resourceName)
    
    if resourceState == "started" or resourceState == "starting" then
        wars2xActive = true
        print("[AHRP-CAD] Wraith ARS 2X detected and active")
        
        -- Subscribe to BOLO updates
        SubscribeToBoloUpdates()
    else
        print("[AHRP-CAD] Wraith ARS 2X not detected")
    end
end)

-- Handle plate check results from server
RegisterNetEvent('ahrp-cad:client:plateCheckResult')
AddEventHandler('ahrp-cad:client:plateCheckResult', function(data)
    if not data or not data.data then return end
    
    local vehicleData = data.data
    local plate = data.plate
    
    -- Display on-screen notification
    ShowPlateCheckNotification(plate, vehicleData)
    
    -- If vehicle has critical flags, also show on the CAD if open
    if vehicleData.isStolen or (vehicleData.warrants and #vehicleData.warrants > 0) then
        -- Send to NUI if CAD is open
        if IsCadOpen then
            SendNUIMessage({
                type = 'plateAlert',
                plate = plate,
                vehicle = vehicleData,
                camera = data.camera
            })
        end
    end
end)

-- Show plate check notification
function ShowPlateCheckNotification(plate, vehicleData)
    local flags = {}
    local color = "~g~" -- Green for clean
    local prefix = "✓"
    
    if vehicleData.isStolen then
        table.insert(flags, "~r~STOLEN~s~")
        color = "~r~"
        prefix = "⚠️"
    end
    
    if vehicleData.warrants and #vehicleData.warrants > 0 then
        table.insert(flags, "~o~WARRANTS~s~")
        if color == "~g~" then
            color = "~o~"
            prefix = "⚠️"
        end
    end
    
    if vehicleData.isRegistered == false then
        table.insert(flags, "~y~UNREGISTERED~s~")
    end
    
    -- Build notification text
    local text = string.format("%s %sPlate: %s~s~", prefix, color, plate)
    
    if #flags > 0 then
        text = text .. "\n" .. table.concat(flags, " | ")
    else
        text = text .. "\n~g~No Flags~s~"
    end
    
    if vehicleData.model then
        text = text .. string.format("\n%s %s", vehicleData.color or "", vehicleData.model)
    end
    
    if vehicleData.owner then
        text = text .. string.format("\nOwner: %s", vehicleData.owner)
    end
    
    -- Show notification for 8 seconds
    BeginTextCommandThefeedPost("STRING")
    AddTextComponentSubstringPlayerName(text)
    EndTextCommandThefeedPostTicker(false, true)
    PlaySoundFrontend(-1, "CONFIRM_BEEP", "HUD_MINI_GAME_SOUNDSET", true)
end

-- Subscribe to BOLO updates from CAD
function SubscribeToBoloUpdates()
    RegisterNetEvent('ahrp-cad:client:boloUpdate')
    AddEventHandler('ahrp-cad:client:boloUpdate', function(bolo)
        if not bolo then return end
        
        -- If we have Wraith ARS 2X, set the BOLO plate automatically
        if wars2xActive and bolo.type == 'VEHICLE' and bolo.plate then
            -- Trigger Wraith's set BOLO function
            SendNUIMessage({
                resource = 'wk_wars2x',
                type = 'setBoloPlate',
                plate = bolo.plate
            })
            
            print(string.format("[AHRP-CAD] Set BOLO plate in Wraith ARS 2X: %s", bolo.plate))
            
            -- Show notification
            ShowNotification({
                type = 'info',
                title = '🚨 BOLO Active',
                message = string.format('ALPR scanning for: %s', bolo.plate),
                duration = 5000
            })
        end
    end)
end

-- Command to manually set BOLO plate in Wraith
RegisterCommand('setbolo', function(source, args)
    if not wars2xActive then
        ShowNotification({
            type = 'error',
            title = 'Error',
            message = 'Wraith ARS 2X not active',
            duration = 3000
        })
        return
    end
    
    if not args[1] then
        ShowNotification({
            type = 'error',
            title = 'Error',
            message = 'Usage: /setbolo [plate]',
            duration = 3000
        })
        return
    end
    
    local plate = string.upper(table.concat(args, " "))
    
    -- Send to Wraith ARS 2X NUI
    SendNUIMessage({
        resource = 'wk_wars2x',
        type = 'setBoloPlate',
        plate = plate
    })
    
    ShowNotification({
        type = 'success',
        title = 'BOLO Set',
        message = string.format('ALPR now scanning for: %s', plate),
        duration = 3000
    })
end)

-- Command to clear BOLO plate in Wraith
RegisterCommand('clearbolo', function()
    if not wars2xActive then
        ShowNotification({
            type = 'error',
            title = 'Error',
            message = 'Wraith ARS 2X not active',
            duration = 3000
        })
        return
    end
    
    -- Send to Wraith ARS 2X NUI
    SendNUIMessage({
        resource = 'wk_wars2x',
        type = 'clearBoloPlate'
    })
    
    ShowNotification({
        type = 'success',
        title = 'BOLO Cleared',
        message = 'ALPR BOLO plate cleared',
        duration = 3000
    })
end)

-- Export to check if Wars2x is active
exports('IsWars2xActive', function()
    return wars2xActive
end)

print("[AHRP-CAD] Wraith ARS 2X client integration loaded")
