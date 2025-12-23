-- Server-side report submission handler
-- Forwards reports from FiveM to the website API

-- Handle report submission from client
RegisterNetEvent("ahrp-cad:submitReport")
AddEventHandler("ahrp-cad:submitReport", function(reportData)
    local src = source
    
    -- Get player identifiers for logging
    local playerName = GetPlayerName(src)
    local steamId = GetSteamIdentifier(src)
    
    -- Add server-side player info
    reportData.playerName = playerName
    reportData.steamId = steamId
    
    -- Send to website API
    SubmitReportToAPI(reportData, src)
end)

-- Submit report to website API endpoint
function SubmitReportToAPI(reportData, source)
    local apiUrl = Config.ApiUrl .. "/fivem/reports"
    local apiKey = Config.ApiKey
    
    -- Prepare headers
    local headers = {
        ["Content-Type"] = "application/json",
        ["x-api-key"] = apiKey
    }
    
    -- Convert to JSON
    local payload = json.encode(reportData)
    
    -- Make HTTP request
    PerformHttpRequest(apiUrl, function(statusCode, response, headers)
        if statusCode == 200 then
            local data = json.decode(response)
            
            if data.success then
                print(("[AHRP-CAD] Report %s submitted by %s"):format(
                    data.report.reportNumber,
                    reportData.playerName
                ))
                
                -- Notify the player
                TriggerClientEvent("ahrp-cad:reportSubmitted", source, {
                    success = true,
                    reportNumber = data.report.reportNumber,
                    message = data.message
                })
                
                -- Optional: Notify all on-duty units
                TriggerClientEvent("ahrp-cad:newReportNotification", -1, {
                    reportNumber = data.report.reportNumber,
                    title = reportData.title,
                    submittedBy = reportData.reportedBy
                })
            else
                print(("[AHRP-CAD] Failed to submit report: %s"):format(data.error or "Unknown error"))
                TriggerClientEvent("ahrp-cad:reportError", source, "Failed to submit report")
            end
        else
            print(("[AHRP-CAD] API Error - Status Code: %d"):format(statusCode))
            TriggerClientEvent("ahrp-cad:reportError", source, "API connection failed")
        end
    end, "POST", payload, headers)
end

-- Helper to get Steam ID
function GetSteamIdentifier(source)
    local identifiers = GetPlayerIdentifiers(source)
    for _, id in ipairs(identifiers) do
        if string.sub(id, 1, 6) == "steam:" then
            return id
        end
    end
    return "unknown"
end

-- Command to view recent reports (for supervisors)
RegisterCommand("reports", function(source, args, rawCommand)
    local src = source
    
    -- Check if player has permission (implement your own permission check)
    if not HasReportPermission(src) then
        TriggerClientEvent("chat:addMessage", src, {
            color = {255, 0, 0},
            multiline = true,
            args = {"System", "You don't have permission to view reports"}
        })
        return
    end
    
    -- Fetch recent reports from API
    FetchReportsFromAPI(src, args[1])
end, false)

-- Fetch reports from website API
function FetchReportsFromAPI(source, status)
    local apiUrl = Config.ApiUrl .. "/fivem/reports"
    
    if status then
        apiUrl = apiUrl .. "?status=" .. status
    end
    
    local headers = {
        ["x-api-key"] = Config.ApiKey
    }
    
    PerformHttpRequest(apiUrl, function(statusCode, response, headers)
        if statusCode == 200 then
            local data = json.decode(response)
            
            if data.success and data.reports then
                TriggerClientEvent("ahrp-cad:showReportsList", source, data.reports)
            end
        else
            print(("[AHRP-CAD] Failed to fetch reports - Status: %d"):format(statusCode))
        end
    end, "GET", "", headers)
end

-- Permission check (integrate with your existing permission system)
function HasReportPermission(source)
    -- Example: Check if player is in a supervisor role
    -- Adapt this to your permission system (ace, framework, etc.)
    
    -- ESX example:
    -- local xPlayer = ESX.GetPlayerFromId(source)
    -- return xPlayer.job.name == "police" and xPlayer.job.grade >= 3
    
    -- QB-Core example:
    -- local Player = QBCore.Functions.GetPlayer(source)
    -- return Player.PlayerData.job.name == "police" and Player.PlayerData.job.grade.level >= 3
    
    -- Simple fallback - allow everyone (change this!)
    return true
end

print("^2[AHRP-CAD] ^7Report server system loaded")
