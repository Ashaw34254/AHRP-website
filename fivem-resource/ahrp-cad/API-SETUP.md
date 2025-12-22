# AHRP CAD - API Integration Setup

This guide explains how to set up the API endpoints on your Next.js CAD system to work with the FiveM resource.

---

## 🔑 API Authentication

### Step 1: Generate API Key

Add to `.env.local`:
```env
FIVEM_API_KEY=your-secure-random-api-key-here
```

Generate a secure key:
```bash
# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Or use online generator
# https://generate-random.org/api-key-generator
```

### Step 2: Create Middleware

Create `lib/api-auth.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function verifyFiveMAPIKey(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false;
  }
  
  const token = authHeader.substring(7);
  const validKey = process.env.FIVEM_API_KEY;
  
  return token === validKey;
}

export function withFiveMAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    if (!verifyFiveMAPIKey(request)) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    return handler(request, context);
  };
}
```

---

## 🔌 Required API Endpoints

### Units API

#### GET /api/cad/units
Get all units or filter by playerId:

```typescript
// app/api/cad/units/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withFiveMAuth } from '@/lib/api-auth';
import prisma from '@/lib/prisma';

async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const playerId = searchParams.get('playerId');
  
  if (playerId) {
    // Find unit by player ID
    const units = await prisma.unit.findMany({
      where: {
        // Assuming you store playerId in unit or via officers
        officers: {
          some: {
            user: {
              discordId: playerId // Or whatever identifier you use
            }
          }
        }
      },
      include: {
        officers: true,
        call: true
      }
    });
    
    return NextResponse.json(units);
  }
  
  // Get all active units
  const units = await prisma.unit.findMany({
    where: {
      status: {
        not: 'OUT_OF_SERVICE'
      }
    },
    include: {
      officers: true,
      call: true
    }
  });
  
  return NextResponse.json(units);
}

export { withFiveMAuth(GET) as GET };
```

#### POST /api/cad/units
Create a new unit:

```typescript
async function POST(request: NextRequest) {
  const body = await request.json();
  
  const unit = await prisma.unit.create({
    data: {
      callsign: body.callsign,
      department: body.department,
      status: body.status || 'AVAILABLE',
      // Add playerId tracking if needed
    }
  });
  
  return NextResponse.json(unit, { status: 201 });
}

export { withFiveMAuth(POST) as POST };
```

#### PATCH /api/cad/units/[id]
Update unit status and location:

```typescript
// app/api/cad/units/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withFiveMAuth } from '@/lib/api-auth';
import prisma from '@/lib/prisma';

async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();
  
  const unit = await prisma.unit.update({
    where: { id: params.id },
    data: {
      status: body.status,
      location: body.location,
      latitude: body.latitude,
      longitude: body.longitude
    }
  });
  
  return NextResponse.json(unit);
}

export { withFiveMAuth(PATCH) as PATCH };
```

---

### Calls API

#### GET /api/cad/calls
Get active calls with filtering:

```typescript
// Already exists in your system
// Just ensure it accepts status query param:
// ?status=PENDING,ACTIVE,DISPATCHED
```

#### GET /api/cad/calls/[id]
Get single call details:

```typescript
// app/api/cad/calls/[id]/route.ts
async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const call = await prisma.call.findUnique({
    where: { id: params.id },
    include: {
      units: {
        include: {
          officers: true
        }
      },
      notes: true
    }
  });
  
  if (!call) {
    return NextResponse.json(
      { error: 'Call not found' },
      { status: 404 }
    );
  }
  
  return NextResponse.json(call);
}

export { withFiveMAuth(GET) as GET };
```

#### POST /api/cad/calls
Create new call (already exists):

```typescript
// Your existing endpoint should work
// Just ensure it accepts:
// - type, priority, location, latitude, longitude
// - description, reporterName, reporterContact
```

#### POST /api/cad/calls/[id]/assign
Assign unit to call:

```typescript
// app/api/cad/calls/[id]/assign/route.ts
async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { unitId } = await request.json();
  
  // Update call
  const call = await prisma.call.update({
    where: { id: params.id },
    data: {
      status: 'DISPATCHED'
    }
  });
  
  // Assign unit to call
  await prisma.unit.update({
    where: { id: unitId },
    data: {
      callId: params.id,
      status: 'ENROUTE'
    }
  });
  
  return NextResponse.json({ success: true });
}

export { withFiveMAuth(POST) as POST };
```

---

### Civil Records API

#### GET /api/cad/civil/citizen
Search citizens:

```typescript
// app/api/cad/civil/citizen/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { withFiveMAuth } from '@/lib/api-auth';
import prisma from '@/lib/prisma';

async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');
  
  if (!query) {
    return NextResponse.json({ error: 'Query required' }, { status: 400 });
  }
  
  const citizens = await prisma.citizen.findMany({
    where: {
      OR: [
        { firstName: { contains: query, mode: 'insensitive' } },
        { lastName: { contains: query, mode: 'insensitive' } },
        { stateId: { contains: query, mode: 'insensitive' } }
      ]
    },
    include: {
      warrants: true,
      licenses: true
    },
    take: 10
  });
  
  return NextResponse.json(citizens);
}

export { withFiveMAuth(GET) as GET };
```

#### GET /api/cad/civil/vehicle
Search vehicles:

```typescript
// app/api/cad/civil/vehicle/route.ts
async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const plate = searchParams.get('plate');
  
  if (!plate) {
    return NextResponse.json({ error: 'Plate required' }, { status: 400 });
  }
  
  const vehicle = await prisma.vehicle.findFirst({
    where: {
      plate: { equals: plate, mode: 'insensitive' }
    },
    include: {
      owner: true
    }
  });
  
  if (!vehicle) {
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
  }
  
  return NextResponse.json(vehicle);
}

export { withFiveMAuth(GET) as GET };
```

---

## 🗃️ Database Schema Updates

### Add FiveM Player Tracking

Update your Prisma schema:

```prisma
model Unit {
  id          String   @id @default(cuid())
  callsign    String   @unique
  department  String
  status      String   @default("OUT_OF_SERVICE")
  
  // FiveM integration
  playerId    String?  // FiveM player identifier
  playerName  String?  // FiveM player name
  
  // Rest of your schema...
}
```

Run migration:
```bash
npx prisma migrate dev --name add_fivem_player_tracking
```

---

## 🔐 CORS Configuration

If your FiveM server and CAD website are on different domains, configure CORS:

```typescript
// middleware.ts or next.config.js
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Allow FiveM server to access API
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  
  return response;
}

export const config = {
  matcher: '/api/cad/:path*'
};
```

---

## 🧪 Testing API Endpoints

Use curl or Postman to test:

```bash
# Test authentication
curl -H "Authorization: Bearer your-api-key" \
  http://localhost:3000/api/cad/units

# Create unit
curl -X POST \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"callsign":"A-12","department":"POLICE"}' \
  http://localhost:3000/api/cad/units

# Update unit status
curl -X PATCH \
  -H "Authorization: Bearer your-api-key" \
  -H "Content-Type: application/json" \
  -d '{"status":"BUSY"}' \
  http://localhost:3000/api/cad/units/{unit-id}

# Search citizen
curl -H "Authorization: Bearer your-api-key" \
  "http://localhost:3000/api/cad/civil/citizen?q=John"
```

---

## 📊 Rate Limiting (Recommended)

Protect your API with rate limiting:

```typescript
// lib/rate-limit.ts
import { NextRequest } from 'next/server';

const rateLimit = new Map<string, { count: number; resetAt: number }>();

export function checkRateLimit(request: NextRequest, limit: number = 100): boolean {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const now = Date.now();
  const windowMs = 60000; // 1 minute
  
  const record = rateLimit.get(ip);
  
  if (!record || now > record.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + windowMs });
    return true;
  }
  
  if (record.count >= limit) {
    return false;
  }
  
  record.count++;
  return true;
}
```

Apply to API routes:

```typescript
export async function GET(request: NextRequest) {
  if (!checkRateLimit(request)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded' },
      { status: 429 }
    );
  }
  
  // Handle request...
}
```

---

## ✅ Checklist

- [ ] Generate secure API key
- [ ] Add API key to `.env.local`
- [ ] Create `lib/api-auth.ts`
- [ ] Apply auth middleware to all CAD API routes
- [ ] Test authentication with curl
- [ ] Update database schema for FiveM tracking
- [ ] Configure CORS if needed
- [ ] Set up rate limiting
- [ ] Update FiveM resource config with API key
- [ ] Test full integration

---

## 🐛 Debugging

Enable API logging:

```typescript
// Add to api routes
console.log('[CAD API]', request.method, request.url);
console.log('[CAD API] Body:', await request.json());
```

Check Next.js logs:
```bash
npm run dev
# Watch console for API requests
```

---

**Integration Complete! Your FiveM resource can now communicate with the CAD system. 🎉**
