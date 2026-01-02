# 🚀 Quick Fix Guide

## The Problem in One Sentence
**Your migrations are trying to use the fast pooler connection, but migrations need the slower direct connection to work!**

---

## ⚡ 3-Step Quick Fix

### Step 1: Get Direct Connection from Supabase (2 minutes)
1. Go to: https://supabase.com/dashboard
2. Click your project → **Settings** → **Database**
3. Scroll to **"Connection string"**
4. Click **"Direct connection"** tab (NOT "Session mode"!)
5. Copy the connection string

### Step 2: Add to .env File (1 minute)
Open `forex-academy/backend/.env` and add/update:
```env
DIRECT_URL="paste-your-direct-connection-string-here"
```

**Important:** Make sure it does NOT have `pgbouncer=true` in it!

### Step 3: Run Migration (30 seconds)
```bash
cd forex-academy/backend
npm run prisma:migrate
```

---

## ✅ How to Know It's Working

**Good signs:**
- ✅ Migration starts without errors
- ✅ You see "Migration created successfully"
- ✅ No timeout errors

**Bad signs (means DIRECT_URL is wrong):**
- ❌ "Can't reach database server" → Wrong host in DIRECT_URL
- ❌ "Timeout" → Still using pooler, check for `pgbouncer=true`
- ❌ "Password incorrect" → Connection string is incomplete

---

## 📚 Need More Help?

Read the full guide: `DATABASE_SETUP.md`

