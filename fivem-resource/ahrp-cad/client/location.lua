-- Location Sync
local LastLocationUpdate = 0
local LastStreetName = ""

-- Main location sync thread
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(Config.LocationSyncInterval)
        
        if IsOnDuty and CurrentUnit then
            UpdatePlayerLocation()
        end
    end
end)

-- Update player location
function UpdatePlayerLocation()
    local ped = PlayerPedId()
    local coords = GetEntityCoords(ped)
    local heading = GetEntityHeading(ped)
    local streetHash, crossingHash = GetStreetNameAtCoord(coords.x, coords.y, coords.z)
    local streetName = GetStreetNameFromHashKey(streetHash)
    local crossingName = GetStreetNameFromHashKey(crossingHash)
    
    local location = streetName
    if crossingName ~= "" and crossingName ~= streetName then
        location = streetName .. " / " .. crossingName
    end
    
    -- Get postal code if you have a postal script
    local postal = GetPostalCode(coords)
    if postal then
        location = location .. " [" .. postal .. "]"
    end
    
    -- Get zone name
    local zoneName = GetLabelText(GetNameOfZone(coords.x, coords.y, coords.z))
    
    -- Only update if location changed or enough time passed
    local currentTime = GetGameTimer()
    if location ~= LastStreetName or (currentTime - LastLocationUpdate) > 30000 then
        LastStreetName = location
        LastLocationUpdate = currentTime
        
        -- Send to server
        TriggerServerEvent('ahrp-cad:server:updateLocation', {
            location = location,
            zone = zoneName,
            latitude = coords.x,
            longitude = coords.y,
            heading = heading,
            postal = postal
        })
        
        if Config.Debug then
            print("^2[AHRP-CAD]^7 Location updated:", location)
        end
    end
end

-- Get postal code (if postal script exists)
function GetPostalCode(coords)
    -- Check for common postal scripts
    if exports['nearest-postal'] then
        local postal = exports['nearest-postal']:GetNearestPostal()
        if postal then
            return postal.code
        end
    end
    
    -- Fallback: generate basic grid postal
    local x = math.floor((coords.x + 8000) / 250)
    local y = math.floor((coords.y + 8000) / 250)
    return string.format("%03d-%03d", x, y)
end

-- Get vehicle info if in vehicle
function GetVehicleInfo()
    local ped = PlayerPedId()
    
    if IsPedInAnyVehicle(ped, false) then
        local vehicle = GetVehiclePedIsIn(ped, false)
        local model = GetDisplayNameFromVehicleModel(GetEntityModel(vehicle))
        local plate = GetVehicleNumberPlateText(vehicle)
        local speed = math.ceil(GetEntitySpeed(vehicle) * 2.236936) -- Convert to MPH
        
        return {
            inVehicle = true,
            model = model,
            plate = plate,
            speed = speed
        }
    end
    
    return {
        inVehicle = false
    }
end

-- Export vehicle info
RegisterNetEvent('ahrp-cad:client:requestVehicleInfo')
AddEventHandler('ahrp-cad:client:requestVehicleInfo', function()
    local vehicleInfo = GetVehicleInfo()
    TriggerServerEvent('ahrp-cad:server:sendVehicleInfo', vehicleInfo)
end)

-- GPS Waypoint from CAD
RegisterNetEvent('ahrp-cad:client:setWaypoint')
AddEventHandler('ahrp-cad:client:setWaypoint', function(coords)
    SetNewWaypoint(coords.x, coords.y)
    ShowNotification("~g~GPS~s~ waypoint set", "success")
end)

-- Blip management for other units
local UnitBlips = {}

RegisterNetEvent('ahrp-cad:client:updateUnitBlips')
AddEventHandler('ahrp-cad:client:updateUnitBlips', function(units)
    -- Remove old blips
    for _, blip in pairs(UnitBlips) do
        RemoveBlip(blip)
    end
    UnitBlips = {}
    
    -- Create new blips
    for _, unit in ipairs(units) do
        if unit.id ~= (CurrentUnit and CurrentUnit.id) and unit.latitude and unit.longitude then
            local blip = AddBlipForCoord(unit.latitude, unit.longitude, 0.0)
            
            -- Set blip properties based on department
            local color = 3 -- Default blue
            if unit.department == "FIRE" then
                color = 1 -- Red
            elseif unit.department == "EMS" then
                color = 2 -- Green
            end
            
            SetBlipSprite(blip, 1) -- Circle
            SetBlipColour(blip, color)
            SetBlipScale(blip, 0.8)
            SetBlipAsShortRange(blip, true)
            
            BeginTextCommandSetBlipName("STRING")
            AddTextComponentString(unit.callsign)
            EndTextCommandSetBlipName(blip)
            
            UnitBlips[unit.id] = blip
        end
    end
end)

-- Export for other resources
exports('GetCurrentLocation', function()
    return LastStreetName
end)
