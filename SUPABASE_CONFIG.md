# Supabase Email Confirmation Configuration

## Issue
The email confirmation link is redirecting to Vercel's login page instead of your application.

## Solution
You need to configure the following in your Supabase Dashboard:

### 1. Update Site URL and Redirect URLs

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project (dylynprxamthpegcsxkj)
3. Navigate to **Authentication** → **URL Configuration**
4. Update the following settings:

   **Site URL:**
   ```
   https://floatier-asmorr00s-projects.vercel.app
   ```

   **Redirect URLs (add both):**
   ```
   https://floatier-asmorr00s-projects.vercel.app
   https://floatier-asmorr00s-projects.vercel.app/*
   http://localhost:5173
   http://localhost:5173/*
   ```

### 2. Email Template Configuration

1. In the Supabase Dashboard, go to **Authentication** → **Email Templates**
2. Select the **Confirm signup** template
3. Ensure the email template uses the correct variable for the confirmation URL:
   ```html
   <a href="{{ .ConfirmationURL }}">Confirm your email</a>
   ```

### 3. Environment Variables

Make sure your production environment (Vercel) has the correct environment variables:

```
VITE_PUBLIC_SUPABASE_URL=https://dylynprxamthpegcsxkj.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
```

## How the Fix Works

1. When a user signs up, the app now passes `emailRedirectTo: window.location.origin` to Supabase
2. This tells Supabase where to redirect users after they click the confirmation link
3. The app handles the confirmation callback by checking for URL hash parameters
4. Upon successful confirmation, the user is automatically logged in

## Testing

1. Create a new account with a valid email
2. Check your email for the confirmation message
3. Click the confirmation link
4. You should be redirected to your app (not Vercel's login page)
5. The app should automatically log you in after successful confirmation

## Important Notes

- The redirect URL must be whitelisted in Supabase's URL Configuration
- Both production and localhost URLs should be added for development and production
- The email template in Supabase must use the correct confirmation URL variable