import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swe_companion/main.dart';
import 'package:swe_companion/ml_lesson_view.dart';
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

    expect(find.byType(SelectionArea), findsOneWidget);
    expect(find.text('LeetCode'), findsOneWidget);
    expect(find.textContaining('Walk into L4–L6 interviews'), findsOneWidget);
    expect(find.textContaining('Learn the pattern'), findsNothing);
    expect(find.text('8/8'), findsOneWidget);
    expect(find.text('Two Sum'), findsOneWidget);
    expect(find.byTooltip('Open Sort Colors on LeetCode'), findsNothing);

    await tester.tap(find.text('Sorting'));
    await tester.pumpAndSettle();

    expect(find.text('Two Sum'), findsNothing);
    expect(find.byTooltip('Open Sort Colors on LeetCode'), findsOneWidget);

    await tester.tap(find.text('Sorting'));
    await tester.pumpAndSettle();

    expect(find.byTooltip('Open Sort Colors on LeetCode'), findsNothing);
    final preferences = await SharedPreferences.getInstance();
    expect(preferences.getString('expanded_topic_reference_v1'), '__none__');

    await tester.tap(find.text('ML'));
    await tester.pump();
    expect(find.text('Chapter 1 — Foundations'), findsOneWidget);
    await tester.pumpAndSettle();
    expect(find.text('Chapter 1 — Foundations'), findsOneWidget);
    expect(find.text('LeetCode'), findsOneWidget);

    await tester.tap(find.text('LeetCode'));
    await tester.pumpAndSettle();
    expect(find.text('Sort Colors'), findsNothing);
    expect(find.text('Two Sum'), findsNothing);
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

  testWidgets('a deep-linked ML page switches directly to LeetCode', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(800, 5000));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    SharedPreferences.setMockInitialValues({});
    await tester.pumpWidget(
      const SweCompanionApp(initialRoute: '/ml/learning'),
    );
    await tester.pumpAndSettle();
    expect(find.text('Chapter 2 — How neural networks learn'), findsOneWidget);

    await tester.tap(find.text('LeetCode'));
    await tester.pumpAndSettle();
    expect(find.text('Two Sum'), findsOneWidget);
    expect(find.text('Chapter 2 — How neural networks learn'), findsNothing);
  });

  testWidgets('a filtered LeetCode topic expands and collapses in one tap', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(800, 5000));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    SharedPreferences.setMockInitialValues({});
    await tester.pumpWidget(const SweCompanionApp());
    await tester.pumpAndSettle();

    await tester.enterText(find.byType(TextField), 'Sort Colors');
    await tester.pumpAndSettle();
    expect(find.byTooltip('Open Sort Colors on LeetCode'), findsNothing);

    await tester.tap(find.text('Sorting'));
    await tester.pumpAndSettle();
    expect(find.byTooltip('Open Sort Colors on LeetCode'), findsOneWidget);

    await tester.tap(find.text('Sorting'));
    await tester.pumpAndSettle();
    expect(find.byTooltip('Open Sort Colors on LeetCode'), findsNothing);
  });

  testWidgets('LeetCode reset confirms and remains empty after reopening', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(800, 1200));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    SharedPreferences.setMockInitialValues({
      'completed_problem_ids_v1': ['1'],
      'challenge_rounds_v1_added': true,
      'ml_completed_topics_v1': ['ml-fundamentals'],
    });
    await tester.pumpWidget(const SweCompanionApp());
    await tester.pumpAndSettle();
    if (find.byTooltip('Open topics').evaluate().isNotEmpty) {
      await tester.tap(find.byTooltip('Open topics'));
      await tester.pumpAndSettle();
    }

    expect(find.text('Progress saved on this device'), findsOneWidget);
    expect(find.byIcon(Icons.save_outlined), findsOneWidget);
    expect(find.text('1/${uniqueProblems.length}'), findsOneWidget);
    await tester.tap(find.text('Reset progress'));
    await tester.pumpAndSettle();
    expect(find.text('Reset LeetCode progress?'), findsOneWidget);
    expect(find.textContaining('cannot be recovered'), findsOneWidget);
    await tester.tap(find.text('No, keep progress'));
    await tester.pumpAndSettle();
    expect(find.text('1/${uniqueProblems.length}'), findsOneWidget);

    await tester.tap(find.text('Reset progress'));
    await tester.pumpAndSettle();
    await tester.tap(find.text('Yes, reset progress'));
    await tester.pumpAndSettle();
    expect(find.text('0/${uniqueProblems.length}'), findsOneWidget);
    final preferences = await SharedPreferences.getInstance();
    expect(preferences.getStringList('completed_problem_ids_v1'), isEmpty);
    expect(preferences.getStringList('ml_completed_topics_v1'), [
      'ml-fundamentals',
    ]);

    await tester.pumpWidget(const SizedBox.shrink());
    await tester.pumpWidget(const SweCompanionApp());
    await tester.pumpAndSettle();
    expect(find.text('Two Sum'), findsOneWidget);
    final twoSumCheckbox = find.byType(Checkbox).first;
    expect(tester.widget<Checkbox>(twoSumCheckbox).value, isFalse);
    await tester.tap(twoSumCheckbox);
    await tester.pumpAndSettle();
    expect(tester.widget<Checkbox>(find.byType(Checkbox).first).value, isTrue);
    expect(preferences.getStringList('completed_problem_ids_v1'), ['1']);
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

    expect(
      find.text('GOOGLE L4–L6 ML DOMAIN INTERVIEW STUDY GUIDE'),
      findsOneWidget,
    );
    expect(
      find.text('Prepare for the Google ML Domain Interview.'),
      findsOneWidget,
    );
    expect(find.textContaining('Designed for:'), findsOneWidget);
    expect(find.textContaining('Covers:'), findsOneWidget);
    expect(find.textContaining('successfully passed'), findsOneWidget);
    expect(find.textContaining('3–5 common knowledge'), findsOneWidget);
    expect(find.text('How the ML domain interview works'), findsOneWidget);
    expect(find.textContaining('non-technical person'), findsOneWidget);
    expect(find.textContaining('Ask clarifying questions'), findsOneWidget);
    expect(find.textContaining('Collaborate:'), findsOneWidget);
    expect(find.textContaining('Identify the key concept:'), findsOneWidget);
    expect(find.textContaining('Explain it clearly:'), findsOneWidget);
    expect(find.textContaining('What is a loss function?'), findsOneWidget);
    expect(find.textContaining('Binary cross-entropy'), findsOneWidget);
    expect(find.textContaining('Let’s focus on recall.'), findsOneWidget);
    expect(find.textContaining('KEY CONCEPT FOUND: RECALL'), findsOneWidget);
    expect(
      find.textContaining('simple implementation or pseudocode'),
      findsOneWidget,
    );
    expect(find.text('Deep Learning / Neural Networks'), findsOneWidget);
    expect(find.text('Agentic AI Development'), findsOneWidget);
    expect(
      find.text('Generative AI → Large Language Models (LLM)'),
      findsOneWidget,
    );
    expect(find.text('Chapter 1 — Foundations'), findsOneWidget);
    expect(find.text('1.1  ML fundamentals'), findsOneWidget);
    expect(find.text('Chapter 1 quiz'), findsOneWidget);
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

    final firstTopicCheckbox = find.byType(Checkbox).first;
    tester.widget<Checkbox>(firstTopicCheckbox).onChanged!(true);
    await tester.pumpAndSettle();
    final preferences = await SharedPreferences.getInstance();
    expect(
      preferences.getStringList('ml_completed_topics_v1'),
      contains('ml-fundamentals'),
    );

    final firstTopicHeader = find.text('1.1  ML fundamentals');
    await tester.tap(firstTopicHeader);
    await tester.pump();
    await tester.pump(const Duration(milliseconds: 500));
    await tester.pumpAndSettle();
    expect(find.text('1.1  ML fundamentals'), findsOneWidget);
    expect(
      find.textContaining('For your Google L4–L5 ML domain interview'),
      findsOneWidget,
    );

    await tester.tap(firstTopicHeader);
    await tester.pumpAndSettle();
    expect(
      find.textContaining('For your Google L4–L5 ML domain interview'),
      findsNothing,
    );
    await tester.tap(firstTopicHeader);
    await tester.pumpAndSettle();
    expect(
      find.textContaining('For your Google L4–L5 ML domain interview'),
      findsOneWidget,
    );
  });

  testWidgets('ML lessons render tables and diagrams as structured content', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(800, 12000));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: MlLessonView(
              topicId: 'architecture-choice',
              accent: Colors.blue,
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('DIAGRAM / FLOW'), findsWidgets);
    expect(find.text('CODE / EXAMPLE'), findsWidgets);
    expect(find.byType(Table), findsWidgets);
    expect(find.text('Natural starting point'), findsOneWidget);
  });

  testWidgets('attention equations and numbered points render in the lesson', (
    tester,
  ) async {
    await tester.binding.setSurfaceSize(const Size(1000, 12000));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    await tester.pumpWidget(
      const MaterialApp(
        home: Scaffold(
          body: SingleChildScrollView(
            child: MlLessonView(
              topicId: 'scaled-multihead',
              accent: Colors.green,
            ),
          ),
        ),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.byType(Math), findsWidgets);
    expect(find.textContaining(r'\boxed{'), findsNothing);
    expect(find.text('1.'), findsWidgets);
    expect(find.text('2.'), findsWidgets);
    expect(find.text('DIAGRAM / FLOW'), findsWidgets);
  });

  testWidgets(
    'ML progress reset requires confirmation and keeps LeetCode data',
    (tester) async {
      await tester.binding.setSurfaceSize(const Size(1600, 900));
      addTearDown(() => tester.binding.setSurfaceSize(null));
      SharedPreferences.setMockInitialValues({
        'ml_completed_topics_v1': ['ml-fundamentals'],
        'completed_problem_ids_v1': ['two-sum'],
      });
      await tester.pumpWidget(
        MaterialApp(
          home: MlReviewPage(darkMode: true, onThemeChanged: () async {}),
        ),
      );
      await tester.pumpAndSettle();

      if (find.byTooltip('Open curriculum').evaluate().isNotEmpty) {
        await tester.tap(find.byTooltip('Open curriculum'));
        await tester.pumpAndSettle();
      }
      expect(find.text('Progress saved on this device'), findsOneWidget);
      expect(find.text('1/57'), findsOneWidget);
      await tester.tap(find.text('Reset progress'));
      await tester.pumpAndSettle();
      expect(find.textContaining('cannot be recovered'), findsOneWidget);
      await tester.tap(find.text('No, keep progress'));
      await tester.pumpAndSettle();
      expect(find.text('1/57'), findsOneWidget);

      await tester.tap(find.text('Reset progress'));
      await tester.pumpAndSettle();
      await tester.tap(find.text('Yes, reset progress'));
      await tester.pumpAndSettle();
      expect(find.text('0/57'), findsOneWidget);
      final preferences = await SharedPreferences.getInstance();
      expect(preferences.getStringList('ml_completed_topics_v1'), isNull);
      expect(preferences.getStringList('completed_problem_ids_v1'), [
        'two-sum',
      ]);
    },
  );

  test('ML curriculum has full lessons and five complete quizzes', () {
    final topics = [for (final part in mlParts) ...part.topics];
    final quizzes = [for (final part in mlParts) ...part.quiz];

    expect(mlParts, hasLength(7));
    expect(topics, hasLength(57));
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
