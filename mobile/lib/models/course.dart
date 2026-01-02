class Course {
  final String id;
  final String title;
  final String description;
  final String level;
  final String? thumbnail;
  final int? duration;
  final double price;
  final bool isFree;
  final bool isPublished;
  final List<dynamic>? learningOutcomes;
  final List<dynamic>? topics;

  Course({
    required this.id,
    required this.title,
    required this.description,
    required this.level,
    this.thumbnail,
    this.duration,
    required this.price,
    required this.isFree,
    required this.isPublished,
    this.learningOutcomes,
    this.topics,
  });

  factory Course.fromJson(Map<String, dynamic> json) {
    return Course(
      id: json['id'],
      title: json['title'],
      description: json['description'],
      level: json['level'],
      thumbnail: json['thumbnail'],
      duration: json['duration'],
      price: (json['price'] ?? 0).toDouble(),
      isFree: json['isFree'] ?? json['is_free'] ?? false,
      isPublished: json['isPublished'] ?? json['is_published'] ?? false,
      learningOutcomes: json['learningOutcomes'] ?? json['learning_outcomes'],
      topics: json['topics'],
    );
  }
}

