import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CAD system database...");

  // Create test user
  const user = await prisma.user.upsert({
    where: { email: "dev@aurorahorizon.local" },
    update: {},
    create: {
      email: "dev@aurorahorizon.local",
      name: "Dev User",
      role: "admin",
      discordId: "dev-user-1",
    },
  });

  console.log("✅ Created test user:", user.email);

  // Create officers
  const officer1 = await prisma.officer.create({
    data: {
      userId: user.id,
      callsign: "D231", // Victoria Police divisional unit
      name: "Sarah Thompson",
      badge: "24681",
      department: "POLICE",
      rank: "Senior Constable",
      dutyStatus: "AVAILABLE",
    },
  });

  const officer2 = await prisma.officer.create({
    data: {
      userId: user.id,
      callsign: "MFB-P1", // Melbourne Fire Brigade Pumper
      name: "James Mitchell",
      badge: "F2401",
      department: "FIRE",
      rank: "Station Officer",
      dutyStatus: "AVAILABLE",
    },
  });

  const officer3 = await prisma.officer.create({
    data: {
      userId: user.id,
      callsign: "MICA-5", // Mobile Intensive Care Ambulance
      name: "Mike Johnson",
      badge: "E205",
      department: "EMS",
      rank: "Paramedic",
      dutyStatus: "AVAILABLE",
    },
  });

  console.log("✅ Created officers:", officer1.callsign, officer2.callsign, officer3.callsign);

  // Create units
  const unit1 = await prisma.unit.create({
    data: {
      callsign: "1A-01",
      department: "POLICE",
      status: "AVAILABLE",
      location: "Downtown",
    },
  });

  const unit2 = await prisma.unit.create({
    data: {
      callsign: "FIRE-1",
      department: "FIRE",
      status: "AVAILABLE",
      location: "Fire Station 1",
    },
  });

  const unit3 = await prisma.unit.create({
    data: {
      callsign: "EMS-5",
      department: "EMS",
      status: "AVAILABLE",
      location: "Hospital",
    },
  });

  console.log("✅ Created units:", unit1.callsign, unit2.callsign, unit3.callsign);

  // Link officers to units
  await prisma.officer.update({
    where: { id: officer1.id },
    data: { unitId: unit1.id },
  });

  await prisma.officer.update({
    where: { id: officer2.id },
    data: { unitId: unit2.id },
  });

  await prisma.officer.update({
    where: { id: officer3.id },
    data: { unitId: unit3.id },
  });

  // Create sample calls with Victorian locations
  const call1 = await prisma.call.create({
    data: {
      callNumber: `2025-${String(Date.now()).slice(-6)}`,
      type: "RBT_STOP",
      priority: "LOW",
      status: "PENDING",
      location: "Intersection of Swanston Street & Collins Street",
      postal: "3000",
      description: "Random Breath Test stop - routine traffic enforcement",
      caller: "Senior Constable Thompson",
      createdById: user.id,
    },
  });

  const call2 = await prisma.call.create({
    data: {
      callNumber: `2025-${String(Date.now() + 1).slice(-6)}`,
      type: "MVA",
      priority: "HIGH",
      status: "DISPATCHED",
      location: "Chadstone Shopping Centre Car Park",
      postal: "3148",
      description: "Motor vehicle accident - two vehicles, injuries reported. Patient conscious but in pain.",
      caller: "Centre Security",
      callerPhone: "0398 765 432",
      createdById: user.id,
      dispatchedAt: new Date(),
    },
  });

  const call3 = await prisma.call.create({
    data: {
      callNumber: `2025-${String(Date.now() + 2).slice(-6)}`,
      type: "STRUCTURE_FIRE",
      priority: "CRITICAL",
      status: "ACTIVE",
      location: "123 Lygon Street, Carlton",
      postal: "3053",
      description: "House fire, flames visible from upper floor. Possible occupants inside. Multiple Triple Zero calls.",
      caller: "Neighbour",
      callerPhone: "0412 345 678",
      createdById: user.id,
      dispatchedAt: new Date(),
    },
  });

  console.log("✅ Created sample calls:", call1.callNumber, call2.callNumber, call3.callNumber);

  // Assign units to calls
  await prisma.unit.update({
    where: { id: unit3.id },
    data: { 
      callId: call2.id,
      status: "ENROUTE"
    },
  });

  await prisma.unit.update({
    where: { id: unit2.id },
    data: { 
      callId: call3.id,
      status: "ON_SCENE"
    },
  });

  // Create sample Victorian citizens
  const citizen1 = await prisma.citizen.create({
    data: {
      firstName: "Connor",
      lastName: "O'Brien",
      dateOfBirth: new Date("1992-03-18"),
      gender: "Male",
      stateId: "VIC-3456789",
      phoneNumber: "0412 567 890",
      address: "45 Chapel Street, St Kilda VIC 3182",
      driversLicense: true,
      weaponsPermit: false,
    },
  });

  const citizen2 = await prisma.citizen.create({
    data: {
      firstName: "Emma",
      lastName: "Nguyen",
      dateOfBirth: new Date("1988-11-05"),
      gender: "Female",
      stateId: "VIC-8901234",
      phoneNumber: "0423 789 012",
      address: "127 Brunswick Street, Fitzroy VIC 3065",
      driversLicense: true,
      weaponsPermit: true,
      isWanted: true,
    },
  });

  console.log("✅ Created citizens:", citizen1.firstName, citizen2.firstName);

  // Create vehicles
  await prisma.vehicle.create({
    data: {
      plate: "ABC1234",
      model: "Honda Civic",
      color: "Blue",
      year: 2020,
      ownerId: citizen1.id,
    },
  });

  await prisma.vehicle.create({
    data: {
      plate: "XYZ9876",
      model: "Ford F-150",
      color: "Black",
      year: 2019,
      isStolen: true,
      ownerId: citizen2.id,
    },
  });

  // Create warrant
  await prisma.warrant.create({
    data: {
      citizenId: citizen2.id,
      offense: "Failure to Appear",
      description: "Failed to appear in court for traffic violations",
      bail: 5000,
      issuedBy: "Judge Thompson",
    },
  });

  console.log("✅ Created vehicles and warrants");

  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
