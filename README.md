# Aurora Horizon RP Website

A modern, professional Next.js website for Aurora Horizon RP, a FiveM roleplay community.

## Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Authentication**: Auth.js (NextAuth v5)
- **UI Library**: NextUI
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Animations**: Framer Motion

## Features

- 🎮 Modern gaming aesthetic with dark theme
- 🔐 Auth.js integration with Discord OAuth
- 📱 Fully responsive design
- ♿ Accessible components
- 🎨 Custom branded color scheme
- ⚡ Optimized performance
- 🔍 SEO-friendly
- 🚨 **Complete CAD System** - Computer Aided Dispatch for emergency services
- 🎮 **FiveM Integration** - Full Lua resource for in-game CAD access

## CAD System

This project includes a comprehensive **Computer Aided Dispatch (CAD) system** inspired by Sonoran CAD:

### CAD Features
- ✅ **Dispatch Console** - Real-time call management and unit assignment
- ✅ **Unit Management** - Track active units with status and location
- ✅ **Active Calls** - Create, assign, and manage emergency calls
- ✅ **Civil Records** - Citizen, vehicle, and criminal history databases
- ✅ **Department Dashboards** - Separate views for Police, Fire, and EMS
- ✅ **Call History** - Archived calls with advanced filtering
- ✅ **Real-time Updates** - Auto-refresh every 10 seconds

### FiveM Integration 🎮
Complete FiveM resource for in-game CAD access:
- 📦 **11 Lua scripts** (client + server)
- 🎨 **Modern UI** with HTML/CSS/JS
- 🔄 **Real-time sync** with website
- 🗺️ **GPS tracking** and unit blips
- 🚨 **Panic button** system
- 📡 **API integration** with authentication
- 📚 **Complete documentation** (4 comprehensive guides)

**Documentation:**
- 📚 **[Complete Documentation Index](docs/INDEX.md)** - Navigate all documentation
- 🚨 **[CAD System Guide](docs/CAD-README.md)** - Full CAD documentation
- 🎙️ **[Voice Alerts Guide](docs/VOICE-ALERTS-GUIDE.md)** - Voice system v2.0
- 🎮 **[FiveM Integration](docs/FIVEM-INTEGRATION.md)** - In-game resource setup
- 📊 **[Project Statistics](docs/PROJECT-STATISTICS.md)** - Codebase metrics

**Quick Links:**
- [FiveM Integration Overview](FIVEM-INTEGRATION.md)
- [FiveM Build Summary](FIVEM-BUILD-SUMMARY.md)
- [CAD System Documentation](CAD-README.md)
- [FiveM Resource](fivem-resource/ahrp-cad/)

### CAD Documentation
- [CAD Dispatch System Guide](CAD-DISPATCH-SYSTEM.md)
- [Development Mode Guide](DEV-MODE-GUIDE.md)
- [Final Features Summary](FINAL-5-FEATURES.md)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn or pnpm

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Set up environment variables:

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Required environment variables:
- `AUTH_SECRET`: Generate with `openssl rand -base64 32`
- `AUTH_URL`: Your app URL (http://localhost:3000 for local dev)
- `AUTH_DISCORD_ID`: Your Discord OAuth Client ID
- `AUTH_DISCORD_SECRET`: Your Discord OAuth Client Secret

### Development

Run the development server with Turbopack:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

Build for production:

```bash
npm run build
# or
yarn build
# or
pnpm build
```

### Production

Run the production server:

```bash
npm start
# or
yarn start
# or
pnpm start
```

## Project Structure

```
├── app/
│   ├── api/auth/[...nextauth]/   # Auth.js API routes
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page
│   └── providers.tsx             # Client providers
├── components/
│   ├── AboutSection.tsx
│   ├── CTASection.tsx
│   ├── DepartmentsSection.tsx
│   ├── FeaturesSection.tsx
│   ├── Footer.tsx
│   ├── HeroSection.tsx
│   ├── HowToJoinSection.tsx
│   └── ServerInfoSection.tsx
├── auth.ts                       # Auth.js configuration
├── middleware.ts                 # Next.js middleware
└── tailwind.config.ts           # Tailwind configuration
```

## Customization

### Discord Links

Update Discord invite links in:
- `components/HeroSection.tsx`
- `components/CTASection.tsx`
- `components/Footer.tsx`

### Server Information

Update server stats in:
- `components/ServerInfoSection.tsx`

### Brand Colors

Modify colors in:
- `tailwind.config.ts` (NextUI theme colors)
- `app/globals.css` (CSS variables)

## Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Navigate to OAuth2 settings
4. Add redirect URL: `http://localhost:3000/api/auth/callback/discord`
5. Copy Client ID and Client Secret to `.env.local`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Ensure your platform supports:
- Node.js 18+
- Environment variables
- Next.js build output

## License

© Aurora Horizon Roleplay. All rights reserved.

## Support

Join our [Discord](https://discord.gg/aurorahorizon) for support and community discussion.
