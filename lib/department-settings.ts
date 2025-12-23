// Department settings utility
// Fetches department configuration from admin settings or returns defaults

export interface DepartmentTheme {
  name: string;
  displayName: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  logoUrl: string;
  badgeUrl: string;
  bannerUrl: string;
  customCSS: string;
  enableGradient: boolean;
  gradientDirection: string;
  borderStyle: string;
  cardOpacity: number;
}

export interface DepartmentSettings {
  enabled: boolean;
  maxUnits: number;
  requireCertification: boolean;
  autoApprove: boolean;
  theme: DepartmentTheme;
  allowRecruitment: boolean;
  minPlaytime: number;
  discordRole: string;
  description: string;
  homepageContent: string;
  motto: string;
}

const defaultSettings: Record<string, DepartmentSettings> = {
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
    homepageContent: "Welcome to the Aurora Horizon Police Department. We are dedicated to maintaining law and order, protecting citizens, and upholding justice. Our officers are trained professionals committed to serving the community with the highest standards of excellence.\n\n**Our Mission:**\nTo provide professional law enforcement services that promote public safety, prevent crime, and enhance the quality of life for all residents.\n\n**Join Us:**\nWe are always looking for dedicated individuals to join our ranks. If you have a passion for justice and want to make a difference, apply today!",
    theme: {
      name: "Police Department",
      displayName: "Aurora Horizon Police Department",
      primaryColor: "#3B82F6",
      secondaryColor: "#1E40AF",
      accentColor: "#60A5FA",
      logoUrl: "/departments/police-logo.png",
      badgeUrl: "/departments/police-badge.png",
      bannerUrl: "/departments/police-banner.png",
      customCSS: "",
      enableGradient: true,
      gradientDirection: "to-br",
      borderStyle: "solid",
      cardOpacity: 90,
    },
  },
  FIRE: {
    enabled: true,
    maxUnits: 15,
    requireCertification: true,
    autoApprove: false,
    allowRecruitment: true,
    minPlaytime: 8,
    discordRole: "Firefighter",
    description: "First responders dedicated to fire suppression, rescue operations, and emergency medical services.",
    motto: "Courage, Honor, Sacrifice",
    homepageContent: "The Aurora Horizon Fire Department is your first line of defense against fires and emergencies. Our brave firefighters respond to a wide range of incidents including structure fires, vehicle accidents, hazardous materials incidents, and medical emergencies.\n\n**What We Do:**\n- Fire suppression and prevention\n- Emergency medical response\n- Technical rescue operations\n- Hazmat response\n\n**Recruitment:**\nBecome a hero. Join our team of dedicated firefighters and make a real difference in people's lives.",
    theme: {
      name: "Fire Department",
      displayName: "Aurora Horizon Fire & Rescue",
      primaryColor: "#EF4444",
      secondaryColor: "#991B1B",
      accentColor: "#F87171",
      logoUrl: "/departments/fire-logo.png",
      badgeUrl: "/departments/fire-badge.png",
      bannerUrl: "/departments/fire-banner.png",
      customCSS: "",
      enableGradient: true,
      gradientDirection: "to-br",
      borderStyle: "solid",
      cardOpacity: 90,
    },
  },
  EMS: {
    enabled: true,
    maxUnits: 12,
    requireCertification: true,
    autoApprove: false,
    allowRecruitment: true,
    minPlaytime: 8,
    discordRole: "EMS",
    description: "Providing critical pre-hospital emergency medical care and transportation.",
    motto: "Saving Lives, One Call at a Time",
    homepageContent: "Aurora Horizon EMS provides rapid response emergency medical services to the community. Our highly trained paramedics and EMTs deliver life-saving care in critical moments.\n\n**Our Services:**\n- Emergency medical response\n- Advanced life support\n- Critical care transport\n- Medical standby services\n\n**Training & Certification:**\nOur team maintains the highest levels of medical certification and undergoes continuous training to provide the best possible care.\n\n**Career Opportunities:**\nIf you're passionate about medicine and helping others in their time of need, consider joining our EMS team.",
    theme: {
      name: "Emergency Medical Services",
      displayName: "Aurora Horizon EMS",
      primaryColor: "#10B981",
      secondaryColor: "#065F46",
      accentColor: "#34D399",
      logoUrl: "/departments/ems-logo.png",
      badgeUrl: "/departments/ems-badge.png",
      bannerUrl: "/departments/ems-banner.png",
      customCSS: "",
      enableGradient: true,
      gradientDirection: "to-br",
      borderStyle: "solid",
      cardOpacity: 90,
    },
  },
};

export function getDepartmentSettings(department: "POLICE" | "FIRE" | "EMS"): DepartmentSettings {
  // TODO: Fetch from API/localStorage when admin settings are saved
  // For now, return defaults
  return defaultSettings[department];
}

export function getDepartmentColor(department: "POLICE" | "FIRE" | "EMS"): string {
  const settings = getDepartmentSettings(department);
  return settings.theme.primaryColor;
}

export function getDepartmentGradient(department: "POLICE" | "FIRE" | "EMS"): string {
  const settings = getDepartmentSettings(department);
  if (settings.theme.enableGradient) {
    return `linear-gradient(${settings.theme.gradientDirection}, ${settings.theme.primaryColor}, ${settings.theme.secondaryColor})`;
  }
  return settings.theme.primaryColor;
}
