# Quick Setup Guide - Character Police Data Management

## ✅ Completed

1. **Database Schema** - Updated with source-based permission system
2. **API Endpoints** - All CRUD operations for Notes, Citations, Arrests
3. **Permission Logic** - Source field enforcement (user vs cad)
4. **Development Mode** - Mock data ready for testing

## 🔧 Final Steps

### 1. Apply Database Migration

```bash
cd c:\Users\anton\AHRP-website
npx prisma migrate dev --name add_character_police_records
```

### 2. Restore Character Page

The comprehensive character page UI has been designed. To implement it:

**Option A - Use provided full implementation:**
The complete page code is in the CHARACTER-POLICE-DATA.md documentation above.

**Option B - Merge with existing:**
Your backup is at: `app/dashboard/characters/[id]/page.tsx.backup`

Key additions needed:
- Import modals: `Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure`
- Import icons: `AlertTriangle, FileWarning, HandCuffs, Receipt, StickyNote, Lock, Eye, Pencil`
- Add state for `policeData`
- Add `loadPoliceData()` function
- Add 4 new tabs: Notes, Flags & Warrants, Citations, Arrests
- Add 3 modals for creating/editing records

### 3. Test in Development

```bash
npm run dev
```

Navigate to: `http://localhost:3000/dashboard/characters/1`

You should see:
- 5 tabs (Personal Details, Notes, Flags & Warrants, Citations, Arrests)
- Mock data pre-populated
- Green "User" chips on editable records
- Orange "CAD System" chips on read-only records
- Edit/Delete buttons on user records only

### 4. Verify Permissions

**User Records (Green chip):**
- ✅ Can click edit icon
- ✅ Can click delete icon
- ✅ Modal opens for editing
- ✅ Changes save successfully

**CAD Records (Orange chip with lock):**
- ✅ Shows "Read-Only" badge
- ✅ No edit/delete buttons
- ✅ Lock icon visible
- ✅ Attempting API edit returns 404

## 📊 What Users Can Do

### Full Control (User-Created):
- ✏️ **Notes** - Create contact logs, incident reports
- 🚗 **Citations** - Add traffic tickets, infractions
- 👮 **Arrests** - Document arrest records

### View Only (CAD-Created):
- 👁️ **Flags** - See character warnings (ARMED, VIOLENT, etc.)
- ⚠️ **Warrants** - View active warrants
- 🔒 **CAD Notes** - See official system notes
- 🔒 **CAD Citations** - View system-issued tickets
- 🔒 **CAD Arrests** - See official arrest records

## 🎨 UI Features

**Character Overview Card:**
- Shows State ID, License Status, Firearm Permit
- Department/Rank chips
- Quick stats

**Tab Navigation:**
- 5 clearly labeled tabs with counts
- Icons for visual identification
- Color-coded badges

**Record Cards:**
- Source indicator (User/CAD)
- Permission badges (editable vs read-only)
- Timestamp and officer info
- Edit/Delete actions where applicable

**Modals:**
- Clean form inputs
- Validation feedback
- Cancel/Save buttons

## 🔌 CAD Integration

When external CAD system creates records, use:

```javascript
// Create CAD-sourced note
POST /api/dashboard/characters/[id]/notes
{
  "title": "Officer Contact",
  "content": "Traffic stop at Highway 1",
  "category": "CONTACT",
  // Note: No 'source' field needed - defaults to 'cad' when created by CAD system
}
```

To create user-editable records programmatically:
```javascript
// Add source: "user" in the database directly
await prisma.characterNote.create({
  data: {
    characterId: "...",
    title: "...",
    source: "user" // Explicitly set as user-created
  }
})
```

## 🐛 Troubleshooting

**"Character not found"**
- Check character ID in URL
- Verify character belongs to logged-in user
- Check dev session in `lib/dev-session.ts`

**"Failed to load police records"**
- Check API endpoint: `/api/dashboard/characters/[id]/police`
- Verify database migration completed
- Check browser console for errors

**Can't edit records**
- Verify record has `source: "user"`
- Check for "Read-Only" badge
- CAD records cannot be edited by design

**Modal not opening**
- Check imports: `useDisclosure` from NextUI
- Verify modal state is initialized
- Check browser console for React errors

## 📝 Mock Data for Testing

Development mode includes:
- 1 user note (editable)
- 1 CAD flag (read-only, CAUTION)
- 1 user citation (editable, $150 fine)
- All CRUD operations work without database

## 🚀 Production Considerations

1. **Authentication** - Currently uses dev session, switch to production auth
2. **Rate Limiting** - Add rate limits to prevent spam
3. **Audit Logging** - Log all modifications to police records
4. **Export** - Add PDF/CSV export for character records
5. **Search** - Add filtering by date, source, type
6. **Notifications** - Alert users when CAD adds new records

## 📦 File Checklist

- ✅ `prisma/schema.prisma` - Updated with new models
- ✅ `app/api/dashboard/characters/[id]/police/route.ts` - Fetch all records
- ✅ `app/api/dashboard/characters/[id]/notes/route.ts` - Notes CRUD
- ✅ `app/api/dashboard/characters/[id]/citations/route.ts` - Citations CRUD
- ✅ `app/api/dashboard/characters/[id]/arrests/route.ts` - Arrests CRUD
- ⏳ `app/dashboard/characters/[id]/page.tsx` - Needs implementation
- ✅ `docs/CHARACTER-POLICE-DATA.md` - Full documentation

---

**Ready to implement!** The backend is complete. Just need to finalize the character page UI using the backup and adding the new tabs/modals as outlined above.
