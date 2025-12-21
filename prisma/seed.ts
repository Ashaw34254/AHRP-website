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
      callsign: "1A-01",
      name: "John Smith",
      badge: "101",
      department: "POLICE",
      rank: "Senior Officer",
      dutyStatus: "AVAILABLE",
    },
  });

  const officer2 = await prisma.officer.create({
    data: {
      userId: user.id,
      callsign: "FIRE-1",
      name: "Jane Doe",
      badge: "F101",
      department: "FIRE",
      rank: "Captain",
      dutyStatus: "AVAILABLE",
    },
  });

  const officer3 = await prisma.officer.create({
    data: {
      userId: user.id,
      callsign: "EMS-5",
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

  // Create sample calls
  const call1 = await prisma.call.create({
    data: {
      callNumber: `2025-${String(Date.now()).slice(-6)}`,
      type: "TRAFFIC_STOP",
      priority: "LOW",
      status: "PENDING",
      location: "Main St & 1st Ave",
      postal: "101",
      description: "Routine traffic stop - speeding violation",
      caller: "Officer Smith",
      createdById: user.id,
    },
  });

  const call2 = await prisma.call.create({
    data: {
      callNumber: `2025-${String(Date.now() + 1).slice(-6)}`,
      type: "MEDICAL_EMERGENCY",
      priority: "HIGH",
      status: "DISPATCHED",
      location: "Aurora Shopping Mall",
      postal: "205",
      description: "Person having chest pains, needs immediate medical assistance",
      caller: "Mall Security",
      callerPhone: "555-0123",
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
      location: "123 Oak Street",
      postal: "310",
      description: "House fire, flames visible from second floor. Possible occupants inside.",
      caller: "Neighbor",
      callerPhone: "555-0456",
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

  // Create sample citizens
  const citizen1 = await prisma.citizen.create({
    data: {
      firstName: "Robert",
      lastName: "Martinez",
      dateOfBirth: new Date("1990-05-15"),
      gender: "Male",
      stateId: "DL-12345678",
      phoneNumber: "555-1234",
      address: "456 Main Street, Aurora",
      driversLicense: true,
      weaponsPermit: false,
    },
  });

  const citizen2 = await prisma.citizen.create({
    data: {
      firstName: "Sarah",
      lastName: "Williams",
      dateOfBirth: new Date("1985-08-22"),
      gender: "Female",
      stateId: "DL-87654321",
      phoneNumber: "555-5678",
      address: "789 Park Avenue, Aurora",
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
