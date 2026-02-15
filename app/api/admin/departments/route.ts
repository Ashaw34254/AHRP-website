import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Default department settings
const defaultDepartments = {
  POLICE: {
    enabled: true,
    maxUnits: 20,
    requireCertification: true,
    autoApprove: false,
    allowRecruitment: true,
    minPlaytime: 10,
    discordRole: "Police Officer",
    description: "Serving and protecting our community with honor and integrity.",
    motto: "To Protect and Serve",
    homepageContent: "Welcome to the Aurora Horizon Police Department. We are dedicated to maintaining law and order, protecting citizens, and upholding justice.",
    theme: {
      name: "Police Department",
      displayName: "Aurora Horizon Police Department",
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
      accentColor: "#60A5FA",
      logoUrl: "",
      badgeUrl: "",
      bannerUrl: "",
      customCSS: "",
      enableGradient: true,
      gradientDirection: "to-br",
      borderStyle: "solid",
      cardOpacity: 90,
    },
    ranks: [],
    members: [],
    announcements: [],
    events: [],
    news: [],
    quickStats: [],
    leadership: [],
    roster: [],
    sops: [],
    stations: [],
    training: [],
  },
  FIRE: {
    enabled: true,
    maxUnits: 15,
    requireCertification: true,
    autoApprove: false,
    allowRecruitment: true,
    minPlaytime: 8,
    discordRole: "Firefighter",
    description: "First responders dedicated to fire suppression and rescue operations.",
    motto: "Courage, Honor, Sacrifice",
    homepageContent: "The Aurora Horizon Fire Department is your first line of defense against fires and emergencies.",
    theme: {
      name: "Fire Department",
      displayName: "Aurora Horizon Fire & Rescue",
      primaryColor: "#EF4444",
      secondaryColor: "#991B1B",
      accentColor: "#F87171",
      logoUrl: "",
      badgeUrl: "",
      bannerUrl: "",
      customCSS: "",
      enableGradient: true,
      gradientDirection: "to-br",
      borderStyle: "solid",
      cardOpacity: 90,
    },
    ranks: [],
    members: [],
    announcements: [],
    events: [],
    news: [],
    quickStats: [],
    leadership: [],
    roster: [],
    sops: [],
    stations: [],
    training: [],
  },
  EMS: {
    enabled: true,
    maxUnits: 12,
    requireCertification: true,
    autoApprove: false,
    allowRecruitment: true,
    minPlaytime: 8,
    discordRole: "EMS",
    description: "Providing critical pre-hospital emergency medical care.",
    motto: "Saving Lives, One Call at a Time",
    homepageContent: "Aurora Horizon EMS provides rapid response emergency medical services to the community.",
    theme: {
      name: "Emergency Medical Services",
      displayName: "Aurora Horizon EMS",
      primaryColor: "#10B981",
      secondaryColor: "#065F46",
      accentColor: "#34D399",
      logoUrl: "",
      badgeUrl: "",
      bannerUrl: "",
      customCSS: "",
      enableGradient: true,
      gradientDirection: "to-br",
      borderStyle: "solid",
      cardOpacity: 90,
    },
    ranks: [],
    members: [],
    announcements: [],
    events: [],
    news: [],
    quickStats: [],
    leadership: [],
    roster: [],
    sops: [],
    stations: [],
    training: [],
  },
};

// GET /api/admin/departments - Get all department settings
export async function GET() {
  try {
    const settings = await prisma.departmentSettings.findMany();
    
    const result: Record<string, any> = {};
    
    // For each department, use DB value or default
    for (const dept of ["POLICE", "FIRE", "EMS"]) {
      const dbSettings = settings.find((s: typeof settings[number]) => s.department === dept);
      
      if (dbSettings) {
        result[dept] = {
          enabled: dbSettings.enabled,
          maxUnits: dbSettings.maxUnits,
          requireCertification: dbSettings.requireCertification,
          autoApprove: dbSettings.autoApprove,
          allowRecruitment: dbSettings.allowRecruitment,
          minPlaytime: dbSettings.minPlaytime,
          discordRole: dbSettings.discordRole,
          description: dbSettings.description,
          homepageContent: dbSettings.homepageContent,
          motto: dbSettings.motto,
          theme: JSON.parse(dbSettings.theme),
          ranks: JSON.parse(dbSettings.ranks),
          members: JSON.parse(dbSettings.members),
          announcements: JSON.parse(dbSettings.announcements || '[]'),
          events: JSON.parse(dbSettings.events || '[]'),
          news: JSON.parse(dbSettings.news || '[]'),
          quickStats: JSON.parse(dbSettings.quickStats || '[]'),
          leadership: JSON.parse(dbSettings.leadership || '[]'),
          roster: JSON.parse(dbSettings.roster || '[]'),
          sops: JSON.parse(dbSettings.sops || '[]'),
          stations: JSON.parse(dbSettings.stations || '[]'),
          training: JSON.parse(dbSettings.training || '[]'),
        };
      } else {
        result[dept] = defaultDepartments[dept as keyof typeof defaultDepartments];
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching departments:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

// PUT /api/admin/departments - Update all department settings
export async function PUT(request: Request) {
  try {
    const departments = await request.json();

    // Validate departments data
    const validDepts = ["POLICE", "FIRE", "EMS"];
    for (const dept of Object.keys(departments)) {
      if (!validDepts.includes(dept)) {
        return NextResponse.json(
          { error: `Invalid department: ${dept}` },
          { status: 400 }
        );
      }
    }

    // Save each department to database
    for (const dept of validDepts) {
      if (departments[dept]) {
        const settings = departments[dept];
        
        await prisma.departmentSettings.upsert({
          where: { department: dept },
          update: {
            enabled: settings.enabled,
            maxUnits: settings.maxUnits,
            requireCertification: settings.requireCertification,
            autoApprove: settings.autoApprove,
            allowRecruitment: settings.allowRecruitment,
            minPlaytime: settings.minPlaytime,
            discordRole: settings.discordRole,
            description: settings.description,
            homepageContent: settings.homepageContent,
            motto: settings.motto,
            theme: JSON.stringify(settings.theme),
            ranks: JSON.stringify(settings.ranks || []),
            members: JSON.stringify(settings.members || []),
            announcements: JSON.stringify(settings.announcements || []),
            events: JSON.stringify(settings.events || []),
            news: JSON.stringify(settings.news || []),
            quickStats: JSON.stringify(settings.quickStats || []),
            leadership: JSON.stringify(settings.leadership || []),
            roster: JSON.stringify(settings.roster || []),
            sops: JSON.stringify(settings.sops || []),
            stations: JSON.stringify(settings.stations || []),
            training: JSON.stringify(settings.training || []),
          },
          create: {
            department: dept,
            enabled: settings.enabled,
            maxUnits: settings.maxUnits,
            requireCertification: settings.requireCertification,
            autoApprove: settings.autoApprove,
            allowRecruitment: settings.allowRecruitment,
            minPlaytime: settings.minPlaytime,
            discordRole: settings.discordRole,
            description: settings.description,
            homepageContent: settings.homepageContent,
            motto: settings.motto,
            theme: JSON.stringify(settings.theme),
            ranks: JSON.stringify(settings.ranks || []),
            members: JSON.stringify(settings.members || []),
            announcements: JSON.stringify(settings.announcements || []),
            events: JSON.stringify(settings.events || []),
            news: JSON.stringify(settings.news || []),
            quickStats: JSON.stringify(settings.quickStats || []),
            leadership: JSON.stringify(settings.leadership || []),
            roster: JSON.stringify(settings.roster || []),
            sops: JSON.stringify(settings.sops || []),
            stations: JSON.stringify(settings.stations || []),
            training: JSON.stringify(settings.training || []),
          },
        });
      }
    }

    return NextResponse.json({
      message: "Department settings updated successfully",
      departments,
    });
  } catch (error) {
    console.error("Error updating departments:", error);
    return NextResponse.json(
      { error: "Failed to update departments" },
      { status: 500 }
    );
  }
}
