class AppConstants {
  static const String appName = 'Forex Academy';
  static const String apiBaseUrl = 'http://localhost:5000/api';
  
  // Storage Keys
  static const String tokenKey = 'auth_token';
  static const String userKey = 'user_data';
  
  // API Endpoints
  static const String loginEndpoint = '/auth/login';
  static const String registerEndpoint = '/auth/register';
  static const String coursesEndpoint = '/courses';
  static const String signalsEndpoint = '/signals';
  static const String liveClassesEndpoint = '/live-classes';
  static const String paymentsEndpoint = '/payments';
}

class AppColors {
  static const int primaryGold = 0xFFD4AF37;
  static const int darkBackground = 0xFF0A0E1A;
  static const int darkCard = 0xFF1F2937;
  static const int darkBorder = 0xFF374151;
}

