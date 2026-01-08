# PHASE 0: Codebase Audit Summary

## A) DASHBOARD LAYOUTS

### ✅ EXISTING COMPONENTS:
1. **OwnerLayout** (`web/src/layouts/OwnerLayout.jsx`)
   - Has vertical left sidebar
   - Uses Outlet pattern for nested routes
   - Already in use for `/owner/*` routes

2. **AdminLayout** (`web/src/layouts/AdminLayout.jsx`)
   - ✅ **ALREADY HAS VERTICAL LEFT SIDEBAR**
   - Uses Outlet pattern for nested routes
   - Already in use for `/admin/*` routes in AppRoutes.jsx
   - **NO ACTION NEEDED** - Admin already has sidebar!

### ROUTING:
- `AppRoutes.jsx` correctly wraps admin routes with `AdminLayout`
- Admin routes are protected with `RoleRoute` component

## B) ROLE DETECTION & ROUTING

### EXISTING:
- `AuthContext.jsx` manages user/profile state
- `RoleRoute.jsx` guards routes by role
- Role stored in `profile.role` field
- Backend middleware: `requireRole.js`, `authorize.js`

## C) SUBSCRIPTION SYSTEM

### EXISTING:
1. **Database:**
   - `subscriptions` table with `status` field (inactive/active/past_due/canceled)
   - `user_id` foreign key to profiles

2. **Backend:**
   - `requireActiveSubscription.js` middleware checks subscription
   - Used in student routes (e.g., `/student/courses`)

3. **Frontend:**
   - `SubscriptionRoute.jsx` guard component
   - **BUG FOUND**: References `subscriptionStatus` from `useAuth()` but it's not provided
   - Need to fix this and add admin bypass

4. **Payment Integration:**
   - Paystack integration exists
   - `/billing/checkout` endpoint
   - Webhook handler updates subscription status

## D) AUDIT/LOGGING SYSTEM

### EXISTING:
- `role_audit` table exists (from `add_role_audit.sql`)
  - Tracks: actor_id, target_id, old_role, new_role, reason, created_at
  - Used by owner controller when updating roles

### MISSING:
- No `subscription_audit` table
- Need to create migration for subscription override tracking

## E) SUBSCRIPTION OVERRIDE

### MISSING:
- No endpoint for manual subscription activation
- No UI controls in Owner Dashboard for subscription override
- No UI controls in Admin Students page for subscription override
- No audit trail for subscription overrides

## SUMMARY

### ✅ TO REUSE:
1. `AdminLayout` - already has sidebar (no changes needed)
2. `OwnerLayout` - reuse pattern for consistency
3. `role_audit` table pattern - reuse for `subscription_audit`
4. Owner/Admin controller patterns - extend for subscription override

### 🔧 TO FIX:
1. `SubscriptionRoute.jsx` - fix missing `subscriptionStatus` and add admin bypass
2. `requireActiveSubscription.js` - add admin/owner bypass

### ➕ TO ADD:
1. Subscription override endpoint (`POST /api/admin/subscription/override`)
2. `subscription_audit` table migration
3. Subscription override UI in Owner Dashboard
4. Subscription override UI in Admin Students page
5. Display override actor info to owner

### 📊 CURRENT STATE:
- Admin sidebar: ✅ EXISTS (AdminLayout)
- Admin subscription bypass: ❌ MISSING
- Subscription override: ❌ MISSING
- Audit trail: ❌ MISSING (for subscriptions)

