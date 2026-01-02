# Forex Academy Web Frontend

React-based web application for the Forex Trading Training Platform.

## Tech Stack

- React 18
- Vite
- React Router
- Tailwind CSS
- Axios
- React Hot Toast

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Run the development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

## Features

- User authentication (Login/Register)
- Course browsing and learning
- Trading signals display
- Live classes and webinars
- Subscription management
- User dashboard with progress tracking
- Responsive design with dark theme

## Pages

- `/` - Home page
- `/courses` - Browse all courses
- `/signals` - View trading signals
- `/live-classes` - Live classes and webinars
- `/pricing` - Subscription plans
- `/dashboard` - User dashboard (protected)
- `/profile` - User profile (protected)
- `/login` - Login page
- `/register` - Registration page
- `/legal/terms` - Terms and Conditions
- `/legal/privacy` - Privacy Policy
- `/legal/disclaimer` - Risk Disclaimer

## Project Structure

```
src/
├── components/     # Reusable components
├── pages/          # Page components
├── services/       # API services
├── context/        # React context
├── hooks/          # Custom hooks
├── routes/         # Route configuration
└── styles/         # Global styles
```

