import 'package:flutter/material.dart';
import '../../services/course_service.dart';
import '../../models/course.dart';

class CourseDetailsScreen extends StatefulWidget {
  final String courseId;

  CourseDetailsScreen({required this.courseId});

  @override
  _CourseDetailsScreenState createState() => _CourseDetailsScreenState();
}

class _CourseDetailsScreenState extends State<CourseDetailsScreen> {
  Course? _course;
  bool _isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadCourse();
  }

  Future<void> _loadCourse() async {
    final course = await CourseService.getCourseById(widget.courseId);
    setState(() {
      _course = course;
      _isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Course Details')),
      body: _isLoading
          ? Center(child: CircularProgressIndicator())
          : _course == null
              ? Center(child: Text('Course not found'))
              : SingleChildScrollView(
                  padding: EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        _course!.title,
                        style: TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                      SizedBox(height: 16),
                      Text(_course!.description),
                      SizedBox(height: 16),
                      Chip(label: Text(_course!.level)),
                    ],
                  ),
                ),
    );
  }
}

