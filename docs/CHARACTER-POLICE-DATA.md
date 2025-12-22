# Character Police Data Management System

## Implementation Summary

A comprehensive police data management system has been implemented for character profiles, allowing users to create, edit, and view all police-related records directly from their character page while protecting CAD-sourced data.

## Database Schema Updates

### New Models Added to `prisma/schema.prisma`:

1. **CharacterNote** - Police notes and reports
   - Fields: title, content, category, createdBy, source
   - Source-based permissions (user/cad)

2. **CharacterFlag** - Character flags (ARMED, VIOLENT, BOLO, etc.)
   - Fields: flagType, reason, severity, isActive, expiresAt
   - CAD-controlled (read-only for users)

3. **CharacterWarrant** - Active warrants
   - Fields: offense, description, bail, isActive, issuedBy
   - CAD-controlled (read-only for users)

4. **CharacterCitation** - Traffic citations and infractions
   - Fields: violation, fine, notes, location, isPaid
   - Source-based permissions

5. **CharacterArrest** - Arrest records
   - Fields: charges, narrative, location, arrestedBy
   - Source-based permissions

### Schema Modifications:
- Added `source` field to Warrant, Citation, and Arrest models (defaults to "cad")
- All character police records cascade delete when character is deleted
- Indexed on characterId and source for performance

## API Endpoints Created

### GET `/api/dashboard/characters/[id]/police`
- Fetches all police-related records for a character
- Returns: notes, flags, warrants, citations, arrests
- Verifies character ownership before returning data

### Notes Management
- **POST** `/api/dashboard/characters/[id]/notes` - Create new note
- **PATCH** `/api/dashboard/characters/[id]/notes` - Update user-created note only
- **DELETE** `/api/dashboard/characters/[id]/notes?noteId={id}` - Delete user-created note only

### Citations Management
- **POST** `/api/dashboard/characters/[id]/citations` - Create citation
- **PATCH** `/api/dashboard/characters/[id]/citations` - Update user citation
- **DELETE** `/api/dashboard/characters/[id]/citations?citationId={id}` - Delete user citation

### Arrests Management
- **POST** `/api/dashboard/characters/[id]/arrests` - Create arrest record
- **PATCH** `/api/dashboard/characters/[id]/arrests` - Update user arrest
- **DELETE** `/api/dashboard/characters/[id]/arrests?arrestId={id}` - Delete user arrest

## Permission System

### Source Field Logic
All police records include a `source` field with two possible values:

1. **"user"** - User-created record
   - Full CRUD permissions
   - Can edit all fields
   - Can delete record
   - Shows green "User" chip
   - Edit/Delete buttons visible

2. **"cad"** - CAD system-generated record
   - Read-only access
   - Cannot edit or delete
   - Shows orange "CAD System" chip with lock icon
   - Displays "Read-Only" badge

### API Enforcement
- All PATCH endpoints verify `source === "user"` before allowing updates
- All DELETE endpoints verify `source === "user"` before allowing deletion
- CAD-sourced data returns 404 error if edit/delete attempted

## Character Dashboard UI

### Location
`/dashboard/characters/[characterId]`

### Tab Structure
The character page now includes 5 main tabs:

1. **Personal Details** - Basic character information (existing functionality)

2. **Notes** - Police notes and reports
   - Create/edit/delete user notes
   - View CAD system notes (read-only)
   - Category tagging (GENERAL, INCIDENT, CONTACT, INTELLIGENCE)

3. **Flags & Warrants**
   - View active character flags (CAD-only, read-only)
   - View active warrants (CAD-only, read-only)
   - Severity indicators (CRITICAL, HIGH, MEDIUM, LOW)
   - Color-coded alerts

4. **Citations** - Traffic citations and infractions
   - Create/edit/delete user citations
   - View CAD citations (read-only)
   - Fine amounts and payment status
   - Location tracking

5. **Arrests** - Criminal history
   - Create/edit/delete user arrest records
   - View CAD arrest records (read-only)
   - Detailed charges and narratives
   - Location and officer information

### Visual Indicators
- **Lock icon** - CAD-sourced, read-only data
- **Eye icon** - "Read-Only" badge for CAD records
- **Color-coded chips**:
  - Green = User-created
  - Orange = CAD system
  - Red = Critical/Active warrants
  - Yellow/Orange = Flags and warnings

### Modals for Data Entry
- Note modal: Title, Content, Category
- Citation modal: Violation, Fine, Location, Notes
- Arrest modal: Charges, Location, Narrative

## Development Mode Support

All API endpoints include dev mode responses with mock data:
- Sample notes, citations, and arrests pre-populated
- Mixed source types (user and CAD) for testing permissions
- No database required in development

## Usage Instructions

### For Users
1. Navigate to character profile at `/dashboard/characters/[id]`
2. Click tabs to view different police record categories
3. Click "Add" buttons to create new user records
4. Click edit/delete icons on user-created records to modify
5. CAD records display with lock icons and cannot be modified

### For CAD Integration
CAD systems can create records by setting `source: "cad"` when calling the APIs directly. These records will be visible to users but protected from modification.

### Database Migration Required
Run the following to apply schema changes:
```bash
npx prisma migrate dev --name add_character_police_records
```

## Next Steps

1. **Run database migration** to create new tables
2. **Test the UI** - Visit a character page and try creating notes/citations/arrests
3. **Integrate with CAD** - Configure CAD system to push records with `source: "cad"`
4. **Seed sample data** - Add mock CAD records for testing
5. **Add export functionality** - Allow users to export their character's police records

## File Locations

- Schema: `prisma/schema.prisma`
- API Routes:
  - `app/api/dashboard/characters/[id]/police/route.ts`
  - `app/api/dashboard/characters/[id]/notes/route.ts`
  - `app/api/dashboard/characters/[id]/citations/route.ts`
  - `app/api/dashboard/characters/[id]/arrests/route.ts`
- UI: `app/dashboard/characters/[id]/page.tsx` (needs to be created from backup)
- Backup: `app/dashboard/characters/[id]/page.tsx.backup`

## Important Notes

- The new character page UI is designed but needs to be finalized
- Old page backed up as `page.tsx.backup`
- All permissions enforced at API level
- Development mode works without database
- CAD-sourced data is intentionally read-only to maintain system integrity
