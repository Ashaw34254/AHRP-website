-- Sync Module - Keeps FiveM in sync with web CAD

local LastSync = 0
local SyncInterval = Config.StatusSyncInterval

-- Main sync thread
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(SyncInterval)
        
        if Config.AutoSync then
            PerformSync()
        end
    end
end)

-- Perform full sync
function PerformSync()
    if Config.Debug then
        print("^3[AHRP-CAD SYNC]^7 Starting sync cycle...")
    end
    
    -- Sync active calls
    SyncActiveCalls()
    
    -- Sync all units
    SyncUnits()
    
    LastSync = os.time()
end

-- Sync active calls from web to game
function SyncActiveCalls()
    GetActiveCalls(function(success, calls)
        if success then
            -- Broadcast to all on-duty players
            for source, _ in pairs(OnDutyPlayers) do
                TriggerClientEvent('ahrp-cad:client:updateUI', source, {
                    type = 'calls',
                    calls = calls
                })
            end
            
            if Config.Debug then
                print("^2[AHRP-CAD SYNC]^7 Synced " .. #calls .. " active calls")
            end
        end
    end)
end

-- Sync units
function SyncUnits()
    local activeUnits = GetActiveUnits()
    
    -- Send unit locations to all clients for blip updates
    TriggerClientEvent('ahrp-cad:client:updateUnitBlips', -1, activeUnits)
    
    if Config.Debug then
        print("^2[AHRP-CAD SYNC]^7 Synced " .. #activeUnits .. " active units")
    end
end

-- Manual sync command (admin)
RegisterCommand('cadsync', function(source, args, rawCommand)
    if source == 0 or IsPlayerAceAllowed(source, "command.cadsync") then
        PerformSync()
        
        if source ~= 0 then
            TriggerClientEvent('chat:addMessage', source, {
                args = {"^2[CAD]^7", "Manual sync completed"}
            })
        else
            print("^2[AHRP-CAD]^7 Manual sync completed")
        end
    end
end, true)

-- Get sync status
RegisterCommand('cadstatus', function(source, args, rawCommand)
    local activeUnits = GetActiveUnits()
    local lastSyncAgo = os.time() - LastSync
    
    local message = string.format(
        "^2[CAD Status]^7\nActive Units: %d\nLast Sync: %d seconds ago\nAuto-Sync: %s",
        #activeUnits,
        lastSyncAgo,
        Config.AutoSync and "Enabled" or "Disabled"
    )
    
    if source ~= 0 then
        TriggerClientEvent('chat:addMessage', source, {
            args = {"^2[CAD]^7", message}
        })
    else
        print(message)
    end
end, false)

-- Webhook notifications (optional - for Discord/Slack)
function SendWebhook(webhookUrl, data)
    if not webhookUrl or webhookUrl == "" then
        return
    end
    
    PerformHttpRequest(webhookUrl, function(err, text, headers)
        -- Ignore response
    end, 'POST', json.encode(data), {
        ['Content-Type'] = 'application/json'
    })
end

-- Send panic alert to Discord
RegisterNetEvent('ahrp-cad:server:webhookPanic')
AddEventHandler('ahrp-cad:server:webhookPanic', function(unit)
    -- Add your Discord webhook URL in config
    local webhookUrl = GetConvar("cad_discord_webhook", "")
    
    if webhookUrl ~= "" then
        SendWebhook(webhookUrl, {
            username = "CAD System",
            content = "@everyone",
            embeds = {{
                title = "🚨 PANIC BUTTON ACTIVATED",
                description = string.format(
                    "**Unit:** %s\n**Location:** %s\n**Time:** %s",
                    unit.callsign,
                    unit.location or "Unknown",
                    os.date("%H:%M:%S")
                ),
                color = 16711680, -- Red
                timestamp = os.date("!%Y-%m-%dT%H:%M:%S")
            }}
        })
    end
end)

-- Export
exports('PerformSync', PerformSync)
exports('GetLastSync', function()
    return LastSync
end)
