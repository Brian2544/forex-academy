# Forex Academy - Setup Guide

## ✅ Current Status

- ✅ Backend server is running on port 4000
- ✅ Supabase connection is configured and working
- ✅ Environment variables are set up
- ✅ Paystack is optional (won't break the system)
- ⚠️  Database tables need to be created

## 📋 Step 1: Set Up Database Tables

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: `drhpbpffnqvjoxatagdc`

2. **Open SQL Editor:**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Schema:**
   - Open the file: `forex-academy/backend/database/schema.sql`
   - Copy ALL the SQL code
   - Paste it into the Supabase SQL Editor
   - Click "Run" (or press Ctrl+Enter)

4. **Verify Tables Created:**
   - Go to "Table Editor" in Supabase
   - You should see these tables:
     - `profiles`
     - `plans`
     - `subscriptions`
     - `courses`
     - `lessons`
     - `live_sessions`
     - `announcements`
     - `blog_posts`
     - `market_analysis`
     - `testimonials`
     - `chat_groups`
     - `chat_group_members`
     - `chat_messages`
     - `app_settings`
     - `payment_events`

## 👤 Step 2: Create Your First User

### Option A: Through the Frontend (Recommended)

1. **Start the Frontend:**
   ```bash
   cd forex-academy/web
   npm run dev
   ```

2. **Register a New User:**
   - Open http://localhost:5173
   - Click "Register" or go to `/register`
   - Fill in your email and password
   - Complete the registration

3. **Complete Profile:**
   - After registration, you'll be prompted to complete your profile
   - Enter: First Name, Last Name, Country, Country Code
   - Your profile will be created automatically

### Option B: Create Owner User (After First Registration)

After you've registered your first user through the frontend:

1. **Find Your Email:**
   - Note the email you used to register

2. **Run the Owner Script:**
   ```bash
   cd forex-academy/backend
   node scripts/create-owner.js your-email@example.com
   ```

   This will promote your user to `owner` role, giving you full admin access.

## 🧪 Step 3: Test the Connection

Run the connection test script:
```bash
cd forex-academy/backend
node scripts/test-connection.js
```

You should see:
```
✅ Successfully connected to Supabase!
✅ Database tables exist
```

## 🚀 Step 4: Start Development

### Backend (Already Running)
The backend is running on: http://localhost:4000

### Frontend
```bash
cd forex-academy/web
npm run dev
```

Frontend will run on: http://localhost:5173

## 🔐 Authentication Flow

1. **User registers** → Supabase Auth creates user
2. **User logs in** → Gets JWT token
3. **Frontend calls** `/auth/bootstrap` → Creates profile in `profiles` table
4. **User is redirected** based on role:
   - `student` → `/student/dashboard`
   - `admin` → `/admin/overview`
   - `owner` → `/admin/overview`

## 💳 Payment Setup (Later)

When you're ready to set up payments:

1. **Get Paystack Keys:**
   - Sign up at https://paystack.com
   - Get your Secret Key and Webhook Secret

2. **Update `.env`:**
   ```env
   PAYSTACK_SECRET_KEY=sk_live_xxxxx
   PAYSTACK_WEBHOOK_SECRET=xxxxx
   ```

3. **Configure Webhook:**
   - In Paystack Dashboard → Settings → Webhooks
   - Add webhook URL: `https://your-domain.com/payments/webhook`
   - Copy the webhook secret to `.env`

## 🐛 Troubleshooting

### Backend won't start
- Check if port 4000 is already in use
- Verify `.env` file exists in `forex-academy/backend/`
- Check that all dependencies are installed: `npm install`

### Database connection fails
- Verify Supabase URL and Service Role Key in `.env`
- Run: `node scripts/test-connection.js`

### User can't register/login
- Make sure database tables are created (Step 1)
- Check Supabase Auth is enabled in your project
- Verify frontend `.env` has correct Supabase URL and Anon Key

### Profile creation fails
- Ensure `profiles` table exists
- Check that the user was created in Supabase Auth
- Verify backend can connect to Supabase (run test script)

## 📝 Next Steps

1. ✅ Set up database tables (Step 1)
2. ✅ Create your first user (Step 2)
3. ✅ Test login and profile creation
4. ✅ Create owner user for admin access
5. ⏳ Set up Paystack when ready for payments

## 🎉 You're Ready!

Once the database tables are created, you can:
- Register and login users
- Create profiles automatically
- Access the student dashboard
- Use admin features (if you're an owner/admin)

The system is fully functional without Paystack - payment features will be disabled until you configure it.

