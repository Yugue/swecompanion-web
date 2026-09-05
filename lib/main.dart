import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

import 'study_data.dart';

void main() => runApp(const SweCompanionApp());

class SweCompanionApp extends StatefulWidget {
  const SweCompanionApp({super.key});

  @override
  State<SweCompanionApp> createState() => _SweCompanionAppState();
}

class _SweCompanionAppState extends State<SweCompanionApp> {
  static const _completedKey = 'completed_problem_ids_v1';
  static const _challengeMigrationKey = 'challenge_rounds_v1_added';
  static const _themeKey = 'dark_mode_v1';

  Set<String> _completed = initialCompletedProblems;
  bool _darkMode = true;
  bool _ready = false;

  @override
  void initState() {
    super.initState();
    unawaited(_loadPreferences());
  }

  Future<void> _loadPreferences() async {
    final preferences = await SharedPreferences.getInstance();
    final savedProblems = preferences.getStringList(_completedKey);
    final completed = savedProblems?.toSet() ?? initialCompletedProblems;
    final challengeMigrationApplied =
        preferences.getBool(_challengeMigrationKey) ?? false;

    if (!challengeMigrationApplied) {
      for (final topic in challengeTopics) {
        for (final problem in topic.problems) {
          if (problem.initiallyComplete &&
              !coreProblemIds.contains(problem.storageKey)) {
            completed.add(problem.storageKey);
          }
        }
      }
      await preferences.setBool(_challengeMigrationKey, true);
      if (savedProblems != null) {
        await preferences.setStringList(
          _completedKey,
          completed.toList()..sort(),
        );
      }
    }

    if (!mounted) return;
    setState(() {
      _completed = completed;
      _darkMode = preferences.getBool(_themeKey) ?? true;
      _ready = true;
    });
  }

  Future<void> _toggleProblem(String id, bool value) async {
    setState(() {
      value ? _completed.add(id) : _completed.remove(id);
    });
    final preferences = await SharedPreferences.getInstance();
    await preferences.setStringList(_completedKey, _completed.toList()..sort());
  }

  Future<void> _toggleTheme() async {
    setState(() => _darkMode = !_darkMode);
    final preferences = await SharedPreferences.getInstance();
    await preferences.setBool(_themeKey, _darkMode);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SWE Companion',
      debugShowCheckedModeBanner: false,
      themeMode: _darkMode ? ThemeMode.dark : ThemeMode.light,
      theme: _theme(Brightness.light),
      darkTheme: _theme(Brightness.dark),
      home:
          _ready
              ? StudyGuideScreen(
                completed: _completed,
                darkMode: _darkMode,
                onProblemChanged: _toggleProblem,
                onThemeChanged: _toggleTheme,
              )
              : const Scaffold(
                body: Center(child: CircularProgressIndicator()),
              ),
    );
  }
}

ThemeData _theme(Brightness brightness) {
  final dark = brightness == Brightness.dark;
  final scheme = ColorScheme.fromSeed(
    seedColor: const Color(0xFF4285F4),
    brightness: brightness,
  ).copyWith(
    surface: dark ? const Color(0xFF101216) : const Color(0xFFF7F9FC),
    surfaceContainer: dark ? const Color(0xFF191C22) : Colors.white,
    surfaceContainerHighest:
        dark ? const Color(0xFF252932) : const Color(0xFFE9EEF6),
    outline: dark ? const Color(0xFF3C424D) : const Color(0xFFD4DAE4),
  );

  return ThemeData(
    useMaterial3: true,
    brightness: brightness,
    colorScheme: scheme,
    scaffoldBackgroundColor: scheme.surface,
    textTheme: Typography.material2021(
      platform: TargetPlatform.macOS,
    ).black.apply(
      bodyColor: dark ? const Color(0xFFE3E7EE) : const Color(0xFF202124),
      displayColor: dark ? const Color(0xFFF1F3F4) : const Color(0xFF202124),
      fontFamily: 'Roboto',
    ),
    cardTheme: CardThemeData(
      elevation: 0,
      color: scheme.surfaceContainer,
      margin: EdgeInsets.zero,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(22),
        side: BorderSide(color: scheme.outline.withValues(alpha: .68)),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: scheme.surfaceContainer,
      contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: scheme.outline),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: scheme.outline),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(16),
        borderSide: BorderSide(color: scheme.primary, width: 1.5),
      ),
    ),
  );
}

enum ProblemFilter { all, remaining, complete }

String _groupScope(String title) => 'group::$title';
String _topicScope(String title) => 'topic::$title';

class StudyGuideScreen extends StatefulWidget {
  const StudyGuideScreen({
    super.key,
    required this.completed,
    required this.darkMode,
    required this.onProblemChanged,
    required this.onThemeChanged,
  });

  final Set<String> completed;
  final bool darkMode;
  final Future<void> Function(String id, bool value) onProblemChanged;
  final Future<void> Function() onThemeChanged;

  @override
  State<StudyGuideScreen> createState() => _StudyGuideScreenState();
}

class _StudyGuideScreenState extends State<StudyGuideScreen> {
  final _scaffoldKey = GlobalKey<ScaffoldState>();
  final _searchController = TextEditingController();
  String? _selectedScope;
  String _query = '';
  ProblemFilter _filter = ProblemFilter.all;

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  List<_TopicResult> get _visibleTopics {
    final query = _query.trim().toLowerCase();
    Iterable<StudyTopic> topics = studyTopics;
    if (_selectedScope?.startsWith('group::') ?? false) {
      final group = _selectedScope!.substring('group::'.length);
      topics = topics.where((topic) => topic.group == group);
    } else if (_selectedScope?.startsWith('topic::') ?? false) {
      final title = _selectedScope!.substring('topic::'.length);
      topics = topics.where((topic) => topic.title == title);
    }
    return topics
        .map((topic) {
          final topicMatches =
              query.isNotEmpty &&
              '${topic.title} ${topic.note}'.toLowerCase().contains(query);
          final problems =
              topic.problems.where((problem) {
                final complete = widget.completed.contains(problem.storageKey);
                final matchesFilter = switch (_filter) {
                  ProblemFilter.all => true,
                  ProblemFilter.remaining => !complete,
                  ProblemFilter.complete => complete,
                };
                final matchesQuery =
                    query.isEmpty ||
                    topicMatches ||
                    '${problem.id} ${problem.title}'.toLowerCase().contains(
                      query,
                    );
                return matchesFilter && matchesQuery;
              }).toList();
          return _TopicResult(topic, problems);
        })
        .where((result) => result.problems.isNotEmpty)
        .toList();
  }

  void _selectScope(String? scope) {
    setState(() => _selectedScope = scope);
    if (_scaffoldKey.currentState?.isDrawerOpen ?? false) {
      Navigator.of(context).pop();
    }
  }

  List<Widget> _groupedTopicCards(List<_TopicResult> results) {
    final children = <Widget>[];
    for (final group in studyGroups) {
      final groupResults =
          results.where((result) => result.topic.group == group.title).toList();
      if (groupResults.isEmpty) continue;
      children.add(
        _GroupHeading(
          group: group,
          completed: widget.completed,
          visibleCount: groupResults.fold(
            0,
            (count, result) => count + result.problems.length,
          ),
        ),
      );
      children.add(const SizedBox(height: 12));
      for (final result in groupResults) {
        children.add(
          _TopicCard(
            topic: result.topic,
            problems: result.problems,
            completed: widget.completed,
            onChanged: widget.onProblemChanged,
          ),
        );
        children.add(const SizedBox(height: 16));
      }
      children.add(const SizedBox(height: 12));
    }
    return children;
  }

  @override
  Widget build(BuildContext context) {
    final width = MediaQuery.sizeOf(context).width;
    final desktop = width >= 1060;
    final compact = width < 1320;
    final results = _visibleTopics;

    return Scaffold(
      key: _scaffoldKey,
      drawer:
          desktop
              ? null
              : Drawer(
                width: 304,
                child: SafeArea(
                  child: _TopicNavigation(
                    completed: widget.completed,
                    selectedScope: _selectedScope,
                    onSelected: _selectScope,
                  ),
                ),
              ),
      body: Stack(
        children: [
          const Positioned.fill(child: _GridBackdrop()),
          SafeArea(
            child: Row(
              children: [
                if (desktop)
                  SizedBox(
                    width: 286,
                    child: _TopicNavigation(
                      completed: widget.completed,
                      selectedScope: _selectedScope,
                      onSelected: _selectScope,
                    ),
                  ),
                Expanded(
                  child: Column(
                    children: [
                      _TopBar(
                        compact: compact,
                        showMenu: !desktop,
                        darkMode: widget.darkMode,
                        onMenuPressed:
                            () => _scaffoldKey.currentState?.openDrawer(),
                        onThemePressed: widget.onThemeChanged,
                      ),
                      Expanded(
                        child: CustomScrollView(
                          slivers: [
                            SliverPadding(
                              padding: EdgeInsets.fromLTRB(
                                compact ? 16 : 32,
                                12,
                                compact ? 16 : 32,
                                56,
                              ),
                              sliver: SliverList.list(
                                children: [
                                  _OverviewHeader(
                                    completed: widget.completed,
                                    compact: compact,
                                  ),
                                  const SizedBox(height: 24),
                                  _GuideControls(
                                    controller: _searchController,
                                    filter: _filter,
                                    compact: compact,
                                    onSearchChanged:
                                        (value) =>
                                            setState(() => _query = value),
                                    onFilterChanged:
                                        (value) =>
                                            setState(() => _filter = value),
                                  ),
                                  const SizedBox(height: 22),
                                  if (results.isEmpty)
                                    _EmptyResults(
                                      onClear: () {
                                        _searchController.clear();
                                        setState(() {
                                          _query = '';
                                          _filter = ProblemFilter.all;
                                        });
                                      },
                                    )
                                  else
                                    ..._groupedTopicCards(results),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _TopicResult {
  const _TopicResult(this.topic, this.problems);
  final StudyTopic topic;
  final List<StudyProblem> problems;
}

class _TopBar extends StatelessWidget {
  const _TopBar({
    required this.compact,
    required this.showMenu,
    required this.darkMode,
    required this.onMenuPressed,
    required this.onThemePressed,
  });

  final bool compact;
  final bool showMenu;
  final bool darkMode;
  final VoidCallback onMenuPressed;
  final Future<void> Function() onThemePressed;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      height: 72,
      padding: EdgeInsets.symmetric(horizontal: compact ? 10 : 24),
      decoration: BoxDecoration(
        color: scheme.surface.withValues(alpha: .92),
        border: Border(
          bottom: BorderSide(color: scheme.outline.withValues(alpha: .55)),
        ),
      ),
      child: Row(
        children: [
          if (showMenu)
            IconButton(
              tooltip: 'Open topics',
              onPressed: onMenuPressed,
              icon: const Icon(Icons.menu_rounded),
            ),
          if (showMenu) const SizedBox(width: 4),
          if (showMenu) const _ProductMark(size: 28),
          if (showMenu) const SizedBox(width: 10),
          Text(
            compact ? 'SWE Companion' : 'Interview study workspace',
            style: Theme.of(context).textTheme.titleMedium?.copyWith(
              fontWeight: FontWeight.w600,
              letterSpacing: -.2,
            ),
          ),
          const Spacer(),
          Container(
            decoration: BoxDecoration(
              color: scheme.surfaceContainer,
              borderRadius: BorderRadius.circular(14),
              border: Border.all(color: scheme.outline.withValues(alpha: .75)),
            ),
            child: IconButton(
              tooltip: darkMode ? 'Use light theme' : 'Use dark theme',
              onPressed: onThemePressed,
              icon: Icon(
                darkMode ? Icons.light_mode_outlined : Icons.dark_mode_outlined,
                size: 21,
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _TopicNavigation extends StatelessWidget {
  const _TopicNavigation({
    required this.completed,
    required this.selectedScope,
    required this.onSelected,
  });

  final Set<String> completed;
  final String? selectedScope;
  final ValueChanged<String?> onSelected;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      decoration: BoxDecoration(
        color: scheme.surfaceContainer.withValues(alpha: .96),
        border: Border(
          right: BorderSide(color: scheme.outline.withValues(alpha: .55)),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          const Padding(
            padding: EdgeInsets.fromLTRB(22, 22, 18, 20),
            child: Row(
              children: [
                _ProductMark(size: 34),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'SWE Companion',
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.w700),
                  ),
                ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 14),
            child: _NavigationTile(
              label: 'All topics',
              icon: Icons.dashboard_outlined,
              selected: selectedScope == null,
              trailing: '${uniqueProblems.length}',
              onTap: () => onSelected(null),
            ),
          ),
          const Padding(
            padding: EdgeInsets.fromLTRB(22, 22, 22, 8),
            child: Text(
              'TOPICS',
              style: TextStyle(
                fontSize: 12,
                fontWeight: FontWeight.w700,
                letterSpacing: 1.2,
              ),
            ),
          ),
          Expanded(
            child: ListView(
              padding: const EdgeInsets.fromLTRB(14, 0, 14, 20),
              children: [
                for (final group in studyGroups)
                  _GroupNavigationSection(
                    group: group,
                    topics:
                        studyTopics
                            .where((topic) => topic.group == group.title)
                            .toList(),
                    completed: completed,
                    selectedScope: selectedScope,
                    onSelected: onSelected,
                  ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(18),
            child: Row(
              children: [
                Icon(
                  Icons.cloud_done_outlined,
                  size: 17,
                  color: scheme.primary,
                ),
                const SizedBox(width: 9),
                Expanded(
                  child: Text(
                    'Progress saved on this device',
                    style: Theme.of(context).textTheme.bodySmall?.copyWith(
                      color: scheme.onSurfaceVariant,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _GroupNavigationSection extends StatelessWidget {
  const _GroupNavigationSection({
    required this.group,
    required this.topics,
    required this.completed,
    required this.selectedScope,
    required this.onSelected,
  });

  final StudyGroup group;
  final List<StudyTopic> topics;
  final Set<String> completed;
  final String? selectedScope;
  final ValueChanged<String?> onSelected;

  @override
  Widget build(BuildContext context) {
    final problemIds = {
      for (final topic in topics)
        for (final problem in topic.problems) problem.storageKey,
    };
    final done = problemIds.where(completed.contains).length;

    return Padding(
      padding: const EdgeInsets.only(bottom: 13),
      child: Column(
        children: [
          _NavigationTile(
            label: group.title,
            icon: group.icon,
            iconColor: group.color,
            selected: selectedScope == _groupScope(group.title),
            trailing: '$done/${problemIds.length}',
            onTap: () => onSelected(_groupScope(group.title)),
          ),
          const SizedBox(height: 3),
          for (final topic in topics)
            Padding(
              padding: const EdgeInsets.only(left: 25),
              child: _SubtopicNavigationTile(
                topic: topic,
                completed: completed,
                selected: selectedScope == _topicScope(topic.title),
                onTap: () => onSelected(_topicScope(topic.title)),
              ),
            ),
        ],
      ),
    );
  }
}

class _SubtopicNavigationTile extends StatelessWidget {
  const _SubtopicNavigationTile({
    required this.topic,
    required this.completed,
    required this.selected,
    required this.onTap,
  });

  final StudyTopic topic;
  final Set<String> completed;
  final bool selected;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final done =
        topic.problems
            .where((problem) => completed.contains(problem.storageKey))
            .length;
    return Material(
      color:
          selected ? scheme.primary.withValues(alpha: .1) : Colors.transparent,
      borderRadius: BorderRadius.circular(10),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(10, 8, 10, 8),
          child: Row(
            children: [
              Container(
                width: 6,
                height: 6,
                decoration: BoxDecoration(
                  color: selected ? scheme.primary : topic.color,
                  shape: BoxShape.circle,
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  topic.shortTitle,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                    color: selected ? scheme.primary : scheme.onSurfaceVariant,
                  ),
                ),
              ),
              Text(
                '$done/${topic.problems.length}',
                style: TextStyle(fontSize: 11, color: scheme.onSurfaceVariant),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _NavigationTile extends StatelessWidget {
  const _NavigationTile({
    required this.label,
    required this.icon,
    required this.selected,
    required this.trailing,
    required this.onTap,
    this.iconColor,
  });

  final String label;
  final IconData icon;
  final bool selected;
  final String trailing;
  final VoidCallback onTap;
  final Color? iconColor;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color:
          selected ? scheme.primary.withValues(alpha: .13) : Colors.transparent,
      borderRadius: BorderRadius.circular(12),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(12),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
          child: Row(
            children: [
              Icon(
                icon,
                size: 20,
                color:
                    selected
                        ? scheme.primary
                        : iconColor ?? scheme.onSurfaceVariant,
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  label,
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: selected ? FontWeight.w600 : FontWeight.w500,
                  ),
                ),
              ),
              Text(
                trailing,
                style: TextStyle(
                  fontSize: 12,
                  color: scheme.onSurfaceVariant,
                  fontFeatures: const [FontFeature.tabularFigures()],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _OverviewHeader extends StatelessWidget {
  const _OverviewHeader({required this.completed, required this.compact});

  final Set<String> completed;
  final bool compact;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final total = uniqueProblems.length;
    final complete =
        uniqueProblems
            .where((problem) => completed.contains(problem.storageKey))
            .length;
    final remaining = total - complete;
    final progress = total == 0 ? 0.0 : complete / total;

    final content = <Widget>[
      Expanded(flex: 5, child: _HeaderCopy(complete: complete)),
      const SizedBox(width: 36, height: 28),
      Expanded(
        flex: 4,
        child: _ProgressPanel(
          total: total,
          complete: complete,
          remaining: remaining,
          progress: progress,
        ),
      ),
    ];

    return Container(
      padding: EdgeInsets.all(compact ? 22 : 30),
      decoration: BoxDecoration(
        color: scheme.surfaceContainer,
        borderRadius: BorderRadius.circular(26),
        border: Border.all(color: scheme.outline.withValues(alpha: .7)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(
              alpha:
                  Theme.of(context).brightness == Brightness.dark ? .18 : .05,
            ),
            blurRadius: 28,
            offset: const Offset(0, 12),
          ),
        ],
      ),
      child:
          compact
              ? Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  _HeaderCopy(complete: complete),
                  const SizedBox(height: 24),
                  _ProgressPanel(
                    total: total,
                    complete: complete,
                    remaining: remaining,
                    progress: progress,
                  ),
                ],
              )
              : Row(children: content),
    );
  }
}

class _HeaderCopy extends StatelessWidget {
  const _HeaderCopy({required this.complete});
  final int complete;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
          decoration: BoxDecoration(
            color: const Color(0xFF4285F4).withValues(alpha: .13),
            borderRadius: BorderRadius.circular(999),
            border: Border.all(
              color: const Color(0xFF4285F4).withValues(alpha: .35),
            ),
          ),
          child: const Text(
            'INTERVIEW PREP',
            style: TextStyle(
              color: Color(0xFF8AB4F8),
              fontWeight: FontWeight.w700,
              fontSize: 12,
              letterSpacing: 1.1,
            ),
          ),
        ),
        const SizedBox(height: 17),
        Text(
          complete == 0
              ? 'Build your pattern library.'
              : 'Keep the patterns sharp.',
          style: Theme.of(context).textTheme.headlineMedium?.copyWith(
            fontWeight: FontWeight.w700,
            height: 1.1,
            letterSpacing: -.8,
          ),
        ),
        const SizedBox(height: 11),
        Text(
          'Review the cue, work the problem, and check it off. Your progress stays in this browser.',
          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
            color: scheme.onSurfaceVariant,
            height: 1.5,
          ),
        ),
        const SizedBox(height: 20),
        const Wrap(
          spacing: 10,
          runSpacing: 10,
          children: [
            _MemoryCue(
              icon: Icons.view_week_outlined,
              label: 'Window → longest / shortest valid',
            ),
            _MemoryCue(
              icon: Icons.stacked_line_chart,
              label: 'Prefix → exact sum with negatives',
            ),
          ],
        ),
      ],
    );
  }
}

class _MemoryCue extends StatelessWidget {
  const _MemoryCue({required this.icon, required this.label});
  final IconData icon;
  final String label;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest.withValues(alpha: .6),
        borderRadius: BorderRadius.circular(11),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, size: 16, color: scheme.primary),
          const SizedBox(width: 8),
          Text(
            label,
            style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w500),
          ),
        ],
      ),
    );
  }
}

class _ProgressPanel extends StatelessWidget {
  const _ProgressPanel({
    required this.total,
    required this.complete,
    required this.remaining,
    required this.progress,
  });

  final int total;
  final int complete;
  final int remaining;
  final double progress;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest.withValues(alpha: .45),
        borderRadius: BorderRadius.circular(19),
        border: Border.all(color: scheme.outline.withValues(alpha: .55)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            crossAxisAlignment: CrossAxisAlignment.end,
            children: [
              Text(
                '${(progress * 100).round()}%',
                style: Theme.of(context).textTheme.headlineLarge?.copyWith(
                  fontWeight: FontWeight.w700,
                  letterSpacing: -1.1,
                ),
              ),
              const Spacer(),
              Text(
                '$complete of $total',
                style: TextStyle(
                  color: scheme.onSurfaceVariant,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 9,
              backgroundColor: scheme.outline.withValues(alpha: .35),
              color: const Color(0xFF34A853),
            ),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              _Metric(
                label: 'Complete',
                value: '$complete',
                color: const Color(0xFF81C995),
              ),
              _Metric(
                label: 'Remaining',
                value: '$remaining',
                color: const Color(0xFFFFD166),
              ),
              _Metric(
                label: 'Groups',
                value: '${studyGroups.length}',
                color: const Color(0xFF8AB4F8),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _Metric extends StatelessWidget {
  const _Metric({
    required this.label,
    required this.value,
    required this.color,
  });
  final String label;
  final String value;
  final Color color;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.w700,
              color: color,
            ),
          ),
          Text(
            label,
            overflow: TextOverflow.ellipsis,
            style: TextStyle(
              fontSize: 12,
              color: Theme.of(context).colorScheme.onSurfaceVariant,
            ),
          ),
        ],
      ),
    );
  }
}

class _GuideControls extends StatelessWidget {
  const _GuideControls({
    required this.controller,
    required this.filter,
    required this.compact,
    required this.onSearchChanged,
    required this.onFilterChanged,
  });

  final TextEditingController controller;
  final ProblemFilter filter;
  final bool compact;
  final ValueChanged<String> onSearchChanged;
  final ValueChanged<ProblemFilter> onFilterChanged;

  @override
  Widget build(BuildContext context) {
    final search = TextField(
      controller: controller,
      onChanged: onSearchChanged,
      textInputAction: TextInputAction.search,
      decoration: const InputDecoration(
        hintText: 'Search questions or patterns',
        prefixIcon: Icon(Icons.search_rounded),
      ),
    );
    final filters = SegmentedButton<ProblemFilter>(
      showSelectedIcon: false,
      segments: const [
        ButtonSegment(value: ProblemFilter.all, label: Text('All')),
        ButtonSegment(value: ProblemFilter.remaining, label: Text('To do')),
        ButtonSegment(value: ProblemFilter.complete, label: Text('Done')),
      ],
      selected: {filter},
      onSelectionChanged: (selection) => onFilterChanged(selection.first),
    );

    if (compact) {
      return Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          search,
          const SizedBox(height: 12),
          Align(alignment: Alignment.centerLeft, child: filters),
        ],
      );
    }
    return Row(
      children: [Expanded(child: search), const SizedBox(width: 14), filters],
    );
  }
}

class _GroupHeading extends StatelessWidget {
  const _GroupHeading({
    required this.group,
    required this.completed,
    required this.visibleCount,
  });

  final StudyGroup group;
  final Set<String> completed;
  final int visibleCount;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final topics = studyTopics.where((topic) => topic.group == group.title);
    final problemIds = {
      for (final topic in topics)
        for (final problem in topic.problems) problem.storageKey,
    };
    final done = problemIds.where(completed.contains).length;

    return Padding(
      padding: const EdgeInsets.fromLTRB(4, 10, 4, 2),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 38,
            height: 38,
            decoration: BoxDecoration(
              color: group.color.withValues(alpha: .14),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: group.color.withValues(alpha: .36)),
            ),
            child: Icon(group.icon, size: 20, color: group.color),
          ),
          const SizedBox(width: 13),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  group.title,
                  style: Theme.of(context).textTheme.titleLarge?.copyWith(
                    fontWeight: FontWeight.w700,
                    letterSpacing: -.35,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  group.description,
                  style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                    color: scheme.onSurfaceVariant,
                  ),
                ),
                const SizedBox(height: 6),
                Text(
                  '$done/${problemIds.length} complete  ·  $visibleCount shown',
                  style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: group.color,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _TopicCard extends StatelessWidget {
  const _TopicCard({
    required this.topic,
    required this.problems,
    required this.completed,
    required this.onChanged,
  });

  final StudyTopic topic;
  final List<StudyProblem> problems;
  final Set<String> completed;
  final Future<void> Function(String id, bool value) onChanged;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final done =
        topic.problems
            .where((problem) => completed.contains(problem.storageKey))
            .length;
    final fraction = done / topic.problems.length;

    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(22, 22, 22, 18),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: topic.color.withValues(alpha: .14),
                    borderRadius: BorderRadius.circular(13),
                    border: Border.all(
                      color: topic.color.withValues(alpha: .35),
                    ),
                  ),
                  child: Icon(topic.icon, color: topic.color, size: 23),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        topic.title,
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontWeight: FontWeight.w700,
                          letterSpacing: -.3,
                        ),
                      ),
                      const SizedBox(height: 5),
                      Text(
                        topic.note,
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: scheme.onSurfaceVariant,
                          height: 1.45,
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                Container(
                  padding: const EdgeInsets.symmetric(
                    horizontal: 10,
                    vertical: 6,
                  ),
                  decoration: BoxDecoration(
                    color: topic.color.withValues(alpha: .12),
                    borderRadius: BorderRadius.circular(999),
                  ),
                  child: Text(
                    '$done/${topic.problems.length}',
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      color: topic.color,
                    ),
                  ),
                ),
              ],
            ),
          ),
          LinearProgressIndicator(
            value: fraction,
            minHeight: 3,
            backgroundColor: scheme.outline.withValues(alpha: .2),
            color: topic.color,
          ),
          for (var index = 0; index < problems.length; index++) ...[
            if (index > 0)
              Divider(
                height: 1,
                indent: 72,
                color: scheme.outline.withValues(alpha: .45),
              ),
            _ProblemRow(
              problem: problems[index],
              complete: completed.contains(problems[index].storageKey),
              accent: topic.color,
              onChanged:
                  (value) => onChanged(problems[index].storageKey, value),
            ),
          ],
        ],
      ),
    );
  }
}

class _ProblemRow extends StatelessWidget {
  const _ProblemRow({
    required this.problem,
    required this.complete,
    required this.accent,
    required this.onChanged,
  });

  final StudyProblem problem;
  final bool complete;
  final Color accent;
  final ValueChanged<bool> onChanged;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Semantics(
      checked: complete,
      label: 'Problem ${problem.id}, ${problem.title}',
      child: InkWell(
        onTap: () => onChanged(!complete),
        child: Padding(
          padding: const EdgeInsets.fromLTRB(14, 9, 18, 9),
          child: Row(
            children: [
              Checkbox(
                value: complete,
                onChanged: (value) => onChanged(value ?? false),
                activeColor: accent,
                checkColor: Colors.black87,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(5),
                ),
              ),
              SizedBox(
                width: 54,
                child: Text(
                  problem.id,
                  textAlign: TextAlign.right,
                  style: TextStyle(
                    color:
                        complete
                            ? scheme.onSurfaceVariant.withValues(alpha: .6)
                            : accent,
                    fontWeight: FontWeight.w700,
                    fontFeatures: const [FontFeature.tabularFigures()],
                  ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Text(
                  problem.title,
                  style: TextStyle(
                    fontSize: 15,
                    height: 1.35,
                    color:
                        complete ? scheme.onSurfaceVariant : scheme.onSurface,
                    decoration: complete ? TextDecoration.lineThrough : null,
                    decorationColor: scheme.onSurfaceVariant,
                  ),
                ),
              ),
              if (problem.difficulty case final difficulty?) ...[
                const SizedBox(width: 8),
                _DifficultyBadge(difficulty: difficulty),
              ],
              const SizedBox(width: 4),
              IconButton(
                tooltip: 'Open ${problem.title} on LeetCode',
                onPressed:
                    () => unawaited(
                      launchUrl(
                        Uri.parse(problem.leetCodeUrl),
                        webOnlyWindowName: '_blank',
                      ),
                    ),
                visualDensity: VisualDensity.compact,
                constraints: const BoxConstraints.tightFor(
                  width: 40,
                  height: 40,
                ),
                icon: Icon(Icons.open_in_new_rounded, color: accent, size: 19),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _DifficultyBadge extends StatelessWidget {
  const _DifficultyBadge({required this.difficulty});

  final String difficulty;

  @override
  Widget build(BuildContext context) {
    final hard = difficulty == 'Hard';
    final color = hard ? const Color(0xFFEA4335) : const Color(0xFFFBBC04);
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 4),
      decoration: BoxDecoration(
        color: color.withValues(alpha: .13),
        borderRadius: BorderRadius.circular(999),
      ),
      child: Text(
        difficulty,
        style: TextStyle(
          color: color,
          fontSize: 11,
          fontWeight: FontWeight.w700,
        ),
      ),
    );
  }
}

class _EmptyResults extends StatelessWidget {
  const _EmptyResults({required this.onClear});
  final VoidCallback onClear;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Card(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 56),
        child: Column(
          children: [
            Icon(
              Icons.search_off_rounded,
              size: 42,
              color: scheme.onSurfaceVariant,
            ),
            const SizedBox(height: 14),
            Text(
              'No questions match these filters',
              style: Theme.of(
                context,
              ).textTheme.titleMedium?.copyWith(fontWeight: FontWeight.w600),
            ),
            const SizedBox(height: 6),
            TextButton(onPressed: onClear, child: const Text('Clear filters')),
          ],
        ),
      ),
    );
  }
}

class _ProductMark extends StatelessWidget {
  const _ProductMark({required this.size});
  final double size;

  @override
  Widget build(BuildContext context) {
    final gap = size * .1;
    final tile = (size - gap) / 2;
    return SizedBox(
      width: size,
      height: size,
      child: Wrap(
        spacing: gap,
        runSpacing: gap,
        children: [
          _MarkTile(size: tile, color: const Color(0xFF4285F4), radius: 3),
          _MarkTile(
            size: tile,
            color: const Color(0xFFEA4335),
            radius: tile / 2,
          ),
          _MarkTile(
            size: tile,
            color: const Color(0xFFFBBC04),
            radius: tile / 2,
          ),
          _MarkTile(size: tile, color: const Color(0xFF34A853), radius: 3),
        ],
      ),
    );
  }
}

class _MarkTile extends StatelessWidget {
  const _MarkTile({
    required this.size,
    required this.color,
    required this.radius,
  });
  final double size;
  final Color color;
  final double radius;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(radius),
      ),
    );
  }
}

class _GridBackdrop extends StatelessWidget {
  const _GridBackdrop();

  @override
  Widget build(BuildContext context) {
    return IgnorePointer(
      child: CustomPaint(
        painter: _GridPainter(
          color: Theme.of(context).colorScheme.outline.withValues(alpha: .16),
        ),
      ),
    );
  }
}

class _GridPainter extends CustomPainter {
  const _GridPainter({required this.color});
  final Color color;

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    const spacing = 28.0;
    for (var x = 10.0; x < size.width; x += spacing) {
      for (var y = 10.0; y < size.height; y += spacing) {
        canvas.drawCircle(Offset(x, y), .75, paint);
      }
    }
  }

  @override
  bool shouldRepaint(covariant _GridPainter oldDelegate) =>
      oldDelegate.color != color;
}
