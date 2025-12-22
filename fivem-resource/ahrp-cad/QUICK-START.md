# 🚀 Quick Start Guide - AHRP CAD FiveM Integration

Get your CAD system integrated with FiveM in 15 minutes!

---

## Part 1: Setup the Website API (5 minutes)

### 1. Generate API Key
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Add to `.env.local`
```env
FIVEM_API_KEY=paste-your-generated-key-here
```

### 3. Create Auth Helper
Create `lib/api-auth.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';

export function verifyFiveMAPIKey(request: NextRequest): boolean {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) return false;
  
  const token = authHeader.substring(7);
  return token === process.env.FIVEM_API_KEY;
}

export function withFiveMAuth(handler: Function) {
  return async (request: NextRequest, context: any) => {
    if (!verifyFiveMAPIKey(request)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return handler(request, context);
  };
}
```

### 4. Protect Existing Endpoints
Add to your existing CAD API routes:

```typescript
// app/api/cad/units/route.ts
import { withFiveMAuth } from '@/lib/api-auth';

async function GET(request: NextRequest) {
  // Your existing code...
}

export { withFiveMAuth(GET) as GET };
export { withFiveMAuth(POST) as POST };
```

Do this for:
- `/api/cad/units/route.ts`
- `/api/cad/units/[id]/route.ts`
- `/api/cad/calls/route.ts`
- `/api/cad/calls/[id]/route.ts`

### 5. Test API
```bash
curl -H "Authorization: Bearer your-api-key" \
  http://localhost:3000/api/cad/units
```

✅ **Part 1 Complete!** API is ready.

---

## Part 2: Install FiveM Resource (5 minutes)

### 1. Copy Resource
```bash
# Copy ahrp-cad folder to your FiveM server
cp -r fivem-resource/ahrp-cad /path/to/server/resources/[ahrp]/
```

### 2. Configure Resource
Edit `resources/[ahrp]/ahrp-cad/config.lua`:

```lua
-- REQUIRED: Set your website URL
Config.WebsiteURL = "http://localhost:3000" -- Change in production!

-- REQUIRED: Set your API key (same as in .env.local)
Config.APIKey = "paste-your-api-key-here"

-- OPTIONAL: Configure job names for your framework
Config.Departments = {
    POLICE = {
        jobs = {"police", "sheriff", "state"}, -- Match your job names
    },
    FIRE = {
        jobs = {"fire", "firefighter"},
    },
    EMS = {
        jobs = {"ambulance", "ems", "doctor"},
    }
}
```

### 3. Add to server.cfg
```cfg
ensure ahrp-cad
```

### 4. Restart Server
```bash
restart ahrp-cad
# or
refresh
start ahrp-cad
```

✅ **Part 2 Complete!** Resource installed.

---

## Part 3: Test In-Game (5 minutes)

### 1. Join Server
Connect to your FiveM server

### 2. Set Emergency Job
Depending on your framework:

**ESX:**
```
/setjob [yourname] police 1
```

**QB-Core:**
```
/job police
```

**Standalone:**
Resource will work, but you may need to manually trigger duty

### 3. Go On Duty
```
/duty
```

You should see: **"You are now on duty as A-XXX"**

### 4. Open CAD
Press **F5** or type:
```
/calls
```

CAD interface should appear!

### 5. Test Features

#### Change Status:
```
/status BUSY
```

#### Request Backup:
```
/backup CODE3
```

#### Send Ten Code:
```
/10-4
```

#### Panic Button:
Press **F9** or type:
```
/panic
```

### 6. Check Web Dashboard
Go to your CAD website dashboard:
- You should see your unit appear in the units list
- Location should update automatically
- Status changes should reflect in real-time

✅ **Part 3 Complete!** Everything works!

---

## 🎯 Common Issues & Fixes

### "Failed to go on duty"
**Fix:** Check server console for API errors
- Verify `Config.WebsiteURL` is accessible from server
- Test: `curl http://your-website.com/api/cad/units`
- Check API key matches

### "You must be in emergency services job"
**Fix:** Configure job names in config.lua
```lua
Config.Departments = {
    POLICE = {
        jobs = {"your-police-job-name"},
    }
}
```

### CAD won't open (F5 not working)
**Fix:** 
1. Check you're on duty: `/duty`
2. Try command: `/calls`
3. Check F8 console for errors

### Location not updating
**Fix:** Check console for API errors
- Website must be accessible from FiveM server
- API key must be correct
- Try manual sync: `/cadsync`

---

## 🎮 Quick Command Reference

| Command | What It Does |
|---------|--------------|
| `/duty` | Go on/off duty |
| `/status BUSY` | Change status |
| `/panic` | Emergency alert |
| `/backup` | Request help |
| `/calls` | Open CAD |
| `F5` | Open CAD |
| `F9` | Panic button |

---

## 📋 Checklist

**Website Setup:**
- [ ] Generated API key
- [ ] Added to `.env.local`
- [ ] Created `lib/api-auth.ts`
- [ ] Protected API endpoints
- [ ] Tested API with curl

**FiveM Setup:**
- [ ] Copied resource to server
- [ ] Configured `config.lua` (URL + API key)
- [ ] Set correct job names
- [ ] Added to `server.cfg`
- [ ] Restarted resource

**Testing:**
- [ ] Joined server
- [ ] Set emergency job
- [ ] Went on duty
- [ ] Opened CAD (F5)
- [ ] Changed status
- [ ] Tested panic button
- [ ] Verified on web dashboard

---

## 🔧 Production Deployment

When going live:

### 1. Update URLs
```lua
-- config.lua
Config.WebsiteURL = "https://your-production-domain.com"
```

### 2. HTTPS Required
FiveM requires HTTPS for external API calls in production.

### 3. Secure API Key
- Use strong, unique key
- Never commit to Git
- Rotate periodically

### 4. Configure CORS
If website and FiveM server on different domains, enable CORS in Next.js

---

## 🎉 Success!

Your CAD system is now fully integrated with FiveM!

**Next Steps:**
- Customize keybinds in config
- Add more ten codes
- Configure Discord webhooks for panic alerts
- Set up postal script for better location tracking

**Need Help?**
- Read full documentation: `README.md`
- API setup guide: `API-SETUP.md`
- Check server console for errors

---

**Happy Dispatching! 🚔🚒🚑**
