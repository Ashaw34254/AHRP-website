# Development Mode Guide

## ✅ Dev Mode is Already Set Up!

Your AHRP website is configured to bypass Auth.js authentication in development mode, allowing you to test all features without setting up Discord OAuth.

## How It Works

### 1. Environment Variable
`.env.local` has `DEV_MODE=true` (not currently used, but available for custom logic)

### 2. Mock Session
`lib/dev-session.ts` provides a mock user session in development:

```typescript
{
  user: {
    id: "dev-user-1",
    name: "Dev User",
    email: "dev@ahrp.local",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=DevUser",
    role: "admin"  // Change to 'user' to test regular user features
  }
}
```

### 3. Middleware
`middleware.ts` completely disables authentication checks when `NODE_ENV === "development"`

### 4. Protected Routes
All protected routes (dashboard, admin) use `getDevSession()` which returns the mock session in development

## Testing Features

### Regular User Features (role: 'user')
1. **Dashboard** - `/dashboard`
   - View profile
   - See stats and activity

2. **Character Manager** - `/dashboard/characters`
   - Create, edit, delete characters
   - View character list

3. **Application Tracker** - `/dashboard/applications`
   - View application status
   - Track progress

4. **Notifications** - `/dashboard/notifications`
   - View notifications
   - Mark as read
   - Filter by type

### Admin Features (role: 'admin')
1. **Admin Dashboard** - `/admin`
   - Overview statistics
   - Recent applications
   - Server activity

2. **Role Management** - `/admin/roles`
   - Manage user roles
   - Edit permissions

3. **Event Calendar** - `/admin/events`
   - Create/edit events
   - Manage participants

### Public Pages
1. **Home** - `/`
   - Hero section with login button
   - About, Departments, Features
   - How to Join, Server Info

2. **Support/Donations** - `/support`
   - Donation tiers
   - FAQ section

## How to Test

### Start Development Server
```bash
npm run dev
```

Server will start on port 3000 (or 3001 if 3000 is occupied)

### Access Protected Routes Directly
Just navigate to any route - no login required:
- http://localhost:3000/dashboard
- http://localhost:3000/dashboard/characters
- http://localhost:3000/admin
- http://localhost:3000/admin/roles

### Switch Between User and Admin
Edit `lib/dev-session.ts` and change the `role` field:
- `role: "user"` - Regular user (dashboard only)
- `role: "admin"` - Admin user (dashboard + admin panel)

Save the file and refresh the browser - changes apply immediately.

## Production Behavior

When you deploy (NODE_ENV === "production"), the dev session is automatically disabled and real Auth.js authentication is required:

1. Middleware will run auth checks
2. Protected routes will redirect to `/auth/signin`
3. `getDevSession()` will use `next-auth` instead of mock data

## Tech Stack
- ✅ Next.js 16.0.10 (updated from 14.2.35)
- ✅ Auth.js (NextAuth v5.0.0-beta.25)
- ✅ NextUI 2.4.8
- ✅ Tailwind CSS 3.4.14
- ✅ Turbopack enabled
- ✅ TypeScript 5.6.3

## Notes
- All mock data is hardcoded (characters, applications, notifications, events)
- Toast notifications work with Sonner
- Error pages (404, 500) are configured
- Dark theme enforced globally
