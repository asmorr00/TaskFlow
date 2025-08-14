# Floatier Subdomain Migration Status

## ✅ Completed Tasks

### 1. Environment Variables
- Updated `.env.local` to use `app.floatier.io` as SUPABASE_URL ✅

### 2. Code Analysis
- No hardcoded URLs found in source code ✅
- Auth callbacks use `window.location.origin` (will adapt automatically) ✅
- No specific landing page URLs to update (no hardcoded references) ✅

### 3. Local Supabase Configuration
- Updated `supabase/config.toml`:
  - Site URL: `https://app.floatier.io`
  - Additional redirect URLs include both subdomains and localhost

## 🔄 Manual Steps Required

### Supabase Dashboard Configuration
You need to manually update these settings in your Supabase dashboard:

1. **Navigate to Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/dylynprxamthpegcsxkj
   
2. **Update Authentication Settings**
   - Go to: Authentication → URL Configuration
   - Update Site URL to: `https://app.floatier.io`
   - Add these Redirect URLs:
     - `https://app.floatier.io`
     - `https://www.floatier.io`
     - `https://app.floatier.io/auth/callback`
     - `http://localhost:5173`
     - `http://localhost:5173/auth/callback`

3. **Google OAuth Configuration (Google Cloud Console)**
   - Go to: https://console.cloud.google.com
   - Navigate to: APIs & Services → Credentials
   - Edit your OAuth 2.0 Client
   
   **Authorized JavaScript Origins:**
   - Add: `https://app.floatier.io`
   - Add: `https://www.floatier.io`
   - Keep: `http://localhost:5173`
   
   **Authorized Redirect URIs:**
   - Add: `https://app.floatier.io/auth/v1/callback`
   - Add: `https://www.floatier.io/auth/v1/callback`
   - Keep: `http://localhost:5173/auth/callback`

### Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project (task-flow)
3. Go to Settings → Environment Variables
4. Update `VITE_PUBLIC_SUPABASE_URL` to `https://app.floatier.io`

## 📋 Architecture Overview

### Current Implementation
- **Landing Page**: Served from the same app, shows when user is not authenticated
- **App/Dashboard**: Shows automatically when user is authenticated
- **Auth Handling**: Uses `window.location.origin` for dynamic callback URLs

### Subdomain Structure
- `www.floatier.io` → Landing/marketing page (unauthenticated users)
- `app.floatier.io` → Task management dashboard (authenticated users)

### Routing Logic
The app already has proper routing logic:
- Unauthenticated users see the landing page
- Authenticated users see the dashboard
- Auth callbacks work with any domain thanks to `window.location.origin`

## 🧪 Testing Checklist

After completing the manual configuration:

- [ ] Test Google OAuth login on localhost
- [ ] Deploy to Vercel staging/preview
- [ ] Test Google OAuth on staging
- [ ] Update production environment variables
- [ ] Test Google OAuth on production (app.floatier.io)
- [ ] Verify landing page works on www.floatier.io
- [ ] Verify app redirects authenticated users properly
- [ ] Check browser console for any CORS errors

## 🚀 Deployment Notes

1. **DNS Configuration**
   Ensure both subdomains point to your Vercel deployment:
   - `www.floatier.io` → Vercel
   - `app.floatier.io` → Vercel

2. **Vercel Configuration**
   The same deployment will handle both subdomains. The app will:
   - Detect the domain using `window.location`
   - Show appropriate content based on auth status
   - Handle redirects automatically

3. **Important**: The app is already designed to work with multiple domains:
   - No hardcoded URLs in the codebase
   - Dynamic callback URLs using `window.location.origin`
   - Proper auth state management

## ⚠️ Important Notes

- The Supabase CLI doesn't support updating auth configuration directly
- All auth configuration must be done through the Supabase dashboard
- Keep the old Supabase URL active until migration is complete
- Monitor error logs during the transition period