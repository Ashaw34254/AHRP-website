# Aurora Horizon Roleplay - AI Agent Instructions

## Project Overview
Next.js 14+ (App Router) FiveM roleplay community website with Auth.js (NextAuth v5), NextUI components, and Tailwind CSS. Features dual-mode architecture for development and production environments.

**Production System**: Full-featured CAD (Computer-Aided Dispatch) system inspired by Sonoran CAD for emergency services management (Police, Fire, EMS) with FiveM integration for in-game access.

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────────┐
│                     Next.js App Router                           │
├─────────────────────────────────────────────────────────────────┤
│  Public Routes          │  Protected Routes (middleware bypass)  │
│  /                      │  /dashboard/*  (User features)         │
│  /about                 │  /admin/*      (Admin panel)           │
│  /apply                 │  /civilian/*   (Civilian dashboard)    │
└─────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                    Provider Hierarchy                            │
│  ThemeProvider → SessionProvider → RealtimeProvider →            │
│  VoiceProvider → NextUIProvider → Page Components                │
└─────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│               Core CAD System Components                         │
│  CADDispatchConsole  │  CADActiveCalls  │  CADUnitStatus        │
│  CADCallDetails      │  CADCivilSearch  │  CADCallHistory       │
└─────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│                    API Routes (/app/api/)                        │
│  /cad/*     - CAD system (calls, units, civil, warrants, etc.)  │
│  /fivem/*   - FiveM game integration                             │
│  /characters/* - Character management                            │
│  /auth/*    - NextAuth authentication                            │
└─────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│              Database (Prisma + SQLite)                          │
│  1749-line schema: User, Character, Call, Unit, Officer,        │
│  Citizen, Vehicle, Warrant, Citation, Incident, etc.            │
└─────────────────────────────────────────────────────────────────┘
                                  ↓
┌─────────────────────────────────────────────────────────────────┐
│            FiveM Integration (Lua Resource)                      │
│  11 scripts: Client (6) + Server (5) + Shared utils             │
│  Real-time sync: Location (5s), Status (10s), Panic alerts      │
└─────────────────────────────────────────────────────────────────┘
```

**Key architectural decisions**:
- **Client-side first**: All pages use `"use client"` for NextUI/Framer Motion
- **Polling over WebSocket**: HTTP polling every 5-10s for simplicity
- **Dev mode bypass**: Authentication completely disabled in development
- **Singleton Prisma**: Prevents multiple client instances in dev hot-reload
- **Context providers**: Nested providers for session, theme, voice, realtime

## Critical Development Patterns

### Development Mode Bypass System
**Authentication is completely disabled in development** via environment-based conditionals:
- `middleware.ts` returns early when `NODE_ENV === "development"`
- `auth.ts` uses empty providers array in dev mode
- `lib/dev-session.ts` provides mock session with configurable role (`"admin"` or `"user"`)
- All protected routes accessible without authentication in dev

**To test admin features**: Edit `lib/dev-session.ts` and change `role: "admin"` (no restart needed, hot-reloads)

### Architecture & Routing
- **Public pages**: Landing page sections in `/app/page.tsx` using modular components (`HeroSection`, `AboutSection`, etc.)
- **Protected routes**: `/dashboard/*` for user features, `/admin/*` for admin panel
- **Layout hierarchy**: `RootLayout` → `Providers` → Route-specific layouts (`DashboardLayout`, `AdminLayout`)
- Route protection handled by middleware (dev bypass active)

### Component Patterns
**All pages use `"use client"` directive** - this is a client-side-first architecture:
- NextAuth's `useSession()` hook used throughout for session access
- NextUI components require client rendering
- Framer Motion animations need browser APIs

**Layout components** ([DashboardLayout.tsx](components/DashboardLayout.tsx), [AdminLayout.tsx](components/AdminLayout.tsx)):
- Provide consistent sidebar navigation
- Handle sign-out via `signOut()` from next-auth/react
- Active route highlighting using `usePathname()`
- Collapsible sidebar in AdminLayout

**Landing page sections** (components/*Section.tsx):
- Self-contained, reusable sections
- Accept minimal props (e.g., `session` for conditional rendering)
- Gradient text via `bg-gradient-to-r ... text-transparent bg-clip-text` pattern

### Styling & Design System
**Tailwind + NextUI integration** ([tailwind.config.ts](tailwind.config.ts)):
- Custom color scheme: primary (indigo), secondary (purple), success (green)
- Dark mode enforced: `<html className="dark">` in [app/layout.tsx](app/layout.tsx)
- Gradient backgrounds: `bg-gradient-to-b from-black via-gray-900 to-black`
- Border pattern: `border border-gray-800` for card-like components

**Toast notifications** via Sonner:
- Use `toast` from [lib/toast.ts](lib/toast.ts), not direct Sonner import
- Toaster rendered in [app/providers.tsx](app/providers.tsx)

### Authentication & Session Management
**Production setup** (currently not configured):
- Discord OAuth via NextAuth
- Requires `AUTH_SECRET`, `AUTH_DISCORD_ID`, `AUTH_DISCORD_SECRET` in `.env.local`
- Session refetch disabled in dev (`refetchInterval={isDev ? 0 : 300}`)

**Development workflow**:
- No env vars needed to start development
- Session always available via mock
- Use `useSession()` hook in client components
- Access user via `session?.user`

## Provider Architecture
**Multiple context providers** wrapping the app ([app/providers.tsx](app/providers.tsx)):
- `ThemeProvider` - Custom theme context for light/dark mode (enforced dark by default)
- `SessionProvider` - NextAuth session management
- `RealtimeProvider` - Polling-based real-time updates for CAD (simulates WebSocket)
- `VoiceProvider` - Text-to-speech voice alert system for dispatch notifications
- `NextUIProvider` - NextUI component library context
- `Toaster` - Global toast notification system via Sonner

**Context usage patterns**:
- `useTheme()` for theme switching
- `useSession()` for auth/user data
- `useVoice()` for voice alert configuration and TTS
- Custom hooks like `useCADVoiceAlerts()` wrap voice functionality

## Real-time System Architecture
**Polling-based updates** via [lib/realtime-context.tsx](lib/realtime-context.tsx):
- Polls `/api/cad/calls` every 5 seconds for new calls
- Broadcasts updates to subscribers via event system
- No WebSocket server required - uses HTTP polling
- Subscribe pattern: `subscribe((update) => { ... })` returns cleanup function
- Emit pattern: `emit({ type, data, timestamp })` broadcasts to all subscribers

**CAD components auto-refresh**:
- Dispatch console refreshes every 10 seconds by default
- Unit status board polls for updates
- Use `useEffect` with intervals: `setInterval(() => fetchData(), 10000)`
- Clean up intervals in return: `return () => clearInterval(intervalId)`

## Common Commands
```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm start            # Run production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with sample CAD data
npm run db:studio    # Open Prisma Studio GUI

# Windows batch scripts
restart-dev.bat      # Kill and restart dev server
clean-restart.bat    # Clean install and restart
kill-dev.bat         # Kill dev server process
```

## Database & Prisma
- Using Prisma 5 ORM with SQLite (dev.db) for local development
- Schema at [prisma/schema.prisma](prisma/schema.prisma) - **1749 lines, comprehensive CAD schema**
- Prisma client singleton at [lib/prisma.ts](lib/prisma.ts) - prevents multiple instances in dev
- Sample data seeder at [prisma/seed.ts](prisma/seed.ts)
- **Important**: SQLite doesn't support enums - use string fields with comments documenting valid values
- Run migrations: `npx prisma migrate dev --name <migration_name>`
- Reset database: `npx prisma migrate reset`

**Key database models**:
- `User` - Auth + CAD user profiles
- `Character` - Detailed character system (physical appearance, IDs, employment, medical records)
- `Call` - Emergency calls with priority, status, type, location
- `Unit` - Emergency units (Police/Fire/EMS) with callsign, status, location
- `Officer` - Personnel records linked to units and users
- `Citizen` - Civil records with warrants, licenses, criminal history
- `Vehicle` - Vehicle registrations with plates, ownership, stolen flags
- `Warrant`, `Citation`, `TrafficStop`, `Incident` - Law enforcement records

**Prisma query patterns**:
```typescript
// Always include relations needed by UI
const calls = await prisma.call.findMany({
  include: {
    units: true,
    createdBy: { select: { name: true, email: true } }
  }
});

// Use where clause for filtering
where: {
  status: { in: ["PENDING", "ACTIVE"] },
  department: department
}
```

## Key Files Reference
- [auth.ts](auth.ts) - NextAuth config with dev bypass
- [middleware.ts](middleware.ts) - Route protection (dev disabled)
- [lib/dev-session.ts](lib/dev-session.ts) - Mock session for development
- [app/providers.tsx](app/providers.tsx) - NextUI + SessionProvider + Toaster setup
- [components/DashboardLayout.tsx](components/DashboardLayout.tsx) - User dashboard chrome
- [components/AdminLayout.tsx](components/AdminLayout.tsx) - Admin panel chrome

## Adding New Features
1. **New dashboard page**: Create in `app/dashboard/[name]/page.tsx` using `"use client"`, import `DashboardLayout`
2. **New admin page**: Create in `app/admin/[name]/page.tsx`, import `AdminLayout`, add route to navigation array in AdminLayout
3. **New landing section**: Create `components/[Name]Section.tsx`, import and render in [app/page.tsx](app/page.tsx)
4. **Protected API routes**: Remember dev mode bypasses auth - implement separate dev checks if needed

## CAD System Architecture (In Development)

### Overview
Building a Computer-Aided Dispatch system similar to Sonoran CAD for managing emergency services operations (Police, Fire, EMS).

### Planned Features
- **Dispatch Console**: Real-time call management and unit assignment
- **Unit Management**: Track active units, status, and availability
- **Active Calls**: Create, assign, and manage emergency calls
- **Civil Records**: Citizen, vehicle, and criminal history databases
- **Department Dashboards**: Separate views for Police, Fire, and EMS
- **Real-time Updates**: WebSocket or polling for live status changes

### Technical Stack
- **Frontend**: Client-side dashboard pages under `/dashboard/police`, `/dashboard/fire`, `/dashboard/ems`
- **Database**: Prisma ORM with PostgreSQL (SQLite for dev/demo)
- **API Routes**: Next.js API routes in `/app/api/cad/*`
- **State Management**: React hooks + direct API calls (consider Zustand for complex state)
- **Real-time**: Polling-based updates (upgrade to WebSocket later if needed)

### Core Modules
1. **Dispatch Console**: Call management, assignment, and tracking
2. **Unit Management**: Active units, status, availability
3. **Active Calls**: Emergency call CRUD operations
4. **Civil Records**: Citizen, vehicle, and criminal history databases
5. **Department Dashboards**: Separate Police/Fire/EMS views

### Database Schema (Prisma)
Key models to implement:
- `Call`: Emergency calls with priority, location, type, status
- `Unit`: Emergency units with callsign, status, department
- `Citizen`: Person records with warrants, licenses
- `Vehicle`: Vehicle registrations with plates, ownership
- `Officer`: LEO/Fire/EMS personnel linked to units

### Integration Points
- Extend [components/DashboardLayout.tsx](components/DashboardLayout.tsx) navigation with Police/Fire/EMS links
- Role-based access: Check `session.user.role` and `session.user.departments`
- Mock CAD data in [lib/dev-session.ts](lib/dev-session.ts) for development
- API routes follow pattern: `/api/cad/[module]/[action]`

### CAD-Specific Patterns
- **Component naming**: `CAD[Module][Component].tsx` (e.g., `CADDispatchConsole.tsx`)
- **API endpoints**: RESTful structure with proper HTTP methods
- **Status updates**: Polling every 5-10s for active calls/units
- **Desktop-first UI**: Multi-panel layouts optimized for dispatch operations

### CAD API Examples
**Core Endpoints:**
- **GET /api/cad/units** - Fetch all units with officers and assigned calls
- **POST /api/cad/units** - Create new unit (callsign, department, status, location)
- **PATCH /api/cad/units/[id]** - Update unit status and location
- **GET /api/cad/calls** - Fetch calls with filtering (status, type, priority, search, dateRange)
- **POST /api/cad/calls** - Create new call (auto-generates call number)
- **GET /api/cad/calls/[id]** - Get single call with full details
- **PATCH /api/cad/calls/[id]** - Update call status, priority, or other fields
- **POST /api/cad/calls/[id]/assign** - Assign unit to call
- **DELETE /api/cad/calls/[id]/assign** - Unassign unit from call
- **POST /api/cad/calls/[id]/notes** - Add note to call
- **GET /api/cad/civil/citizen?q={query}** - Search citizen by name or State ID
- **GET /api/cad/civil/vehicle?plate={plate}** - Search vehicle by license plate

**Query Parameters for GET /api/cad/calls:**
- `status` - Comma-separated list (e.g., "PENDING,ACTIVE" or "CLOSED,CANCELLED")
- `type` - Filter by call type
- `priority` - Filter by priority level
- `search` - Search call number or location
- `days` - Date range in days (e.g., "7" for last 7 days)

### CAD Components (Reusable Modules)
Located in `components/CAD*.tsx`:
- **CADDispatchConsole** - Main dispatcher interface with call queue, unit assignment, and quick dispatch actions
- **CADActiveCalls** - Real-time active calls list with auto-refresh, click to view details
- **CADUnitStatus** - Unit status board with officer assignments and inline status updates
- **CADNewCallForm** - Create new emergency calls
- **CADCivilSearch** - Search citizens and vehicles with warrant/stolen flags
- **CADCallDetails** - Full call details modal with status/priority updates, unit assignment, and notes
- **CADCallHistory** - Archived call viewer with advanced filtering
- **QuickStatusUpdate** - Inline unit status dropdown with color-coded statuses

### CAD Dashboard Pages
Integrated CAD interfaces at:
- [app/dashboard/police/cad/page.tsx](app/dashboard/police/cad/page.tsx) - Police CAD interface
- [app/dashboard/fire/cad/page.tsx](app/dashboard/fire/cad/page.tsx) - Fire Department CAD
- [app/dashboard/ems/cad/page.tsx](app/dashboard/ems/cad/page.tsx) - EMS CAD interface
- All use 5-tab interface: **Dispatch Console**, Active Calls, Unit Status, Civil Records, Call History

### CAD Features Implemented
✅ **Dispatch Console**: Unified view with pending/active call queues, available/busy units, multi-unit dispatch  
✅ **Call Management**: Create, view, update status/priority, assign units, close calls  
✅ **Unit Management**: View units, update status inline, see assigned calls  
✅ **Call Notes**: Add timestamped notes to active calls  
✅ **Call History**: Search archived calls with filters (type, priority, date range, search)  
✅ **Civil Records**: Search citizens and vehicles with flags (warrants, stolen)  
✅ **Real-time Updates**: Auto-refresh every 10 seconds (polling-based)  
✅ **Department Filtering**: Filter views by POLICE, FIRE, EMS  
✅ **Status Color Coding**: Visual indicators for priorities and statuses  
✅ **Quick Dispatch**: One-click unit assignment from dispatch console

## FiveM Integration 🎮
**Complete FiveM resource** in `fivem-resource/ahrp-cad/`:
- **11 Lua scripts** - 6 client-side, 5 server-side, plus shared utilities
- **Resource structure**: `fxmanifest.lua`, `config.lua`, `client/`, `server/`, `html/` (NUI interface)
- **Real-time sync**: Location updates every 5s, status polling every 10s
- **Commands**: `/duty`, `/status`, `/panic`, `/backup`, `/calls`, `/callsign`, ten-codes
- **Keybinds**: F5 (CAD interface), F9 (panic button) - customizable
- **Features**: Unit blips, panic alerts, civil record search, backup requests, traffic stop logging
- **Framework support**: Auto-detects ESX, QB-Core, or standalone mode
- **API integration**: Uses website API endpoints with authentication

**Documentation**:
- [FiveM Integration Guide](docs/FIVEM-INTEGRATION.md) - Complete overview
- [API Setup](fivem-resource/ahrp-cad/API-SETUP.md) - API configuration
- [Quick Start](fivem-resource/ahrp-cad/QUICK-START.md) - 15-minute setup

**Integration points**:
- Web API endpoints in `/app/api/fivem/*` accept FiveM server requests
- Authentication via API keys in config
- Location sync updates Unit table in database
- NUI opens actual website URL in iframe (no duplicate UI)

## Voice Alert System
**Advanced TTS (Text-to-Speech) for CAD notifications** via [lib/voice-context.tsx](lib/voice-context.tsx):
- **Providers**: Web Speech API (default), Google, Azure, ElevenLabs
- **Voice profiles**: Different voices for call types (dispatch, medical, admin)
- **Alert types**: New calls, BOLO hits, panic alerts, status changes, backup requests
- **Smart features**: Priority scaling, volume fade in/out, queue management
- **Sound effects**: Emergency tones with volume control
- **Keyboard shortcuts**: Toggle mute, skip current, test voice, clear queue
- **Department-specific**: Override settings per POLICE/FIRE/EMS
- **Analytics**: Alert history logging and performance tracking

**Hook usage pattern**:
```typescript
import { useCADVoiceAlerts } from "@/lib/use-voice-alerts";

// In CAD components
const { announceCall, announceStatusChange } = useCADVoiceAlerts();

// Announce new call
announceCall(call, { priority: "HIGH", department: "POLICE" });

// Announce status change
announceStatusChange("Unit A-12 is now 10-8");
```

**Configuration storage**: LocalStorage with `voiceConfig` key, persists across sessions

## Character System
**Detailed character profiles** for roleplay immersion:
- **Physical appearance**: Height, weight, eye/hair color, build, distinguishing features
- **Identification**: State ID (auto-generated), blood type, license status, firearm permit
- **Medical**: Allergies, chronic conditions, organ donor status
- **Employment**: Occupation, department (POLICE/FIRE/EMS/CIVILIAN), rank
- **Background**: Place of birth, nationality, education, backstory (rich text)
- **Personality**: JSON-stored traits and skills system
- **Approval workflow**: `isApproved` flag for admin review

**Key fields**:
```typescript
interface Character {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  stateId: string; // Auto-generated
  department: "POLICE" | "FIRE" | "EMS" | "CIVILIAN";
  licenseStatus: "NONE" | "VALID" | "SUSPENDED" | "REVOKED";
  firearmPermit: boolean;
  backstory: string; // Rich text HTML
  personalityTraits: string; // JSON array
  skills: string; // JSON object {skill: level}
}
```

## API Design Patterns
**RESTful structure** in `/app/api/cad/`:
- Organized by module: `calls/`, `units/`, `civil/`, `officers/`, etc.
- HTTP methods: GET (fetch), POST (create), PATCH (update), DELETE (remove)
- Dynamic routes: `[id]/route.ts` for single resource operations
- Nested actions: `[id]/assign/route.ts`, `[id]/notes/route.ts`

**Query parameter conventions** (see [app/api/cad/calls/route.ts](app/api/cad/calls/route.ts)):
```typescript
// Multiple status filtering - comma-separated
?status=PENDING,ACTIVE,DISPATCHED

// Search across fields
?search=call123

// Date range filtering
?days=7  // Last 7 days

// Type and priority filters
?type=TRAFFIC_STOP&priority=HIGH
```

**Response patterns**:
```typescript
// Success with data
return NextResponse.json({ calls, units });

// Success without data
return NextResponse.json({ success: true });

// Error handling
return NextResponse.json(
  { error: "Failed to fetch calls" },
  { status: 500 }
);
```

**Prisma includes** - always fetch required relations:
```typescript
const calls = await prisma.call.findMany({
  include: {
    units: true,
    createdBy: { select: { name: true, email: true } }
  }
});
```

## Complete API Endpoint Reference

### CAD Modules in `/app/api/cad/`
**Calls Module** (`calls/`):
- `GET /calls` - List calls with filters
- `POST /calls` - Create new call
- `GET /calls/[id]` - Get single call
- `PATCH /calls/[id]` - Update call
- `POST /calls/[id]/assign` - Assign unit
- `DELETE /calls/[id]/assign` - Unassign unit
- `POST /calls/[id]/notes` - Add note

**Units Module** (`units/`):
- `GET /units` - List all units
- `POST /units` - Create unit
- `PATCH /units/[id]` - Update unit status/location
- `GET /units/[id]/history` - Status history

**Civil Records** (`civil/`):
- `GET /civil/citizen?q={query}` - Search citizens
- `GET /civil/vehicle?plate={plate}` - Search vehicles
- `POST /civil/citizen` - Create citizen record
- `POST /civil/vehicle` - Register vehicle

**Officers Module** (`officers/`):
- `GET /officers` - List all officers
- `POST /officers` - Create officer profile
- `PATCH /officers/[id]` - Update officer

**BOLO System** (`bolo/`):
- `GET /bolo` - Active BOLOs
- `POST /bolo` - Create BOLO
- `PATCH /bolo/[id]` - Update BOLO status

**Warrants** (`warrants/`):
- `GET /warrants?citizenId={id}` - Get warrants
- `POST /warrants` - Issue warrant
- `PATCH /warrants/[id]` - Update warrant status

**Incidents** (`incidents/`):
- `GET /incidents` - List incidents
- `POST /incidents` - Create incident report
- `PATCH /incidents/[id]` - Update incident

**Panic System** (`panic/`):
- `POST /panic` - Trigger panic alert
- `GET /panic/active` - Get active panic alerts
- `PATCH /panic/[id]` - Clear panic

**Dispatcher** (`dispatcher/`):
- `POST /dispatcher/chat` - Send dispatcher message
- `GET /dispatcher/log` - Get message history

**Medical Records** (`medical/`):
- `GET /medical/[characterId]` - Get medical history
- `POST /medical` - Add medical record

**Training** (`training/`):
- `GET /training/records` - Training records
- `POST /training` - Log training session

**Shifts** (`shifts/`):
- `POST /shifts/start` - Start shift
- `POST /shifts/end` - End shift
- `GET /shifts/active` - Active shifts

### FiveM API in `/app/api/fivem/`
- `POST /fivem/location` - Update unit location from game
- `GET /fivem/calls` - Get calls for in-game display
- `POST /fivem/status` - Update unit status from game
- `POST /fivem/panic` - Trigger panic from game

### Character API in `/app/api/characters/`
- `GET /characters` - List user's characters
- `POST /characters` - Create character
- `PATCH /characters/[id]` - Update character
- `DELETE /characters/[id]` - Delete character

## Adding New Features
1. **New dashboard page**: Create in `app/dashboard/[name]/page.tsx` using `"use client"`, import `DashboardLayout`
2. **New admin page**: Create in `app/admin/[name]/page.tsx`, import `AdminLayout`, add route to navigation array
3. **New landing section**: Create `components/[Name]Section.tsx`, import in [app/page.tsx](app/page.tsx)
4. **Protected API routes**: Dev mode bypasses auth - implement separate dev checks if needed
5. **New CAD component**: Follow `CAD[Module][Component].tsx` pattern, use auto-refresh
6. **New CAD API endpoint**: Follow RESTful structure in `/api/cad/[module]/route.ts`
7. **New context provider**: Add to [app/providers.tsx](app/providers.tsx) and create hook in `/lib/`

## Developer Tools & Scripts
**Windows batch scripts** in `/scripts/`:
```bash
restart-dev.bat      # Kills Node process on port 3000, runs npm run dev
clean-restart.bat    # npm clean install, prisma generate, npm run dev
kill-dev.bat         # Kills all Node processes on port 3000
```

**Prisma commands**:
```bash
npx prisma studio              # Open database GUI
npx prisma migrate dev         # Create and apply migration
npx prisma migrate reset       # Reset DB and run seeds
npx prisma generate            # Regenerate Prisma client
npx prisma db push             # Push schema without migration
```

**Common development tasks**:
```bash
# Test with different user roles
# Edit lib/dev-session.ts, change role: "admin" or "user"

# Reset database with fresh seed data
npm run db:seed

# Check for TypeScript errors
npx tsc --noEmit

# Format code
npx prettier --write .
```

## Troubleshooting

**Dev server won't start**:
- Check if port 3000 is in use: `netstat -ano | findstr :3000`
- Run `scripts/kill-dev.bat` to kill existing processes
- Delete `.next` folder and restart

**Prisma client out of sync**:
- Run `npx prisma generate` after schema changes
- Restart dev server to load new client

**Authentication issues in dev**:
- Verify `NODE_ENV=development` in environment
- Check [lib/dev-session.ts](lib/dev-session.ts) for mock session
- Auth is intentionally bypassed in dev mode

**CAD components not refreshing**:
- Verify intervals are cleaned up in `useEffect` return
- Check browser console for API errors
- Ensure API endpoints return proper JSON

**Database locked error**:
- Close Prisma Studio if open
- Check for other processes using dev.db
- Restart dev server

## Important Gotchas
- Path aliases use `@/*` not `~/` (configured in [tsconfig.json](tsconfig.json))
- NextUI requires wrapping in `NextUIProvider` (already in [app/providers.tsx](app/providers.tsx))
- All images/assets use external URLs or CDN links (no `/public` directory assets currently)
- Admin role checking not implemented - all authenticated users can access `/admin` in current state
- SQLite doesn't support real enums - use strings with comment documentation
- CAD components auto-refresh - ensure state management handles rapid updates

## Documentation Reference
**Comprehensive guides** in `/docs/`:
- [INDEX.md](docs/INDEX.md) - Complete documentation index
- [CAD-README.md](docs/CAD-README.md) - Full CAD system documentation
- [VOICE-ALERTS-GUIDE.md](docs/VOICE-ALERTS-GUIDE.md) - Voice system v2.0 guide
- [FIVEM-INTEGRATION.md](docs/FIVEM-INTEGRATION.md) - FiveM resource setup
- [DEV-MODE-GUIDE.md](docs/DEV-MODE-GUIDE.md) - Development workflow
- [DATABASE-COMPLETE.md](docs/DATABASE-COMPLETE.md) - Database schema reference
- [PROJECT-STATISTICS.md](docs/PROJECT-STATISTICS.md) - Codebase metrics

## Key Components Reference
**Reusable CAD components** in `/components/`:
- `CADDispatchConsole.tsx` - Unified dispatch interface (711 lines)
- `CADActiveCalls.tsx` - Real-time call list with auto-refresh
- `CADUnitStatus.tsx` - Unit status board with inline updates
- `CADCallDetails.tsx` - Modal for call details with assignment
- `CADNewCallForm.tsx` - Form for creating emergency calls
- `CADCivilSearch.tsx` - Search interface for citizens/vehicles
- `CADCallHistory.tsx` - Archived calls with filtering
- `QuickStatusUpdate.tsx` - Inline status dropdown component
- `EnhancedVoiceWidget.tsx` - Voice alert control widget
- `VoiceSettings.tsx` - Voice configuration interface
- `PanicAlertMonitor.tsx` - Panic button system integration
- `BOLOSystem.tsx` - Be On the Lookout management
- `WarrantManagement.tsx` - Warrant CRUD operations
- `IncidentReports.tsx` - Incident report system

**Layout components**:
- `DashboardLayout.tsx` - User dashboard chrome (410 lines)
- `AdminLayout.tsx` - Admin panel chrome with collapsible sidebar
- `Header.tsx` - Global navigation header
- `Footer.tsx` - Site-wide footer

**Landing page sections**:
- `HeroSection.tsx` - Homepage hero with CTA
- `FeaturesSection.tsx` - Feature showcase grid
- `DepartmentsSection.tsx` - Department information
- `TestimonialsSection.tsx` - Community testimonials
- `FAQSection.tsx` - Frequently asked questions

## Best Practices

### Component Development
- Always use `"use client"` for interactive components
- Fetch data in components via API routes, not direct Prisma calls
- Clean up intervals/subscriptions in `useEffect` return
- Use NextUI components for consistency
- Implement loading states with Skeleton components

### API Development
- Include Prisma relations needed by frontend (`include:`)
- Use proper HTTP status codes (200, 201, 400, 404, 500)
- Validate input data before database operations
- Handle errors gracefully with try/catch
- Return consistent JSON structure

### State Management
- Use React hooks for local state (`useState`, `useEffect`)
- Context providers for global state (session, theme, voice)
- Real-time updates via polling (5-10s intervals)
- LocalStorage for client-side persistence (voice config)

### Performance
- Pagination for large lists (calls, units, history)
- Debounce search inputs to reduce API calls
- Use `select:` in Prisma to limit returned fields
- Cleanup intervals to prevent memory leaks
- Memoize expensive computations with `useMemo`

### Security (Dev Mode)
- Auth bypass only active in development
- API routes should check environment before bypassing auth
- Production requires Discord OAuth configuration
- Mock session provides consistent development experience

## Environment Variables
**Required for production** (`.env.local`):
```bash
# Auth.js Configuration
AUTH_SECRET=your-secret-key-here  # Generate: openssl rand -base64 32
AUTH_URL=http://localhost:3000    # Your app URL

# Discord OAuth (Production only)
AUTH_DISCORD_ID=your-discord-client-id
AUTH_DISCORD_SECRET=your-discord-client-secret

# Database (auto-configured)
DATABASE_URL="file:./dev.db"
```

**Development notes**:
- No env vars required for local development
- Discord OAuth only needed for production
- `AUTH_SECRET` generated automatically in dev mode
- Database URL defaults to SQLite in project root

## Common UI Patterns

### NextUI Modal Pattern
```typescript
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@nextui-org/react";

const { isOpen, onOpen, onClose } = useDisclosure();

// Trigger modal
<Button onPress={onOpen}>Open Modal</Button>

// Modal component
<Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
  <ModalContent>
    <ModalHeader>Title</ModalHeader>
    <ModalBody>Content</ModalBody>
    <ModalFooter>
      <Button onPress={onClose}>Close</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
```

### Framer Motion Animation Pattern
```typescript
import { motion } from "framer-motion";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  Content
</motion.div>
```

**Common animation variants**:
- Fade in: `initial={{ opacity: 0 }}` → `animate={{ opacity: 1 }}`
- Slide up: `initial={{ y: 20 }}` → `animate={{ y: 0 }}`
- Stagger children: Use `staggerChildren` in parent variants

### NextUI Form Pattern
```typescript
import { Input, Select, SelectItem, Textarea } from "@nextui-org/react";

<Input
  label="Field Label"
  placeholder="Enter value"
  value={value}
  onChange={(e) => setValue(e.target.value)}
  isRequired
  errorMessage={error}
/>

<Select
  label="Select Option"
  value={selected}
  onChange={(e) => setSelected(e.target.value)}
>
  <SelectItem key="option1" value="option1">Option 1</SelectItem>
</Select>
```

## Database Seeding
**Seed script** ([prisma/seed.ts](prisma/seed.ts)) creates:
- Test user: `dev@aurorahorizon.local` (admin role)
- 3 Officers: Police (1A-01), Fire (FIRE-1), EMS (EMS-5)
- 3 Units with assigned officers
- 5 Sample calls (various priorities and statuses)
- 3 Citizens with criminal history
- 2 Vehicles (one stolen)
- Sample warrants and citations

**Run seed**: `npm run db:seed` or `npx tsx prisma/seed.ts`

**Reset and reseed**: `npx prisma migrate reset` (destructive - deletes all data)

## Project Structure Deep Dive

### Dashboard Organization
`/app/dashboard/` contains **30+ feature modules**:
- **Department-specific**: `police/`, `fire/`, `ems/` - CAD interfaces for each department
- **Civil operations**: `civil-records/`, `criminal/`, `court/` - Records management
- **Fleet & logistics**: `fleet/`, `vehicles/` - Vehicle management
- **Personnel**: `officers/`, `training/`, `shifts/` - Staff management
- **Incidents**: `incidents/`, `medical/`, `dispatch/` - Emergency operations
- **Communication**: `messages/`, `notifications/`, `mdt/` - Messaging systems
- **Admin tools**: `supervisor/`, `templates/`, `zones/` - Management features

### API Module Organization
`/app/api/` has **26 API modules**:
- `cad/*` - 26 submodules (calls, units, civil, warrants, BOLO, etc.)
- `fivem/*` - Game integration endpoints
- `characters/*` - Character management
- `applications/*` - Application processing
- `auth/*` - NextAuth handlers
- `profile/*` - User profile management
- `dashboard/*` - Dashboard data endpoints

## TypeScript Patterns

### Enum Simulation (SQLite Limitation)
```typescript
// SQLite doesn't support enums - use string types with comments

// In Prisma schema
model Unit {
  status String // AVAILABLE, BUSY, EN_ROUTE, ON_SCENE, OUT_OF_SERVICE
  department String // POLICE, FIRE, EMS
}

// In TypeScript - create type union
type UnitStatus = "AVAILABLE" | "BUSY" | "EN_ROUTE" | "ON_SCENE" | "OUT_OF_SERVICE";
type Department = "POLICE" | "FIRE" | "EMS";
```

### API Response Type Pattern
```typescript
// Consistent API response structure
type APIResponse<T> = {
  data?: T;
  error?: string;
  success?: boolean;
};

// Usage
return NextResponse.json({ data: calls });
return NextResponse.json({ error: "Not found" }, { status: 404 });
```

### JSON Field Pattern
```typescript
// Store complex data in JSON fields
interface Character {
  personalityTraits: string; // JSON.stringify(["Friendly", "Aggressive"])
  skills: string; // JSON.stringify({driving: 75, shooting: 50})
}

// Parse when using
const traits = JSON.parse(character.personalityTraits) as string[];
const skills = JSON.parse(character.skills) as Record<string, number>;
```

## Production Deployment

### Pre-deployment Checklist
1. **Environment Variables** - Set all required vars in production:
   - `AUTH_SECRET` - Generate: `openssl rand -base64 32`
   - `AUTH_DISCORD_ID` & `AUTH_DISCORD_SECRET` - From Discord Developer Portal
   - `DATABASE_URL` - Production database connection string
   - `AUTH_URL` - Your production domain (e.g., `https://yourdomain.com`)

2. **Database Migration**:
```bash
# Switch to production database provider in schema.prisma
# Change: datasource db { provider = "postgresql" }
npx prisma migrate deploy  # Apply migrations to production
npx prisma generate         # Generate production client
```

3. **Remove Dev Bypasses**:
   - Auth middleware will auto-activate in production (`NODE_ENV=production`)
   - Mock session disabled automatically
   - Discord OAuth becomes required

4. **Build Verification**:
```bash
npm run build              # Test production build locally
npm start                  # Run production server locally
# Verify: No TypeScript errors, all routes load, API endpoints work
```

### Deployment Targets

**Vercel (Primary Platform)**:

**Initial Setup**:
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Link project (run in project root)
vercel link

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

**Dashboard Configuration**:
1. Go to vercel.com → Import your GitHub repo
2. **Framework Preset**: Next.js (auto-detected)
3. **Build Command**: `npm run build` (default)
4. **Output Directory**: `.next` (default)
5. **Install Command**: `npm install` (default)

**Environment Variables** (Project Settings → Environment Variables):
```bash
# Production Environment
AUTH_SECRET=<generate-with-openssl-rand-base64-32>
AUTH_URL=https://yourdomain.vercel.app
AUTH_DISCORD_ID=<discord-client-id>
AUTH_DISCORD_SECRET=<discord-client-secret>
DATABASE_URL=<vercel-postgres-url>

# Set for: Production, Preview, Development (select all)
```

**Vercel Postgres Setup**:
1. In your project, go to **Storage** tab
2. Click **Create Database** → **Postgres**
3. Copy connection strings:
   - `POSTGRES_URL` → Use as `DATABASE_URL`
   - `POSTGRES_PRISMA_URL` → For Prisma (optimized)
   - `POSTGRES_URL_NON_POOLING` → For migrations
4. Update `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}
```

**Database Migration on Vercel**:
```bash
# Option 1: Run locally with production DB
DATABASE_URL="<vercel-postgres-url>" npx prisma migrate deploy

# Option 2: Use Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy
vercel env push

# Seed production database
DATABASE_URL="<vercel-postgres-url>" npm run db:seed
```

**Build Settings** (if needed):
- **Node Version**: 18.x (set in package.json)
- **Install Command**: `npm install && npx prisma generate`
- **Build Command**: `prisma generate && next build`

**Custom Domain**:
1. Project Settings → Domains
2. Add your domain (e.g., `aurorahorizon.com`)
3. Update DNS records (Vercel provides instructions)
4. Update `AUTH_URL` environment variable to your custom domain

**Automatic Deployments**:
- **Production**: Pushes to `main` branch auto-deploy
- **Preview**: Pull requests get preview URLs
- **Branch**: Each branch gets its own preview

**Vercel-Specific Optimizations**:
```javascript
// next.config.mjs
export default {
  // Use Edge Runtime for API routes (optional)
  experimental: {
    serverActions: true,
  },
  // Optimize for Vercel
  output: 'standalone', // Smaller Docker images if needed
};
```

**Monitoring in Vercel**:
- **Analytics**: Enable in Project Settings → Analytics
- **Speed Insights**: Automatic with Vercel Pro
- **Logs**: Deployments → Select deployment → Logs
- **Runtime Logs**: Functions → View logs for API routes

**Common Vercel Issues**:

**Issue**: Build fails with Prisma errors
```bash
# Fix: Update build command in Vercel
Build Command: npx prisma generate && next build
```

**Issue**: Environment variables not available in preview
- **Fix**: Select "Preview" environment when adding env vars

**Issue**: Database connection errors
```bash
# Fix: Use POSTGRES_PRISMA_URL instead of POSTGRES_URL
# POSTGRES_PRISMA_URL uses connection pooling
```

**Issue**: Discord OAuth redirect fails
- **Fix**: Add Vercel URLs to Discord OAuth Redirects:
  - `https://yourdomain.vercel.app/api/auth/callback/discord`
  - `https://yourdomain.com/api/auth/callback/discord` (custom domain)

**Issue**: 504 Gateway Timeout on long API calls
- **Fix**: Vercel Serverless functions have 10s limit (60s on Pro)
- Consider background jobs for long operations

**Vercel CLI Commands**:
```bash
vercel                    # Deploy to preview
vercel --prod            # Deploy to production
vercel logs              # View function logs
vercel env ls            # List environment variables
vercel env add           # Add environment variable
vercel env pull          # Pull env vars to .env.local
vercel env rm            # Remove environment variable
vercel domains ls        # List domains
vercel rollback          # Rollback to previous deployment
vercel inspect <url>     # Inspect deployment
```

**Alternative: Railway/Render**:
- Connect GitHub repo
- Set environment variables in dashboard
- PostgreSQL addon recommended
- Auto-deploys on push to main

**Alternative: Docker**:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --production
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Database Migration Strategy

**SQLite → PostgreSQL** (required for production):
1. Update `schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Create migration:
```bash
npx prisma migrate dev --name switch_to_postgres
```

3. Export existing data (if needed):
```bash
# From SQLite
npx prisma db pull --schema=./prisma/schema-sqlite.prisma
# Seed new PostgreSQL database
npm run db:seed
```

**PostgreSQL connection string format**:
```
postgresql://user:password@host:5432/database?sslmode=require
```

### Performance Optimization

**Next.js Config** ([next.config.mjs](next.config.mjs)):
- Already using Turbopack for dev
- Production uses automatic optimizations
- Consider: `output: 'standalone'` for Docker

**Database Optimization**:
```typescript
// Add indexes in schema.prisma for frequent queries
@@index([status, department])  // On Unit model
@@index([callNumber])           // On Call model
@@index([stateId])              // On Character model
```

**Prisma Connection Pooling**:
```typescript
// For high traffic, use Prisma Accelerate or PgBouncer
// Connection pool size: 10-20 for most apps
```

### Security Hardening

1. **Environment Variables** - Never commit `.env.local` to git
2. **CORS Configuration** - Add allowed origins for API routes
3. **Rate Limiting** - Consider implementing for API endpoints:
```typescript
// Example rate limit pattern
const rateLimit = new Map();
const WINDOW = 60000; // 1 minute
const MAX_REQUESTS = 100;
```

4. **SQL Injection** - Prisma handles this, but validate all inputs
5. **XSS Protection** - Next.js escapes by default, avoid `dangerouslySetInnerHTML`

### Monitoring & Logging

**Production Logging**:
```typescript
// Replace console.log with structured logging
import { logger } from '@/lib/logger';

logger.info('Call created', { callId, priority });
logger.error('Database error', { error, context });
```

**Error Tracking** - Consider integrating:
- Sentry for error monitoring
- LogRocket for session replay
- Vercel Analytics for performance

**Health Check Endpoint**:
```typescript
// /app/api/health/route.ts
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: 'healthy' });
  } catch (error) {
    return NextResponse.json({ status: 'unhealthy' }, { status: 503 });
  }
}
```

### Common Production Issues

**Issue**: Auth redirects to localhost
- **Fix**: Update `AUTH_URL` in production environment variables

**Issue**: Prisma Client errors
- **Fix**: Run `npx prisma generate` in build step, check DATABASE_URL

**Issue**: Missing environment variables
- **Fix**: Verify all vars in hosting platform dashboard

**Issue**: CORS errors on API routes
- **Fix**: Add `Access-Control-Allow-Origin` headers if needed

**Issue**: Database connection pooling errors
- **Fix**: Reduce Prisma connection pool size or use connection pooler

**Issue**: Slow API responses
- **Fix**: Add database indexes, implement caching, optimize Prisma queries

### Post-Deployment Verification

```bash
# Test critical flows
curl https://yourdomain.com/api/health
curl https://yourdomain.com/api/cad/calls

# Verify authentication
# - Login works with Discord OAuth
# - Protected routes redirect correctly
# - Session persists across requests

# Check CAD system
# - Create call works
# - Unit assignment functions
# - Real-time polling active
# - Voice alerts configured
```

### Rollback Strategy

**Vercel**: Instant rollback to previous deployment in dashboard

**Database**: Always backup before migrations:
```bash
pg_dump $DATABASE_URL > backup.sql  # PostgreSQL
# Restore: psql $DATABASE_URL < backup.sql
```

**Git**: Tag production releases:
```bash
git tag -a v1.0.0 -m "Production release"
git push origin v1.0.0
```
