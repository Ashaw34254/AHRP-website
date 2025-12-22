import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedSettings() {
  console.log('🌱 Seeding default settings...');

  const defaultSettings = [
    // General Settings
    {
      category: 'general',
      key: 'site_name',
      value: 'Aurora Horizon Roleplay',
      description: 'The name of the community',
      dataType: 'string',
    },
    {
      category: 'general',
      key: 'site_description',
      value: 'A premier FiveM roleplay community',
      description: 'Site description for meta tags',
      dataType: 'string',
    },
    {
      category: 'general',
      key: 'maintenance_mode',
      value: 'false',
      description: 'Enable maintenance mode to prevent non-admin access',
      dataType: 'boolean',
    },
    {
      category: 'general',
      key: 'max_characters_per_user',
      value: '3',
      description: 'Maximum number of characters each user can create',
      dataType: 'number',
    },

    // Authentication Settings
    {
      category: 'auth',
      key: 'require_discord_verification',
      value: 'true',
      description: 'Require Discord OAuth for account creation',
      dataType: 'boolean',
    },
    {
      category: 'auth',
      key: 'session_duration_days',
      value: '30',
      description: 'Number of days before session expires',
      dataType: 'number',
    },

    // Notification Settings
    {
      category: 'notifications',
      key: 'email_notifications_enabled',
      value: 'true',
      description: 'Enable email notifications',
      dataType: 'boolean',
    },
    {
      category: 'notifications',
      key: 'discord_webhook_url',
      value: '',
      description: 'Discord webhook URL for admin notifications',
      dataType: 'string',
    },
    {
      category: 'notifications',
      key: 'notify_on_new_application',
      value: 'true',
      description: 'Notify admins when new applications are submitted',
      dataType: 'boolean',
    },

    // CAD System Settings
    {
      category: 'cad',
      key: 'auto_assign_call_numbers',
      value: 'true',
      description: 'Automatically generate call numbers',
      dataType: 'boolean',
    },
    {
      category: 'cad',
      key: 'call_timeout_minutes',
      value: '30',
      description: 'Minutes before pending calls are flagged as stale',
      dataType: 'number',
    },
    {
      category: 'cad',
      key: 'max_units_per_call',
      value: '5',
      description: 'Maximum number of units that can be assigned to one call',
      dataType: 'number',
    },
    {
      category: 'cad',
      key: 'panic_alert_sound',
      value: 'true',
      description: 'Play sound when panic button is pressed',
      dataType: 'boolean',
    },

    // Whitelist Settings
    {
      category: 'whitelist',
      key: 'whitelist_enabled',
      value: 'true',
      description: 'Enable server whitelist system',
      dataType: 'boolean',
    },
    {
      category: 'whitelist',
      key: 'auto_whitelist_after_approval',
      value: 'true',
      description: 'Automatically whitelist users after application approval',
      dataType: 'boolean',
    },
    {
      category: 'whitelist',
      key: 'whitelist_expiry_days',
      value: '90',
      description: 'Days before whitelist expires (0 = never)',
      dataType: 'number',
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    });
  }

  console.log(`✅ Seeded ${defaultSettings.length} default settings`);
}

seedSettings()
  .catch((e) => {
    console.error('Error seeding settings:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
