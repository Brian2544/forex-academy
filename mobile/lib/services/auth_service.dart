import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../core/api.dart';
import '../core/constants.dart';
import '../models/user.dart';

class AuthService {
  static Future<Map<String, dynamic>> login(String email, String password) async {
    final response = await ApiService.post(
      AppConstants.loginEndpoint,
      {'email': email, 'password': password},
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success']) {
        final user = User.fromJson(data['data']['user']);
        final token = data['data']['token'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(AppConstants.tokenKey, token);
        await prefs.setString(AppConstants.userKey, jsonEncode(user.toJson()));

        return {'success': true, 'user': user, 'token': token};
      }
    }

    return {
      'success': false,
      'message': jsonDecode(response.body)['message'] ?? 'Login failed',
    };
  }

  static Future<Map<String, dynamic>> register(Map<String, dynamic> userData) async {
    final response = await ApiService.post(
      AppConstants.registerEndpoint,
      userData,
    );

    if (response.statusCode == 201 || response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success']) {
        final user = User.fromJson(data['data']['user']);
        final token = data['data']['token'];

        final prefs = await SharedPreferences.getInstance();
        await prefs.setString(AppConstants.tokenKey, token);
        await prefs.setString(AppConstants.userKey, jsonEncode(user.toJson()));

        return {'success': true, 'user': user, 'token': token};
      }
    }

    return {
      'success': false,
      'message': jsonDecode(response.body)['message'] ?? 'Registration failed',
    };
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(AppConstants.tokenKey);
    await prefs.remove(AppConstants.userKey);
  }

  static Future<User?> getCurrentUser() async {
    final prefs = await SharedPreferences.getInstance();
    final userJson = prefs.getString(AppConstants.userKey);
    if (userJson != null) {
      return User.fromJson(jsonDecode(userJson));
    }
    return null;
  }

  static Future<bool> isAuthenticated() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.containsKey(AppConstants.tokenKey);
  }
}

