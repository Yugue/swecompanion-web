import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_math_fork/flutter_math.dart';

class MlLessonView extends StatelessWidget {
  const MlLessonView({super.key, required this.topicId, required this.accent});

  final String topicId;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<String>(
      future: rootBundle.loadString('assets/ml_lessons/$topicId.md'),
      builder: (context, snapshot) {
        if (snapshot.hasError) {
          return _LessonNotice(
            icon: Icons.error_outline_rounded,
            text: 'This lesson could not be loaded.',
            color: Theme.of(context).colorScheme.error,
          );
        }
        if (!snapshot.hasData) {
          return const Padding(
            padding: EdgeInsets.all(28),
            child: Center(child: CircularProgressIndicator()),
          );
        }
        final blocks = _parseLesson(snapshot.data!);
        return SelectionArea(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              for (final block in blocks)
                _LessonBlockView(block: block, accent: accent),
            ],
          ),
        );
      },
    );
  }
}

class _LessonNotice extends StatelessWidget {
  const _LessonNotice({
    required this.icon,
    required this.text,
    required this.color,
  });
  final IconData icon;
  final String text;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(18),
      child: Row(
        children: [
          Icon(icon, color: color),
          const SizedBox(width: 10),
          Text(text),
        ],
      ),
    );
  }
}

enum _LessonBlockType {
  heading1,
  heading2,
  heading3,
  paragraph,
  bullet,
  quote,
  code,
  diagram,
  table,
  math,
  divider,
}

class _LessonBlock {
  const _LessonBlock(this.type, this.text);
  final _LessonBlockType type;
  final String text;
}

List<_LessonBlock> _parseLesson(String source) {
  final lines = source.replaceAll('\r', '').split('\n');
  _removeSourceTitle(lines);
  final blocks = <_LessonBlock>[];
  var index = 0;

  bool isBoundary(String line) {
    final trimmed = line.trim();
    return trimmed.isEmpty ||
        trimmed.startsWith('#') ||
        trimmed.startsWith('```') ||
        trimmed == r'\[' ||
        trimmed == r'\]' ||
        trimmed == '---' ||
        trimmed.startsWith('- ') ||
        trimmed.startsWith('* ') ||
        trimmed.startsWith('>') ||
        _isTableLine(trimmed);
  }

  while (index < lines.length) {
    final line = lines[index].trimRight();
    final trimmed = line.trim();
    if (trimmed.isEmpty) {
      index++;
      continue;
    }
    if (trimmed == '---') {
      blocks.add(const _LessonBlock(_LessonBlockType.divider, ''));
      index++;
      continue;
    }
    if (trimmed.startsWith('```')) {
      final language = trimmed.substring(3).trim().toLowerCase();
      index++;
      final content = <String>[];
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        content.add(lines[index]);
        index++;
      }
      if (index < lines.length) index++;
      final fencedText = content.join('\n').trimRight();
      blocks.add(
        _LessonBlock(
          language == 'text' && _looksLikeDiagram(fencedText)
              ? _LessonBlockType.diagram
              : _LessonBlockType.code,
          fencedText,
        ),
      );
      continue;
    }
    if (trimmed == r'\[') {
      index++;
      final content = <String>[];
      while (index < lines.length && lines[index].trim() != r'\]') {
        content.add(lines[index]);
        index++;
      }
      if (index < lines.length) index++;
      blocks.add(
        _LessonBlock(_LessonBlockType.math, content.join('\n').trim()),
      );
      continue;
    }
    if (_startsTable(lines, index)) {
      final content = <String>[];
      while (index < lines.length && _isTableLine(lines[index].trim())) {
        content.add(lines[index].trim());
        index++;
      }
      blocks.add(_LessonBlock(_LessonBlockType.table, content.join('\n')));
      continue;
    }
    if (trimmed.startsWith('### ')) {
      blocks.add(_LessonBlock(_LessonBlockType.heading3, trimmed.substring(4)));
      index++;
      continue;
    }
    if (trimmed.startsWith('## ')) {
      blocks.add(_LessonBlock(_LessonBlockType.heading2, trimmed.substring(3)));
      index++;
      continue;
    }
    if (trimmed.startsWith('# ')) {
      blocks.add(_LessonBlock(_LessonBlockType.heading1, trimmed.substring(2)));
      index++;
      continue;
    }
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      blocks.add(_LessonBlock(_LessonBlockType.bullet, trimmed.substring(2)));
      index++;
      continue;
    }
    if (trimmed.startsWith('>')) {
      final content = <String>[];
      while (index < lines.length && lines[index].trim().startsWith('>')) {
        content.add(lines[index].trim().replaceFirst(RegExp(r'^>\s?'), ''));
        index++;
      }
      blocks.add(_LessonBlock(_LessonBlockType.quote, content.join(' ')));
      continue;
    }

    final paragraph = <String>[trimmed];
    index++;
    while (index < lines.length && !isBoundary(lines[index])) {
      paragraph.add(lines[index].trim());
      index++;
    }
    blocks.add(_LessonBlock(_LessonBlockType.paragraph, paragraph.join(' ')));
  }
  return blocks;
}

void _removeSourceTitle(List<String> lines) {
  while (lines.isNotEmpty && lines.first.trim().isEmpty) {
    lines.removeAt(0);
  }
  if (lines.isEmpty || !lines.first.trim().startsWith('#')) return;
  final wasPartHeading = lines.first.trim().startsWith('## Part ');
  lines.removeAt(0);
  while (lines.isNotEmpty && lines.first.trim().isEmpty) {
    lines.removeAt(0);
  }
  if (wasPartHeading &&
      lines.isNotEmpty &&
      lines.first.trim().startsWith('### Topic ')) {
    lines.removeAt(0);
  }
}

bool _isTableLine(String line) =>
    line.startsWith('|') && line.endsWith('|') && line.length > 2;

bool _startsTable(List<String> lines, int index) {
  if (index + 1 >= lines.length || !_isTableLine(lines[index].trim())) {
    return false;
  }
  final separatorCells = _tableCells(lines[index + 1]);
  return separatorCells.isNotEmpty &&
      separatorCells.every(
        (cell) => RegExp(r'^:?-{3,}:?$').hasMatch(cell.trim()),
      );
}

List<String> _tableCells(String line) {
  final trimmed = line.trim();
  if (!_isTableLine(trimmed)) return const [];
  return trimmed.substring(1, trimmed.length - 1).split('|');
}

bool _looksLikeDiagram(String text) =>
    RegExp(r'[↓↑→←│─┌┐└┘├┤┬┴▼▲]').hasMatch(text);

class _LessonBlockView extends StatelessWidget {
  const _LessonBlockView({required this.block, required this.accent});
  final _LessonBlock block;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    switch (block.type) {
      case _LessonBlockType.heading1:
      case _LessonBlockType.heading2:
      case _LessonBlockType.heading3:
        final size = switch (block.type) {
          _LessonBlockType.heading1 => 24.0,
          _LessonBlockType.heading2 => 20.0,
          _ => 17.0,
        };
        return Padding(
          padding: EdgeInsets.only(top: size == 24 ? 26 : 20, bottom: 9),
          child: _InlineMarkdown(
            block.text,
            style: TextStyle(
              fontSize: size,
              height: 1.25,
              fontWeight: FontWeight.w700,
              color: scheme.onSurface,
            ),
          ),
        );
      case _LessonBlockType.paragraph:
        return Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: _InlineMarkdown(
            block.text,
            style: TextStyle(
              fontSize: 15.5,
              height: 1.58,
              color: scheme.onSurfaceVariant,
            ),
          ),
        );
      case _LessonBlockType.bullet:
        return Padding(
          padding: const EdgeInsets.only(left: 5, bottom: 8),
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                margin: const EdgeInsets.only(top: 9),
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  color: accent,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 11),
              Expanded(
                child: _InlineMarkdown(
                  block.text,
                  style: TextStyle(
                    fontSize: 15,
                    height: 1.52,
                    color: scheme.onSurfaceVariant,
                  ),
                ),
              ),
            ],
          ),
        );
      case _LessonBlockType.quote:
        return Container(
          margin: const EdgeInsets.symmetric(vertical: 7),
          padding: const EdgeInsets.all(15),
          decoration: BoxDecoration(
            color: accent.withValues(alpha: .09),
            borderRadius: BorderRadius.circular(6),
            border: Border(left: BorderSide(color: accent, width: 3)),
          ),
          child: _InlineMarkdown(
            block.text,
            style: TextStyle(
              fontSize: 15.5,
              height: 1.5,
              color: scheme.onSurface,
              fontStyle: FontStyle.italic,
            ),
          ),
        );
      case _LessonBlockType.code:
        return _LessonCodePanel(
          text: block.text,
          accent: accent,
          isDiagram: false,
        );
      case _LessonBlockType.diagram:
        return _LessonCodePanel(
          text: block.text,
          accent: accent,
          isDiagram: true,
        );
      case _LessonBlockType.table:
        return _LessonTable(markdown: block.text, accent: accent);
      case _LessonBlockType.math:
        return Container(
          margin: const EdgeInsets.symmetric(vertical: 8),
          padding: const EdgeInsets.symmetric(horizontal: 15, vertical: 18),
          decoration: BoxDecoration(
            color: scheme.surfaceContainerHighest.withValues(alpha: .65),
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: scheme.outline.withValues(alpha: .55)),
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Math.tex(
              block.text,
              mathStyle: MathStyle.display,
              textStyle: TextStyle(color: accent, fontSize: 17),
              onErrorFallback:
                  (error) => SelectableText(
                    block.text,
                    style: TextStyle(
                      fontFamily: 'monospace',
                      color: scheme.error,
                    ),
                  ),
            ),
          ),
        );
      case _LessonBlockType.divider:
        return Divider(height: 32, color: scheme.outline.withValues(alpha: .5));
    }
  }
}

class _LessonCodePanel extends StatelessWidget {
  const _LessonCodePanel({
    required this.text,
    required this.accent,
    required this.isDiagram,
  });

  final String text;
  final Color accent;
  final bool isDiagram;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final panelColor =
        isDiagram
            ? accent.withValues(alpha: .065)
            : scheme.surfaceContainerHighest.withValues(alpha: .65);
    return Semantics(
      label: isDiagram ? 'Lesson diagram' : 'Code example',
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 8),
        decoration: BoxDecoration(
          color: panelColor,
          borderRadius: BorderRadius.circular(6),
          border: Border.all(
            color:
                isDiagram
                    ? accent.withValues(alpha: .42)
                    : scheme.outline.withValues(alpha: .55),
          ),
        ),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(14, 10, 14, 0),
              child: Row(
                children: [
                  Icon(
                    isDiagram
                        ? Icons.account_tree_outlined
                        : Icons.code_rounded,
                    size: 15,
                    color: isDiagram ? accent : scheme.onSurfaceVariant,
                  ),
                  const SizedBox(width: 7),
                  Text(
                    isDiagram ? 'DIAGRAM / FLOW' : 'CODE / EXAMPLE',
                    style: TextStyle(
                      color: isDiagram ? accent : scheme.onSurfaceVariant,
                      fontSize: 10.5,
                      fontWeight: FontWeight.w700,
                      letterSpacing: .9,
                    ),
                  ),
                ],
              ),
            ),
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              padding: const EdgeInsets.fromLTRB(15, 11, 15, 15),
              child: SelectableText(
                text,
                style: TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 13.5,
                  height: 1.5,
                  color: scheme.onSurface,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _LessonTable extends StatelessWidget {
  const _LessonTable({required this.markdown, required this.accent});

  final String markdown;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final rawRows = markdown.split('\n').map(_tableCells).toList();
    if (rawRows.length < 2) return const SizedBox.shrink();
    final rows = <List<String>>[rawRows.first, ...rawRows.skip(2)];
    final columnCount = rows.fold<int>(
      0,
      (maximum, row) => row.length > maximum ? row.length : maximum,
    );

    return Semantics(
      label: 'Lesson table',
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 10),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(6),
          border: Border.all(color: scheme.outline.withValues(alpha: .55)),
        ),
        clipBehavior: Clip.antiAlias,
        child: SingleChildScrollView(
          scrollDirection: Axis.horizontal,
          child: Table(
            defaultColumnWidth: const IntrinsicColumnWidth(),
            border: TableBorder(
              horizontalInside: BorderSide(
                color: scheme.outline.withValues(alpha: .4),
              ),
              verticalInside: BorderSide(
                color: scheme.outline.withValues(alpha: .35),
              ),
            ),
            children: [
              for (var rowIndex = 0; rowIndex < rows.length; rowIndex++)
                TableRow(
                  decoration: BoxDecoration(
                    color:
                        rowIndex == 0
                            ? accent.withValues(alpha: .11)
                            : rowIndex.isEven
                            ? scheme.surfaceContainerHighest.withValues(
                              alpha: .28,
                            )
                            : scheme.surfaceContainer.withValues(alpha: .38),
                  ),
                  children: [
                    for (var column = 0; column < columnCount; column++)
                      ConstrainedBox(
                        constraints: const BoxConstraints(
                          minWidth: 116,
                          maxWidth: 340,
                        ),
                        child: Padding(
                          padding: const EdgeInsets.symmetric(
                            horizontal: 12,
                            vertical: 11,
                          ),
                          child: _InlineMarkdown(
                            column < rows[rowIndex].length
                                ? rows[rowIndex][column].trim()
                                : '',
                            style: TextStyle(
                              color:
                                  rowIndex == 0
                                      ? scheme.onSurface
                                      : scheme.onSurfaceVariant,
                              fontSize: 13.5,
                              height: 1.4,
                              fontWeight:
                                  rowIndex == 0
                                      ? FontWeight.w700
                                      : FontWeight.w400,
                            ),
                          ),
                        ),
                      ),
                  ],
                ),
            ],
          ),
        ),
      ),
    );
  }
}

class _InlineMarkdown extends StatelessWidget {
  const _InlineMarkdown(this.text, {required this.style});
  final String text;
  final TextStyle style;

  @override
  Widget build(BuildContext context) {
    final spans = <InlineSpan>[];
    final pattern = RegExp(r'(\*\*.+?\*\*|`.+?`|\\\(.+?\\\))');
    var cursor = 0;
    for (final match in pattern.allMatches(text)) {
      if (match.start > cursor) {
        spans.add(
          TextSpan(text: _readableInline(text.substring(cursor, match.start))),
        );
      }
      final token = match.group(0)!;
      if (token.startsWith(r'\(')) {
        spans.add(
          WidgetSpan(
            alignment: PlaceholderAlignment.middle,
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 2),
              child: Math.tex(
                token.substring(2, token.length - 2),
                mathStyle: MathStyle.text,
                textStyle: style.copyWith(fontSize: style.fontSize ?? 15),
                onErrorFallback:
                    (error) => Text(
                      token.substring(2, token.length - 2),
                      style: style.copyWith(fontFamily: 'monospace'),
                    ),
              ),
            ),
          ),
        );
      } else if (token.startsWith('**')) {
        spans.add(
          TextSpan(
            text: _readableInline(token.substring(2, token.length - 2)),
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
        );
      } else {
        spans.add(
          TextSpan(
            text: token.substring(1, token.length - 1),
            style: TextStyle(
              fontFamily: 'monospace',
              fontSize: (style.fontSize ?? 15) - 1,
              backgroundColor:
                  Theme.of(context).colorScheme.surfaceContainerHighest,
            ),
          ),
        );
      }
      cursor = match.end;
    }
    if (cursor < text.length) {
      spans.add(TextSpan(text: _readableInline(text.substring(cursor))));
    }
    return Text.rich(TextSpan(style: style, children: spans));
  }
}

String _readableInline(String value) {
  var result = value
      .replaceAll(r'\(', '')
      .replaceAll(r'\)', '')
      .replaceAll(r'\rightarrow', '→')
      .replaceAll(r'\Rightarrow', '⇒')
      .replaceAll(r'\leftarrow', '←')
      .replaceAll(r'\times', '×')
      .replaceAll(r'\cdot', '·')
      .replaceAll(r'\approx', '≈')
      .replaceAll(r'\neq', '≠')
      .replaceAll(r'\leq', '≤')
      .replaceAll(r'\geq', '≥')
      .replaceAll(r'\nabla', '∇')
      .replaceAll(r'\partial', '∂')
      .replaceAll(r'\sum', 'Σ')
      .replaceAll(r'\theta', 'θ')
      .replaceAll(r'\lambda', 'λ')
      .replaceAll(r'\sigma', 'σ')
      .replaceAll(r'\mu', 'μ');
  result = result.replaceAllMapped(
    RegExp(r'\\frac\{([^{}]+)\}\{([^{}]+)\}'),
    (match) => '(${match.group(1)})/(${match.group(2)})',
  );
  result = result.replaceAllMapped(
    RegExp(r'\\sqrt\{([^{}]+)\}'),
    (match) => '√(${match.group(1)})',
  );
  result = result.replaceAllMapped(
    RegExp(r'\\(?:text|mathrm|mathbf|mathbb)\{([^{}]+)\}'),
    (match) => match.group(1)!,
  );
  result = result.replaceAll('{{', '{').replaceAll('}}', '}');
  result = result.replaceAllMapped(
    RegExp(r'_\{([^{}]+)\}'),
    (match) => '_${match.group(1)}',
  );
  result = result.replaceAllMapped(
    RegExp(r'\^\{([^{}]+)\}'),
    (match) => '^${match.group(1)}',
  );
  return result;
}
