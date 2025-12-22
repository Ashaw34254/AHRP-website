-- Commands

-- Go on duty
RegisterCommand('duty', function(source, args, rawCommand)
    local isEmergency, department = IsEmergencyJob()
    
    if not isEmergency then
        ShowNotification("You must be in an emergency services job to go on duty", "error")
        return
    end
    
    TriggerServerEvent('ahrp-cad:server:toggleDuty', department)
end, false)

-- Change status
RegisterCommand('status', function(source, args, rawCommand)
    if not IsOnDuty then
        ShowNotification("You must be on duty to change status", "error")
        return
    end
    
    local newStatus = string.upper(args[1] or "")
    local validStatuses = {"AVAILABLE", "BUSY", "ENROUTE", "ON_SCENE", "OUT_OF_SERVICE"}
    
    local isValid = false
    for _, status in ipairs(validStatuses) do
        if newStatus == status then
            isValid = true
            break
        end
    end
    
    if not isValid then
        ShowNotification(
            "Invalid status. Valid options: ~b~AVAILABLE, BUSY, ENROUTE, ON_SCENE, OUT_OF_SERVICE",
            "error"
        )
        return
    end
    
    TriggerServerEvent('ahrp-cad:server:updateStatus', newStatus)
end, false)

-- Panic button
function TriggerPanicButton()
    if not IsOnDuty then
        ShowNotification("You must be on duty to use panic button", "error")
        return
    end
    
    TriggerServerEvent('ahrp-cad:server:panicButton')
    ShowNotification("~r~⚠ PANIC BUTTON ACTIVATED ⚠", "error", true)
    
    -- Flash screen and play sound
    Citizen.CreateThread(function()
        local flashCount = 0
        while flashCount < 5 do
            StartScreenEffect('Dont_tazeme_bro', 0, false)
            PlaySoundFrontend(-1, "Bed", "WastedSounds", true)
            Citizen.Wait(200)
            StopScreenEffect('Dont_tazeme_bro')
            Citizen.Wait(200)
            flashCount = flashCount + 1
        end
    end)
end

RegisterCommand('panic', function(source, args, rawCommand)
    TriggerPanicButton()
end, false)

-- Keybind: Panic Button
RegisterCommand('+panicButton', function()
    TriggerPanicButton()
end, false)

RegisterCommand('-panicButton', function() end, false)

RegisterKeyMapping('+panicButton', 'Panic Button', 'keyboard', Config.Keybinds.Panic)

-- Quick status toggle
RegisterCommand('+toggleStatus', function()
    if not IsOnDuty then return end
    
    -- Cycle through common statuses
    local statusCycle = {"AVAILABLE", "BUSY", "ENROUTE", "ON_SCENE"}
    local currentIndex = 1
    
    for i, status in ipairs(statusCycle) do
        if CurrentStatus == status then
            currentIndex = i
            break
        end
    end
    
    local nextIndex = (currentIndex % #statusCycle) + 1
    local newStatus = statusCycle[nextIndex]
    
    TriggerServerEvent('ahrp-cad:server:updateStatus', newStatus)
end, false)

RegisterCommand('-toggleStatus', function() end, false)

RegisterKeyMapping('+toggleStatus', 'Quick Status Toggle', 'keyboard', Config.Keybinds.ToggleStatus)

-- Admin: Create call
RegisterCommand('createcall', function(source, args, rawCommand)
    if not IsOnDuty then
        ShowNotification("You must be on duty to create calls", "error")
        return
    end
    
    -- This would open a UI form, for now just notify
    ShowNotification("Open CAD (F5) to create calls", "info")
    OpenCADUI()
end, false)

-- View active calls
RegisterCommand('calls', function(source, args, rawCommand)
    if not IsOnDuty then
        ShowNotification("You must be on duty to view calls", "error")
        return
    end
    
    OpenCADUI()
end, false)

-- Set callsign
RegisterCommand('callsign', function(source, args, rawCommand)
    local callsign = args[1]
    
    if not callsign then
        if CurrentUnit then
            ShowNotification("Your callsign is: ~b~" .. CurrentUnit.callsign, "info")
        else
            ShowNotification("You are not on duty", "error")
        end
        return
    end
    
    TriggerServerEvent('ahrp-cad:server:setCallsign', callsign)
end, false)

-- Request backup
RegisterCommand('backup', function(source, args, rawCommand)
    if not IsOnDuty then
        ShowNotification("You must be on duty to request backup", "error")
        return
    end
    
    local backupType = args[1] or "ROUTINE"
    TriggerServerEvent('ahrp-cad:server:requestBackup', backupType)
    ShowNotification("~y~Backup requested: " .. backupType, "warning", true)
end, false)

-- Ten code shortcuts
RegisterCommand('10-4', function() SendTenCode('10-4') end, false)
RegisterCommand('10-8', function() SendTenCode('10-8') end, false)
RegisterCommand('10-23', function() SendTenCode('10-23') end, false)
RegisterCommand('code4', function() SendTenCode('Code 4') end, false)

-- Plate scanner commands
RegisterCommand('scanplate', function(source, args, rawCommand)
    if not IsOnDuty then
        ShowNotification("You must be on duty to scan plates", "error")
        return
    end
    
    ScanNearbyVehicle()
end, false)

RegisterCommand('checkplate', function(source, args, rawCommand)
    if not IsOnDuty then
        ShowNotification("You must be on duty to check plates", "error")
        return
    end
    
    local plate = args[1]
    if not plate then
        ShowNotification("Usage: ~b~/checkplate [plate]", "error")
        return
    end
    
    plate = string.upper(plate)
    LastScannedPlate = plate
    
    TriggerServerEvent('ahrp-cad:server:plateCheck', {
        plate = plate,
        model = "Manual Entry",
        location = LastStreetName or "Unknown"
    })
end, false)

RegisterCommand('autoscan', function(source, args, rawCommand)
    if not IsOnDuty then
        ShowNotification("You must be on duty to use auto-scan", "error")
        return
    end
    
    ToggleAutoScan()
end, false)

-- Keybind: Scan Plate
RegisterCommand('+scanPlate', function()
    if IsOnDuty then
        ScanNearbyVehicle()
    end
end, false)

RegisterCommand('-scanPlate', function() end, false)

RegisterKeyMapping('+scanPlate', 'Scan Vehicle Plate', 'keyboard', Config.Keybinds.ScanPlate or 'E')
