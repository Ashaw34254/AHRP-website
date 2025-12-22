-- API Integration Module
-- All API calls to the Next.js CAD system

-- Make HTTP request to CAD API
function MakeAPIRequest(endpoint, method, data, callback)
    local url = Config.WebsiteURL .. endpoint
    
    PerformHttpRequest(url, function(statusCode, response, headers)
        if Config.Debug then
            print("^3[AHRP-CAD API]^7 " .. method .. " " .. endpoint .. " -> " .. statusCode)
        end
        
        if statusCode == 200 or statusCode == 201 then
            local success, decoded = pcall(json.decode, response)
            if success then
                callback(true, decoded)
            else
                print("^1[AHRP-CAD API ERROR]^7 Failed to decode JSON response")
                callback(false, nil)
            end
        else
            print("^1[AHRP-CAD API ERROR]^7 Status: " .. statusCode .. " Response: " .. response)
            callback(false, nil)
        end
    end, method, data and json.encode(data) or "", {
        ["Content-Type"] = "application/json",
        ["Authorization"] = "Bearer " .. Config.APIKey
    })
end

-- Create or get unit
function CreateOrGetUnit(source, department, identifier, name, callback)
    -- First, try to find existing unit
    MakeAPIRequest("/api/cad/units?playerId=" .. identifier, "GET", nil, function(success, units)
        if success and units and #units > 0 then
            -- Unit exists, return it
            callback(true, units[1])
        else
            -- Create new unit
            local unitData = {
                department = department,
                status = "AVAILABLE",
                playerId = identifier,
                playerName = name,
                callsign = GenerateCallsign(department, identifier)
            }
            
            MakeAPIRequest("/api/cad/units", "POST", unitData, function(success, newUnit)
                callback(success, newUnit)
            end)
        end
    end)
end

-- Generate callsign
function GenerateCallsign(department, identifier)
    local prefix = ""
    if department == "POLICE" then
        prefix = "A-"
    elseif department == "FIRE" then
        prefix = "E-"
    elseif department == "EMS" then
        prefix = "M-"
    end
    
    -- Use last 3 chars of identifier for unique number
    local suffix = string.sub(identifier, -3):upper()
    local number = 0
    for i = 1, #suffix do
        number = number + string.byte(suffix, i)
    end
    
    return prefix .. (number % 999)
end

-- Update unit status
function UpdateUnitStatus(unitId, status, callback)
    local data = {
        status = status
    }
    
    MakeAPIRequest("/api/cad/units/" .. unitId, "PATCH", data, function(success, response)
        callback(success)
    end)
end

-- Update unit location
function UpdateUnitLocation(unitId, locationData, callback)
    local data = {
        location = locationData.location,
        latitude = locationData.latitude,
        longitude = locationData.longitude
    }
    
    MakeAPIRequest("/api/cad/units/" .. unitId, "PATCH", data, function(success, response)
        callback(success)
    end)
end

-- Get active calls
function GetActiveCalls(callback)
    MakeAPIRequest("/api/cad/calls?status=PENDING,ACTIVE,DISPATCHED", "GET", nil, function(success, response)
        if success then
            callback(true, response.calls or {})
        else
            callback(false, {})
        end
    end)
end

-- Create backup call
function CreateBackupCall(unit, backupType, callback)
    local priority = "HIGH"
    if backupType == "CODE3" then
        priority = "CRITICAL"
    end
    
    local callData = {
        type = "BACKUP_REQUEST",
        priority = priority,
        location = unit.location or "Unknown",
        latitude = unit.latitude,
        longitude = unit.longitude,
        description = backupType .. " backup requested by " .. unit.callsign,
        reporterName = unit.callsign,
        reporterContact = "Unit " .. unit.callsign
    }
    
    MakeAPIRequest("/api/cad/calls", "POST", callData, function(success, call)
        callback(success, call)
    end)
end

-- Assign unit to call
function AssignUnitToCall(callId, unitId, callback)
    local data = {
        unitId = unitId
    }
    
    MakeAPIRequest("/api/cad/calls/" .. callId .. "/assign", "POST", data, function(success, response)
        callback(success)
    end)
end

-- Update call status
function UpdateCallStatus(callId, status, callback)
    local data = {
        status = status
    }
    
    MakeAPIRequest("/api/cad/calls/" .. callId, "PATCH", data, function(success, response)
        callback(success)
    end)
end

-- Add call note
function AddCallNote(callId, note, authorName, callback)
    local data = {
        note = note,
        author = authorName
    }
    
    MakeAPIRequest("/api/cad/calls/" .. callId .. "/notes", "POST", data, function(success, response)
        callback(success)
    end)
end

-- Search citizen
function SearchCitizen(query, callback)
    MakeAPIRequest("/api/cad/civil/citizen?q=" .. query, "GET", nil, function(success, response)
        callback(success, response)
    end)
end

-- Search vehicle
function SearchVehicle(plate, callback)
    MakeAPIRequest("/api/cad/civil/vehicle?plate=" .. plate, "GET", nil, function(success, response)
        callback(success, response)
    end)
end

-- Get unit details
function GetUnitDetails(unitId, callback)
    MakeAPIRequest("/api/cad/units/" .. unitId, "GET", nil, function(success, response)
        callback(success, response)
    end)
end

-- Exports for other resources
exports('MakeAPIRequest', MakeAPIRequest)
exports('SearchCitizen', SearchCitizen)
exports('SearchVehicle', SearchVehicle)
exports('GetActiveCalls', GetActiveCalls)
