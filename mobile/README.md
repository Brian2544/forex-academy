# Forex Academy Mobile App

Flutter mobile application for the Forex Trading Training Platform.

## Tech Stack

- Flutter 3.0+
- Dart 3.0+
- Provider (State Management)
- HTTP (API calls)
- Shared Preferences (Local storage)

## Setup

1. Install Flutter: https://flutter.dev/docs/get-started/install

2. Install dependencies:
```bash
flutter pub get
```

3. Update API URL in `lib/core/constants.dart`:
```dart
static const String apiBaseUrl = 'YOUR_API_URL';
```

4. Run the app:
```bash
flutter run
```

## Features

- User authentication (Login/Register)
- Course browsing
- Trading signals
- User dashboard
- Dark theme UI

## Project Structure

```
lib/
├── core/          # Constants, theme, API
├── models/        # Data models
├── services/      # API services
├── screens/       # App screens
└── widgets/       # Reusable widgets
```

## Building

### Android
```bash
flutter build apk
```

### iOS
```bash
flutter build ios
```

