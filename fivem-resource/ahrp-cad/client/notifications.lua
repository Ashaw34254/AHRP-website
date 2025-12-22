-- Notifications System

function ShowNotification(message, type, playSound)
    -- Native GTA notification
    SetNotificationTextEntry("STRING")
    AddTextComponentString(message)
    DrawNotification(false, false)
    
    -- Play sound if enabled
    if playSound and Config.Notifications.PlaySound then
        PlaySoundFrontend(-1, "CONFIRM_BEEP", "HUD_MINI_GAME_SOUNDSET", 1)
    end
    
    -- Also send to NUI for custom notifications
    SendNUIMessage({
        action = "notify",
        message = message,
        type = type or "info"
    })
    
    if Config.Debug then
        print("^3[AHRP-CAD Notification]^7 " .. message)
    end
end

-- Advanced notification with buttons
function ShowAdvancedNotification(data)
    SendNUIMessage({
        action = "advancedNotify",
        title = data.title,
        message = data.message,
        type = data.type or "info",
        buttons = data.buttons or {},
        duration = data.duration or 5000
    })
    
    if data.playSound and Config.Notifications.PlaySound then
        PlaySoundFrontend(-1, "CONFIRM_BEEP", "HUD_MINI_GAME_SOUNDSET", 1)
    end
end

-- Call notification with accept/decline buttons
RegisterNetEvent('ahrp-cad:client:callNotification')
AddEventHandler('ahrp-cad:client:callNotification', function(callData)
    ShowAdvancedNotification({
        title = "New Call Assignment",
        message = string.format(
            "Type: %s\nPriority: %s\nLocation: %s",
            callData.type,
            callData.priority,
            callData.location
        ),
        type = "warning",
        playSound = true,
        buttons = {
            {
                text = "Accept",
                action = "acceptCall",
                callId = callData.id
            },
            {
                text = "Decline", 
                action = "declineCall",
                callId = callData.id
            }
        },
        duration = 10000
    })
end)

-- Handle notification button clicks
RegisterNUICallback('notificationAction', function(data, cb)
    if data.action == "acceptCall" then
        TriggerServerEvent('ahrp-cad:server:acceptCall', data.callId)
    elseif data.action == "declineCall" then
        TriggerServerEvent('ahrp-cad:server:declineCall', data.callId)
    end
    cb('ok')
end)

-- Export for other resources
exports('ShowNotification', ShowNotification)
exports('ShowAdvancedNotification', ShowAdvancedNotification)
