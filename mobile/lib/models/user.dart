class User {
  final String id;
  final String firstName;
  final String lastName;
  final String email;
  final String? phone;
  final String role;
  final String skillLevel;
  final bool isEmailVerified;
  final String? profileImage;
  final String? referralCode;

  User({
    required this.id,
    required this.firstName,
    required this.lastName,
    required this.email,
    this.phone,
    required this.role,
    required this.skillLevel,
    required this.isEmailVerified,
    this.profileImage,
    this.referralCode,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      firstName: json['firstName'] ?? json['first_name'] ?? '',
      lastName: json['lastName'] ?? json['last_name'] ?? '',
      email: json['email'],
      phone: json['phone'],
      role: json['role'] ?? 'student',
      skillLevel: json['skillLevel'] ?? json['skill_level'] ?? 'beginner',
      isEmailVerified: json['isEmailVerified'] ?? json['is_email_verified'] ?? false,
      profileImage: json['profileImage'] ?? json['profile_image'],
      referralCode: json['referralCode'] ?? json['referral_code'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'firstName': firstName,
      'lastName': lastName,
      'email': email,
      'phone': phone,
      'role': role,
      'skillLevel': skillLevel,
      'isEmailVerified': isEmailVerified,
      'profileImage': profileImage,
      'referralCode': referralCode,
    };
  }

  String get fullName => '$firstName $lastName';
}

