# Blog Views Tracking Setup Guide

This document explains how to set up and use the blog views tracking feature.

## Features

- ✅ Near real-time view count updates (polling every 5 seconds)
- ✅ Works for both logged-in and guest users
- ✅ Multiple views from the same user are counted
- ✅ Debounced view tracking (2 seconds) to prevent spam
- ✅ Atomic view increments using database functions
- ✅ Works on Supabase free tier (no Realtime required)

## Database Setup

1. **Run the migration**:
   ```bash
   # Apply the migration in your Supabase dashboard
   # Or use Supabase CLI: supabase migration up
   ```
   
   The migration file is located at: `supabase/migrations/add_blog_views_tracking.sql`

**Note**: This implementation uses polling instead of Supabase Realtime, so it works on the free tier without any additional setup!

## How It Works

### View Tracking Flow

1. **Page Load**: When a user visits a blog post page:
   - The page loads the blog content
   - After 2 seconds (debounce), a POST request is made to `/api/blogs/[slug]/views`
   - The view count is incremented atomically in the database

2. **Near Real-time Updates**:
   - The page polls the API every 5 seconds to fetch the latest view count
   - When any user views the post, all connected clients will see the updated count within 5 seconds
   - The view count updates automatically without page refresh
   - This approach works on Supabase free tier (no Realtime subscription needed)

### API Endpoints

#### GET `/api/blogs/[slug]/views`
- Fetches the current view count for a blog post
- Returns: `{ views: number }`

#### POST `/api/blogs/[slug]/views`
- Increments the view count for a blog post
- Uses atomic database function for safe concurrent updates
- Returns: `{ views: number }` (updated count)

### Database Function

The migration creates a PostgreSQL function `increment_blog_views(blog_id_param UUID)` that:
- Atomically increments the view count
- Updates the `updated_at` timestamp
- Returns the new view count
- Uses `SECURITY DEFINER` to allow public access

## Frontend Implementation

The blog page (`src/app/blog/[slug]/page.tsx`) includes:

1. **View Tracking**: Automatically tracks views after 2 seconds
2. **Polling**: Polls the API every 5 seconds for view count updates
3. **State Management**: Maintains local view count state that updates automatically

## Testing

1. Open a blog post in multiple browser tabs/windows
2. Wait 2 seconds after page load
3. The view count should increment
4. All open tabs should show the updated count in real-time

## Notes

- Views are tracked per page load (not per unique user)
- The 2-second debounce prevents rapid-fire view increments
- Updates are polled every 5 seconds (works on free tier, no Realtime needed)
- The view count is stored in the `blogs.views` column
- To make updates more frequent, adjust the polling interval in the blog page component (currently 5000ms)

