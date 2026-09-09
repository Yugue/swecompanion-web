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
      index++;
      final content = <String>[];
      while (index < lines.length && !lines[index].trim().startsWith('```')) {
        content.add(lines[index]);
        index++;
      }
      if (index < lines.length) index++;
      blocks.add(
        _LessonBlock(_LessonBlockType.code, content.join('\n').trimRight()),
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
    if (_isTableLine(trimmed)) {
      final content = <String>[];
      while (index < lines.length && _isTableLine(lines[index].trim())) {
        content.add(lines[index].trim());
        index++;
      }
      blocks.add(_LessonBlock(_LessonBlockType.code, content.join('\n')));
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
        return Container(
          margin: const EdgeInsets.symmetric(vertical: 8),
          decoration: BoxDecoration(
            color: scheme.surfaceContainerHighest.withValues(alpha: .65),
            borderRadius: BorderRadius.circular(6),
            border: Border.all(color: scheme.outline.withValues(alpha: .55)),
          ),
          child: SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: const EdgeInsets.all(15),
            child: SelectableText(
              block.text,
              style: TextStyle(
                fontFamily: 'monospace',
                fontSize: 13.5,
                height: 1.5,
                color: scheme.onSurface,
              ),
            ),
          ),
        );
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
