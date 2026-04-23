import 'package:flutter/material.dart';
import '../models/course.dart';

class CourseCard extends StatelessWidget {
  final Course course;
  final VoidCallback? onTap;

  CourseCard({required this.course, this.onTap});

  String _priceLabelForLevel(String level) {
    switch (level.toLowerCase()) {
      case 'beginner':
        return '200 USD';
      case 'intermediate':
        return '150 USD';
      case 'advanced':
        return '100 USD';
      default:
        return '100 USD';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Card(
      child: InkWell(
        onTap: onTap,
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                course.title,
                style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(height: 8),
              Text(
                course.description,
                maxLines: 2,
                overflow: TextOverflow.ellipsis,
              ),
              SizedBox(height: 8),
              Row(
                children: [
                  Chip(label: Text(course.level)),
                  SizedBox(width: 8),
                  Chip(
                    label: Text(_priceLabelForLevel(course.level)),
                    backgroundColor: Colors.green.withOpacity(0.2),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}

