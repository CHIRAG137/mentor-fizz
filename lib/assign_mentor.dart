import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mentorfizz/mentor_evaluation.dart';
import 'package:mentorfizz/mentor_students.dart';

class AssignMentorScreen extends StatefulWidget {
  const AssignMentorScreen({Key? key}) : super(key: key);

  @override
  State<AssignMentorScreen> createState() => _AssignMentorScreenState();
}

class _AssignMentorScreenState extends State<AssignMentorScreen> {
  late List<Student> students = [];

  @override
  void initState() {
    super.initState();
    try {
      fetchStudents();
    } on Exception catch (e) {
      print(e.toString());
    }
  }

  Future<void> fetchStudents() async {
    final response = await http.get(
        Uri.parse('https://mentor-fizz.vercel.app/api/students/unassigned'));
    print('Response status code: ${response.statusCode}');
    print('Response body: ${response.body}');
    if (response.statusCode == 200) {
      final List<dynamic> responseData = jsonDecode(response.body);
      print(responseData); // Print response data for debugging
      setState(() {
        students = responseData.map((data) => Student.fromJson(data)).toList();
      });
    } else {
      throw Exception('Failed to load students');
    }
  }

  Future<void> assignStudent(
      String mentorId, String studentId, int index) async {
    print("Clicked");
    print(mentorId);
    print(studentId);
    final body = jsonEncode({"mentorId": mentorId, "studentId": studentId});
    final response = await http.post(
      Uri.parse('https://mentor-fizz.vercel.app/api/mentors/assign'),
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    );
    print('Response status code: ${response.statusCode}');
    print('Response body: ${response.body}');
    final responseData = jsonDecode(response.body);

    if (response.statusCode == 201) {
      print(responseData); // Print response data for debugging
      setState(() {
        students.removeAt(index);
      });
      showAlert('Message', 'Student Assigned Successfully');
    } else {
      showAlert('Error', responseData['error']);
    }
  }

  showAlert(String title, String message) {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(title),
          content: Text(message),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(context).pop();
              },
              child: const Text("OK"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: const [
                  Text(
                    "Assign a student",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
              const SizedBox(
                height: 24,
              ),
              SingleChildScrollView(
                scrollDirection: Axis.vertical,
                child: Column(
                  children: students.map((student) {
                    return StudentWidget(
                      student: student,
                      assignStudent: () {
                        final i = students.indexOf(student);

                        assignStudent(
                            '65ec4bffeffc9cea72983760', student.id, i);
                      },
                    );
                  }).toList(),
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        elevation: 0,
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => MentorStudentsScreen(),
            ),
          );
        },
        child: const Text("View"),
        backgroundColor: Color(0XFF4BAB84),
      ),
      floatingActionButtonLocation: FloatingActionButtonLocation.centerFloat,
    );
  }
}

class Student {
  final String id;
  final String name;
  final String email;
  final String subject;
  final String ideationMarks;
  final String evaluationMarks;
  final String vivaMarks;
  final bool isAssigned;
  final String mentor;

  Student({
    required this.id,
    required this.name,
    required this.email,
    required this.subject,
    required this.ideationMarks,
    required this.evaluationMarks,
    required this.vivaMarks,
    required this.isAssigned,
    required this.mentor,
  });

  factory Student.fromJson(Map<String, dynamic> json) {
    return Student(
      id: json['_id'],
      name: json['name'],
      email: json['email'],
      subject: json['subject'],
      ideationMarks: json['ideationMarks'].toString(),
      evaluationMarks: json['evaluationMarks'].toString(),
      vivaMarks: json['vivaMarks'].toString(),
      isAssigned: json['isAssigned'],
      mentor: json['mentor'] ?? '',
    );
  }
}

class StudentWidget extends StatelessWidget {
  final Student student;
  final VoidCallback assignStudent;
  const StudentWidget(
      {super.key, required this.student, required this.assignStudent});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            border: Border.all(
              color: Colors.grey.shade400,
              width: 0.5,
            ),
            borderRadius: BorderRadius.circular(8),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  CircleAvatar(
                    radius: 32,
                    child: Text(student.name[0]),
                  ),
                  const SizedBox(
                    width: 12,
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        student.name,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                      const SizedBox(
                        height: 14,
                      ),
                      Text(
                        student.subject,
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.grey.shade500,
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(
                    width: 0.5,
                    color: Colors.grey.shade400,
                  ),
                ),
                child: GestureDetector(
                  onTap: () => assignStudent(),
                  child: const Icon(
                    Icons.done,
                    color: Colors.green,
                  ),
                ),
              ),
            ],
          ),
        ),
        SizedBox(
          height: 12,
        ),
      ],
    );
  }
}
