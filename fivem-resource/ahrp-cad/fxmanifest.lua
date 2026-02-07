fx_version 'cerulean'
game 'gta5'

author 'Aurora Horizon RP'
description 'CAD System Integration - Dispatch, Units, and Real-time Sync'
version '1.1.0'

-- Client scripts
client_scripts {
    'config.lua',
    'client/main.lua',
    'client/ui.lua',
    'client/commands.lua',
    'client/location.lua',
    'client/notifications.lua',
    'client/plate-scanner.lua',
    'client/tablet.lua',
    'client/wars2x-integration.lua',
    'client/voice-alerts.lua',
    'client/reports.lua'
}

-- Server scripts
server_scripts {
    'config.lua',
    'server/main.lua',
    'server/api.lua',
    'server/sync.lua',
    'server/dispatch.lua',
    'server/plate-scanner.lua',
    'server/wars2x-integration.lua',
    'server/reports.lua'
}

-- Shared scripts
shared_scripts {
    'shared/utils.lua'
}

-- NUI page
ui_page 'html/index.html'

-- HTML/NUI files
files {
    'html/index.html',
    'html/voice-tts.js'
}

-- Dependencies (optional, adjust based on your server)
-- dependencies {
--     'es_extended',
--     'qb-core'
-- }
