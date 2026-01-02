# 🎓 Database Setup Guide (Simple Explanation)

## 🤔 What's the Problem?

Think of your database like a swimming pool:
- **Pooler Connection** = A fast water slide (port 5432) - Great for playing, but you can't build new slides on it!
- **Direct Connection** = The pool itself (direct access) - Slower, but you CAN build new slides here!

**The Problem:** We're trying to build new slides (run migrations) using the water slide (pooler), which doesn't work!

## ✅ The Solution

We need TWO connection strings:
1. **DATABASE_URL** - For your app to talk to the database (uses the pooler - fast!)
2. **DIRECT_URL** - For migrations to build tables (uses direct connection - slower but works!)

---

## 📋 Step-by-Step Instructions

### Step 1: Get Your Direct Connection String from Supabase

1. **Go to Supabase Dashboard**
   - Open your browser
   - Go to https://supabase.com/dashboard
   - Log in to your account

2. **Find Your Project**
   - Click on your project (the one with `fktjdbubpzavcbzopqov` in the name)

3. **Go to Database Settings**
   - Look on the left sidebar
   - Click on **"Settings"** (gear icon ⚙️)
   - Click on **"Database"** in the settings menu

4. **Find the Connection String**
   - Scroll down to **"Connection string"** section
   - You'll see different tabs: **"URI"**, **"JDBC"**, **"Golang"**, etc.
   - Click on the **"URI"** tab
   - Look for **"Connection pooling"** section
   - You'll see two options:
     - ✅ **"Session mode"** or **"Transaction mode"** (this is the POOLER - keep this for DATABASE_URL)
     - ✅ **"Direct connection"** (this is what we need for DIRECT_URL!)

5. **Copy the Direct Connection String**
   - Click on **"Direct connection"**
   - You'll see a connection string that looks like:
     ```
     postgresql://postgres.fktjdbubpzavcbzopqov:[YOUR-PASSWORD]@aws-1-eu-central-1.pooler.supabase.com:5432/postgres
     ```
   - **IMPORTANT:** The direct connection might:
     - Use a different host (like `db.xxxxx.supabase.co` instead of `pooler.supabase.com`)
     - Use port `5432` (not `6543`)
     - NOT have `pgbouncer=true` in it
   - Copy this entire string

### Step 2: Update Your .env File

1. **Open the .env file**
   - Go to: `forex-academy/backend/.env`
   - Open it in your code editor

2. **Add or Update DIRECT_URL**
   - Find the line that says `DIRECT_URL=`
   - If it doesn't exist, add a new line
   - Paste your direct connection string from Step 1
   - Make sure it looks like this:
     ```
     DIRECT_URL="postgresql://postgres.fktjdbubpzavcbzopqov:YOUR_PASSWORD@db.fktjdbubpzavcbzopqov.supabase.co:5432/postgres?schema=public"
     ```
   - **Important:** 
     - Keep the quotes `"..."` around it
     - Make sure there's NO `pgbouncer=true` in the URL
     - The host should be different from the pooler one

3. **Keep DATABASE_URL as is**
   - Your `DATABASE_URL` should stay with the pooler (the fast one)
   - It should have `pgbouncer=true` in it
   - This is what your app uses for regular queries

### Step 3: Test the Migration

1. **Open your terminal**
   - Make sure you're in the `forex-academy/backend` folder

2. **Run the migration**
   ```bash
   npm run prisma:migrate
   ```

3. **What should happen:**
   - ✅ If it works: You'll see "Migration created successfully" or similar
   - ❌ If it doesn't work: You'll see an error message
     - If you see "Can't reach database server" → Your DIRECT_URL is wrong, go back to Step 1
     - If you see "timeout" → The connection string might still be using the pooler

---

## 🔍 How to Check if Your DIRECT_URL is Correct

Your DIRECT_URL should:
- ✅ Start with `postgresql://`
- ✅ Have your password in it
- ✅ Use a host like `db.xxxxx.supabase.co` OR the same host but WITHOUT `pgbouncer=true`
- ✅ Use port `5432` (usually)
- ✅ End with `/postgres` or `/postgres?schema=public`
- ❌ Should NOT have `pooler.supabase.com` in it (unless it's the direct connection format)
- ❌ Should NOT have `pgbouncer=true` in it

---

## 🆘 Still Having Problems?

### Problem: "Can't reach database server"
**Solution:** Your DIRECT_URL host is wrong. Go back to Supabase and make sure you copied the "Direct connection" string, not the "Session mode" one.

### Problem: "Timeout error"
**Solution:** Your DIRECT_URL might still be using the pooler. Check that it doesn't have `pgbouncer=true` and the host is correct.

### Problem: "Password is wrong"
**Solution:** Make sure you copied the entire connection string including the password part.

---

## 📝 Quick Checklist

Before running migrations, make sure:
- [ ] You have a `DIRECT_URL` in your `.env` file
- [ ] The `DIRECT_URL` is from Supabase's "Direct connection" section
- [ ] The `DIRECT_URL` does NOT have `pgbouncer=true`
- [ ] Your `DATABASE_URL` still has `pgbouncer=true` (for your app)
- [ ] You've saved the `.env` file

---

## 🎉 Success!

Once your migration works, you're all set! Your app will use the fast pooler connection for regular queries, and migrations will use the direct connection when needed.

