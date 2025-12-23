# Staff Reports FiveM Integration - Setup Guide

## 📋 Overview
This integration connects your existing FiveM Staff Reports system with your Next.js admin dashboard, allowing you to view and manage reports from both the game and website in real-time.

## ✅ What's Been Created

### 1. **API Proxy Layer** (`/app/api/fivem/staff-reports/`)
- **route.ts** - Main proxy endpoint for fetching and creating reports
- **stats/route.ts** - Statistics endpoint
- Forwards requests to your FiveM server's HTTP API
- No authentication required (direct HTTP connection)

### 2. **Admin Dashboard Page** (`/app/admin/reports/`)
- Full-featured reports management interface
- Real-time statistics cards (Total, Pending, Resolved, Critical)
- Advanced filtering (Status, Priority, Type)
- Search functionality
- Detailed report viewing modal
- Auto-refreshes every 30 seconds

### 3. **StaffReports Component** (`/components/StaffReports.tsx`)
- Complete UI for viewing FiveM staff reports
- Table display with sorting and filtering
- Color-coded status and priority chips
- Type icons (Player, Staff, Bug, Suggestion)
- Report details modal with full information

## 🚀 Setup Instructions

### Step 1: Configure Environment Variables

Add this to your `.env.local` file:

```env
# FiveM Server Configuration
FIVEM_SERVER_URL="http://your-server-ip:30120"
```

**Example:**
- Local development: `http://localhost:30120`
- Production server: `http://your-server-ip:30120` or `https://your-domain.com` if using reverse proxy

### Step 2: Update FiveM Server Configuration

In your `server_web_api.lua`, add your website domain:

```lua
local ALLOWED_ORIGINS = {
    "https://yourwebsite.com",
    "https://www.yourwebsite.com",
    "http://localhost:3000", -- For development
}
```

### Step 3: Ensure FiveM HTTP Endpoint is Active

In your `server.cfg`:
```cfg
endpoint_add_http "0.0.0.0:30120"
```

### Step 4: Restart Services

```bash
# Restart FiveM resource
ensure ahrp_staff_reports

# Restart Next.js dev server
npm run dev
```

## 📍 Access Points

### Admin Dashboard
- Navigate to: `http://localhost:3000/admin/reports`
- Or click "Reports" in the admin sidebar

### Features Available:
1. **Statistics Dashboard**
   - Total reports
   - Pending count
   - Resolved count
   - Critical reports

2. **Filtering**
   - By Status (Pending, Under Review, Resolved, Closed)
   - By Priority (Low, Medium, High, Critical)
   - By Type (Player, Staff, Bug, Suggestion, Other)
   - Text search across all fields

3. **Report Details**
   - Click "View" on any report
   - See full details including:
     - Report ID, Type, Priority, Status
     - Submitter information
     - Reported person
     - Location
     - Full details/description
     - Witnesses
     - Evidence links
     - Assignment information

## 🔧 Troubleshooting

### "Failed to connect to FiveM server"

**Check:**
1. FiveM server is running
2. `FIVEM_SERVER_URL` is correct in `.env.local`
3. Port 30120 is accessible
4. Test directly: `curl http://your-server:30120/api/stats`

### "Failed to load reports: Connection Error"

**Fix:**
1. Verify `FIVEM_SERVER_URL` is correct in `.env.local`
2. Ensure FiveM server HTTP endpoint is enabled
3. Check firewall allows connections on port 30120
4. Test directly: `curl http://your-server:30120/api/reports`

### "CORS Error"

**Fix:**
1. Add your website URL to `ALLOWED_ORIGINS` in `server_web_api.lua`
2. Include both `http://localhost:3000` for dev and production URL
3. Restart FiveM resource

### Reports not refreshing

**The dashboard auto-refreshes every 30 seconds**. To force refresh:
- Click the "Refresh" button in the filters section

## 🔐 Security Notes

1. **Network Security**
   - FiveM HTTP endpoint accessed server-to-server
   - No direct client-to-FiveM communication
   - Next.js API routes act as a secure proxy

2. **CORS Protection**
   - FiveM server validates allowed origins (if configured)
   - Only configured domains can access the API
   - Configure ALLOWED_ORIGINS in your FiveM resource if needed

3. **Production Deployment**
   - Update `FIVEM_SERVER_URL` to your production FiveM server
   - Use HTTPS for production website
   - Consider using a reverse proxy (Nginx) for FiveM HTTP endpoint
   - Restrict FiveM HTTP port access to your web server only
   - Use firewall rules to block direct public access to port 30120

## 📊 API Endpoints Used

### From FiveM Server:
- `GET /api/reports` - List all reports with filters
- `GET /api/reports/:id` - Get single report details
- `GET /api/stats` - Get statistics
- `POST /api/reports` - Create new report (future)

### Next.js Proxy Routes:
- `GET /api/fivem/staff-reports` - Proxy to FiveM reports
- `GET /api/fivem/staff-reports/stats` - Proxy to FiveM stats
- `POST /api/fivem/staff-reports` - Proxy to create report

## 🎨 Customization

### Change Auto-Refresh Interval

In `StaffReports.tsx`, line ~76:
```typescript
// Change 30000 (30 seconds) to your preferred interval
const interval = setInterval(() => {
  fetchReports();
  fetchStats();
}, 30000); // milliseconds
```

### Add Custom Filters

Extend the filter section in `StaffReports.tsx`:
```typescript
<Select label="Your Filter">
  <SelectItem key="option1">Option 1</SelectItem>
</Select>
```

### Customize Colors

Status and priority colors are defined at the top of `StaffReports.tsx`:
```typescript
const STATUS_COLORS = {
  PENDING: "warning",
  UNDER_REVIEW: "primary",
  // ... modify as needed
};
```

## 📱 Mobile Support

The interface is fully responsive and works on:
- Desktop (optimized for large screens)
- Tablets (responsive grid)
- Mobile devices (stacked layout)

## 🔄 Next Steps

1. **Test the integration** - Submit a test report in FiveM, verify it appears in dashboard
2. **Configure notifications** - Add Discord webhook for new reports
3. **Add report management** - Implement update/assign functionality
4. **Setup production** - Deploy with proper environment variables

## 📞 Support

If you encounter issues:
1. Check browser console for errors
2. Check FiveM server console for API errors
3. Verify all environment variables are set
4. Test FiveM API directly with curl/Postman

---

**Last Updated:** December 24, 2025  
**Integration Version:** 1.0.0
