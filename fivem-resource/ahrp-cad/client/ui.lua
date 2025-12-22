-- UI Management using IFrame to website
local NUIFocused = false
local CADUrl = Config.WebsiteURL .. "/dashboard/police/cad" -- Default to police CAD

-- Open CAD UI (opens website in overlay browser)
function OpenCADUI()
    if not IsOnDuty then
        ShowNotification("You must be on duty to access the CAD", "error")
        return
    end
    
    -- Determine which department CAD to open
    local isEmergency, department = IsEmergencyJob()
    if isEmergency then
        if department == "FIRE" then
            CADUrl = Config.WebsiteURL .. "/dashboard/fire/cad"
        elseif department == "EMS" then
            CADUrl = Config.WebsiteURL .. "/dashboard/ems/cad"
        else
            CADUrl = Config.WebsiteURL .. "/dashboard/police/cad"
        end
    end
    
    UIOpen = true
    
    -- Open website in overlay browser
    SetNuiFocus(false, false)
    SendNUIMessage({
        type = "openUrl",
        url = CADUrl
    })
    
    -- Alternative: Use native browser (comment out above, uncomment below)
    -- This opens the website in the Steam overlay or default browser
    -- OpenUrl(CADUrl)
end

-- Close CAD UI
function CloseCADUI()
    UIOpen = false
    SendNUIMessage({
        type = "closeUrl"
    })
end

-- Note: Since we're using IFrame/browser, most NUI callbacks are not needed
-- The website handles all interactions directly
-- Unit status updates come from the website API

-- Keybind: Open CAD
RegisterCommand('+openCAD', function()
    if IsOnDuty then
        OpenCADUI()
    end
end, false)

RegisterCommand('-openCAD', function() end, false)

RegisterKeyMapping('+openCAD', 'Open CAD System', 'keyboard', Config.Keybinds.OpenCAD)

-- Update UI with new data
-- Note: When using IFrame, the website handles its own updates via API polling
-- This is kept for compatibility with other notification systems
RegisterNetEvent('ahrp-cad:client:updateUI')
AddEventHandler('ahrp-cad:client:updateUI', function(data)
    -- Website auto-refreshes, no need to push updates
    if Config.Debug then
        print("^3[AHRP-CAD]^7 UI update received (website handles via polling)")
    end
end)

-- Send ten code
function SendTenCode(code)
    local description = Config.TenCodes[code]
    if description then
        TriggerServerEvent('ahrp-cad:server:sendTenCode', code, description)
        ShowNotification("Sent: ~b~" .. code .. "~s~ - " .. description, "info")
    end
end

-- Ten codes menu (simple in-game list)
function OpenTenCodesMenu()
    -- Show simple text list of ten codes
    local codeText = "^3[Ten Codes]^7\n"
    for code, description in pairs(Config.TenCodes) do
        codeText = codeText .. "^2" .. code .. "^7: " .. description .. "\n"
    end
    
    -- Display in chat or notification
    TriggerEvent('chat:addMessage', {
        multiline = true,
        args = {codeText}
    })
end

-- Keybind: Ten Codes Menu
RegisterCommand('+tenCodes', function()
    if IsOnDuty then
        OpenTenCodesMenu()
    end
end, false)

RegisterCommand('-tenCodes', function() end, false)

RegisterKeyMapping('+tenCodes', 'Open Ten Codes Menu', 'keyboard', Config.Keybinds.TenCodes)
