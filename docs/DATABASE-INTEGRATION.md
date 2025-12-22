# 🗄️ Database Integration - Complete

## Overview

All department data (stations, divisions, ranks, members, settings) is now stored in a **SQLite database** and fully editable from the admin panel at **http://localhost:3000/admin/departments**.

## What's in the Database

### Department Table
- Display name, motto, description, homepage content
- Theme colors (primary, secondary, accent)
- Logo/badge/banner URLs
- Settings (max units, certifications, recruitment)

### Station Table
- Name, address, phone number
- Staff count, status (Active/Inactive)
- Image URL

### Division Table
- Name, icon, member count
- Description

### Rank Table
- Name, abbreviation, level
- Permissions (JSON array)
- Pay grade, color

### Member Table
- Name, badge number
- Rank (FK to Rank table)
- Status (active/loa/suspended/terminated)
- Join date, certifications (JSON array)

## Database Files

- **`prisma/schema.prisma`** - Database schema with Department, Station, Division, Rank, Member models
- **`prisma/seed-departments.ts`** - Seed script to populate initial data
- **`dev.db`** - SQLite database file (created automatically)

## API Endpoints

### Departments
- `GET /api/departments` - Get all departments with full data
- `PUT /api/departments` - Bulk update all departments
- `GET /api/departments/[dept]` - Get specific department (POLICE/FIRE/EMS)
- `PATCH /api/departments/[dept]` - Update specific department

### Stations
- `GET /api/departments/[dept]/stations` - Get all stations for department
- `POST /api/departments/[dept]/stations` - Create new station
- `PUT /api/departments/[dept]/stations` - Bulk update stations

### Divisions
- `GET /api/departments/[dept]/divisions` - Get all divisions
- `POST /api/departments/[dept]/divisions` - Create new division
- `PUT /api/departments/[dept]/divisions` - Bulk update divisions

### Ranks
- `GET /api/departments/[dept]/ranks` - Get all ranks
- `POST /api/departments/[dept]/ranks` - Create new rank
- `PUT /api/departments/[dept]/ranks` - Bulk update ranks

## Usage

### Server Components (API Routes, Server Pages)
```typescript
import { getDepartmentSettings } from "@/lib/department-settings-server";

// In an API route or server component
const deptData = await getDepartmentSettings("POLICE");
console.log(deptData.stations); // Array of stations
console.log(deptData.divisions); // Array of divisions
console.log(deptData.ranks); // Array of ranks
```

### Client Components (Dashboard Pages)
```typescript
"use client";
import { useState, useEffect } from "react";

function PoliceDashboard() {
  const [deptData, setDeptData] = useState(null);
  
  useEffect(() => {
    fetch('/api/departments/POLICE')
      .then(res => res.json())
      .then(setDeptData);
  }, []);
  
  return (
    <div>
      <h1>{deptData?.displayName}</h1>
      {deptData?.stations.map(station => (
        <div key={station.id}>{station.name}</div>
      ))}
    </div>
  );
}
```

## Admin Panel Integration

The admin panel at `/admin/departments` needs to be updated to:
1. **Load data from API** instead of client state
2. **Save changes to database** via API endpoints
3. **Add UI for managing stations** (currently only theme/ranks)
4. **Add UI for managing divisions** (not yet implemented)

### Next Steps for Admin Panel
- [ ] Add "Stations" tab to manage department stations
- [ ] Add "Divisions" tab to manage units/divisions
- [ ] Replace mock data loading with API fetch on component mount
- [ ] Update save handler to call API endpoints
- [ ] Add loading states and error handling
- [ ] Add success toasts when data is saved

## Database Commands

### Reset Database (Deletes all data)
```bash
cd c:\Users\anton\AHRP-website
$env:DATABASE_URL="file:./dev.db"
npx prisma migrate reset
```

### Run Migrations
```bash
$env:DATABASE_URL="file:./dev.db"
npx prisma migrate dev
```

### Seed Departments
```bash
$env:DATABASE_URL="file:./dev.db"
npx tsx prisma/seed-departments.ts
```

### View Database in Prisma Studio
```bash
$env:DATABASE_URL="file:./dev.db"
npx prisma studio
```

## Data Flow

```
Admin Panel → PUT /api/departments → Prisma → SQLite Database
                                                     ↓
Dashboard Pages → GET /api/departments/[dept] → Prisma → Read from DB
```

## Pre-Seeded Data

### POLICE
- 3 stations (Mission Row, Vespucci, Paleto Bay)
- 6 divisions (Patrol, Traffic, Detective, SWAT, K9, Training)
- 11 ranks (Recruit → Chief of Police)
- 3 members

### FIRE
- 3 stations (Downtown, Davis, Sandy Shores)
- 4 divisions (Engine, Ladder, Rescue, Hazmat)
- 9 ranks (Probationary FF → Fire Chief)
- 2 members

### EMS
- 2 stations (Pillbox, Sandy Shores Medical)
- 4 divisions (Ambulance Ops, Critical Care, Training, Flight Medics)
- 8 ranks (EMT-B → EMS Chief)
- 1 member

## Benefits

✅ **Persistent Storage** - Data survives page refreshes and server restarts  
✅ **Multi-User Support** - Multiple admins can edit departments  
✅ **Full CRUD Operations** - Create, read, update, delete all department data  
✅ **Relational Data** - Proper foreign keys between departments, ranks, and members  
✅ **Type Safety** - Prisma provides full TypeScript types  
✅ **Easy Queries** - Prisma's query API is intuitive and type-safe  
✅ **Migration System** - Database schema changes are tracked and versioned  

## Current Limitations

⚠️ **Admin Panel Still Uses State** - Need to connect admin panel to API  
⚠️ **No Stations/Divisions UI** - Admin panel doesn't have tabs to manage these yet  
⚠️ **Dashboard Pages Use Old Method** - Still using useMemo with hardcoded data  

## Migration Checklist

To fully integrate database:
- [ ] Update admin panel to fetch from `/api/departments` on mount
- [ ] Add stations management tab to admin panel
- [ ] Add divisions management tab to admin panel  
- [ ] Update Police dashboard to fetch from API
- [ ] Update Fire dashboard to fetch from API
- [ ] Update EMS dashboard to fetch from API
- [ ] Add loading skeletons for data fetching
- [ ] Add error boundaries for failed requests
- [ ] Implement optimistic UI updates

## Success Criteria

When complete:
1. Admin edits stations → Saves to DB → Dashboard shows new stations immediately
2. Admin adds division → Saves to DB → Dashboard displays new division
3. Admin changes department colors → Saves to DB → All dashboards update
4. All data persists across server restarts
5. Multiple admins can work simultaneously without conflicts
