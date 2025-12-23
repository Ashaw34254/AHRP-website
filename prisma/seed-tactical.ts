import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedTactical() {
  console.log("🎯 Seeding tactical teams...");

  // Get the test user
  const testUser = await prisma.user.findUnique({
    where: { email: "dev@aurorahorizon.local" },
  });

  if (!testUser) {
    console.log("❌ Test user not found. Run main seed first.");
    return;
  }

  // Create CIRT Team Members
  const cirtOfficers = [
    {
      userId: testUser.id,
      callsign: "CIRT-1",
      name: "James Rodriguez",
      badge: "CIRT-001",
      department: "POLICE",
      isTactical: true,
      tacticalTeam: "CIRT",
      tacticalRole: "TEAM_LEADER",
      qualifications: JSON.stringify([
        "SWAT Leader",
        "Crisis Response",
        "Hostage Rescue",
        "Tactical Entry",
      ]),
      responseTime: 10,
      equipment: JSON.stringify([
        "M4 Carbine",
        "Ballistic Shield",
        "Flash Grengs",
        "Breaching Tools",
      ]),
      phone: "(555) 100-0001",
      dutyStatus: "AVAILABLE",
    },
    {
      userId: testUser.id,
      callsign: "CIRT-2",
      name: "Sarah Mitchell",
      badge: "CIRT-002",
      department: "POLICE",
      isTactical: true,
      tacticalTeam: "CIRT",
      tacticalRole: "SNIPER",
      qualifications: JSON.stringify([
        "Precision Marksman",
        "Observation",
        "Long Range",
      ]),
      responseTime: 12,
      equipment: JSON.stringify([
        "Sniper Rifle",
        "Spotter Scope",
        "Ghillie Suit",
      ]),
      phone: "(555) 100-0002",
      dutyStatus: "AVAILABLE",
    },
    {
      userId: testUser.id,
      callsign: "CIRT-3",
      name: "Marcus Chen",
      badge: "CIRT-003",
      department: "POLICE",
      isTactical: true,
      tacticalTeam: "CIRT",
      tacticalRole: "BREACHER",
      qualifications: JSON.stringify([
        "Explosive Breaching",
        "Mechanical Breaching",
        "Entry Specialist",
      ]),
      responseTime: 10,
      equipment: JSON.stringify([
        "Breaching Shotgun",
        "Ballistic Ram",
        "C4 Charges",
      ]),
      phone: "(555) 100-0003",
      dutyStatus: "ON_DUTY",
    },
    {
      userId: testUser.id,
      callsign: "CIRT-N1",
      name: "Dr. Emily Parker",
      badge: "CIRT-004",
      department: "POLICE",
      isTactical: true,
      tacticalTeam: "CIRT",
      tacticalRole: "NEGOTIATOR",
      qualifications: JSON.stringify([
        "Crisis Negotiation",
        "Psychology",
        "De-escalation",
      ]),
      responseTime: 15,
      equipment: JSON.stringify([
        "Communication Equipment",
        "Negotiation Phone",
      ]),
      phone: "(555) 100-0004",
      dutyStatus: "AVAILABLE",
    },
  ];

  // Create SOG Team Members
  const sogOfficers = [
    {
      userId: testUser.id,
      callsign: "SOG-1",
      name: "Captain Alex Thompson",
      badge: "SOG-001",
      department: "POLICE",
      isTactical: true,
      tacticalTeam: "SOG",
      tacticalRole: "TEAM_LEADER",
      qualifications: JSON.stringify([
        "Counter-Terrorism",
        "VIP Protection",
        "Special Operations",
        "Command Training",
      ]),
      responseTime: 8,
      equipment: JSON.stringify([
        "HK416",
        "Night Vision",
        "Tactical Communications",
      ]),
      phone: "(555) 200-0001",
      dutyStatus: "AVAILABLE",
    },
    {
      userId: testUser.id,
      callsign: "SOG-2",
      name: "David Harrison",
      badge: "SOG-002",
      department: "POLICE",
      isTactical: true,
      tacticalTeam: "SOG",
      tacticalRole: "ENTRY_TEAM",
      qualifications: JSON.stringify([
        "Close Quarters Battle",
        "Tactical Entry",
        "Room Clearing",
      ]),
      responseTime: 8,
      equipment: JSON.stringify([
        "MP5",
        "Flash Bangs",
        "Body Armor Level IV",
      ]),
      phone: "(555) 200-0002",
      dutyStatus: "AVAILABLE",
    },
    {
      userId: testUser.id,
      callsign: "SOG-K9",
      name: "Officer Lisa Wong",
      badge: "SOG-003",
      department: "POLICE",
      isTactical: true,
      tacticalTeam: "SOG",
      tacticalRole: "K9_HANDLER",
      qualifications: JSON.stringify([
        "K9 Handler",
        "Tactical K9",
        "Explosive Detection",
      ]),
      responseTime: 10,
      equipment: JSON.stringify([
        "K9 Partner - Rex",
        "Tracking Equipment",
        "Bite Suit",
      ]),
      phone: "(555) 200-0003",
      dutyStatus: "ON_DUTY",
    },
    {
      userId: testUser.id,
      callsign: "SOG-EOD",
      name: "Tech Sgt. Michael Davis",
      badge: "SOG-004",
      department: "POLICE",
      isTactical: true,
      tacticalTeam: "SOG",
      tacticalRole: "EXPLOSIVES",
      qualifications: JSON.stringify([
        "Explosive Ordnance Disposal",
        "Bomb Squad",
        "HAZMAT",
      ]),
      responseTime: 12,
      equipment: JSON.stringify([
        "EOD Robot",
        "Blast Suit",
        "Detection Equipment",
      ]),
      phone: "(555) 200-0004",
      dutyStatus: "AVAILABLE",
    },
  ];

  // Insert all tactical officers
  for (const officer of [...cirtOfficers, ...sogOfficers]) {
    await prisma.officer.create({
      data: officer,
    });
  }

  console.log(`✅ Created ${cirtOfficers.length} CIRT officers`);
  console.log(`✅ Created ${sogOfficers.length} SOG officers`);

  // Create a sample tactical callout
  const callout = await prisma.tacticalCallout.create({
    data: {
      incidentType: "HOSTAGE_SITUATION",
      location: "123 Main Street, Building 5, 3rd Floor",
      priority: "CRITICAL",
      team: "CIRT",
      requestedBy: "Dispatch Command",
      approvedBy: "Shift Commander",
      briefing:
        "Active hostage situation. Armed suspect with 3 hostages. No demands made yet. Suspect is barricaded in apartment 305.",
      stagingArea: "Corner of Main St and 2nd Ave - South parking lot",
      status: "ON_SCENE",
    },
  });

  console.log(`✅ Created sample tactical callout: ${callout.id}`);
  console.log("🎯 Tactical team seeding complete!");
}

seedTactical()
  .catch((error) => {
    console.error("❌ Tactical seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
