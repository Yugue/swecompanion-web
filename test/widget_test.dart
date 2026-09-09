import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swe_companion/main.dart';
import 'package:swe_companion/ml_page.dart';
import 'package:swe_companion/ml_study_data.dart';
import 'package:swe_companion/study_data.dart';

void main() {
  testWidgets('shows the interview study workspace', (tester) async {
    await tester.binding.setSurfaceSize(const Size(800, 5000));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    SharedPreferences.setMockInitialValues({});
    await tester.pumpWidget(const SweCompanionApp());
    await tester.pumpAndSettle();

    expect(find.text('LeetCode'), findsOneWidget);
    expect(find.textContaining('Walk into L4–L6 interviews'), findsOneWidget);
    expect(find.textContaining('Learn the pattern'), findsNothing);
    expect(find.text('8/8'), findsOneWidget);
    expect(find.text('Two Sum'), findsOneWidget);
    expect(find.text('Sort Colors'), findsNothing);

    await tester.tap(find.text('Sorting'));
    await tester.pumpAndSettle();

    expect(find.text('Two Sum'), findsNothing);
    expect(find.text('Sort Colors'), findsOneWidget);

    await tester.tap(find.text('Sorting'));
    await tester.pumpAndSettle();

    expect(find.text('Sort Colors'), findsNothing);
    final preferences = await SharedPreferences.getInstance();
    expect(preferences.getString('expanded_topic_reference_v1'), '__none__');

    await tester.tap(find.text('ML'));
    await tester.pumpAndSettle();
    expect(find.text('Chapter 1 — Foundations'), findsOneWidget);
    expect(find.text('LeetCode'), findsOneWidget);
  });

  testWidgets('restores the expanded topic from local storage', (tester) async {
    await tester.binding.setSurfaceSize(const Size(800, 5000));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    SharedPreferences.setMockInitialValues({
      'expanded_topic_reference_v1': 'prefix-sum-subarray',
    });
    await tester.pumpWidget(const SweCompanionApp());
    await tester.pumpAndSettle();

    expect(find.text('Subarray Sum Equals K'), findsOneWidget);
    expect(find.text('Two Sum'), findsNothing);
  });

  test('challenge rounds and official LeetCode links are complete', () {
    final challengeProblems = [
      for (final topic in challengeTopics) ...topic.problems,
    ];

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

  test('main topics are flat with requested review subcategories', () {
    final titles = coreStudyTopics.map((topic) => topic.title).toSet();
    expect(
      titles,
      containsAll(['Sorting', 'DFS', 'BFS', 'Data Structures to Know']),
    );
    expect(titles, isNot(contains('Design & Data Structures')));
    expect(
      titles,
      isNot(containsAll(['Trees: DFS & BFS', 'Flood Fill & Grid DFS'])),
    );
    expect(titles, isNot(contains('Backtracking')));
    expect(titles, isNot(contains('Topological Sort')));

    final sorting = coreStudyTopics.singleWhere(
      (topic) => topic.title == 'Sorting',
    );
    expect(sorting.problems.map((problem) => problem.subcategory), [
      'Two-group partitioning',
      'Three-group partitioning',
      'Merge sort',
    ]);

    final dfs = coreStudyTopics.singleWhere((topic) => topic.title == 'DFS');
    expect(dfs.problems.map((problem) => problem.subcategory).toSet(), {
      'Tree DFS',
      'Backtracking',
      'Flood fill / Grid DFS',
    });

    final bfs = coreStudyTopics.singleWhere((topic) => topic.title == 'BFS');
    expect(bfs.problems.map((problem) => problem.subcategory).toSet(), {
      'Tree BFS',
      'Topological sort',
      'Shortest path',
    });
  });

  testWidgets('ML guide reveals quiz answers and saves review progress', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(900, 7000));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    SharedPreferences.setMockInitialValues({});
    await tester.pumpWidget(
      MaterialApp(
        home: MlReviewPage(darkMode: true, onThemeChanged: () async {}),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Chapter 1 — Foundations'), findsOneWidget);
    expect(find.text('1.1  ML fundamentals'), findsOneWidget);
    expect(find.text('Chapter 1 knowledge check'), findsOneWidget);
    expect(find.textContaining('Without them, the composition'), findsNothing);

    await tester.tap(
      find.text(
        'Why are nonlinear activations necessary between linear layers?',
      ),
    );
    await tester.pumpAndSettle();
    expect(
      find.textContaining('Without them, the composition'),
      findsOneWidget,
    );

    await tester.tap(find.byType(Checkbox).first);
    await tester.pumpAndSettle();
    final preferences = await SharedPreferences.getInstance();
    expect(
      preferences.getStringList('ml_completed_topics_v1'),
      contains('ml-fundamentals'),
    );
  });

  test('ML curriculum has unique topics and five complete quizzes', () {
    final topics = [for (final part in mlParts) ...part.topics];
    final quizzes = [for (final part in mlParts) ...part.quiz];

    expect(mlParts, hasLength(7));
    expect(topics, hasLength(62));
    expect(topics.map((topic) => topic.id).toSet(), hasLength(topics.length));
    expect(quizzes, hasLength(50));
    expect(
      topics.every(
        (topic) =>
            topic.summary.isNotEmpty &&
            topic.keyPoints.length >= 3 &&
            topic.interviewPrompt.isNotEmpty,
      ),
      isTrue,
    );
  });
}
