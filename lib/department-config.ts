// Comprehensive department configuration for CAD system
// Includes priority levels, unit types, status codes, and more

export type Department = "POLICE" | "FIRE" | "EMS";

// Department-Specific Priority Levels
export const DEPARTMENT_PRIORITIES = {
  POLICE: [
    { value: "ROUTINE", label: "Routine", color: "default", responseTime: 30 },
    { value: "PRIORITY", label: "Priority", color: "primary", responseTime: 15 },
    { value: "CODE_2", label: "Code 2 - Urgent", color: "warning", responseTime: 10 },
    { value: "CODE_3", label: "Code 3 - Emergency", color: "danger", responseTime: 5 },
    { value: "TACTICAL", label: "Tactical - CIRT/SOG", color: "danger", responseTime: 3 },
    { value: "CODE_99", label: "Code 99 - Officer Down", color: "danger", responseTime: 2 },
  ],
  FIRE: [
    { value: "LOW", label: "Low Priority", color: "default", responseTime: 20 },
    { value: "MEDIUM", label: "Medium Priority", color: "primary", responseTime: 10 },
    { value: "HIGH", label: "High Priority", color: "warning", responseTime: 5 },
    { value: "FIRST_ALARM", label: "1st Alarm", color: "danger", responseTime: 4 },
    { value: "SECOND_ALARM", label: "2nd Alarm", color: "danger", responseTime: 3 },
    { value: "THIRD_ALARM", label: "3rd Alarm", color: "danger", responseTime: 2 },
  ],
  EMS: [
    { value: "GREEN", label: "Green - Non-Urgent", color: "success", responseTime: 25 },
    { value: "YELLOW", label: "Yellow - Urgent", color: "warning", responseTime: 15 },
    { value: "ORANGE", label: "Orange - Serious", color: "warning", responseTime: 8 },
    { value: "RED", label: "Red - Life-Threatening", color: "danger", responseTime: 4 },
    { value: "CRITICAL", label: "Critical - Immediate", color: "danger", responseTime: 2 },
  ],
};

// Department-Specific Unit Types
export const DEPARTMENT_UNIT_TYPES = {
  POLICE: [
    { value: "PATROL", label: "Patrol Unit", icon: "Car" },
    { value: "TRAFFIC", label: "Traffic Unit", icon: "CarFront" },
    { value: "K9", label: "K9 Unit", icon: "Dog" },
    { value: "SWAT", label: "SWAT/Tactical", icon: "Shield" },
    { value: "CIRT", label: "CIRT - Critical Incident Response", icon: "ShieldAlert" },
    { value: "SOG", label: "SOG - Special Operations Group", icon: "Target" },
    { value: "DETECTIVE", label: "Detective Unit", icon: "Search" },
    { value: "MOTORCYCLE", label: "Motorcycle Unit", icon: "Bike" },
    { value: "SUPERVISOR", label: "Supervisor", icon: "Star" },
    { value: "HELICOPTER", label: "Air Unit", icon: "Plane" },
    { value: "BOMB_SQUAD", label: "Bomb Squad", icon: "Bomb" },
    { value: "NEGOTIATOR", label: "Crisis Negotiator", icon: "MessageCircle" },
  ],
  FIRE: [
    { value: "ENGINE", label: "Fire Engine", icon: "Flame" },
    { value: "LADDER", label: "Ladder Truck", icon: "Truck" },
    { value: "RESCUE", label: "Rescue Unit", icon: "Wrench" },
    { value: "HAZMAT", label: "HAZMAT Unit", icon: "Radiation" },
    { value: "CHIEF", label: "Battalion Chief", icon: "Star" },
    { value: "TANKER", label: "Water Tanker", icon: "Droplet" },
    { value: "BRUSH", label: "Brush Truck", icon: "Trees" },
  ],
  EMS: [
    { value: "AMBULANCE", label: "Ambulance", icon: "Ambulance" },
    { value: "MEDIC", label: "Medic Unit", icon: "Heart" },
    { value: "SUPERVISOR", label: "EMS Supervisor", icon: "Star" },
    { value: "AIR_AMBULANCE", label: "Air Ambulance", icon: "Plane" },
    { value: "QUICK_RESPONSE", label: "Quick Response Vehicle", icon: "Zap" },
    { value: "PARAMEDIC", label: "Paramedic Unit", icon: "Stethoscope" },
  ],
};

// Department-Specific Status Codes
export const DEPARTMENT_STATUS_CODES = {
  POLICE: [
    { code: "10-8", label: "In Service/Available", color: "success" },
    { code: "10-6", label: "Busy", color: "warning" },
    { code: "10-7", label: "Out of Service", color: "default" },
    { code: "10-23", label: "Arrived on Scene", color: "primary" },
    { code: "10-24", label: "Assignment Complete", color: "success" },
    { code: "10-97", label: "Arrived at Scene", color: "primary" },
    { code: "10-98", label: "Available for Assignment", color: "success" },
    { code: "10-99", label: "Officer Needs Assistance", color: "danger" },
    { code: "CODE_4", label: "No Further Assistance Needed", color: "success" },
    { code: "CODE_5", label: "Stakeout", color: "warning" },
    { code: "CODE_6", label: "Out for Investigation", color: "primary" },
  ],
  FIRE: [
    { code: "AVAILABLE", label: "Available/In Quarters", color: "success" },
    { code: "RESPONDING", label: "Responding", color: "warning" },
    { code: "ON_SCENE", label: "On Scene", color: "primary" },
    { code: "WATER_SUPPLY", label: "Water Supply Established", color: "primary" },
    { code: "FIRE_ATTACK", label: "Fire Attack Mode", color: "danger" },
    { code: "FIRE_OUT", label: "Fire Under Control", color: "success" },
    { code: "OVERHAUL", label: "Overhaul Operations", color: "warning" },
    { code: "RETURNING", label: "Returning to Station", color: "primary" },
    { code: "OUT_OF_SERVICE", label: "Out of Service", color: "default" },
  ],
  EMS: [
    { code: "AVAILABLE", label: "Available", color: "success" },
    { code: "DISPATCHED", label: "Dispatched", color: "warning" },
    { code: "EN_ROUTE", label: "En Route to Scene", color: "warning" },
    { code: "ON_SCENE", label: "On Scene", color: "primary" },
    { code: "PATIENT_CONTACT", label: "Patient Contact", color: "primary" },
    { code: "TRANSPORTING", label: "Transporting", color: "warning" },
    { code: "AT_HOSPITAL", label: "At Hospital", color: "primary" },
    { code: "HOSPITAL_CLEAR", label: "Clear from Hospital", color: "success" },
    { code: "RETURNING", label: "Returning to Service", color: "primary" },
    { code: "OUT_OF_SERVICE", label: "Out of Service", color: "default" },
  ],
};

// Auto-Suggest Units by Call Type
export const CALL_TYPE_UNIT_SUGGESTIONS = {
  // POLICE Call Types
  TRAFFIC_OFFENCE: ["TRAFFIC", "PATROL"],
  RBT_STOP: ["TRAFFIC", "PATROL"],
  SUSPICIOUS_BEHAVIOUR: ["PATROL"],
  THEFT_FROM_VEHICLE: ["PATROL", "DETECTIVE"],
  BURGLARY: ["PATROL", "DETECTIVE", "K9"],
  ARMED_ROBBERY: ["PATROL", "K9", "SWAT", "SUPERVISOR"],
  AGGRAVATED_ASSAULT: ["PATROL", "SUPERVISOR"],
  FAMILY_VIOLENCE: ["PATROL", "SUPERVISOR"],
  SHOTS_FIRED: ["PATROL", "SWAT", "K9", "SUPERVISOR", "HELICOPTER"],
  VEHICLE_PURSUIT: ["PATROL", "TRAFFIC", "HELICOPTER", "SUPERVISOR"],
  WARRANT_EXECUTION: ["PATROL", "SWAT", "K9"],
  HIGH_RISK_WARRANT: ["CIRT", "SOG", "SWAT", "SUPERVISOR", "NEGOTIATOR"],
  HOSTAGE_SITUATION: ["CIRT", "SOG", "NEGOTIATOR", "SUPERVISOR", "HELICOPTER"],
  BARRICADED_SUSPECT: ["CIRT", "NEGOTIATOR", "SUPERVISOR"],
  ACTIVE_SHOOTER: ["CIRT", "SOG", "SWAT", "SUPERVISOR", "HELICOPTER"],
  TERRORIST_THREAT: ["SOG", "CIRT", "BOMB_SQUAD", "SUPERVISOR"],
  VIP_PROTECTION: ["SOG", "SUPERVISOR"],
  CIVIL_DISTURBANCE: ["CIRT", "SWAT", "SUPERVISOR", "PATROL"],
  WELFARE_CHECK: ["PATROL"],
  MISSING_PERSON: ["PATROL", "K9", "HELICOPTER"],
  PUBLIC_ORDER: ["PATROL", "SUPERVISOR"],
  DRUG_OFFENCE: ["PATROL", "DETECTIVE", "K9"],
  HOON_DRIVING: ["TRAFFIC", "PATROL"],

  // FIRE Call Types
  STRUCTURE_FIRE: ["ENGINE", "LADDER", "CHIEF", "RESCUE"],
  CAR_FIRE: ["ENGINE"],
  BUSHFIRE: ["ENGINE", "BRUSH", "TANKER", "CHIEF"],
  SMOKE_INVESTIGATION: ["ENGINE"],
  HAZMAT_INCIDENT: ["HAZMAT", "ENGINE", "CHIEF"],
  RESCUE_OPERATION: ["RESCUE", "ENGINE", "LADDER", "CHIEF"],
  FALSE_ALARM: ["ENGINE"],

  // EMS Call Types
  MEDICAL_EMERGENCY: ["AMBULANCE", "MEDIC"],
  CARDIAC_ARREST: ["AMBULANCE", "MEDIC", "PARAMEDIC", "SUPERVISOR", "AIR_AMBULANCE"],
  TRAUMA: ["AMBULANCE", "PARAMEDIC", "AIR_AMBULANCE"],
  OVERDOSE: ["AMBULANCE", "MEDIC"],
  DIFFICULTY_BREATHING: ["AMBULANCE", "MEDIC"],
  STROKE: ["AMBULANCE", "PARAMEDIC", "AIR_AMBULANCE"],
  SEIZURE: ["AMBULANCE", "MEDIC"],
  ALLERGIC_REACTION: ["AMBULANCE", "MEDIC"],
  CHEST_PAIN: ["AMBULANCE", "MEDIC", "PARAMEDIC"],
  UNCONSCIOUS_PERSON: ["AMBULANCE", "MEDIC", "PARAMEDIC"],
};

// Response Time Targets (in minutes)
export const RESPONSE_TIME_TARGETS = {
  POLICE: {
    ROUTINE: 30,
    PRIORITY: 15,
    CODE_2: 10,
    CODE_3: 5,
    CODE_99: 2,
  },
  FIRE: {
    LOW: 20,
    MEDIUM: 10,
    HIGH: 5,
    FIRST_ALARM: 4,
    SECOND_ALARM: 3,
    THIRD_ALARM: 2,
  },
  EMS: {
    GREEN: 25,
    YELLOW: 15,
    ORANGE: 8,
    RED: 4,
    CRITICAL: 2,
  },
};

// Cross-Department Call Types that require coordination
export const CROSS_DEPARTMENT_CALLS = [
  "STRUCTURE_FIRE", // Fire + Police for traffic control
  "VEHICLE_PURSUIT", // Police + EMS standby
  "ARMED_ROBBERY", // Police + EMS standby
  "SHOTS_FIRED", // Police + EMS + Fire
  "HAZMAT_INCIDENT", // Fire + Police + EMS
  "CARDIAC_ARREST", // EMS + Fire (first responders)
  "TRAUMA", // EMS + Police (potential crime scene)
];

// Auto-notify other departments
export const AUTO_NOTIFY_DEPARTMENTS: Record<string, Department[]> = {
  STRUCTURE_FIRE: ["POLICE"], // Police for traffic/scene control
  SHOTS_FIRED: ["EMS", "FIRE"], // EMS for victims, Fire for backup
  VEHICLE_PURSUIT: ["EMS"], // EMS standby
  ARMED_ROBBERY: ["EMS"], // EMS standby
  HAZMAT_INCIDENT: ["POLICE", "EMS"], // All departments
  CARDIAC_ARREST: ["FIRE"], // Fire first responders
  TRAUMA: ["POLICE"], // Potential crime scene
  OVERDOSE: ["POLICE"], // Potential drug offense
};

// Equipment/Resource Types
export const DEPARTMENT_EQUIPMENT = {
  POLICE: [
    { type: "K9_UNIT", label: "K9 Unit", available: 3 },
    { type: "HELICOPTER", label: "Police Helicopter", available: 1 },
    { type: "SWAT_TEAM", label: "SWAT Team", available: 1 },
    { type: "TOW_TRUCK", label: "Tow Truck", available: 5 },
    { type: "EVIDENCE_VAN", label: "Evidence Collection Van", available: 2 },
  ],
  FIRE: [
    { type: "FOAM_UNIT", label: "Foam Unit", available: 2 },
    { type: "BREATHING_APPARATUS", label: "SCBA Sets", available: 50 },
    { type: "JAWS_OF_LIFE", label: "Hydraulic Rescue Tools", available: 8 },
    { type: "THERMAL_CAMERA", label: "Thermal Imaging Camera", available: 10 },
  ],
  EMS: [
    { type: "DEFIBRILLATOR", label: "AED/Defibrillator", available: 20 },
    { type: "OXYGEN", label: "Oxygen Supply", available: 100 },
    { type: "BACKBOARD", label: "Spinal Backboard", available: 30 },
    { type: "STRETCHER", label: "Stretcher/Gurney", available: 25 },
  ],
};

// Escalation Thresholds
export const ESCALATION_RULES = {
  FIRE: {
    STRUCTURE_FIRE: {
      escalateTo: "SECOND_ALARM",
      conditions: ["multipleFloors", "largeStructure", "casualties"],
    },
  },
  EMS: {
    MEDICAL_EMERGENCY: {
      escalateTo: "MULTI_CASUALTY",
      conditions: ["multiplePatients", "massiveTrauma"],
    },
  },
  POLICE: {
    SHOTS_FIRED: {
      escalateTo: "ACTIVE_SHOOTER",
      conditions: ["multipleVictims", "activeShooter", "schoolShooting"],
      autoDispatch: ["SWAT", "SUPERVISOR", "EMS", "FIRE"],
    },
  },
};

// Geographic Zones (simplified - expand based on actual coverage areas)
export const GEOGRAPHIC_ZONES = [
  { id: "NORTH", name: "North Zone", postcodes: ["3000", "3001", "3002"] },
  { id: "SOUTH", name: "South Zone", postcodes: ["3004", "3005", "3006"] },
  { id: "EAST", name: "East Zone", postcodes: ["3010", "3011", "3012"] },
  { id: "WEST", name: "West Zone", postcodes: ["3020", "3021", "3022"] },
  { id: "CENTRAL", name: "Central Zone", postcodes: ["3003", "3007", "3008"] },
];

// Helper functions
export function getPriorityByDepartment(department: Department, priority: string) {
  const priorities = DEPARTMENT_PRIORITIES[department];
  return priorities.find(p => p.value === priority) || priorities[0];
}

export function getUnitTypesByDepartment(department: Department) {
  return DEPARTMENT_UNIT_TYPES[department] || [];
}

export function getStatusCodesByDepartment(department: Department) {
  return DEPARTMENT_STATUS_CODES[department] || [];
}

export function getSuggestedUnits(callType: string): string[] {
  return CALL_TYPE_UNIT_SUGGESTIONS[callType] || [];
}

export function getResponseTimeTarget(department: Department, priority: string): number {
  return RESPONSE_TIME_TARGETS[department]?.[priority] || 15;
}

export function shouldNotifyDepartments(callType: string): Department[] {
  return AUTO_NOTIFY_DEPARTMENTS[callType] || [];
}

export function getZoneByPostcode(postcode: string) {
  return GEOGRAPHIC_ZONES.find(zone => zone.postcodes.includes(postcode)) || GEOGRAPHIC_ZONES[4]; // Default to CENTRAL
}
