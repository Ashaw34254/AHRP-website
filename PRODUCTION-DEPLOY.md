# Aurora Horizon RP - Production Deployment Guide

## Pre-Deployment Checklist

### 1. Database Setup
```bash
# Run Prisma migrations
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed initial data (optional)
npm run db:seed
```

### 2. Environment Variables
- Copy `.env.production.example` to `.env.production`
- Update all values with production credentials
- Generate AUTH_SECRET: `openssl rand -base64 32`
- Set up Discord OAuth app at https://discord.com/developers/applications
- Update NEXTAUTH_URL to your production domain

### 3. Build for Production
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Test production build locally
npm start
```

### 4. Database Migration Checklist
- [ ] Backup existing database
- [ ] Run `npx prisma migrate deploy`
- [ ] Verify all tables created
- [ ] Test application functionality
- [ ] Monitor for errors

### 5. Security Checklist
- [ ] AUTH_SECRET is strong and unique
- [ ] All API keys are in environment variables
- [ ] Database credentials are secure
- [ ] CORS settings are configured
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced

### 6. Performance Optimization
- [ ] Images are optimized
- [ ] Static assets are cached
- [ ] Database queries are indexed
- [ ] API routes are optimized
- [ ] Monitoring is set up

## Deployment Platforms

### Vercel (Recommended)
1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

### Other Platforms
- Railway
- Render
- DigitalOcean
- AWS/Azure/GCP

## Post-Deployment

### Monitoring
- Check application logs
- Monitor database performance
- Set up error tracking (Sentry)
- Configure uptime monitoring

### Testing
- Test all application flows
- Verify Discord OAuth works
- Test application submissions
- Check admin dashboard access
- Verify CAD system functionality

## Database Backup Strategy
```bash
# SQLite backup
cp prisma/dev.db prisma/backup-$(date +%Y%m%d).db

# For production, use automated backups:
# - Vercel Postgres: Automatic backups
# - PlanetScale: Automatic backups
# - Manual: Set up cron job for regular backups
```

## Troubleshooting

### Build Fails
- Check for TypeScript errors: `npm run build`
- Verify all dependencies are installed
- Check environment variables

### Database Connection Issues
- Verify DATABASE_URL is correct
- Run `npx prisma generate`
- Check database is accessible

### Authentication Issues
- Verify AUTH_SECRET is set
- Check Discord OAuth credentials
- Ensure NEXTAUTH_URL matches domain

## Support
For issues, check:
- Application logs
- Browser console
- Network tab
- Database logs
