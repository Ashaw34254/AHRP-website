import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function seedDepartments() {
  console.log("🚓 Seeding departments...");

  // POLICE DEPARTMENT
  const police = await prisma.department.upsert({
    where: { name: "POLICE" },
    update: {},
    create: {
      name: "POLICE",
      displayName: "Aurora Horizon Police Department",
      motto: "To Protect and Serve",
      description: "The Aurora Horizon Police Department is dedicated to maintaining law and order across our community through professional policing and community engagement.",
      homepageContent: `**Our Mission:**
We are committed to protecting life and property while maintaining the highest standards of professionalism and integrity.

**What We Do:**
- Respond to emergency calls and incidents
- Conduct criminal investigations
- Traffic enforcement and accident response
- Community policing initiatives
- Specialized tactical operations

**Join Requirements:**
- Active on server for at least 2 weeks
- Clean disciplinary record
- Pass background check and interview
- Complete police academy training`,
      primaryColor: "#3B82F6",
      secondaryColor: "#2563EB",
      accentColor: "#1D4ED8",
      enabled: true,
      maxUnits: 20,
      requireCertification: true,
      autoApprove: false,
      allowRecruitment: true,
      minPlaytime: 10,
      discordRole: "Police Officer"
    }
  });

  // Police Stations
  const policeStations = [
    {
      name: "Mission Row Station",
      address: "1200 Mission Row, Downtown",
      phone: "(555) 0100",
      staffCount: 45,
      status: "Active",
      imageUrl: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?w=400&h=300&fit=crop"
    },
    {
      name: "Vespucci Police Station",
      address: "440 Vespucci Blvd",
      phone: "(555) 0101",
      staffCount: 28,
      status: "Active",
      imageUrl: "https://images.unsplash.com/photo-1593115057322-e94b77572f20?w=400&h=300&fit=crop"
    },
    {
      name: "Paleto Bay Sheriff",
      address: "101 Great Ocean Hwy",
      phone: "(555) 0102",
      staffCount: 15,
      status: "Active",
      imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop"
    }
  ];

  for (const station of policeStations) {
    await prisma.station.upsert({
      where: { id: `police-${station.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: station,
      create: { ...station, departmentId: police.id, id: `police-${station.name.toLowerCase().replace(/\s+/g, '-')}` }
    });
  }

  // Police Divisions
  const policeDivisions = [
    { name: "Patrol Division", icon: "Car", memberCount: 42 },
    { name: "Traffic Division", icon: "Target", memberCount: 18 },
    { name: "Detective Bureau", icon: "FileText", memberCount: 12 },
    { name: "SWAT Unit", icon: "Shield", memberCount: 8 },
    { name: "K9 Unit", icon: "AlertTriangle", memberCount: 6 },
    { name: "Training Division", icon: "Award", memberCount: 5 }
  ];

  for (const division of policeDivisions) {
    await prisma.division.upsert({
      where: { id: `police-${division.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: division,
      create: { ...division, departmentId: police.id, id: `police-${division.name.toLowerCase().replace(/\s+/g, '-')}` }
    });
  }

  // Police Ranks
  const policeRanks = await Promise.all([
    prisma.rank.create({ data: { departmentId: police.id, name: "Recruit", abbreviation: "RCT", level: 1, payGrade: 1, color: "gray" }}),
    prisma.rank.create({ data: { departmentId: police.id, name: "Cadet", abbreviation: "CDT", level: 2, payGrade: 2, color: "default" }}),
    prisma.rank.create({ data: { departmentId: police.id, name: "Officer", abbreviation: "OFC", level: 3, payGrade: 3, color: "default" }}),
    prisma.rank.create({ data: { departmentId: police.id, name: "Senior Officer", abbreviation: "SFC", level: 4, payGrade: 4, color: "success" }}),
    prisma.rank.create({ data: { departmentId: police.id, name: "Corporal", abbreviation: "CPL", level: 5, payGrade: 5, color: "secondary" }}),
    prisma.rank.create({ data: { departmentId: police.id, name: "Sergeant", abbreviation: "SGT", level: 6, payGrade: 6, color: "secondary" }}),
    prisma.rank.create({ data: { departmentId: police.id, name: "Lieutenant", abbreviation: "LT", level: 7, payGrade: 7, color: "primary" }}),
    prisma.rank.create({ data: { departmentId: police.id, name: "Captain", abbreviation: "CPT", level: 8, payGrade: 8, color: "warning" }}),
    prisma.rank.create({ data: { departmentId: police.id, name: "Commander", abbreviation: "CDR", level: 9, payGrade: 9, color: "danger" }}),
    prisma.rank.create({ data: { departmentId: police.id, name: "Deputy Chief", abbreviation: "DC", level: 10, payGrade: 10, color: "danger" }}),
    prisma.rank.create({ data: { departmentId: police.id, name: "Chief of Police", abbreviation: "CHIEF", level: 11, payGrade: 11, color: "danger" }})
  ]);

  // Police Members
  const policeMembers = [
    { rankId: policeRanks[10].id, name: "James Mitchell", badgeNumber: "001", status: "active" },
    { rankId: policeRanks[7].id, name: "Sarah Williams", badgeNumber: "103", status: "active" },
    { rankId: policeRanks[6].id, name: "Michael Rodriguez", badgeNumber: "205", status: "active" }
  ];

  for (const member of policeMembers) {
    await prisma.member.upsert({
      where: { id: `police-${member.badgeNumber}` },
      update: member,
      create: { ...member, departmentId: police.id, id: `police-${member.badgeNumber}` }
    });
  }

  // FIRE DEPARTMENT
  const fire = await prisma.department.upsert({
    where: { name: "FIRE" },
    update: {},
    create: {
      name: "FIRE",
      displayName: "Aurora Horizon Fire & Rescue",
      motto: "Courage, Honor, Sacrifice",
      description: "Aurora Horizon Fire & Rescue is committed to protecting lives, property, and the environment through fire suppression, rescue operations, and emergency medical services.",
      homepageContent: `**Our Mission:**
Dedicated to saving lives and property through professional firefighting, rescue operations, and emergency response.

**What We Do:**
- Structure and vehicle fire suppression
- Technical rescue operations
- Hazardous materials response
- Fire prevention and education
- Emergency medical response support

**Join Requirements:**
- Active server member
- Pass physical fitness assessment
- Complete fire academy training
- Maintain certifications`,
      primaryColor: "#EF4444",
      secondaryColor: "#DC2626",
      accentColor: "#B91C1C",
      enabled: true,
      maxUnits: 15,
      requireCertification: true,
      autoApprove: false,
      allowRecruitment: true,
      minPlaytime: 8,
      discordRole: "Firefighter"
    }
  });

  // Fire Stations
  const fireStations = [
    { name: "Station 1 - Downtown", address: "425 Elgin Ave", phone: "(555) 0200", staffCount: 18, status: "Active" },
    { name: "Station 2 - Davis", address: "1337 Davis Ave", phone: "(555) 0201", staffCount: 14, status: "Active" },
    { name: "Station 3 - Sandy Shores", address: "1905 Alhambra Dr", phone: "(555) 0202", staffCount: 10, status: "Active" }
  ];

  for (const station of fireStations) {
    await prisma.station.upsert({
      where: { id: `fire-${station.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: station,
      create: { ...station, departmentId: fire.id, id: `fire-${station.name.toLowerCase().replace(/\s+/g, '-')}` }
    });
  }

  // Fire Divisions
  const fireDivisions = [
    { name: "Engine Company", icon: "Truck", memberCount: 24 },
    { name: "Ladder Company", icon: "Shield", memberCount: 12 },
    { name: "Rescue Squad", icon: "Heart", memberCount: 8 },
    { name: "Hazmat Team", icon: "AlertTriangle", memberCount: 6 }
  ];

  for (const division of fireDivisions) {
    await prisma.division.upsert({
      where: { id: `fire-${division.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: division,
      create: { ...division, departmentId: fire.id, id: `fire-${division.name.toLowerCase().replace(/\s+/g, '-')}` }
    });
  }

  // Fire Ranks
  const fireRanks = await Promise.all([
    prisma.rank.create({ data: { departmentId: fire.id, name: "Probationary Firefighter", abbreviation: "PFF", level: 1, payGrade: 1, color: "default" }}),
    prisma.rank.create({ data: { departmentId: fire.id, name: "Firefighter", abbreviation: "FF", level: 2, payGrade: 2, color: "default" }}),
    prisma.rank.create({ data: { departmentId: fire.id, name: "Firefighter II", abbreviation: "FF-II", level: 3, payGrade: 3, color: "success" }}),
    prisma.rank.create({ data: { departmentId: fire.id, name: "Engineer", abbreviation: "ENG", level: 4, payGrade: 4, color: "secondary" }}),
    prisma.rank.create({ data: { departmentId: fire.id, name: "Lieutenant", abbreviation: "LT", level: 5, payGrade: 5, color: "primary" }}),
    prisma.rank.create({ data: { departmentId: fire.id, name: "Captain", abbreviation: "CPT", level: 6, payGrade: 6, color: "warning" }}),
    prisma.rank.create({ data: { departmentId: fire.id, name: "Battalion Chief", abbreviation: "BC", level: 7, payGrade: 7, color: "danger" }}),
    prisma.rank.create({ data: { departmentId: fire.id, name: "Assistant Chief", abbreviation: "AC", level: 8, payGrade: 8, color: "danger" }}),
    prisma.rank.create({ data: { departmentId: fire.id, name: "Fire Chief", abbreviation: "CHIEF", level: 9, payGrade: 9, color: "danger" }})
  ]);

  // Fire Members
  const fireMembers = [
    { rankId: fireRanks[8].id, name: "Jennifer Taylor", badgeNumber: "F-001", status: "active" },
    { rankId: fireRanks[5].id, name: "David Martinez", badgeNumber: "F-105", status: "active" }
  ];

  for (const member of fireMembers) {
    await prisma.member.upsert({
      where: { id: `fire-${member.badgeNumber}` },
      update: member,
      create: { ...member, departmentId: fire.id, id: `fire-${member.badgeNumber}` }
    });
  }

  // EMS DEPARTMENT
  const ems = await prisma.department.upsert({
    where: { name: "EMS" },
    update: {},
    create: {
      name: "EMS",
      displayName: "Aurora Horizon EMS",
      motto: "Saving Lives, One Call at a Time",
      description: "Aurora Horizon EMS provides professional emergency medical services with highly trained paramedics and EMTs responding 24/7 to medical emergencies.",
      homepageContent: `**Our Mission:**
Providing compassionate, professional emergency medical care to our community with rapid response and advanced life support.

**What We Do:**
- Emergency medical response
- Advanced life support
- Patient transportation
- Medical training and education
- Inter-facility transfers

**Join Requirements:**
- Active server participation
- EMT or Paramedic certification (in-RP)
- Complete medical training program
- Pass skills assessment`,
      primaryColor: "#10B981",
      secondaryColor: "#059669",
      accentColor: "#047857",
      enabled: true,
      maxUnits: 12,
      requireCertification: true,
      autoApprove: false,
      allowRecruitment: true,
      minPlaytime: 5,
      discordRole: "EMS Personnel"
    }
  });

  // EMS Stations
  const emsStations = [
    { name: "Pillbox Medical Center", address: "357 Pillbox Hill Dr", phone: "(555) 0300", staffCount: 25, status: "Active" },
    { name: "Sandy Shores Medical", address: "1850 Senora Way", phone: "(555) 0301", staffCount: 12, status: "Active" }
  ];

  for (const station of emsStations) {
    await prisma.station.upsert({
      where: { id: `ems-${station.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: station,
      create: { ...station, departmentId: ems.id, id: `ems-${station.name.toLowerCase().replace(/\s+/g, '-')}` }
    });
  }

  // EMS Divisions
  const emsDivisions = [
    { name: "Ambulance Operations", icon: "Ambulance", memberCount: 20 },
    { name: "Critical Care Team", icon: "Heart", memberCount: 8 },
    { name: "Medical Training", icon: "Award", memberCount: 5 },
    { name: "Flight Medics", icon: "Plane", memberCount: 4 }
  ];

  for (const division of emsDivisions) {
    await prisma.division.upsert({
      where: { id: `ems-${division.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: division,
      create: { ...division, departmentId: ems.id, id: `ems-${division.name.toLowerCase().replace(/\s+/g, '-')}` }
    });
  }

  // EMS Ranks
  const emsRanks = await Promise.all([
    prisma.rank.create({ data: { departmentId: ems.id, name: "EMT-Basic", abbreviation: "EMT-B", level: 1, payGrade: 1, color: "default" }}),
    prisma.rank.create({ data: { departmentId: ems.id, name: "EMT-Intermediate", abbreviation: "EMT-I", level: 2, payGrade: 2, color: "default" }}),
    prisma.rank.create({ data: { departmentId: ems.id, name: "Paramedic", abbreviation: "PM", level: 3, payGrade: 3, color: "success" }}),
    prisma.rank.create({ data: { departmentId: ems.id, name: "Advanced Paramedic", abbreviation: "AP", level: 4, payGrade: 4, color: "secondary" }}),
    prisma.rank.create({ data: { departmentId: ems.id, name: "Field Supervisor", abbreviation: "FS", level: 5, payGrade: 5, color: "primary" }}),
    prisma.rank.create({ data: { departmentId: ems.id, name: "EMS Lieutenant", abbreviation: "EMS-LT", level: 6, payGrade: 6, color: "warning" }}),
    prisma.rank.create({ data: { departmentId: ems.id, name: "EMS Captain", abbreviation: "EMS-CPT", level: 7, payGrade: 7, color: "danger" }}),
    prisma.rank.create({ data: { departmentId: ems.id, name: "EMS Chief", abbreviation: "EMS-CHIEF", level: 8, payGrade: 8, color: "danger" }})
  ]);

  // EMS Members
  const emsMembers = [
    { rankId: emsRanks[7].id, name: "Dr. Emily Chen", badgeNumber: "M-001", status: "active" }
  ];

  for (const member of emsMembers) {
    await prisma.member.upsert({
      where: { id: `ems-${member.badgeNumber}` },
      update: member,
      create: { ...member, departmentId: ems.id, id: `ems-${member.badgeNumber}` }
    });
  }

  console.log("✅ Departments seeded successfully!");
}

async function main() {
  await seedDepartments();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
