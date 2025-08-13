# Google OAuth Setup Guide for Floatier

## Overview
This guide will help you configure Google OAuth authentication for your Floatier application using Supabase.

## Step 1: Set up Google Cloud Console

### 1.1 Create a Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Name it "Floatier" and create it

### 1.2 Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" → "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

### 1.3 Create OAuth 2.0 Credentials
1. Go to "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - Choose "External" user type
   - Fill in the required fields:
     - App name: Floatier
     - User support email: your email
     - Developer contact: your email
   - Add your domain to Authorized domains (if you have one)
   - Save and continue through the scopes (you can skip adding scopes for now)
   - Add test users if needed
   - Save

### 1.4 Create OAuth Client ID
1. Back in Credentials, click "Create Credentials" → "OAuth client ID"
2. Choose "Web application" as the application type
3. Name: "Floatier Web Client"
4. Add Authorized JavaScript origins:
   ```
   https://dylynprxamthpegcsxkj.supabase.co
   ```
5. Add Authorized redirect URIs:
   ```
   https://dylynprxamthpegcsxkj.supabase.co/auth/v1/callback
   ```
6. Click "Create"
7. **Save your Client ID and Client Secret** - you'll need these for Supabase

## Step 2: Configure Supabase

### 2.1 Add Google Provider in Supabase
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (dylynprxamthpegcsxkj)
3. Navigate to **Authentication** → **Providers**
4. Find "Google" in the list and enable it
5. Enter your Google OAuth credentials:
   - **Client ID**: (from Google Cloud Console)
   - **Client Secret**: (from Google Cloud Console)
6. The Callback URL shown by Supabase should be:
   ```
   https://dylynprxamthpegcsxkj.supabase.co/auth/v1/callback
   ```
   (This should match what you added in Google Cloud Console)
7. Click "Save"

### 2.2 Update URL Configuration
1. Still in Supabase, go to **Authentication** → **URL Configuration**
2. Ensure these URLs are in your Redirect URLs list:
   ```
   https://floatier-asmorr00s-projects.vercel.app
   https://floatier-asmorr00s-projects.vercel.app/*
   http://localhost:5173
   http://localhost:5173/*
   ```

## Step 3: Update Your Application (Already Done)

The application code is already configured to handle Google OAuth:

```typescript
const handleGoogleAuth = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  })
}
```

## Step 4: Testing

### Local Development Testing
1. Make sure your dev server is running on `http://localhost:5173`
2. Click the "Google" button on the sign-in page
3. You should be redirected to Google's OAuth consent screen
4. After authorizing, you should be redirected back to your app and logged in

### Production Testing
1. Deploy your latest changes to Vercel
2. Visit `https://floatier-asmorr00s-projects.vercel.app`
3. Click the "Google" button on the sign-in page
4. Complete the OAuth flow
5. Verify you're logged in successfully

## Troubleshooting

### Common Issues and Solutions

1. **"Error 400: redirect_uri_mismatch"**
   - Make sure the redirect URI in Google Cloud Console exactly matches Supabase's callback URL
   - The URL should be: `https://dylynprxamthpegcsxkj.supabase.co/auth/v1/callback`

2. **"This app is blocked"**
   - Your app might need verification if you're using sensitive scopes
   - For testing, add test users in Google Cloud Console
   - Or publish your app (requires review for production use)

3. **User redirected to wrong page after OAuth**
   - Verify the `redirectTo` parameter in your code matches your app URL
   - Check Supabase URL Configuration includes your app URLs

4. **"Invalid client" error**
   - Double-check your Client ID and Client Secret in Supabase
   - Ensure there are no extra spaces when copying credentials

## Security Notes

- Never expose your Client Secret in client-side code
- The Client Secret should only be stored in Supabase
- Use environment variables for any sensitive configuration
- Enable 2FA on your Google Cloud account for added security

## Next Steps

Once Google OAuth is working:
1. Consider adding more OAuth providers (GitHub, Microsoft, etc.)
2. Implement user profile management
3. Add role-based access control if needed
4. Set up proper error handling and user feedback