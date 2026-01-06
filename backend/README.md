# Forex Academy Backend API

Node.js + Express backend for the Forex Learning App with Supabase Auth and Paystack payments.

## Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Configure environment variables:**
Create a `.env` file in the `backend/` directory:

```env
PORT=4000
FRONTEND_URL=http://localhost:3000
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key
PAYSTACK_WEBHOOK_SECRET=your_paystack_webhook_secret
APP_BASE_URL=http://localhost:3000
```

3. **Set up Supabase database:**
Run the SQL migrations in `database/schema.sql` in your Supabase SQL editor.

4. **Configure Paystack webhook:**
- Go to Paystack Dashboard > Settings > Webhooks
- Add webhook URL: `https://your-domain.com/payments/webhook`
- Copy the webhook secret and add it to `.env` as `PAYSTACK_WEBHOOK_SECRET`

5. **Run the server:**
```bash
npm run dev
# or
npm start
```

## Database Schema

See `database/schema.sql` for complete table definitions.

### Key Tables:
- `profiles` - User profiles with roles (student/admin/owner)
- `plans` - Subscription plans
- `subscriptions` - User subscriptions (activated via Paystack webhook)
- `payment_events` - Webhook event log for idempotency
- `courses`, `lessons`, `live_sessions`, `announcements`, `blog_posts`, `market_analysis`, `testimonials` - Content tables
- `chat_groups`, `chat_group_members`, `chat_messages` - Chat system
- `app_settings` - Application settings (WhatsApp URL, etc.)

## API Endpoints

### Authentication
- `POST /auth/bootstrap` - Create/update user profile (requires Bearer token)

### Users
- `GET /users/me` - Get current user profile

### Student
- `GET /student/dashboard` - Get dashboard data (subscription status, counts, etc.)
- `GET /student/access` - Get subscription status

### Payments
- `GET /billing/plans` - Get available subscription plans
- `POST /payments/checkout` - Initialize Paystack payment
- `POST /payments/webhook` - Paystack webhook handler (public)

### Admin (requires admin/owner role)
- `POST /admin/users/:id/role` - Update user role (owner only)
- `PATCH /admin/settings` - Update app settings
- CRUD endpoints for: courses, lessons, live-sessions, announcements, blog-posts, market-analysis, testimonials

### Chat (requires active subscription)
- `GET /chat/groups` - Get user's chat groups
- `GET /chat/groups/:id/messages` - Get messages for a group
- `POST /chat/groups/:id/messages` - Send message

### Admin Chat Management
- `POST /chat/admin/groups` - Create chat group
- `PATCH /chat/admin/groups/:id` - Update chat group
- `DELETE /chat/admin/groups/:id` - Delete chat group
- `POST /chat/admin/groups/:id/members` - Add member to group
- `DELETE /chat/admin/groups/:id/members/:userId` - Remove member from group

## Creating an Owner

To create the first owner user, you have three options:

### Option 1: Using the seed script (Recommended)
1. Sign up a user through the frontend
2. Run the seed script:
```bash
node scripts/create-owner.js user@example.com
```

### Option 2: Using SQL
Run this SQL in Supabase SQL editor (replace `USER_EMAIL` with the user's email):

```sql
UPDATE profiles
SET role = 'owner'
WHERE id = (
  SELECT id FROM auth.users WHERE email = 'USER_EMAIL'
);
```

### Option 3: Using the admin API endpoint
(Only works if you already have an owner):
```bash
POST /admin/users/:id/role
Body: { "role": "owner" }
```

## Testing

### Test Paystack Webhook Locally

Use a tool like ngrok to expose your local server:
```bash
ngrok http 4000
```

Then set the webhook URL in Paystack dashboard to your ngrok URL + `/payments/webhook`.

### Sample API Calls

```bash
# Get plans
curl http://localhost:4000/billing/plans

# Bootstrap profile (requires Bearer token)
curl -X POST http://localhost:4000/auth/bootstrap \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT" \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","country":"Nigeria","country_code":"NG"}'

# Get dashboard (requires Bearer token)
curl http://localhost:4000/student/dashboard \
  -H "Authorization: Bearer YOUR_SUPABASE_JWT"
```

## Frontend Setup

The frontend is a React Vite app located in `/web`. To set it up:

1. **Navigate to web directory:**
```bash
cd web
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create `.env` file:**
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_API_BASE_URL=http://localhost:4000
```

4. **Run development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Paystack Configuration

### 1. Get API Keys
- Sign up at [Paystack](https://paystack.com)
- Go to Settings > API Keys & Webhooks
- Copy your **Secret Key** (starts with `sk_`)
- Add it to backend `.env` as `PAYSTACK_SECRET_KEY`

### 2. Set Up Webhook
- In Paystack Dashboard, go to Settings > Webhooks
- Click "Add Webhook URL"
- Enter: `https://your-domain.com/payments/webhook` (or use ngrok for local testing)
- Copy the **Webhook Secret** (shown after creating webhook)
- Add it to backend `.env` as `PAYSTACK_WEBHOOK_SECRET`

### 3. Test Mode
- Use test keys for development
- Test card: `4084084084084081` (CVV: 408, Expiry: any future date)
- Test webhook events can be triggered from Paystack dashboard

## Important Notes

- All protected routes require `Authorization: Bearer <supabase_jwt_token>` header
- Subscription activation happens **ONLY** via Paystack webhook confirmation
- Students **cannot** access portal content without active subscription
- Role management is done in-app (not manually in Supabase dashboard)
- The webhook handler uses raw body parsing for signature verification
- All student content routes (except dashboard and access) require active subscription

