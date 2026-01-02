# API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication Endpoints

### Register
- **POST** `/auth/register`
- Body: `{ firstName, lastName, email, password, phone?, skillLevel?, referralCode? }`

### Login
- **POST** `/auth/login`
- Body: `{ email, password }`

### Verify Email
- **GET** `/auth/verify-email?token={token}`

### Forgot Password
- **POST** `/auth/forgot-password`
- Body: `{ email }`

### Reset Password
- **POST** `/auth/reset-password`
- Body: `{ token, password }`

### Get Profile
- **GET** `/auth/profile` (Protected)

### Update Profile
- **PUT** `/auth/profile` (Protected)
- Body: `{ firstName?, lastName?, phone?, skillLevel? }`

## Course Endpoints

### Get All Courses
- **GET** `/courses?level={level}&isFree={boolean}`

### Get Course by ID
- **GET** `/courses/:id`

### Get Lesson
- **GET** `/courses/:courseId/lessons/:lessonId` (Protected)

### Mark Lesson Complete
- **POST** `/courses/:courseId/lessons/:lessonId/complete` (Protected)

### Get User Progress
- **GET** `/courses/progress/my` (Protected)

## Payment Endpoints

### Get Plans
- **GET** `/payments/plans`

### Initiate Payment
- **POST** `/payments/initiate` (Protected)
- Body: `{ plan }`

### Verify Payment
- **GET** `/payments/verify?transaction_id={id}&tx_ref={ref}`

### Get Payment History
- **GET** `/payments/history` (Protected)

### Get Current Subscription
- **GET** `/payments/subscription` (Protected)

## Signal Endpoints

### Get All Signals
- **GET** `/signals?status={status}&currencyPair={pair}`

### Get Signal by ID
- **GET** `/signals/:id`

### Create Signal
- **POST** `/signals` (Admin/Trainer)
- Body: `{ currencyPair, action, entryPrice, stopLoss, takeProfit, riskPercentage?, explanation?, isPremium? }`

### Update Signal Status
- **PUT** `/signals/:id/status` (Admin/Trainer)
- Body: `{ status }`

## Live Class Endpoints

### Get All Live Classes
- **GET** `/live-classes?status={status}&isWebinar={boolean}`

### Get Live Class by ID
- **GET** `/live-classes/:id`

## Testimonial Endpoints

### Get Testimonials
- **GET** `/testimonials?isFeatured={boolean}`

### Create Testimonial
- **POST** `/testimonials` (Protected)
- Body: `{ content, rating?, videoUrl?, screenshotUrl? }`

## Admin Endpoints

### Get Dashboard Stats
- **GET** `/admin/dashboard/stats` (Admin)

### Course Management
- **POST** `/admin/courses` (Admin)
- **PUT** `/admin/courses/:id` (Admin)
- **DELETE** `/admin/courses/:id` (Admin)

### Lesson Management
- **POST** `/admin/courses/:courseId/lessons` (Admin)
- **PUT** `/admin/lessons/:id` (Admin)
- **DELETE** `/admin/lessons/:id` (Admin)

### Live Class Management
- **POST** `/admin/live-classes` (Admin/Trainer)
- **PUT** `/admin/live-classes/:id` (Admin/Trainer)

### Testimonial Management
- **GET** `/admin/testimonials` (Admin)
- **PUT** `/admin/testimonials/:id/approve` (Admin)

