## Created Env Files

- `backend/.env`
- `web/.env`

## Variables Still Needing Real Values

### Backend (`backend/.env`)

- `SUPABASE_URL` - Supabase Dashboard -> Settings -> API (Project URL)
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase Dashboard -> Settings -> API (service_role key)
- `PAYSTACK_SECRET_KEY` - Paystack Dashboard -> Settings -> API Keys & Webhooks (Secret Key)
- `PAYSTACK_WEBHOOK_SECRET` - Paystack Dashboard -> Settings -> API Keys & Webhooks (Webhook Secret)
- `PAYSTACK_PUBLIC_KEY` - Paystack Dashboard -> Settings -> API Keys & Webhooks (Public Key)
- `PAYSTACK_MOCK_MODE` - local backend setting (set manually if you want mock mode)
- `PAYSTACK_CURRENCY` - local backend setting (must match your Paystack merchant support)
- `PAYSTACK_ACCESS_DAYS` - local backend setting (default access duration)
- `PAYSTACK_CHANNELS` - local backend setting (comma-separated Paystack channels)
- `APP_BASE_URL` - backend app URL config used for callback URLs
- `FRONTEND_URL` - frontend origin used by backend CORS/redirects
- `PORT` - backend server port
- `OWNER_EMAILS` - local app role config (comma-separated owner emails)
- `OWNER_EMAIL` - local script input fallback for `scripts/create-owner.js`
- `SUPABASE_DB_URL` - Supabase Dashboard -> Project -> Database (connection string)
- `DATABASE_URL` - database connection string (same source as above if used)

### Frontend (`web/.env`)

- `VITE_SUPABASE_URL` - Supabase Dashboard -> Settings -> API (Project URL)
- `VITE_SUPABASE_ANON_KEY` - Supabase Dashboard -> Settings -> API (anon/publishable key)
- `VITE_API_BASE_URL` - backend base URL reachable by frontend
- `VITE_PAYSTACK_PUBLIC_KEY` - Paystack Dashboard -> Settings -> API Keys & Webhooks (Public Key)
- `VITE_SUPABASE_STORAGE_BUCKET` - Supabase Storage bucket name used by app
- `VITE_API_PROXY_TARGET` - optional local Vite proxy target

## Frontend vs Backend Placement

- Backend-only secrets/config belong in `backend/.env`
- Frontend `VITE_*` values belong in `web/.env`

## Never Expose In Frontend

- `SUPABASE_SERVICE_ROLE_KEY`
- `PAYSTACK_SECRET_KEY`
- `PAYSTACK_WEBHOOK_SECRET`
- `SUPABASE_DB_URL`
- `DATABASE_URL`

## Short Startup Order After Filling Values

1. Fill `backend/.env` with real backend values
2. Fill `web/.env` with real frontend values
3. Start backend (`backend`, `npm run dev`)
4. Start frontend (`web`, `npm run dev`)
5. Test auth (register/login)
6. Test payment init, callback, verify, and webhook flow
