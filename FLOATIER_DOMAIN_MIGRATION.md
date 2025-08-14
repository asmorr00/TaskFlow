# Floatier.io Domain Configuration & Google OAuth Setup

## Current Status

### ✅ Completed
1. **Supabase CLI**: Upgraded to v2.34.3
2. **Domain DNS**: floatier.io resolves correctly and redirects to www.floatier.io
3. **Hosting**: Verified deployment on Vercel (project: task-flow)
4. **Codebase Analysis**: 
   - Found Supabase URL in `.env.local`
   - Auth callback configured to use `window.location.origin`
   - No hardcoded URLs in source code

### 🔄 Required Actions

## 1. Update Environment Variables

### Local Development (.env.local)
```bash
# Update from dylynprxamthpegcsxkj.supabase.co to floatier.io
VITE_PUBLIC_SUPABASE_URL=https://floatier.io
VITE_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bHlucHJ4YW10aHBlZ2NzeGtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ3NjE1NzcsImV4cCI6MjA3MDMzNzU3N30.OZ2a1S15igPw3FflVJh8D6jWgMqRmuRH-vKxkiGfrR8
```

### Vercel Environment Variables
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Navigate to your project (task-flow)
3. Go to Settings → Environment Variables
4. Update `VITE_PUBLIC_SUPABASE_URL` to `https://floatier.io`

## 2. Supabase Custom Domain Setup

### Prerequisites
- Access to Supabase dashboard
- Domain DNS management access

### Steps to Configure Custom Domain in Supabase

1. **Access Supabase Dashboard**
   - Go to: https://supabase.com/dashboard/project/dylynprxamthpegcsxkj
   - Navigate to Settings → Custom Domains

2. **Add Custom Domain**
   - Click "Add a custom domain"
   - Enter: `floatier.io`
   - Follow the DNS verification process

3. **Required DNS Records**
   You'll need to add these records to your domain DNS:
   ```
   Type: CNAME
   Name: floatier.io (or @ depending on your DNS provider)
   Value: dylynprxamthpegcsxkj.supabase.co
   ```

   Or if using A records:
   ```
   Type: A
   Name: floatier.io
   Value: [Supabase will provide the IP]
   ```

4. **SSL Certificate**
   - Supabase will automatically provision an SSL certificate
   - This may take up to 24 hours to propagate

## 3. Google OAuth Configuration Update

### Google Cloud Console Updates

1. **Access Google Cloud Console**
   - Go to: https://console.cloud.google.com
   - Select your project
   - Navigate to APIs & Services → Credentials

2. **Update OAuth 2.0 Client**
   - Find your OAuth 2.0 Client ID
   - Click to edit

3. **Update Authorized JavaScript Origins**
   Remove:
   ```
   https://dylynprxamthpegcsxkj.supabase.co
   ```
   
   Add:
   ```
   https://floatier.io
   https://www.floatier.io
   http://localhost:5173 (for local development)
   ```

4. **Update Authorized Redirect URIs**
   Remove:
   ```
   https://dylynprxamthpegcsxkj.supabase.co/auth/v1/callback
   ```
   
   Add:
   ```
   https://floatier.io/auth/v1/callback
   https://www.floatier.io/auth/v1/callback
   http://localhost:5173/auth/callback (for local development)
   ```

5. **Save Changes**

### Supabase Auth Configuration

1. **Access Authentication Settings**
   - Go to: https://supabase.com/dashboard/project/dylynprxamthpegcsxkj
   - Navigate to Authentication → URL Configuration

2. **Update Site URL**
   - Change from: `https://dylynprxamthpegcsxkj.supabase.co`
   - To: `https://www.floatier.io`

3. **Update Redirect URLs**
   Add these URLs to the allowed list:
   ```
   https://www.floatier.io
   https://floatier.io
   http://localhost:5173
   ```

## 4. Supabase CLI Setup (Optional)

To link your local project to Supabase:

1. **Generate Access Token**
   - Go to: https://supabase.com/dashboard/account/tokens
   - Create a new access token
   - Copy the token

2. **Login to Supabase CLI**
   ```bash
   supabase login --token YOUR_ACCESS_TOKEN
   ```

3. **Link Project**
   ```bash
   supabase link --project-ref dylynprxamthpegcsxkj
   ```

## 5. Testing Checklist

After completing the configuration:

- [ ] Test Google OAuth login on localhost
- [ ] Deploy to Vercel staging/preview
- [ ] Test Google OAuth on staging
- [ ] Update production environment variables
- [ ] Test Google OAuth on production (www.floatier.io)
- [ ] Verify callback URLs are working
- [ ] Check browser console for any CORS errors

## Troubleshooting

### Common Issues

1. **"redirect_uri_mismatch" Error**
   - Ensure all URLs in Google Console match exactly
   - Check for trailing slashes
   - Verify protocol (http vs https)

2. **CORS Errors**
   - Check Supabase URL Configuration
   - Verify custom domain is properly configured
   - Ensure SSL certificate is active

3. **"Invalid Site URL" Error**
   - Update Site URL in Supabase Dashboard
   - Check environment variables in Vercel

4. **DNS Not Resolving**
   - Allow 24-48 hours for DNS propagation
   - Verify DNS records are correct
   - Use `nslookup floatier.io` to check resolution

## Important Notes

- The auth callback in your code uses `window.location.origin` which will automatically adapt to the current domain
- Keep the old Supabase URL active until migration is complete
- Test thoroughly in staging before updating production
- Monitor error logs during the transition period

## Resources

- [Supabase Custom Domains Documentation](https://supabase.com/docs/guides/platform/custom-domains)
- [Supabase Local Development](https://supabase.com/docs/guides/local-development)
- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)