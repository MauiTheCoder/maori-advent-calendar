# Netlify Environment Variables Setup

## Your Firebase Configuration

Based on your current `.env.local` file, here are the exact environment variables you need to set in Netlify:

### 🔧 Required Environment Variables for Netlify

Go to your Netlify dashboard → Site settings → Environment variables, and add these:

| Variable Name | Value |
|---------------|--------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyBp2XYYHYqTc9JykhiTdhmLywGTdFQPhhc` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `mahuru-maori-2025.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `mahuru-maori-2025` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `mahuru-maori-2025.firebasestorage.app` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `608916020621` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:608916020621:web:f5671e3d57a838a49c71c4` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-NJN363BV69` |
| `NEXT_PUBLIC_ADMIN_EMAILS` | `leon.green@twoa.ac.nz` |
| `NEXT_PUBLIC_SITE_URL` | `https://maori-advent-calendar.netlify.app` |
| `NEXT_PUBLIC_ENVIRONMENT` | `production` |

### ⚠️ Important Notes

1. **Admin Email Configured**: `leon.green@twoa.ac.nz` will have admin access
2. **Keep the values exactly as shown** - any typos will cause build failures
3. **Don't include quotes** when entering values in Netlify dashboard

### 🚀 Quick Setup Methods

#### Method 1: Manual Setup (Netlify Dashboard)
1. Go to [Netlify Dashboard](https://app.netlify.com)
2. Select your site: `maori-advent-calendar`
3. Go to **Site settings** → **Environment variables**
4. Click **Add a variable** for each one above

#### Method 2: Netlify CLI (Faster)
If you have Netlify CLI installed:

```bash
# Set all variables at once
netlify env:set NEXT_PUBLIC_FIREBASE_API_KEY "AIzaSyBp2XYYHYqTc9JykhiTdhmLywGTdFQPhhc"
netlify env:set NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN "mahuru-maori-2025.firebaseapp.com"
netlify env:set NEXT_PUBLIC_FIREBASE_PROJECT_ID "mahuru-maori-2025"
netlify env:set NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET "mahuru-maori-2025.firebasestorage.app"
netlify env:set NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID "608916020621"
netlify env:set NEXT_PUBLIC_FIREBASE_APP_ID "1:608916020621:web:f5671e3d57a838a49c71c4"
netlify env:set NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID "G-NJN363BV69"
netlify env:set NEXT_PUBLIC_ADMIN_EMAILS "leon.green@twoa.ac.nz"
netlify env:set NEXT_PUBLIC_SITE_URL "https://maori-advent-calendar.netlify.app"
netlify env:set NEXT_PUBLIC_ENVIRONMENT "production"

# Then deploy
netlify deploy --prod
```

### 🔍 Verification

After setting the environment variables:

1. **Trigger a new deploy**: Push a commit or manually trigger deploy
2. **Check build logs**: Look for Firebase initialization messages
3. **Test the site**: Visit your production URL
4. **Test admin setup**: Go to `/admin/setup`

### 🏗️ Local Development

Your local `.env.local` file is configured and ready. To test locally:

```bash
# Update admin email in .env.local first
bun dev
# or
npm run dev

# Then visit:
# http://localhost:3000
# http://localhost:3000/admin/setup
```

### 🛠️ Troubleshooting

If the build still fails:

1. **Check for typos** in environment variable names and values
2. **Verify Firebase project** is active and has Authentication + Firestore enabled
3. **Check build logs** in Netlify for specific error messages
4. **Run local validation**: Use the check-env.js script

### 📞 Need Help?

- Check build logs in Netlify dashboard
- Verify Firebase console settings
- Run `node check-env.js` locally to validate configuration