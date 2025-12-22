# Database Migration for Plate Scanner Integration

After integrating the Wraith ARS 2X system with AHRP CAD, you need to update your database schema to support plate scan logging.

## Step 1: Review Schema Changes

The following model has been added to `prisma/schema.prisma`:

```prisma
model PlateScan {
  id          String   @id @default(cuid())
  
  plate       String
  camera      String   // front, rear, manual, wars2x
  location    String?
  result      String   @default("CHECKED") // CHECKED, BOLO_HIT, STOLEN, WANTED, CLEAR, NOT_FOUND
  
  // Officer who scanned
  officerId   String
  officer     Officer  @relation(fields: [officerId], references: [id])
  
  // Unit that scanned
  unitId      String?
  unit        Unit?    @relation(fields: [unitId], references: [id])
  
  // Vehicle if found in database
  vehicleId   String?
  vehicle     Vehicle? @relation(fields: [vehicleId], references: [id])
  
  scannedAt   DateTime @default(now())
  
  @@index([plate, scannedAt])
  @@index([officerId, scannedAt])
}
```

Relation fields added to existing models:
- `Officer.plateScans` - One officer can have many plate scans
- `Unit.plateScans` - One unit can have many plate scans
- `Vehicle.plateScans` - One vehicle can be scanned multiple times

## Step 2: Create Migration

Run the following command to create and apply the migration:

```bash
# Generate migration
npx prisma migrate dev --name add_plate_scan_model

# Or if using Docker/production
npx prisma migrate deploy
```

## Step 3: Update Prisma Client

After migration, regenerate the Prisma client:

```bash
npx prisma generate
```

## Step 4: Verify Migration

Check that the migration was successful:

```bash
# Open Prisma Studio to view the new table
npx prisma studio
```

You should see a new `PlateScan` table with the following columns:
- id
- plate
- camera
- location
- result
- officerId
- unitId
- vehicleId
- scannedAt

## Step 5: Test Integration

1. Start your server with `npm run dev`
2. Ensure `wk_wars2x` resource is running
3. Get in a police vehicle in-game
4. Open Wraith ARS 2X (F5)
5. Drive around and let the radar scan plates
6. Check console for:
   ```
   [AHRP-CAD] Wraith ARS 2X scanned plate: ABC123 (front camera)
   [AHRP-CAD] Logged plate scan: ABC123 -> CLEAR
   ```
7. Open Prisma Studio or check database to verify plate scans are being logged

## Rollback (If Needed)

If you need to rollback the migration:

```bash
# Reset database (WARNING: This will delete all data)
npx prisma migrate reset

# Or manually delete the migration file from prisma/migrations/
```

## Troubleshooting

### Migration fails with foreign key errors

If you get foreign key errors, ensure you have existing Officers and Units in your database. The PlateScan model requires valid officerId references.

**Solution**: Seed some test data first:
```bash
npm run db:seed
```

### "Column already exists" error

If you get this error, the column may already exist from a previous attempt.

**Solution**: 
```bash
# Pull current schema from database
npx prisma db pull

# Generate client
npx prisma generate
```

### SQLite locking issues

If using SQLite and getting "database is locked" errors:

**Solution**: 
1. Stop all Node.js processes
2. Close Prisma Studio
3. Run migration again

## Next Steps

After successful migration:

1. Configure Wars2x integration in `fivem-resource/ahrp-cad/config.lua`
2. Read [WARS2X-INTEGRATION.md](WARS2X-INTEGRATION.md) for setup instructions
3. Test plate scanning in-game
4. Monitor plate scan logs in CAD dashboard

## API Endpoints

The migration enables these new endpoints:

```
GET  /api/cad/plate-scans          - Get plate scan history
GET  /api/cad/plate-scans?plate=   - Search by plate
GET  /api/cad/plate-scans?officerId= - Search by officer
POST /api/cad/plate-scans          - Log new plate scan
```

Test the API:
```bash
# Get recent plate scans
curl http://localhost:3000/api/cad/plate-scans?limit=10 \
  -H "Authorization: Bearer your-api-key"

# Search specific plate
curl http://localhost:3000/api/cad/plate-scans?plate=ABC123 \
  -H "Authorization: Bearer your-api-key"
```
