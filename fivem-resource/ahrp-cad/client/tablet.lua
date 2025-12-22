-- 3D Tablet System

local TabletObject = nil
local TabletDict = "amb@world_human_seat_wall_tablet@female@base"
local TabletAnim = "base"
local TabletProp = "prop_cs_tablet"
local TabletBone = 60309
local TabletActive = false

-- Tablet position offsets (can be adjusted per player preference)
local TabletOffset = {
    pos = vector3(0.03, 0.002, -0.0),
    rot = vector3(10.0, 160.0, 0.0)
}

-- Load tablet animation
function LoadTabletAnimation()
    RequestAnimDict(TabletDict)
    while not HasAnimDictLoaded(TabletDict) do
        Citizen.Wait(100)
    end
end

-- Load tablet prop model
function LoadTabletProp()
    RequestModel(GetHashKey(TabletProp))
    while not HasModelLoaded(GetHashKey(TabletProp)) do
        Citizen.Wait(100)
    end
end

-- Show tablet (with prop)
function ShowTablet()
    if TabletActive then return end
    
    local ped = PlayerPedId()
    
    -- Don't show if in vehicle
    if IsPedInAnyVehicle(ped, false) then
        ShowNotification("~y~Opening CAD in vehicle mode", "info")
        OpenCADUI() -- Open without tablet prop
        return
    end
    
    TabletActive = true
    
    -- Load resources
    LoadTabletAnimation()
    LoadTabletProp()
    
    -- Create tablet prop
    local coords = GetEntityCoords(ped)
    TabletObject = CreateObject(GetHashKey(TabletProp), coords.x, coords.y, coords.z, true, true, true)
    
    -- Attach to player
    AttachEntityToEntity(
        TabletObject,
        ped,
        GetPedBoneIndex(ped, TabletBone),
        TabletOffset.pos.x, TabletOffset.pos.y, TabletOffset.pos.z,
        TabletOffset.rot.x, TabletOffset.rot.y, TabletOffset.rot.z,
        true, true, false, true, 1, true
    )
    
    -- Play animation
    TaskPlayAnim(ped, TabletDict, TabletAnim, 3.0, 3.0, -1, 49, 0, false, false, false)
    
    -- Disable controls while using tablet
    Citizen.CreateThread(function()
        while TabletActive do
            Citizen.Wait(0)
            
            -- Disable certain controls
            DisableControlAction(0, 1, true) -- LookLeftRight
            DisableControlAction(0, 2, true) -- LookUpDown
            DisableControlAction(0, 24, true) -- Attack
            DisableControlAction(0, 257, true) -- Attack 2
            DisableControlAction(0, 25, true) -- Aim
            DisableControlAction(0, 263, true) -- Melee Attack 1
            DisableControlAction(0, 140, true) -- Melee Attack Light
            DisableControlAction(0, 141, true) -- Melee Attack Heavy
            DisableControlAction(0, 142, true) -- Melee Attack Alternate
            DisableControlAction(0, 143, true) -- Melee Block
            DisableControlAction(0, 22, true) -- Jump
            DisableControlAction(0, 21, true) -- Sprint
            
            -- Allow movement but slower
            if IsControlPressed(0, 32) or IsControlPressed(0, 33) or 
               IsControlPressed(0, 34) or IsControlPressed(0, 35) then
                SetPedMoveRateOverride(ped, 0.5) -- Walk slower with tablet
            end
        end
    end)
    
    -- Open CAD UI
    OpenCADUI()
end

-- Hide tablet
function HideTablet()
    if not TabletActive then return end
    
    TabletActive = false
    local ped = PlayerPedId()
    
    -- Remove prop
    if TabletObject then
        DeleteObject(TabletObject)
        TabletObject = nil
    end
    
    -- Stop animation
    ClearPedTasks(ped)
    
    -- Re-enable controls
    SetPedMoveRateOverride(ped, 1.0)
    
    -- Close CAD UI
    CloseCADUI()
end

-- Toggle tablet
function ToggleTablet()
    if TabletActive then
        HideTablet()
    else
        if not IsOnDuty then
            ShowNotification("You must be on duty to access the CAD", "error")
            return
        end
        ShowTablet()
    end
end

-- Tablet customization (for different departments)
function SetTabletAppearance(department)
    if department == "FIRE" then
        TabletProp = "prop_cs_tablet" -- Could use different prop
    elseif department == "EMS" then
        TabletProp = "prop_cs_tablet"
    else
        TabletProp = "prop_cs_tablet"
    end
end

-- Check if player should auto-hide tablet
Citizen.CreateThread(function()
    while true do
        Citizen.Wait(500)
        
        if TabletActive then
            local ped = PlayerPedId()
            
            -- Hide if player enters vehicle
            if IsPedInAnyVehicle(ped, false) then
                HideTablet()
                ShowNotification("~y~Tablet put away", "info")
            end
            
            -- Hide if player starts combat
            if IsPedInMeleeCombat(ped) or IsPedShooting(ped) then
                HideTablet()
                ShowNotification("~r~Tablet put away - Combat mode", "warning")
            end
            
            -- Hide if player is ragdolled/falling
            if IsPedRagdoll(ped) or IsPedFalling(ped) then
                HideTablet()
            end
        end
    end
end)

-- Override OpenCADUI to use tablet
local OriginalOpenCAD = OpenCADUI
function OpenCADUI()
    if Config.Use3DTablet then
        ShowTablet()
    else
        OriginalOpenCAD()
    end
end

-- Override CloseCADUI to hide tablet
local OriginalCloseCAD = CloseCADUI
function CloseCADUI()
    if Config.Use3DTablet and TabletActive then
        HideTablet()
    else
        OriginalCloseCAD()
    end
end

-- Cleanup on resource stop
AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        if TabletActive then
            HideTablet()
        end
    end
end)

-- Exports
exports('ShowTablet', ShowTablet)
exports('HideTablet', HideTablet)
exports('ToggleTablet', ToggleTablet)
exports('IsTabletActive', function() return TabletActive end)
