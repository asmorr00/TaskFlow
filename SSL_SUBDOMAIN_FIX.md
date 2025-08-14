# Fix SSL/Subdomain Configuration for app.floatier.io

## 🔴 Current Issue
`app.floatier.io` is pointing to Supabase servers instead of Vercel, causing SSL certificate mismatch error.

## 📊 Current DNS Configuration

| Domain | Current Points To | Should Point To |
|--------|------------------|-----------------|
| floatier.io | ✅ Vercel (64.29.17.1, 216.198.79.1) | ✅ Correct |
| www.floatier.io | ✅ Vercel (via CNAME to floatier.io) | ✅ Correct |
| app.floatier.io | ❌ Supabase (dylynprxamthpegcsxkj.supabase.co) | ❌ Should be Vercel |

## 🛠️ Required Actions

### Step 1: Fix DNS Records
**In your DNS provider (domain registrar):**

1. **Remove the current CNAME record:**
   - Record: `app`
   - Type: CNAME
   - Value: `dylynprxamthpegcsxkj.supabase.co` ← DELETE THIS

2. **Add new CNAME record:**
   - Record: `app`
   - Type: CNAME
   - Value: `floatier.io` (or use A records with Vercel IPs)
   
   **OR use A records (same as root domain):**
   - Record: `app`
   - Type: A
   - Value: `64.29.17.1`
   - Add another A record with: `216.198.79.1`

### Step 2: Add Subdomain to Vercel

1. **Go to Vercel Dashboard:**
   - https://vercel.com/dashboard
   - Select your project (task-flow or floatier)

2. **Navigate to Settings → Domains**

3. **Add Custom Domain:**
   - Click "Add Domain"
   - Enter: `app.floatier.io`
   - Vercel will provide instructions if DNS isn't configured yet

4. **Vercel will automatically:**
   - Provision SSL certificate for the subdomain
   - Handle HTTPS redirect
   - Configure proper routing

### Step 3: Update Environment Variables

**In Vercel Dashboard:**
1. Go to Settings → Environment Variables
2. Ensure these are set:
   ```
   VITE_PUBLIC_SUPABASE_URL=https://dylynprxamthpegcsxkj.supabase.co
   VITE_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```
   
   Note: Keep using the Supabase URL for API calls, NOT app.floatier.io

### Step 4: Fix Local Environment

Update `.env.local`:
```bash
# This should be your Supabase project URL, NOT app.floatier.io
VITE_PUBLIC_SUPABASE_URL=https://dylynprxamthpegcsxkj.supabase.co
VITE_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 5: Update Supabase Auth Settings

**In Supabase Dashboard** (https://supabase.com/dashboard/project/dylynprxamthpegcsxkj):

1. **Authentication → URL Configuration:**
   - Site URL: `https://app.floatier.io`
   - Redirect URLs:
     - `https://app.floatier.io`
     - `https://www.floatier.io`
     - `http://localhost:5173`

### Step 6: Verify Configuration

After DNS propagation (5-30 minutes):

```bash
# Test DNS resolution
nslookup app.floatier.io

# Test SSL certificate
curl -I https://app.floatier.io

# Check SSL status
openssl s_client -connect app.floatier.io:443 -servername app.floatier.io < /dev/null
```

## 🎯 Expected Result

Once configured correctly:
- `https://app.floatier.io` → Vercel hosting (with SSL)
- `https://www.floatier.io` → Vercel hosting (with SSL)
- Both subdomains serve the same app
- Auth callbacks work on both domains
- SSL certificates valid for both subdomains

## ⚠️ Important Notes

1. **DO NOT** use `app.floatier.io` as your SUPABASE_URL
2. **DO** add `app.floatier.io` to Vercel domains
3. **DO** update DNS to point `app` subdomain to Vercel, not Supabase
4. DNS propagation can take 5-30 minutes (sometimes up to 48 hours)

## 🔍 Troubleshooting

If SSL still fails after configuration:
1. Clear browser cache and cookies
2. Wait for DNS propagation (use `nslookup` to verify)
3. Check Vercel dashboard for domain verification status
4. Ensure no conflicting DNS records exist

## 📝 Quick DNS Provider Instructions

### Cloudflare
1. DNS → Records
2. Delete CNAME for `app` pointing to Supabase
3. Add CNAME: `app` → `floatier.io`

### GoDaddy
1. DNS → Manage Zones
2. Edit/Delete the `app` CNAME record
3. Add new CNAME: `app` → `floatier.io`

### Namecheap
1. Domain List → Manage → Advanced DNS
2. Delete existing `app` CNAME
3. Add CNAME Record: Host=`app`, Value=`floatier.io`

### Google Domains
1. DNS → Manage custom records
2. Delete `app` subdomain pointing to Supabase
3. Add CNAME: `app` → `floatier.io`