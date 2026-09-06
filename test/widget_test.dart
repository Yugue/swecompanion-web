import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swe_companion/main.dart';
import 'package:swe_companion/study_data.dart';

void main() {
  testWidgets('shows the interview study workspace', (tester) async {
    SharedPreferences.setMockInitialValues({});
    await tester.pumpWidget(const SweCompanionApp());
    await tester.pumpAndSettle();

    expect(find.text('SWE Companion'), findsOneWidget);
    expect(find.textContaining('Walk into L4–L6 interviews'), findsOneWidget);
    expect(find.textContaining('Learn the pattern'), findsOneWidget);
  });

  test('challenge rounds and official LeetCode links are complete', () {
    final challengeProblems = [
      for (final topic in challengeTopics) ...topic.problems,
    ];

    expect(studyGroups.last.title, 'Challenge Rounds');
    expect(challengeTopics, hasLength(4));
    expect(challengeProblems, hasLength(112));
    expect(
      challengeProblems.every((problem) => problem.difficulty != null),
      isTrue,
    );
    expect(
      challengeProblems
          .where((problem) => !problem.initiallyComplete)
          .single
          .id,
      '992',
    );
    expect(
      studyTopics.every(
        (topic) => topic.problems.every(
          (problem) =>
              problem.leetCodeUrl.startsWith('https://leetcode.com/problems/'),
        ),
      ),
      isTrue,
    );
    expect(
      challengeProblems.singleWhere((problem) => problem.id == '310').title,
      'Minimum Height Trees',
    );
  });
}
