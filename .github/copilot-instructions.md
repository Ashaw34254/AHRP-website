# Aurora Horizon Roleplay - AI Agent Instructions

## Project Overview
Next.js 14+ (App Router) FiveM roleplay community website with Auth.js (NextAuth v5), NextUI components, and Tailwind CSS. Features dual-mode architecture for development and production environments.

**Active Development**: Building integrated CAD (Computer-Aided Dispatch) system inspired by Sonoran CAD for emergency services management (Police, Fire, EMS).

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
- Schema at [prisma/schema.prisma](prisma/schema.prisma)
- Prisma client singleton at [lib/prisma.ts](lib/prisma.ts)
- Sample data seeder at [prisma/seed.ts](prisma/seed.ts)
- **Important**: SQLite doesn't support enums - use string fields with comments documenting valid values
- Run migrations: `npx prisma migrate dev --name <migration_name>`
- Reset database: `npx prisma migrate reset`

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

## Adding New Features
1. **New dashboard page**: Create in `app/dashboard/[name]/page.tsx` using `"use client"`, import `DashboardLayout`
2. **New admin page**: Create in `app/admin/[name]/page.tsx`, import `AdminLayout`, add route to navigation array in AdminLayout
3. **New landing section**: Create `components/[Name]Section.tsx`, import and render in [app/page.tsx](app/page.tsx)
4. **Protected API routes**: Remember dev mode bypasses auth - implement separate dev checks if needed
5. **New CAD component**: Follow naming pattern `CAD[Module][Component].tsx`, use auto-refresh with intervals
6. **New CAD API endpoint**: Follow RESTful structure in `/api/cad/[module]/route.ts`, include Prisma relations

## Important Gotchas
- Path aliases use `@/*` not `~/` (configured in [tsconfig.json](tsconfig.json))
- NextUI requires wrapping in `NextUIProvider` (already in [app/providers.tsx](app/providers.tsx))
- All images/assets use external URLs or CDN links (no `/public` directory assets currently)
- Admin role checking not implemented - all authenticated users can access `/admin` in current state
- SQLite doesn't support real enums - use strings with comment documentation
- CAD components auto-refresh - ensure state management handles rapid updates
