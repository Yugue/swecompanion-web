import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:swe_companion/main.dart';
import 'package:swe_companion/study_data.dart';

void main() {
  testWidgets('shows the interview study workspace', (tester) async {
    await tester.binding.setSurfaceSize(const Size(800, 5000));
    addTearDown(() => tester.binding.setSurfaceSize(null));
    SharedPreferences.setMockInitialValues({});
    await tester.pumpWidget(const SweCompanionApp());
    await tester.pumpAndSettle();

    expect(find.text('SWE Companion'), findsOneWidget);
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
    expect(titles, containsAll(['Sorting', 'DFS', 'BFS']));
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
}
