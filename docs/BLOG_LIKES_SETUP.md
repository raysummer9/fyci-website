# Blog Likes Feature Setup Guide

This document explains how to set up and use the blog likes feature.

## Features

- ✅ Toggle like/unlike functionality
- ✅ Works for both logged-in and guest users
- ✅ Guest users tracked via localStorage
- ✅ Near real-time like count updates (polling every 5 seconds)
- ✅ Prevents duplicate likes from the same user
- ✅ Atomic like/unlike operations using database functions
- ✅ Works on Supabase free tier (no Realtime required)

## Database Setup

1. **Run the migration**:
   ```bash
   # Apply the migration in your Supabase dashboard
   # Or use Supabase CLI: supabase migration up
   ```
   
   The migration file is located at: `supabase/migrations/add_blog_likes_tracking.sql`

**Note**: This implementation uses polling instead of Supabase Realtime, so it works on the free tier without any additional setup!

## How It Works

### Like/Unlike Flow

1. **User Interaction**: When a user clicks the like button:
   - For authenticated users: Uses their user ID
   - For guest users: Uses a unique guest ID stored in localStorage
   - The API toggles the like status (like if not liked, unlike if liked)
   - The like count updates immediately

2. **Near Real-time Updates**:
   - The page polls the API every 5 seconds to fetch the latest like count
   - When any user likes/unlikes, all connected clients will see the updated count within 5 seconds
   - The like count and button state update automatically without page refresh

### Database Structure

- **`blog_likes` table**: Tracks individual likes
  - `blog_id`: Reference to the blog post
  - `user_id`: For authenticated users (nullable)
  - `guest_id`: For anonymous users (nullable)
  - Unique constraints prevent duplicate likes

- **`blogs.likes` column**: Stores the total like count (maintained by database functions)

### API Endpoints

#### GET `/api/blogs/[slug]/like?guest_id={guest_id}`
- Fetches the current like count and whether the current user has liked
- Query params:
  - `guest_id`: Required for anonymous users (optional for authenticated users)
- Returns: `{ likes: number, is_liked: boolean }`

#### POST `/api/blogs/[slug]/like`
- Toggles like status (like/unlike)
- Body: `{ guest_id?: string }` (required for anonymous users)
- Returns: `{ likes: number, is_liked: boolean }`

### Database Functions

The migration creates two PostgreSQL functions:

1. **`toggle_blog_like(blog_id_param, user_id_param, guest_id_param)`**:
   - Atomically toggles like status
   - Increments or decrements the like count
   - Returns the new like count and status
   - Uses `SECURITY DEFINER` to allow public access

2. **`check_blog_like(blog_id_param, user_id_param, guest_id_param)`**:
   - Checks if a user has liked a blog post
   - Returns boolean

## Frontend Implementation

The blog page (`src/app/blog/[slug]/page.tsx`) includes:

1. **Like Button**: Interactive button that shows current like status
2. **Guest ID Management**: Automatically generates and stores guest IDs in localStorage
3. **Polling**: Polls the API every 5 seconds for like count updates
4. **State Management**: Maintains local like count and status that updates automatically

## User Experience

### Authenticated Users
- Like status is tied to their user account
- Can like/unlike from any device where they're logged in
- Like status persists across sessions

### Guest Users
- Like status is tied to their browser (via localStorage)
- Guest ID is automatically generated on first visit
- Like status persists in the same browser
- Clearing browser data will reset like status

## Testing

1. Open a blog post in multiple browser tabs/windows
2. Click the like button in one tab
3. The like count should update in all tabs within 5 seconds
4. Click again to unlike
5. The count should decrease and button should show "Like" again

## Notes

- Likes are tracked per user/guest (one like per user per post)
- The like button toggles between "Like" and "Liked" states
- Updates are polled every 5 seconds (works on free tier, no Realtime needed)
- The like count is stored in the `blogs.likes` column
- Guest users are identified by a unique ID stored in localStorage

