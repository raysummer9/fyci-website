# Row Level Security (RLS) Implementation

## Overview

This document describes the comprehensive Row Level Security (RLS) policies implemented for the FYCI website to enforce strict data access controls.

## Permission Model

### 1. Public Users (Unauthenticated)
- **Read Access**: Can only view published content across all content types
- **Write Access**: None (except comments require approval)

### 2. Admins (`role='admin'`)
- **Full Access**: Read and write access to all tables and data
- **User Management**: Can create, update, and delete user accounts
- **Content Management**: Can manage all programme areas, programmes, competitions, events, blogs, and publications

### 3. Authors (`role='author'`)
- **Limited Access**: Can only modify their own blog posts
- **Read Access**: Can view all published content + their own draft content
- **Write Access**: 
  - Create new blog posts (automatically assigned as `created_by`)
  - Update their own blog posts
  - Delete their own blog posts
  - Manage comments on their own blog posts
  - Manage blog tags for their own posts

## Implementation Details

### Helper Functions

The RLS policies use several helper functions to simplify policy logic:

```sql
-- Check if current user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN;

-- Check if current user is author  
CREATE OR REPLACE FUNCTION is_author()
RETURNS BOOLEAN;

-- Check if current user owns a blog
CREATE OR REPLACE FUNCTION is_blog_owner(blog_created_by UUID)
RETURNS BOOLEAN;
```

### Key Policies by Table

#### Profiles
- Users can view/update their own profile
- Only admins can manage other profiles
- Only admins can change user roles

#### Blogs (Special Case for Authors)
- Public: Read published blogs only
- Authors: Full access to their own blogs (draft/published)
- Admins: Full access to all blogs

#### Content Tables (Programmes, Competitions, Events, Publications)
- Public: Read published content only
- Authors: Read-only access
- Admins: Full access

#### Comments
- Public: Read approved comments on published blogs
- Anyone: Can insert comments (require approval)
- Authors: Can manage comments on their own blogs
- Admins: Full access to all comments

### Data Integrity Constraints

#### Automatic Field Population
- `created_by` field is automatically set when authors create content
- Triggers ensure proper ownership assignment

#### Status Validation
- All content tables enforce valid status values
- Status-based policies ensure proper access control

#### Foreign Key Relationships
- Proper cascading deletes maintain referential integrity
- RLS policies respect these relationships

## Security Features

### 1. Authentication Verification
All policies verify that `auth.uid()` exists and corresponds to a valid user profile.

### 2. Role-Based Access Control
Policies check user roles from the `profiles` table to determine permissions.

### 3. Content Ownership
Authors can only modify content they created, enforced through `created_by` field verification.

### 4. Status-Based Access
Public users can only access content with `status='published'` across all content types.

## Application Integration

### Admin Operations
Admin operations use the service role client (`createAdminClient()`) to bypass RLS when necessary for user management.

### Client Operations
Regular application operations respect RLS policies, ensuring proper access control at the database level.

## Deployment Instructions

To apply these RLS policies:

1. **Backup your database** before making changes
2. **Run the enhanced RLS script**:
   ```bash
   # Apply via Supabase CLI
   supabase db reset --linked
   
   # Or manually via Supabase Dashboard SQL Editor
   # Execute the contents of supabase/enhanced-rls-policies.sql
   ```

3. **Verify policies** are working as expected by testing different user roles and permissions

## Testing Checklist

- [ ] Public users can read published content only
- [ ] Admins can perform all operations
- [ ] Authors can only modify their own blogs
- [ ] Comments require approval before being public
- [ ] Profile updates respect role restrictions
- [ ] Foreign key relationships are maintained
