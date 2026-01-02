import 'dart:convert';
import '../core/api.dart';
import '../core/constants.dart';

class PaymentService {
  static Future<Map<String, dynamic>> getPlans() async {
    final response = await ApiService.get('${AppConstants.paymentsEndpoint}/plans');

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['data']['plans'];
    }

    return {};
  }

  static Future<Map<String, dynamic>> initiatePayment(String plan) async {
    final response = await ApiService.post(
      '${AppConstants.paymentsEndpoint}/initiate',
      {'plan': plan},
    );

    if (response.statusCode == 200) {
      return jsonDecode(response.body)['data'];
    }

    return {};
  }
}

