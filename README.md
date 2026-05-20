# SRI Dads — World Cup Pool 2026

## Deploy to Vercel

### 1. Upload to GitHub
- Create a new **private** repository on github.com
- Upload all these files to it

### 2. Connect to Vercel
- Go to vercel.com → New Project → Import your GitHub repo
- Vercel will detect it's a React app automatically

### 3. Add environment variables in Vercel
In your Vercel project → Settings → Environment Variables, add:

| Name | Value |
|------|-------|
| REACT_APP_SUPABASE_URL | https://iraxzyuqadmtjemrlswe.supabase.co |
| REACT_APP_SUPABASE_ANON_KEY | sb_publishable_nyxjDFKNLvGQjub4MKDBlg_ZI5bFJG_ |

### 4. Deploy
Click Deploy — Vercel builds and hosts it automatically.

### 5. Connect your GoDaddy domain
- In Vercel: Settings → Domains → Add your domain
- In GoDaddy: DNS → add a CNAME record pointing to Vercel
- Vercel gives you the exact DNS values to enter

## Admin
Default admin PIN: **1234**
Change it in the Admin panel after first login.
