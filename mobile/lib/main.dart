import 'package:flutter/material.dart';
import 'core/theme.dart';
import 'screens/auth/login_screen.dart';
import 'services/auth_service.dart';

void main() {
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Forex Academy',
      theme: AppTheme.darkTheme,
      home: FutureBuilder<bool>(
        future: AuthService.isAuthenticated(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          }
          
          if (snapshot.data == true) {
            // Navigate to dashboard
            return LoginScreen(); // Replace with DashboardScreen
          }
          
          return LoginScreen();
        },
      ),
    );
  }
}

