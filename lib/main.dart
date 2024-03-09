import 'package:flutter/material.dart';
import 'package:mentorfizz/assign_mentor.dart';
import 'package:mentorfizz/mentor_evaluation.dart';
import 'package:mentorfizz/mentor_students.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return const MaterialApp(
      home: AssignMentorScreen(),
      debugShowCheckedModeBanner: false,
    );
  }
}
