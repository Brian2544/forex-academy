# 🔧 Supabase Network Setup - Fix Connection Issues

## 🎯 The Problem

If you're getting "Can't reach database server" or timeout errors, it's likely because **Supabase is blocking connections from your IP address**.

## ✅ Solution: Allow Your IP in Supabase

### Step 1: Check Network Restrictions (2 minutes)

1. **Go to Supabase Dashboard**
   - Open: https://supabase.com/dashboard
   - Click on your project

2. **Go to Database Settings**
   - Click **Settings** (⚙️) on the left sidebar
   - Click **Database** in the settings menu

3. **Find Network Restrictions**
   - Scroll down to **"Network Restrictions"** or **"Connection Pooling"** section
   - Look for **"Allowed IP addresses"** or **"Restrict connections"**

4. **Enable Connections**
   - **Option A (Easiest):** Enable **"Allow connections from anywhere"** (for development)
   - **Option B (More Secure):** Add your current IP address to the allowed list
     - You can find your IP at: https://whatismyipaddress.com/
     - Click "Add IP" and paste your IP address

### Step 2: Verify Direct Connection String

Make sure your `DIRECT_URL` in `.env` uses the correct format from Supabase:

1. In Supabase Dashboard → Settings → Database
2. Scroll to **"Connection string"**
3. Set **"Method"** dropdown to **"Direct connection"**
4. Copy the connection string
5. It should look like:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.fktjdbubpzavcbzopqov.supabase.co:5432/postgres
   ```

### Step 3: Test the Connection

Run this command to test:
```bash
cd forex-academy/backend
node scripts/test-connection.js
```

This will tell you if the connection works!

---

## 🔍 Common Issues

### Issue: "Can't reach database server"
**Cause:** Your IP is blocked or the host is wrong
**Fix:** 
1. Check Supabase Network Restrictions (Step 1 above)
2. Make sure DIRECT_URL uses `db.xxxxx.supabase.co` (not `pooler.supabase.com`)

### Issue: "Timeout"
**Cause:** Still using pooler or network is slow
**Fix:**
1. Make sure DIRECT_URL does NOT have `pgbouncer=true`
2. Make sure DIRECT_URL host is `db.xxxxx.supabase.co`
3. Check your internet connection

### Issue: "Password incorrect"
**Cause:** Wrong password in connection string
**Fix:**
1. Get a fresh connection string from Supabase
2. Make sure you copied the entire string including password

---

## 📝 Quick Checklist

- [ ] Supabase Network Restrictions allow your IP (or "anywhere")
- [ ] DIRECT_URL uses "Direct connection" string from Supabase
- [ ] DIRECT_URL host is `db.xxxxx.supabase.co` (not pooler)
- [ ] DIRECT_URL does NOT have `pgbouncer=true`
- [ ] You've tested with `node scripts/test-connection.js`

---

## 🎉 Once It Works

After allowing your IP and setting the correct DIRECT_URL, migrations should work perfectly!

