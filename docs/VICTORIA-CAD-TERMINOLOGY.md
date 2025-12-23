# Victoria Police & Australian Emergency Services - CAD Terminology

## 🇦🇺 Victorian CAD System Configuration

This document outlines the Australian/Victorian-specific terminology, locations, and configurations implemented in the CAD system.

### Victoria Police Structure

**Divisions:**
- North West Metro Region (Broadmeadows, Craigieburn)
- Western Metro Region (Footscray, Sunshine, Werribee)
- Southern Metro Region (St Kilda, Port Melbourne, Prahran)
- Eastern Metro Region (Box Hill, Ringwood, Knox)
- North East Metro Region (Heidelberg, Eltham, Whittlesea)

**Unit Callsigns:**
- `D###` - Divisional Van (Divvy Van)
- `S###` - Solo motorcycle officer
- `HWP##` - Highway Patrol
- `PSU##` - Public Order Response Unit
- `SOG##` - Special Operations Group

**Ranks (in order):**
1. Probationary Constable
2. Constable
3. Senior Constable
4. Leading Senior Constable
5. Sergeant
6. Senior Sergeant
7. Inspector
8. Superintendent
9. Chief Superintendent
10. Assistant Commissioner
11. Deputy Commissioner
12. Chief Commissioner

### Fire Services (MFB & CFA)

**Melbourne Fire Brigade Units:**
- `MFB-P#` - Pumper
- `MFB-A#` - Aerial
- `MFB-T#` - Tanker
- `MFB-R#` - Rescue

**Country Fire Authority:**
- `CFA-###` - Volunteer brigades

### Ambulance Victoria

**Unit Types:**
- `MICA-#` - Mobile Intensive Care Ambulance (Advanced paramedics)
- `ALS-#` - Advanced Life Support
- `BLS-#` - Basic Life Support
- `SPRINT-#` - Special Purpose Response and Intervention Team
- `AirAmb-#` - Air Ambulance

**Ranks:**
- Graduate Ambulance Paramedic
- Qualified Ambulance Paramedic
- MICA Paramedic (Advanced Care)
- Team Manager
- Area Manager

### Victorian Call Types

#### Police
- `RBT_STOP` - Random Breath Test
- `TRAFFIC_OFFENCE` - Traffic violation
- `HOON_DRIVING` - Hooning/illegal street racing
- `FAMILY_VIOLENCE` - Domestic/family violence incident
- `AGGRAVATED_ASSAULT` - Serious assault
- `ARMED_ROBBERY` - Armed hold-up
- `BURGLARY` - Break and enter
- `THEFT_FROM_VEHICLE` - Car break-in
- `DRUG_OFFENCE` - Drug-related crime
- `MISSING_PERSON` - Missing person report
- `PUBLIC_ORDER` - Public disturbance
- `WARRANT_EXECUTION` - Serving warrant
- `SUSPICIOUS_BEHAVIOUR` - Suspicious activity

#### Fire/Emergency
- `STRUCTURE_FIRE` - Building fire
- `CAR_FIRE` - Vehicle fire
- `BUSHFIRE` - Wildfire/scrub fire
- `HAZMAT_INCIDENT` - Hazardous materials
- `RESCUE_OPERATION` - Technical rescue
- `FALSE_ALARM` - False alarm activation

#### Ambulance
- `MVA` - Motor Vehicle Accident
- `CARDIAC_ARREST` - Cardiac arrest
- `RESPIRATORY_DISTRESS` - Breathing difficulty
- `TRAUMA_INCIDENT` - Serious injury
- `UNCONSCIOUS_PERSON` - Person unconscious
- `OVERDOSE` - Drug overdose

### Victorian Locations (Sample)

#### Melbourne CBD (Postcode: 3000)
- Federation Square
- Flinders Street Station
- Southern Cross Station
- Bourke Street Mall
- Collins Street
- Queen Victoria Market

#### Inner Suburbs
- **Carlton (3053)** - Lygon Street, University of Melbourne
- **Fitzroy (3065)** - Brunswick Street, Smith Street
- **Collingwood (3066)** - Smith Street, Victoria Park
- **Richmond (3121)** - Bridge Road, Swan Street
- **St Kilda (3182)** - Fitzroy Street, Acland Street
- **Port Melbourne (3207)** - Beach Street, Station Pier

#### Eastern Suburbs
- **Box Hill (3128)** - Box Hill Central
- **Ringwood (3134)** - Eastland Shopping Centre
- **Glen Waverley (3150)** - Glen Waverley Village
- **Doncaster (3108)** - Westfield Doncaster

#### Western Suburbs
- **Footscray (3011)** - Nicholson Street Mall
- **Sunshine (3020)** - Hampshire Road
- **Werribee (3030)** - Watton Street
- **Point Cook (3030)** - Sanctuary Lakes

#### Northern Suburbs
- **Preston (3072)** - High Street
- **Reservoir (3073)** - Broadway
- **Broadmeadows (3047)** - Broadmeadows Central
- **Epping (3076)** - Cooper Street

#### Southeastern Suburbs
- **Dandenong (3175)** - Dandenong Plaza
- **Frankston (3199)** - Bayside Shopping Centre
- **Cranbourne (3977)** - Cranbourne Park
- **Narre Warren (3805)** - Fountain Gate

### Australian Formatting

**Phone Numbers:**
- Mobile: `04## ### ###` or `+61 4## ### ###`
- Landline (Melbourne): `03 #### ####` or `+61 3 #### ####`

**Postcodes:**
- 4-digit format (e.g., `3000` for Melbourne CBD)
- Victoria range: `3000-3999`

**Addresses:**
- Format: `[Number] [Street Name], [Suburb] VIC [Postcode]`
- Example: `123 Collins Street, Melbourne VIC 3000`

**Date/Time:**
- Date: `DD/MM/YYYY` (e.g., 24/12/2025)
- Time: 24-hour format `HH:mm` (e.g., 14:30)

**Speed:**
- km/h (kilometres per hour)
- Common limits: 40, 50, 60, 80, 100, 110 km/h

**Emergency Number:**
- `000` (Triple Zero) - Primary emergency number
- `112` - Mobile emergency number (works on locked phones)
- `106` - Text emergency for deaf/hearing impaired

### Victorian Police Terminology

**General:**
- "Divvy Van" - Divisional van (patrol wagon)
- "Solo" - Motorcycle officer
- "Highway" - Highway Patrol
- "Booze Bus" - Mobile RBT unit
- "Hoon" - Illegal street racer/reckless driver
- "Rego" - Vehicle registration
- "Ute" - Utility vehicle (pickup truck)

**Procedures:**
- "VIN Check" - Vehicle Identification Number check
- "LEAP Check" - Law Enforcement Assistance Program database check
- "RBT" - Random Breath Test
- "Code 3" - Lights and sirens response
- "Code 1" - Non-urgent attendance

**Locations:**
- "The City" - Melbourne CBD
- "Out East" - Eastern suburbs
- "Out West" - Western suburbs
- "Down South" - Southern suburbs/Mornington Peninsula

### Implementation Notes

All Victorian-specific configurations are centralized in:
- `/lib/victoria-police-config.ts` - Main configuration file
- Seed data updated with Victorian locations and call types
- CAD forms updated with Australian phone/postcode formats
- Default locations use Melbourne metro area and suburbs

### Future Enhancements

- Regional Victoria support (Geelong, Ballarat, Bendigo)
- VicRoads integration for vehicle checks
- Crime Statistics Victoria (CSV) data
- State Emergency Service (SES) units
- Local Government Areas (LGA) boundaries
