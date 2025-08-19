# Supabase API Layer

This directory contains the complete replacement for the Django backend API. All Django views have been converted to TypeScript functions that directly interact with Supabase.

## Structure

- `types.ts` - TypeScript interfaces for all API requests and responses
- `supabaseApi.ts` - All API functions that replace Django views
- `index.ts` - Exports all functions and types for easy importing

## Replaced Django Views

### Core Functions
- `HealthCheckView` → `healthCheck()`
- `ImageUploadView` → `uploadImage()`
- `AdminStatusView` → `checkAdminStatus()`
- `MemberStatusView` → `checkMemberStatus()`
- `ProfileUpdateView` → `updateProfile()`
- `GetMemberByEmailView` → `getMemberByEmail()`

### Member Operations
- `MemberListView` → `getMembers()`
- `MemberDetailView` → `getMember()`, `createMember()`, `updateMember()`, `deleteMember()`
- `BoardMemberListView` → `getBoardMembers()`
- `NonBoardMemberListView` → `getNonBoardMembers()`

### Event Operations
- `EventListView` → `getEvents()`
- `EventDetailView` → `getEvent()`, `createEvent()`, `updateEvent()`, `deleteEvent()`
- `ClubEventListView` → `getClubEvents()`
- `FeaturedEventListView` → `getFeaturedEvents()`
- `RecruitingEventListView` → `getRecruitingEvents()`

### Allowed Email Operations
- `AllowedEmailListView` → `getAllowedEmails()`
- `AllowedEmailDetailView` → `getAllowedEmail()`, `createAllowedEmail()`, `updateAllowedEmail()`, `deleteAllowedEmail()`

## Usage

### Import Functions
```typescript
import { getMembers, createMember, getEvents } from '../api';
```

### Use in Components
```typescript
const fetchMembers = async () => {
  try {
    const members = await getMembers();
    // Handle success
  } catch (error) {
    // Handle error
  }
};
```

### Use in Hooks
```typescript
import { getBoardMembers } from '../api';

export const useBoardMembers = () => {
  const fetchBoardMembers = async () => {
    const data = await getBoardMembers();
    // Transform and dispatch to Redux
  };
};
```

## Key Benefits

1. **No Backend Server** - Direct Supabase communication
2. **Type Safety** - Full TypeScript support with generated types
3. **Real-time Updates** - Can easily add Supabase subscriptions
4. **Better Performance** - No Django middleware overhead
5. **Simplified Deployment** - Frontend-only deployment
6. **Built-in Security** - RLS policies handle permissions

## Migration Status

✅ **Completed**
- All Django views converted to TypeScript functions
- All frontend hooks updated to use new API
- Type definitions created
- Error handling implemented

🔄 **Next Steps**
- Set up RLS policies in Supabase
- Test all functions
- Remove Django backend
- Update deployment configuration

## Error Handling

All functions include proper error handling and will throw descriptive errors that can be caught and handled by the calling code.

## Image Upload

The `uploadImage` function handles file validation, bucket selection, and Supabase storage upload. It returns the public URL for the uploaded image.
