import 'package:flutter/services.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_math_fork/flutter_math.dart';
import 'package:swe_companion/ml_study_data.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  test('all ML lessons have parseable equations and balanced blocks', () async {
    final issues = <String>[];
    var displayCount = 0;
    var inlineCount = 0;
    var tableCount = 0;
    var codeCount = 0;
    var numberedCount = 0;

    for (final part in mlParts) {
      for (final topic in part.topics) {
        final source = await rootBundle.loadString(
          'assets/ml_lessons/${topic.id}.md',
        );
        final fenceCount =
            RegExp(r'^```', multiLine: true).allMatches(source).length;
        if (fenceCount.isOdd) issues.add('${topic.id}: unmatched code fence');
        codeCount += fenceCount ~/ 2;

        final prose = source.replaceAll(
          RegExp(r'^```.*?^```', multiLine: true, dotAll: true),
          '',
        );
        final opens = RegExp(r'\\\[').allMatches(prose).length;
        final closes = RegExp(r'\\\]').allMatches(prose).length;
        if (opens != closes) {
          issues.add('${topic.id}: $opens display opens, $closes closes');
        }
        for (final line in prose.split('\n')) {
          if (line.contains(r'\[') && line.trim() != r'\[') {
            issues.add('${topic.id}: display opening must be on its own line');
          }
          if (line.contains(r'\]') && line.trim() != r'\]') {
            issues.add('${topic.id}: display closing must be on its own line');
          }
          if (RegExp(r'^\d+\.\s+').hasMatch(line.trim())) numberedCount++;
        }

        final displayMatches =
            RegExp(r'\\\[(.*?)\\\]', dotAll: true).allMatches(prose).toList();
        if (displayMatches.length != opens) {
          issues.add('${topic.id}: some display equations are not paired');
        }
        for (final match in displayMatches) {
          displayCount++;
          final expression = match.group(1)!.trim();
          final math = Math.tex(expression);
          final error = math.parseError;
          if (error != null) {
            issues.add('${topic.id}: display ${error.message}: $expression');
          } else {
            try {
              math.ast!.buildWidget(
                MathOptions(style: MathStyle.display, fontSize: 17),
              );
            } catch (error) {
              issues.add('${topic.id}: display build $error: $expression');
            }
          }
        }
        for (final match in RegExp(
          r'\\\((.*?)\\\)',
          dotAll: true,
        ).allMatches(prose)) {
          inlineCount++;
          final expression = match.group(1)!.trim();
          final math = Math.tex(expression);
          final error = math.parseError;
          if (error != null) {
            issues.add('${topic.id}: inline ${error.message}: $expression');
          } else {
            try {
              math.ast!.buildWidget(
                MathOptions(style: MathStyle.text, fontSize: 15),
              );
            } catch (error) {
              issues.add('${topic.id}: inline build $error: $expression');
            }
          }
        }

        final lines = prose.split('\n');
        for (var index = 0; index + 1 < lines.length; index++) {
          if (!lines[index].trim().startsWith('|') ||
              !RegExp(
                r'^\s*\|(?:\s*:?-{3,}:?\s*\|)+\s*$',
              ).hasMatch(lines[index + 1])) {
            continue;
          }
          tableCount++;
          final columns = '|'.allMatches(lines[index]).length - 1;
          var row = index + 2;
          while (row < lines.length && lines[row].trim().startsWith('|')) {
            final actual = '|'.allMatches(lines[row]).length - 1;
            if (actual != columns) {
              issues.add(
                '${topic.id}: table row has $actual columns, expected $columns',
              );
            }
            row++;
          }
        }
      }
    }

    expect(displayCount, greaterThan(1200));
    expect(inlineCount, greaterThan(0));
    expect(tableCount, greaterThan(20));
    expect(codeCount, greaterThan(1000));
    expect(numberedCount, greaterThan(60));
    expect(issues, isEmpty, reason: issues.take(80).join('\n'));
  });
}
