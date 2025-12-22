// Fetch department settings from API
export async function getDepartmentSettings(dept: 'POLICE' | 'FIRE' | 'EMS') {
  try {
    const response = await fetch(`/api/departments/${dept}`, {
      cache: 'no-store' // Always fetch fresh data
    });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch department: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    // Transform database format to UI format
    return {
      enabled: data.enabled,
      maxUnits: data.maxUnits,
      requireCertification: data.requireCertification,
      autoApprove: data.autoApprove,
      allowRecruitment: data.allowRecruitment,
      minPlaytime: data.minPlaytime,
      discordRole: data.discordRole,
      description: data.description || "",
      homepageContent: data.homepageContent || "",
      motto: data.motto || "",
      theme: {
        name: data.name,
        displayName: data.displayName,
        primaryColor: data.primaryColor,
        secondaryColor: data.secondaryColor,
        accentColor: data.accentColor,
        logoUrl: data.logoUrl || "",
        badgeUrl: data.badgeUrl || "",
        bannerUrl: data.bannerUrl || "",
        customCSS: data.customCSS || "",
        enableGradient: data.enableGradient,
        gradientDirection: data.gradientDirection,
        borderStyle: data.borderStyle,
        cardOpacity: data.cardOpacity
      },
      stations: data.stations || [],
      divisions: data.divisions || [],
      ranks: (data.ranks || []).map((rank: any) => ({
        id: rank.id,
        name: rank.name,
        abbreviation: rank.abbreviation || "",
        level: rank.level,
        permissions: rank.permissions ? JSON.parse(rank.permissions) : [],
        payGrade: rank.payGrade
      })),
      members: (data.members || []).map((member: any) => ({
        id: member.id,
        name: member.name,
        badgeNumber: member.badgeNumber || "",
        rank: member.rank?.name || "",
        status: member.status,
        joinDate: member.joinDate,
        certifications: member.certifications ? JSON.parse(member.certifications) : []
      }))
    };
  } catch (error) {
    console.error('Error fetching department settings:', error);
    // Return fallback data
    return getFallbackSettings(dept);
  }
}

// Fallback settings for when API fails or in server components
function getFallbackSettings(dept: 'POLICE' | 'FIRE' | 'EMS') {
  const defaults = {
    POLICE: {
      enabled: true,
      maxUnits: 20,
      requireCertification: true,
      autoApprove: false,
      allowRecruitment: true,
      minPlaytime: 10,
      discordRole: "Police Officer",
      description: "Aurora Horizon Police Department - To Protect and Serve",
      homepageContent: "Welcome to the Police Department",
      motto: "To Protect and Serve",
      theme: {
        name: "POLICE",
        displayName: "Aurora Horizon Police Department",
        primaryColor: "#3B82F6",
        secondaryColor: "#2563EB",
        accentColor: "#1D4ED8",
        logoUrl: "",
        badgeUrl: "",
        bannerUrl: "",
        customCSS: "",
        enableGradient: true,
        gradientDirection: "to right",
        borderStyle: "solid",
        cardOpacity: 0.5
      },
      stations: [],
      divisions: [],
      ranks: [],
      members: []
    },
    FIRE: {
      enabled: true,
      maxUnits: 15,
      requireCertification: true,
      autoApprove: false,
      allowRecruitment: true,
      minPlaytime: 8,
      discordRole: "Firefighter",
      description: "Aurora Horizon Fire & Rescue - Courage, Honor, Sacrifice",
      homepageContent: "Welcome to Fire & Rescue",
      motto: "Courage, Honor, Sacrifice",
      theme: {
        name: "FIRE",
        displayName: "Aurora Horizon Fire & Rescue",
        primaryColor: "#EF4444",
        secondaryColor: "#DC2626",
        accentColor: "#B91C1C",
        logoUrl: "",
        badgeUrl: "",
        bannerUrl: "",
        customCSS: "",
        enableGradient: true,
        gradientDirection: "to right",
        borderStyle: "solid",
        cardOpacity: 0.5
      },
      stations: [],
      divisions: [],
      ranks: [],
      members: []
    },
    EMS: {
      enabled: true,
      maxUnits: 12,
      requireCertification: true,
      autoApprove: false,
      allowRecruitment: true,
      minPlaytime: 5,
      discordRole: "EMS Personnel",
      description: "Aurora Horizon EMS - Saving Lives, One Call at a Time",
      homepageContent: "Welcome to EMS",
      motto: "Saving Lives, One Call at a Time",
      theme: {
        name: "EMS",
        displayName: "Aurora Horizon EMS",
        primaryColor: "#10B981",
        secondaryColor: "#059669",
        accentColor: "#047857",
        logoUrl: "",
        badgeUrl: "",
        bannerUrl: "",
        customCSS: "",
        enableGradient: true,
        gradientDirection: "to right",
        borderStyle: "solid",
        cardOpacity: 0.5
      },
      stations: [],
      divisions: [],
      ranks: [],
      members: []
    }
  };

  return defaults[dept];
}
