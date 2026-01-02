# Forex Academy Backend

Backend API for the Forex Trading Training Platform.

## Tech Stack

- Node.js + Express
- PostgreSQL + Sequelize ORM
- JWT Authentication
- Flutterwave Payment Integration

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
   - Database credentials
   - JWT secret
   - Email configuration
   - Flutterwave keys
   - Frontend URL

4. Make sure PostgreSQL is running and create the database:
```sql
CREATE DATABASE forex_academy;
```

5. Run the server:
```bash
# Development
npm run dev

# Production
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/verify-email` - Verify email
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Courses
- `GET /api/courses` - Get all courses
- `GET /api/courses/:id` - Get course by ID
- `GET /api/courses/:courseId/lessons/:lessonId` - Get lesson
- `POST /api/courses/:courseId/lessons/:lessonId/complete` - Mark lesson complete
- `GET /api/courses/progress/my` - Get user progress

### Payments
- `GET /api/payments/plans` - Get subscription plans
- `POST /api/payments/initiate` - Initiate payment
- `GET /api/payments/verify` - Verify payment callback
- `GET /api/payments/history` - Get payment history
- `GET /api/payments/subscription` - Get current subscription

### Signals
- `GET /api/signals` - Get all signals
- `GET /api/signals/:id` - Get signal by ID
- `POST /api/signals` - Create signal (Admin/Trainer)
- `PUT /api/signals/:id/status` - Update signal status

### Live Classes
- `GET /api/live-classes` - Get all live classes
- `GET /api/live-classes/:id` - Get live class by ID

### Testimonials
- `GET /api/testimonials` - Get approved testimonials
- `POST /api/testimonials` - Submit testimonial

### Admin
- `GET /api/admin/dashboard/stats` - Get dashboard statistics
- `POST /api/admin/courses` - Create course
- `PUT /api/admin/courses/:id` - Update course
- `DELETE /api/admin/courses/:id` - Delete course
- `POST /api/admin/courses/:courseId/lessons` - Create lesson
- `PUT /api/admin/lessons/:id` - Update lesson
- `DELETE /api/admin/lessons/:id` - Delete lesson
- `POST /api/admin/live-classes` - Create live class
- `PUT /api/admin/live-classes/:id` - Update live class
- `GET /api/admin/testimonials` - Get all testimonials
- `PUT /api/admin/testimonials/:id/approve` - Approve testimonial

## Database Models

- User
- Course
- Lesson
- Subscription
- Payment
- Signal
- LiveClass
- Progress
- Testimonial

## Environment Variables

See `.env.example` for all required environment variables.

