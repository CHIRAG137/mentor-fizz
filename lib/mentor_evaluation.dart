import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:mentorfizz/mentor_students.dart';
import 'package:pdf/pdf.dart';
import 'package:pdf/widgets.dart' as pw;
import 'package:path_provider/path_provider.dart';

class MentorEvaluation extends StatefulWidget {
  final String studentId;
  final String mentorId;

  const MentorEvaluation(
      {super.key, required this.mentorId, required this.studentId});

  @override
  State<MentorEvaluation> createState() => _MentorEvaluationState();
}

class _MentorEvaluationState extends State<MentorEvaluation> {
  final TextEditingController ideationController = TextEditingController();
  final TextEditingController executionController = TextEditingController();
  final TextEditingController vivaController = TextEditingController();

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

  Future<void> submitEvaluation() async {
    final String ideation = ideationController.text;
    final String execution = executionController.text;
    final String viva = vivaController.text;

    final Uri url =
        Uri.parse('https://mentor-fizz.vercel.app/api/mentors/update');
    final Map<String, String> body = {
      'studentId': widget.studentId,
      'mentorId': widget.mentorId,
      'ideationMarks': ideation,
      'evaluationMarks': execution,
      'vivaMarks': viva,
    };

    try {
      final response = await http.patch(
        url,
        body: json.encode(body),
        headers: {'Content-Type': 'application/json'},
      );

      if (response.statusCode == 201) {
        showAlert('Message',
            'Evaluation submitted successfully.\nTotal Marks : ${int.parse(ideation) + int.parse(execution) + int.parse(viva)}');
        print('Evaluation submitted successfully');
      } else {
        showAlert('Message', 'Failed to submit evaluation.');

        print(
            'Failed to submit evaluation. Status code: ${response.statusCode}');
      }
    } catch (error) {
      showAlert('Message', 'Error submitting evaluation: $error');
      print('Error submitting evaluation: $error');
    }
  }

  
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Container(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                children: [
                  Row(
                    children: [
                      GestureDetector(
                        child: const Icon(
                          Icons.arrow_back_ios_new_rounded,
                        ),
                        onTap: () {
                          Navigator.push(
                            context,
                            MaterialPageRoute(
                              builder: (context) =>
                                  const MentorStudentsScreen(),
                            ),
                          );
                        },
                      ),
                      const SizedBox(
                        width: 28,
                      ),
                      const Text(
                        "Evaluate a student",
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
                  RoundedBorderTextFormField(
                    controller: ideationController,
                    hintText: "Enter Ideation marks",
                  ),
                  const SizedBox(
                    height: 12,
                  ),
                  RoundedBorderTextFormField(
                    controller: executionController,
                    hintText: "Enter execution marks",
                  ),
                  const SizedBox(
                    height: 12,
                  ),
                  RoundedBorderTextFormField(
                    controller: vivaController,
                    hintText: "Enter viva marks",
                  ),
                  const SizedBox(
                    height: 12,
                  ),
                ],
              ),
              Container(
                width: double.infinity,
                child: ElevatedButton(
                  style: ButtonStyle(
                    elevation: MaterialStateProperty.all(0),
                    backgroundColor: MaterialStateProperty.all(Colors.black),
                  ),
                  onPressed: submitEvaluation,
                  child: const Text("Submit"),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class RoundedBorderTextFormField extends StatelessWidget {
  final TextEditingController controller;
  final String hintText;

  const RoundedBorderTextFormField({
    Key? key,
    required this.controller,
    required this.hintText,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(8),
        border: Border.all(
          color: Colors.grey[400]!,
          width: 0.5,
        ),
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 12.0),
        child: TextFormField(
          controller: controller,
          keyboardType: TextInputType.number,
          decoration: InputDecoration(
            hintText: hintText,
            border: InputBorder.none,
          ),
        ),
      ),
    );
  }
}
