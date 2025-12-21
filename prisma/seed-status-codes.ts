import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedStatusCodes() {
  const statusCodes = [
    // Universal Codes
    { code: '10-4', meaning: 'Acknowledged/Affirmative', department: null, category: 'acknowledgment' },
    { code: '10-7', meaning: 'Out of Service', department: null, category: 'status' },
    { code: '10-8', meaning: 'In Service/Available', department: null, category: 'status' },
    { code: '10-9', meaning: 'Repeat', department: null, category: 'acknowledgment' },
    { code: '10-10', meaning: 'Negative/Off Duty', department: null, category: 'status' },
    { code: '10-15', meaning: 'Prisoner in Custody', department: 'POLICE', category: 'status' },
    { code: '10-19', meaning: 'Return to Station', department: null, category: 'status' },
    { code: '10-20', meaning: 'Location', department: null, category: 'information' },
    { code: '10-23', meaning: 'Arrived at Scene', department: null, category: 'status' },
    { code: '10-25', meaning: 'Report in Person', department: null, category: 'request' },
    { code: '10-27', meaning: 'License/Registration Check', department: 'POLICE', category: 'request' },
    { code: '10-28', meaning: 'Vehicle Registration Information', department: 'POLICE', category: 'information' },
    { code: '10-29', meaning: 'Check for Wanted', department: 'POLICE', category: 'request' },
    { code: '10-32', meaning: 'Person with Gun', department: 'POLICE', category: 'emergency' },
    { code: '10-33', meaning: 'Emergency! Officer Needs Help', department: 'POLICE', category: 'emergency' },
    { code: '10-35', meaning: 'Major Crime Alert', department: 'POLICE', category: 'emergency' },
    { code: '10-39', meaning: 'Urgent - Use Lights and Siren', department: null, category: 'emergency' },
    { code: '10-41', meaning: 'Beginning Tour of Duty', department: null, category: 'status' },
    { code: '10-42', meaning: 'Ending Tour of Duty', department: null, category: 'status' },
    { code: '10-45', meaning: 'Animal Carcass', department: null, category: 'information' },
    { code: '10-50', meaning: 'Vehicle Accident', department: null, category: 'call' },
    { code: '10-51', meaning: 'Tow Truck Needed', department: null, category: 'request' },
    { code: '10-52', meaning: 'Ambulance Needed', department: null, category: 'request' },
    { code: '10-54', meaning: 'Possible Dead Body', department: null, category: 'emergency' },
    { code: '10-56', meaning: 'Suicide', department: null, category: 'emergency' },
    { code: '10-57', meaning: 'Hit and Run', department: 'POLICE', category: 'call' },
    { code: '10-58', meaning: 'Direct Traffic', department: 'POLICE', category: 'request' },
    { code: '10-65', meaning: 'Felony in Progress', department: 'POLICE', category: 'emergency' },
    { code: '10-70', meaning: 'Fire Alarm', department: 'FIRE', category: 'emergency' },
    { code: '10-71', meaning: 'Shooting', department: 'POLICE', category: 'emergency' },
    { code: '10-78', meaning: 'Officer Needs Assistance', department: 'POLICE', category: 'emergency' },
    { code: '10-79', meaning: 'Bomb Threat', department: 'POLICE', category: 'emergency' },
    { code: '10-80', meaning: 'Explosion', department: null, category: 'emergency' },
    { code: '10-90', meaning: 'Robbery in Progress', department: 'POLICE', category: 'emergency' },
    { code: '10-91', meaning: 'Suspicious Person', department: 'POLICE', category: 'call' },
    { code: '10-92', meaning: 'Improperly Parked Vehicle', department: 'POLICE', category: 'call' },
    { code: '10-94', meaning: 'Street Racing', department: 'POLICE', category: 'call' },
    { code: '10-97', meaning: 'Arrived at Scene', department: null, category: 'status' },
    { code: '10-98', meaning: 'Assignment Completed', department: null, category: 'status' },
    { code: '10-99', meaning: 'Officer Down/Emergency', department: 'POLICE', category: 'emergency' },
    
    // EMS Specific
    { code: '10-52', meaning: 'Medical Emergency', department: 'EMS', category: 'emergency' },
    { code: '10-45A', meaning: 'Cardiac Arrest', department: 'EMS', category: 'emergency' },
    { code: '10-45B', meaning: 'Respiratory Arrest', department: 'EMS', category: 'emergency' },
    { code: '10-45C', meaning: 'Unconscious Person', department: 'EMS', category: 'emergency' },
    
    // Fire Specific
    { code: '10-70', meaning: 'Structure Fire', department: 'FIRE', category: 'emergency' },
    { code: '10-71', meaning: 'Vehicle Fire', department: 'FIRE', category: 'emergency' },
    { code: '10-72', meaning: 'Brush Fire', department: 'FIRE', category: 'emergency' },
    { code: '10-73', meaning: 'Smoke Investigation', department: 'FIRE', category: 'call' },
  ];

  console.log('Seeding status codes...');
  
  for (const code of statusCodes) {
    await prisma.statusCode.upsert({
      where: { code: code.code },
      update: code,
      create: code,
    });
  }

  console.log(`✓ Created ${statusCodes.length} status codes`);
}

async function main() {
  console.log('Starting status codes seed...');
  await seedStatusCodes();
  console.log('Status codes seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
