# Development Mode Notice

## 🚀 Development Mode Active

This project is configured to bypass authentication in development mode for easier testing.

### Features Available Without Auth:

- ✅ Home page
- ✅ User Dashboard (`/dashboard`)
- ✅ Character Manager (`/dashboard/characters`)
- ✅ Applications (`/dashboard/applications`)
- ✅ Notifications (`/dashboard/notifications`)
- ✅ Admin Panel (`/admin`)
- ✅ Role Management (`/admin/roles`)
- ✅ Event Calendar (`/admin/events`)
- ✅ Support Page (`/support`)

### Mock User

A mock user is automatically logged in during development:

```javascript
{
  name: "Dev User",
  email: "dev@ahrp.local",
  role: "admin"
}
```

### To Change Mock User Role

Edit `lib/dev-session.ts` and change the `role` field:
- `"admin"` - Full admin access
- `"user"` - Regular user access

### Production Mode

Authentication is **required** in production mode. The mock session is only active when:
```
NODE_ENV=development
```

### Testing Auth in Development

To test actual authentication in development:
1. Set `NODE_ENV=production` in your terminal
2. Run `npm run build && npm start`
3. Configure Discord OAuth credentials in `.env.local`
