# Phase 0: Pre-Flight Audit Report

## A) FRONTEND AUDIT

### Existing Routes (AppRoutes.jsx)
- ✅ `/pricing` - Public route, uses Pricing component
- ✅ `/billing` - Protected route, uses Billing component  
- ✅ `/billing/success` - Protected route, uses Billing component (callback handler)

### Existing Pages/Components
- ✅ `src/pages/Pricing.jsx` - Exists, uses `paymentService.getPlans()` and `paymentService.initiatePayment()`
- ✅ `src/pages/Billing.jsx` - Exists, has checkout flow but uses `/payments/checkout` endpoint
- ❌ No dedicated callback/verify page (Billing.jsx handles it via URL params)

### Auth + Profile
- ✅ `src/context/AuthContext.jsx` - Stores current user
- ✅ Frontend fetches user via `/auth/me` or similar
- ✅ User ID available via `req.userId` in backend

### Feature Gating
- ✅ `src/components/guards/SubscriptionRoute.jsx` - Exists, checks subscription status
- ✅ `src/middleware/requireActiveSubscription.js` - Backend middleware exists
- ✅ `/student/access` endpoint returns subscription status

### Frontend Service
- ✅ `src/services/payment.service.js` - Exists but uses different endpoints:
  - `getPlans()` → calls `/payments/plans` (doesn't exist)
  - `initiatePayment()` → calls `/payments/initiate` (doesn't exist)
  - Needs update to use `/billing/plans` and `/billing/checkout`

## B) BACKEND AUDIT

### Server Structure
- ✅ `src/server.js` - Entry point
- ✅ `src/app.js` - Express app setup
- ✅ Routes mounted: `/billing` and `/payments` both use `paymentRoutes`

### Existing Payment Routes
- ✅ `src/modules/payments/payments.routes.js`:
  - `POST /payments/webhook` - Webhook handler (no auth)
  - `GET /billing/plans` - Get plans
  - `POST /payments/checkout` - Initialize payment (auth required)
- ❌ Missing: `GET /billing/verify` - Verify transaction after callback
- ❌ Missing: `GET /billing/me` - Get current user subscription status

### Existing Payment Controller
- ✅ `src/modules/payments/payments.controller.js`:
  - `getPlans()` - Fetches from `plans` table
  - `checkout()` - Initializes Paystack transaction (one-time payment, not subscription)

### Webhook Handler
- ✅ `src/modules/payments/payments.webhook.js` - Exists
- ⚠️ Currently handles `charge.success` but doesn't handle subscription renewal events
- ⚠️ Doesn't create Paystack subscriptions, only one-time transactions

### Paystack Config
- ✅ `src/config/paystack.js` - Exists
- ✅ Has `initializeTransaction()` and `verifyTransaction()`
- ❌ Missing: Paystack subscription API methods (create customer, create subscription)

### Environment Config
- ✅ `src/config/env.js` - Loads env vars
- ✅ `PAYSTACK_SECRET_KEY` - Configured
- ✅ `PAYSTACK_WEBHOOK_SECRET` - Configured
- ✅ `APP_BASE_URL` - Configured

## C) DATABASE AUDIT (Supabase)

### Existing Tables
- ✅ `plans` table exists:
  - `id`, `name`, `price_usd`, `interval`, `is_active`
  - ❌ Missing: `paystack_plan_code_test`, `paystack_plan_code_live`
  
- ✅ `subscriptions` table exists:
  - `id`, `user_id`, `plan_id`, `status`, `provider`, `provider_ref`, `current_period_end`
  - ❌ Missing: `paystack_customer_code`, `paystack_subscription_code`
  
- ✅ `payment_events` table exists - For webhook idempotency

- ❌ `payments` table doesn't exist (optional but recommended)

### RLS Policies
- ✅ Subscriptions table has RLS: users can read own subscription
- ✅ Backend uses service role, so RLS is bypassed

## SUMMARY

### What Exists (Will Reuse)
1. ✅ Database tables: `plans`, `subscriptions`, `payment_events`
2. ✅ Backend routes: `/billing/plans`, `/payments/checkout`, `/payments/webhook`
3. ✅ Frontend pages: `Pricing.jsx`, `Billing.jsx`
4. ✅ Frontend routes: `/pricing`, `/billing`, `/billing/success`
5. ✅ Subscription checking: `requireActiveSubscription` middleware, `/student/access` endpoint
6. ✅ Paystack config and basic transaction methods

### What Needs to be Added (Minimal)
1. ❌ Database: Add Paystack plan codes to `plans` table
2. ❌ Database: Add Paystack customer/subscription codes to `subscriptions` table
3. ❌ Backend: Add `GET /billing/verify` endpoint
4. ❌ Backend: Add `GET /billing/me` endpoint
5. ❌ Backend: Add Paystack subscription API methods (create customer, create subscription)
6. ❌ Backend: Update webhook to handle subscription events (subscription.create, invoice.payment_failed, subscription.disable)
7. ❌ Backend: Update checkout to create Paystack subscriptions instead of one-time transactions
8. ❌ Frontend: Update `payment.service.js` to use correct endpoints
9. ❌ Frontend: Add proper callback verification in `Billing.jsx`

### What Needs to be Modified (Minimal)
1. ⚠️ `payments.controller.js` - Update checkout to create subscriptions
2. ⚠️ `payments.webhook.js` - Add subscription event handlers
3. ⚠️ `Billing.jsx` - Add verify call on callback
4. ⚠️ `payment.service.js` - Fix endpoint paths

### Naming Conventions
- Routes: `/billing/*` for billing-related, `/payments/*` for payment processing
- Files: `payments.controller.js`, `payments.routes.js`, `payments.webhook.js`
- Tables: `plans`, `subscriptions`, `payment_events`

