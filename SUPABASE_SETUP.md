# Supabase Setup Instructions

## 1. Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up for a free account
3. Click "New Project"
4. Choose your organization
5. Fill in project details:
   - Name: `maori-advent-calendar`
   - Database Password: (create a strong password)
   - Region: Choose closest to your users

## 2. Set up Database Schema

1. In your Supabase dashboard, go to the SQL Editor
2. Copy and paste the entire contents of `src/lib/supabase-setup.sql`
3. Click "Run" to execute the SQL commands
4. This will create all necessary tables, functions, and security policies

## 3. Configure Environment Variables

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - anon public key
   - service_role key (keep this secret!)

3. Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Email Configuration (optional - for later)
RESEND_API_KEY=your_resend_api_key_here

# Application Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Test the Setup

1. Restart your development server: `bun run dev`
2. Visit `http://localhost:3000`
3. Try registering a new account
4. Check your Supabase dashboard > Authentication > Users to see if the user was created
5. Check the Database > users table to see if the profile was created

## 5. Verify Database Tables

After running the SQL setup, you should see these tables in your Supabase dashboard:

- `characters` - Cultural guardians/figures
- `activities` - Daily cultural activities
- `users` - User profiles (extends auth.users)
- `user_progress` - Activity completion tracking
- `prizes` - Available prizes and rewards
- `user_prize_claims` - Prize claim tracking

## 6. Authentication Flow

The system is configured for:

1. **Email/Password Registration** - Users sign up with email and password
2. **Email Verification** - Supabase sends verification emails automatically
3. **Profile Creation** - User profiles are created automatically via database trigger
4. **Character Selection** - Users choose their cultural guardian after registration
5. **Progress Tracking** - All activity completion and points are tracked

## 7. Security Features

- **Row Level Security (RLS)** is enabled on all user data tables
- Users can only access their own data
- Public read access for characters, activities, and prizes
- Automatic point calculation via database triggers
- Secure password hashing via Supabase Auth

## 8. Sample Data

The setup includes:

- **5 Māori Characters** - Traditional figures and animals
- **Sample Activities** - For the first few days
- **Prize Examples** - Digital and physical rewards
- **Difficulty Levels** - Beginner, Intermediate, Advanced

## 9. Admin Access

To manage content:

1. Use the Supabase dashboard to add/edit activities
2. Modify prizes and requirements
3. View user progress and analytics
4. Export user data for prize fulfillment

## 10. Production Deployment

For production:

1. Ensure all environment variables are set
2. Configure custom domain in Supabase settings
3. Set up email templates for authentication
4. Configure CORS settings if needed
5. Set up backups and monitoring

## Troubleshooting

**User registration fails:**
- Check environment variables are correct
- Verify Supabase project is active
- Check browser console for errors

**Character selection not working:**
- Ensure characters table was populated via SQL script
- Check if user profile exists in users table

**Database errors:**
- Verify all SQL commands ran successfully
- Check Supabase logs for detailed error messages
- Ensure RLS policies are properly configured

Need help? Check the Supabase documentation or contact support.
