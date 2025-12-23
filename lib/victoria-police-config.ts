// Victoria Police specific terminology and codes
// Based on Victoria Police structure and Australian emergency services

export const VIC_POLICE_CODES = {
  // Victoria Police Radio Codes
  STATUS: {
    CODE_1: "Non-urgent incident",
    CODE_2: "Urgent incident",
    CODE_3: "Emergency incident",
    CODE_99: "Officer needs urgent assistance",
  },
  RESPONSE: {
    LIGHTS_ONLY: "Priority 1 - Lights Only",
    LIGHTS_SIRENS: "Priority 2 - Lights & Sirens",
    IMMEDIATE: "Priority 3 - Immediate Response",
  }
};

export const VIC_CALL_TYPES = {
  POLICE: [
    "TRAFFIC_OFFENCE",
    "RBT_STOP", // Random Breath Test
    "SUSPICIOUS_BEHAVIOUR",
    "THEFT_FROM_VEHICLE",
    "BURGLARY",
    "ARMED_ROBBERY",
    "AGGRAVATED_ASSAULT",
    "FAMILY_VIOLENCE",
    "SHOTS_FIRED",
    "VEHICLE_PURSUIT",
    "WARRANT_EXECUTION",
    "WELFARE_CHECK",
    "MISSING_PERSON",
    "PUBLIC_ORDER",
    "DRUG_OFFENCE",
    "HOON_DRIVING",
    "OTHER"
  ],
  FIRE: [
    "STRUCTURE_FIRE",
    "CAR_FIRE",
    "BUSHFIRE",
    "SMOKE_INVESTIGATION",
    "HAZMAT_INCIDENT",
    "RESCUE_OPERATION",
    "FALSE_ALARM",
    "OTHER"
  ],
  EMS: [
    "MEDICAL_EMERGENCY",
    "MVA", // Motor Vehicle Accident
    "OVERDOSE",
    "CARDIAC_ARREST",
    "TRAUMA_INCIDENT",
    "RESPIRATORY_DISTRESS",
    "UNCONSCIOUS_PERSON",
    "OTHER"
  ],
  SHARED: [
    "MUTUAL_AID",
    "COMMUNITY_ASSIST",
    "OTHER"
  ]
};

export const VIC_LOCATIONS = {
  MELBOURNE_CBD: [
    "Bourke Street Mall",
    "Federation Square",
    "Flinders Street Station",
    "Southern Cross Station",
    "Queen Victoria Market",
    "Collins Street",
    "Swanston Street",
    "Little Bourke Street",
  ],
  INNER_SUBURBS: [
    "Carlton",
    "Fitzroy",
    "Collingwood",
    "Richmond",
    "South Melbourne",
    "Port Melbourne",
    "North Melbourne",
    "Kensington",
  ],
  EASTERN_SUBURBS: [
    "Box Hill",
    "Doncaster",
    "Ringwood",
    "Glen Waverley",
    "Blackburn",
    "Mitcham",
    "Nunawading",
  ],
  WESTERN_SUBURBS: [
    "Footscray",
    "Sunshine",
    "Werribee",
    "Hoppers Crossing",
    "Point Cook",
    "Altona",
    "Newport",
  ],
  NORTHERN_SUBURBS: [
    "Preston",
    "Reservoir",
    "Epping",
    "Mill Park",
    "Broadmeadows",
    "Coburg",
    "Fawkner",
  ],
  SOUTHEASTERN_SUBURBS: [
    "Dandenong",
    "Frankston",
    "Cranbourne",
    "Berwick",
    "Narre Warren",
    "Pakenham",
  ],
};

export const VIC_POLICE_DIVISIONS = [
  { code: "North West Metro", area: "Broadmeadows, Craigieburn, Greenvale" },
  { code: "Western Metro", area: "Footscray, Sunshine, Werribee" },
  { code: "Southern Metro", area: "St Kilda, Port Melbourne, Prahran" },
  { code: "Eastern Metro", area: "Box Hill, Ringwood, Knox" },
  { code: "North East Metro", area: "Heidelberg, Eltham, Whittlesea" },
];

export const VIC_POLICE_RANKS = [
  "Probationary Constable",
  "Constable",
  "Senior Constable",
  "Leading Senior Constable",
  "Sergeant",
  "Senior Sergeant",
  "Inspector",
  "Superintendent",
  "Chief Superintendent",
  "Assistant Commissioner",
  "Deputy Commissioner",
  "Chief Commissioner",
];

export const VIC_UNIT_TYPES = {
  POLICE: [
    "Divvy Van", // Divisional Van
    "Solo", // Solo motorcycle officer
    "Highway Patrol",
    "PSU", // Public Order Response Unit
    "SOG", // Special Operations Group
    "Airwing",
    "Water Police",
    "Mounted Branch",
    "Dog Squad",
  ],
  FIRE: [
    "Pumper",
    "Aerial",
    "Tanker",
    "Rescue",
    "HazMat",
    "Command",
  ],
  AMBULANCE: [
    "MICA", // Mobile Intensive Care Ambulance
    "ALS", // Advanced Life Support
    "BLS", // Basic Life Support
    "SPRINT", // Special Purpose Response and Intervention Team
    "Air Ambulance",
  ]
};

// Australian-specific formats
export const AUS_FORMATS = {
  dateFormat: "DD/MM/YYYY",
  timeFormat: "HH:mm",
  speedUnit: "km/h",
  distanceUnit: "km",
  postcodePattern: /^\d{4}$/,
  phonePattern: /^(\+61|0)[2-478]\d{8}$/, // Australian phone format
};

// Victoria Police station callsigns
export const VIC_STATIONS = {
  CBD: "Melbourne East",
  NORTH: "Broadmeadows",
  WEST: "Footscray",
  EAST: "Box Hill",
  SOUTH: "St Kilda",
  SOUTHEAST: "Dandenong",
};

export function formatVicAddress(address: string, suburb: string, postcode: string): string {
  return `${address}, ${suburb} VIC ${postcode}`;
}

export function getCallTypeDisplay(type: string): string {
  return type
    .replace(/_/g, " ")
    .split(" ")
    .map(word => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}
