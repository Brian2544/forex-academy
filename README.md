# Forex Trading Academy

**Learn. Practice. Trade with Confidence.**

A comprehensive Forex trading training platform with courses, live classes, trading signals, and mentorship.

## 🏗️ Project Structure

```
forex-academy/
├── backend/          # Node.js + Express + PostgreSQL API
├── web/             # React + Tailwind CSS Web App
├── mobile/          # Flutter Mobile App
├── shared/          # Shared resources (API docs, constants)
└── docs/            # Documentation
```

## 🚀 Quick Start

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```env
PORT=5000
DB_HOST=localhost
DB_NAME=forex_academy
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
# ... other variables
```

4. Create PostgreSQL database:
```sql
CREATE DATABASE forex_academy;
```

5. Start the server:
```bash
npm run dev
```

### Web Frontend Setup

1. Navigate to web directory:
```bash
cd web
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm run dev
```

### Mobile App Setup

1. Navigate to mobile directory:
```bash
cd mobile
```

2. Install Flutter dependencies:
```bash
flutter pub get
```

3. Update API URL in `lib/core/constants.dart`

4. Run the app:
```bash
flutter run
```

## 📋 Features

### Phase 1 (MVP) ✅
- User authentication (Register/Login)
- Email verification
- User dashboard
- Beginner course content
- Payment integration (Flutterwave)
- Admin panel
- Legal pages (Terms, Privacy, Disclaimer)

### Phase 2 (Growth)
- Intermediate & Advanced courses
- Strategy library
- Live class scheduling
- Testimonials system
- Email & push notifications

### Phase 3 (Premium)
- Trading signals module
- Trade history tracking
- Progress tracking & certificates
- Referral system

## 🛠️ Tech Stack

### Backend
- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT Authentication
- Flutterwave Payment Gateway
- Nodemailer (Email service)

### Web Frontend
- React 18
- Vite
- Tailwind CSS
- React Router
- Axios
- React Hot Toast

### Mobile
- Flutter 3.0+
- Provider (State Management)
- HTTP (API calls)

## 📚 API Documentation

See [shared/constants/api-endpoints.md](./shared/constants/api-endpoints.md) for complete API documentation.

## 🔐 User Roles

- **Student**: Access courses, watch videos, receive signals, join live classes
- **Admin**: Upload lessons, schedule classes, post signals, manage users
- **Trainer**: Create live classes, post signals

## 💳 Subscription Plans

- **Free**: Beginner course, limited videos, community access
- **Monthly ($29.99)**: All courses, strategy library, certificates
- **Premium ($99.99)**: Live signals, mentorship, priority support
- **Lifetime ($499.99)**: All features, lifetime access

## ⚠️ Legal & Compliance

All legal pages are included:
- Terms & Conditions
- Privacy Policy
- Risk Disclaimer

**Important**: This platform is for educational purposes only. We do not provide financial advice or guarantee profits.

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=localhost
DB_NAME=forex_academy
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
FLUTTERWAVE_PUBLIC_KEY=your_key
FLUTTERWAVE_SECRET_KEY=your_secret
FRONTEND_URL=http://localhost:3000
```

### Web (.env)
```
VITE_API_URL=http://localhost:5000/api
```

## 🗄️ Database Schema

Key tables:
- `users` - User accounts
- `courses` - Course catalog
- `lessons` - Course lessons
- `subscriptions` - User subscriptions
- `payments` - Payment records
- `signals` - Trading signals
- `live_classes` - Scheduled classes
- `progress` - User learning progress
- `testimonials` - User testimonials

## 🎨 UI/UX

- **Theme**: Dark mode (default)
- **Accent Color**: Gold (#D4AF37)
- **Design**: Premium, trustworthy, data-driven

## 📱 Deployment

### Backend
- Recommended: VPS (DigitalOcean, AWS, Truehost)
- Database: PostgreSQL
- Environment: Node.js 18+

### Web
- Recommended: Vercel, Netlify, or VPS
- Build: `npm run build`

### Mobile
- Android: Google Play Store
- iOS: App Store

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

All rights reserved. This is a proprietary platform.

## ⚠️ Disclaimer

**Trading forex involves substantial risk of loss. Past performance is not indicative of future results. We do not guarantee profits. Only trade with money you can afford to lose.**

---

**Built with ❤️ for Forex Traders**

