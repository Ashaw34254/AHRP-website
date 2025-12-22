import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding default application forms...");

  // Whitelist Application
  await prisma.applicationFormConfig.upsert({
    where: { name: "whitelist" },
    update: {},
    create: {
      name: "whitelist",
      title: "Whitelist Application",
      description: "Apply to join Aurora Horizon RP community",
      isActive: true,
      fields: {
        create: [
          {
            fieldName: "discordUsername",
            label: "Discord Username",
            fieldType: "text",
            placeholder: "username#1234",
            helpText: "Your Discord username with tag",
            required: true,
            order: 0,
            width: "half",
            section: "Personal Information",
          },
          {
            fieldName: "characterName",
            label: "Character Name",
            fieldType: "text",
            placeholder: "First Last",
            helpText: "Your character's full name",
            required: true,
            order: 1,
            width: "half",
            section: "Personal Information",
          },
          {
            fieldName: "ageGroup",
            label: "Age Group",
            fieldType: "select",
            options: JSON.stringify(["18-20", "21-25", "26-30", "31+"]),
            required: true,
            order: 2,
            width: "half",
            section: "Personal Information",
          },
          {
            fieldName: "timezone",
            label: "Timezone",
            fieldType: "text",
            placeholder: "EST, PST, GMT, etc.",
            required: true,
            order: 3,
            width: "half",
            section: "Personal Information",
          },
          {
            fieldName: "experience",
            label: "Roleplay Experience",
            fieldType: "select",
            options: JSON.stringify(["No Experience", "Beginner (1-6 months)", "Intermediate (6-12 months)", "Advanced (1-2 years)", "Expert (2+ years)"]),
            required: true,
            order: 4,
            width: "full",
            section: "Personal Information",
          },
          {
            fieldName: "characterBackstory",
            label: "Character Backstory",
            fieldType: "textarea",
            placeholder: "Tell us about your character's background, personality, and goals...",
            helpText: "Minimum 100 characters",
            required: true,
            minLength: 100,
            order: 5,
            width: "full",
            section: "Character Information",
          },
          {
            fieldName: "whyJoin",
            label: "Why do you want to join Aurora Horizon RP?",
            fieldType: "textarea",
            placeholder: "What attracts you to our community?",
            helpText: "Minimum 50 characters",
            required: true,
            minLength: 50,
            order: 6,
            width: "full",
            section: "Character Information",
          },
          {
            fieldName: "availability",
            label: "Availability",
            fieldType: "textarea",
            placeholder: "List your typical availability (days/times)...",
            required: true,
            order: 7,
            width: "full",
            section: "Availability",
          },
        ],
      },
    },
  });

  // Police Application
  await prisma.applicationFormConfig.upsert({
    where: { name: "police" },
    update: {},
    create: {
      name: "police",
      title: "Police Department Application",
      description: "Apply to join the Police Department",
      isActive: true,
      fields: {
        create: [
          {
            fieldName: "discordUsername",
            label: "Discord Username",
            fieldType: "text",
            placeholder: "username#1234",
            required: true,
            order: 0,
            width: "half",
            section: "Personal Information",
          },
          {
            fieldName: "characterName",
            label: "Character Name",
            fieldType: "text",
            placeholder: "First Last",
            required: true,
            order: 1,
            width: "half",
            section: "Personal Information",
          },
          {
            fieldName: "leoExperience",
            label: "Law Enforcement Experience",
            fieldType: "select",
            options: JSON.stringify(["None", "Some (1-3 months)", "Moderate (3-6 months)", "Experienced (6+ months)"]),
            required: true,
            order: 2,
            width: "full",
            section: "Personal Information",
          },
          {
            fieldName: "whyPolice",
            label: "Why do you want to join the Police Department?",
            fieldType: "textarea",
            placeholder: "Explain your interest in law enforcement RP...",
            required: true,
            minLength: 100,
            order: 3,
            width: "full",
            section: "Motivation",
          },
          {
            fieldName: "scenario",
            label: "Scenario Response",
            fieldType: "textarea",
            placeholder: "You pull over a vehicle for speeding. As you approach, you notice the driver acting nervously. How do you handle this situation?",
            helpText: "Describe your actions step by step",
            required: true,
            minLength: 150,
            order: 4,
            width: "full",
            section: "Scenario",
          },
        ],
      },
    },
  });

  // EMS Application
  await prisma.applicationFormConfig.upsert({
    where: { name: "ems" },
    update: {},
    create: {
      name: "ems",
      title: "EMS/Medical Application",
      description: "Apply to join the EMS Department",
      isActive: true,
      fields: {
        create: [
          {
            fieldName: "discordUsername",
            label: "Discord Username",
            fieldType: "text",
            placeholder: "username#1234",
            required: true,
            order: 0,
            width: "half",
            section: "Personal Information",
          },
          {
            fieldName: "characterName",
            label: "Character Name",
            fieldType: "text",
            placeholder: "First Last",
            required: true,
            order: 1,
            width: "half",
            section: "Personal Information",
          },
          {
            fieldName: "medicalExperience",
            label: "Medical RP Experience",
            fieldType: "select",
            options: JSON.stringify(["None", "Basic", "Intermediate", "Advanced"]),
            required: true,
            order: 2,
            width: "full",
            section: "Personal Information",
          },
          {
            fieldName: "whyEMS",
            label: "Why do you want to join EMS?",
            fieldType: "textarea",
            placeholder: "Explain your interest in medical RP...",
            required: true,
            minLength: 100,
            order: 3,
            width: "full",
            section: "Motivation",
          },
        ],
      },
    },
  });

  // Fire Application
  await prisma.applicationFormConfig.upsert({
    where: { name: "fire" },
    update: {},
    create: {
      name: "fire",
      title: "Fire Department Application",
      description: "Apply to join the Fire Department",
      isActive: true,
      fields: {
        create: [
          {
            fieldName: "discordUsername",
            label: "Discord Username",
            fieldType: "text",
            placeholder: "username#1234",
            required: true,
            order: 0,
            width: "half",
            section: "Personal Information",
          },
          {
            fieldName: "characterName",
            label: "Character Name",
            fieldType: "text",
            placeholder: "First Last",
            required: true,
            order: 1,
            width: "half",
            section: "Personal Information",
          },
          {
            fieldName: "fireExperience",
            label: "Fire/Rescue RP Experience",
            fieldType: "select",
            options: JSON.stringify(["None", "Basic", "Intermediate", "Advanced"]),
            required: true,
            order: 2,
            width: "full",
            section: "Personal Information",
          },
          {
            fieldName: "whyFire",
            label: "Why do you want to join the Fire Department?",
            fieldType: "textarea",
            placeholder: "Explain your interest in fire/rescue RP...",
            required: true,
            minLength: 100,
            order: 3,
            width: "full",
            section: "Motivation",
          },
        ],
      },
    },
  });

  // Business Application
  await prisma.applicationFormConfig.upsert({
    where: { name: "business" },
    update: {},
    create: {
      name: "business",
      title: "Business Application",
      description: "Apply to start a business in Aurora Horizon RP",
      isActive: true,
      fields: {
        create: [
          {
            fieldName: "discordUsername",
            label: "Discord Username",
            fieldType: "text",
            placeholder: "username#1234",
            required: true,
            order: 0,
            width: "half",
            section: "Owner Information",
          },
          {
            fieldName: "characterName",
            label: "Character Name",
            fieldType: "text",
            placeholder: "First Last",
            required: true,
            order: 1,
            width: "half",
            section: "Owner Information",
          },
          {
            fieldName: "businessName",
            label: "Business Name",
            fieldType: "text",
            placeholder: "Your proposed business name",
            required: true,
            order: 2,
            width: "full",
            section: "Business Details",
          },
          {
            fieldName: "businessType",
            label: "Business Type",
            fieldType: "select",
            options: JSON.stringify(["Restaurant/Bar", "Retail Store", "Auto Shop", "Club/Entertainment", "Services", "Other"]),
            required: true,
            order: 3,
            width: "full",
            section: "Business Details",
          },
          {
            fieldName: "businessPlan",
            label: "Business Plan",
            fieldType: "textarea",
            placeholder: "Describe your business concept, target customers, and how it will enhance the community...",
            helpText: "Minimum 200 characters",
            required: true,
            minLength: 200,
            order: 4,
            width: "full",
            section: "Business Details",
          },
          {
            fieldName: "requestedLocation",
            label: "Requested Location",
            fieldType: "text",
            placeholder: "Preferred location or area in the city",
            required: false,
            order: 5,
            width: "full",
            section: "Business Details",
          },
        ],
      },
    },
  });

  // Gang Application
  await prisma.applicationFormConfig.upsert({
    where: { name: "gang" },
    update: {},
    create: {
      name: "gang",
      title: "Gang Application",
      description: "Apply to establish an official gang",
      isActive: true,
      fields: {
        create: [
          {
            fieldName: "discordUsername",
            label: "Discord Username",
            fieldType: "text",
            placeholder: "username#1234",
            required: true,
            order: 0,
            width: "half",
            section: "Leader Information",
          },
          {
            fieldName: "characterName",
            label: "Character Name (Leader)",
            fieldType: "text",
            placeholder: "First Last",
            required: true,
            order: 1,
            width: "half",
            section: "Leader Information",
          },
          {
            fieldName: "gangName",
            label: "Gang Name",
            fieldType: "text",
            placeholder: "Your gang's name",
            required: true,
            order: 2,
            width: "full",
            section: "Gang Details",
          },
          {
            fieldName: "gangTheme",
            label: "Gang Theme/Style",
            fieldType: "select",
            options: JSON.stringify(["Street Gang", "Motorcycle Club", "Organized Crime", "Cartel", "Other"]),
            required: true,
            order: 3,
            width: "full",
            section: "Gang Details",
          },
          {
            fieldName: "gangBackstory",
            label: "Gang Backstory & Goals",
            fieldType: "textarea",
            placeholder: "Describe your gang's history, values, territory, and roleplay goals...",
            helpText: "Minimum 200 characters",
            required: true,
            minLength: 200,
            order: 4,
            width: "full",
            section: "Gang Details",
          },
          {
            fieldName: "memberCount",
            label: "Current Member Count",
            fieldType: "number",
            placeholder: "How many members do you currently have?",
            required: true,
            order: 5,
            width: "half",
            section: "Gang Details",
          },
          {
            fieldName: "requestedTerritory",
            label: "Requested Territory",
            fieldType: "text",
            placeholder: "Preferred area or neighborhood",
            required: false,
            order: 6,
            width: "half",
            section: "Gang Details",
          },
        ],
      },
    },
  });

  console.log("✓ Default application forms seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
