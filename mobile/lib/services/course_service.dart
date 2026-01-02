import 'dart:convert';
import '../core/api.dart';
import '../core/constants.dart';
import '../models/course.dart';

class CourseService {
  static Future<List<Course>> getCourses({String? level}) async {
    final endpoint = level != null
        ? '${AppConstants.coursesEndpoint}?level=$level'
        : AppConstants.coursesEndpoint;

    final response = await ApiService.get(endpoint);

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success']) {
        final courses = (data['data']['courses'] as List)
            .map((json) => Course.fromJson(json))
            .toList();
        return courses;
      }
    }

    return [];
  }

  static Future<Course?> getCourseById(String id) async {
    final response = await ApiService.get('${AppConstants.coursesEndpoint}/$id');

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['success']) {
        return Course.fromJson(data['data']['course']);
      }
    }

    return null;
  }
}

