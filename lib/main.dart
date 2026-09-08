import 'dart:async';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:url_launcher/url_launcher.dart';

import 'study_data.dart';
import 'url_reference.dart';

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
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: scheme.outline.withValues(alpha: .68)),
      ),
    ),
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: scheme.surfaceContainer,
      contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: scheme.outline),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: scheme.outline),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(10),
        borderSide: BorderSide(color: scheme.primary, width: 1.5),
      ),
    ),
  );
}

enum ProblemFilter { all, remaining, complete }

String _topicScope(String title) => 'topic::$title';

String _topicReference(StudyTopic topic) => topic.title
    .toLowerCase()
    .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
    .replaceAll(RegExp(r'^-+|-+$'), '');

StudyTopic? _topicForReference(String? reference) {
  if (reference == null) return null;
  for (final topic in studyTopics) {
    if (_topicReference(topic) == reference) return topic;
  }
  return null;
}

String? _migrateTopicReference(String? reference) => switch (reference) {
  'partitioning-merge-sort' => 'sorting',
  'trees-dfs-bfs' || 'flood-fill-grid-dfs' || 'backtracking' => 'dfs',
  'bfs-shortest-path' || 'topological-sort' => 'bfs',
  _ => reference,
};

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
  static const _expandedTopicKey = 'expanded_topic_reference_v1';
  static const _noExpandedTopic = '__none__';

  final _scaffoldKey = GlobalKey<ScaffoldState>();
  final _searchController = TextEditingController();
  final _contentScrollController = ScrollController();
  final _topicKeys = <String, GlobalKey>{
    for (final topic in studyTopics) _topicReference(topic): GlobalKey(),
  };
  String? _selectedScope;
  String _query = '';
  ProblemFilter _filter = ProblemFilter.all;
  String? _expandedTopicReference = _topicReference(studyTopics.first);

  @override
  void initState() {
    super.initState();
    unawaited(_restoreExpandedTopic());
  }

  @override
  void dispose() {
    _searchController.dispose();
    _contentScrollController.dispose();
    super.dispose();
  }

  Future<void> _restoreExpandedTopic() async {
    final preferences = await SharedPreferences.getInstance();
    final linkedReference = _migrateTopicReference(readTopicReference());
    final savedReference = _migrateTopicReference(
      preferences.getString(_expandedTopicKey),
    );
    final linkedTopic = _topicForReference(linkedReference);
    final savedTopic = _topicForReference(savedReference);
    final reference =
        linkedTopic != null
            ? _topicReference(linkedTopic)
            : savedReference == _noExpandedTopic
            ? null
            : _topicReference(savedTopic ?? studyTopics.first);

    await preferences.setString(
      _expandedTopicKey,
      reference ?? _noExpandedTopic,
    );
    if (!mounted) return;
    setState(() => _expandedTopicReference = reference);
    if (linkedTopic != null && reference != null) {
      unawaited(_scrollToTopic(reference));
    }
  }

  Future<void> _scrollToTopic(String reference) async {
    await WidgetsBinding.instance.endOfFrame;
    await Future<void>.delayed(const Duration(milliseconds: 320));
    if (!mounted) return;
    final topicContext = _topicKeys[reference]?.currentContext;
    if (topicContext == null || !topicContext.mounted) return;
    final renderBox = topicContext.findRenderObject();
    if (renderBox is! RenderBox || !_contentScrollController.hasClients) {
      return;
    }
    final target = (_contentScrollController.offset +
            renderBox.localToGlobal(Offset.zero).dy -
            88)
        .clamp(0.0, _contentScrollController.position.maxScrollExtent);
    await _contentScrollController.animateTo(
      target,
      duration: const Duration(milliseconds: 420),
      curve: Curves.easeOutCubic,
    );
  }

  void _openTopic(StudyTopic topic, {bool scroll = false}) {
    final reference = _topicReference(topic);
    final nextReference =
        _expandedTopicReference == reference ? null : reference;
    setState(() => _expandedTopicReference = nextReference);
    replaceTopicReference(nextReference);
    unawaited(
      SharedPreferences.getInstance().then(
        (preferences) => preferences.setString(
          _expandedTopicKey,
          nextReference ?? _noExpandedTopic,
        ),
      ),
    );
    if (scroll && nextReference != null) {
      unawaited(_scrollToTopic(reference));
    }
  }

  List<_TopicResult> get _visibleTopics {
    final query = _query.trim().toLowerCase();
    Iterable<StudyTopic> topics = studyTopics;
    if (_selectedScope?.startsWith('topic::') ?? false) {
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
    if (scope?.startsWith('topic::') ?? false) {
      final title = scope!.substring('topic::'.length);
      for (final topic in studyTopics) {
        if (topic.title == title) {
          _openTopic(topic, scroll: true);
          break;
        }
      }
    }
    if (_scaffoldKey.currentState?.isDrawerOpen ?? false) {
      Navigator.of(context).pop();
    }
  }

  List<Widget> _topicCards(List<_TopicResult> results) {
    final children = <Widget>[];
    final expandedReference =
        _expandedTopicReference == null
            ? null
            : results.any(
              (result) =>
                  _topicReference(result.topic) == _expandedTopicReference,
            )
            ? _expandedTopicReference
            : results.isEmpty
            ? null
            : _topicReference(results.first.topic);
    for (final result in results) {
      children.add(
        _TopicCard(
          headerKey: _topicKeys[_topicReference(result.topic)],
          topic: result.topic,
          problems: result.problems,
          completed: widget.completed,
          expanded: _topicReference(result.topic) == expandedReference,
          onOpen: () => _openTopic(result.topic),
          onChanged: widget.onProblemChanged,
        ),
      );
      children.add(const SizedBox(height: 16));
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
                        child: SingleChildScrollView(
                          controller: _contentScrollController,
                          padding: EdgeInsets.fromLTRB(
                            compact ? 16 : 32,
                            12,
                            compact ? 16 : 32,
                            56,
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              _OverviewHeader(compact: compact),
                              const SizedBox(height: 24),
                              _GuideControls(
                                controller: _searchController,
                                filter: _filter,
                                compact: compact,
                                onSearchChanged:
                                    (value) => setState(() => _query = value),
                                onFilterChanged:
                                    (value) => setState(() => _filter = value),
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
                                ..._topicCards(results),
                            ],
                          ),
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
              borderRadius: BorderRadius.circular(8),
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
    final completedCount =
        uniqueProblems
            .where((problem) => completed.contains(problem.storageKey))
            .length;
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
              trailing: _ProgressRing(
                done: completedCount,
                total: uniqueProblems.length,
                color: scheme.primary,
                size: 40,
              ),
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
                for (final topic in studyTopics)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: _SubtopicNavigationTile(
                      topic: topic,
                      completed: completed,
                      selected: selectedScope == _topicScope(topic.title),
                      onTap: () => onSelected(_topicScope(topic.title)),
                    ),
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
      borderRadius: BorderRadius.circular(6),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(6),
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
              _ProgressRing(
                done: done,
                total: topic.problems.length,
                color: topic.color,
                size: 34,
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
  });

  final String label;
  final IconData icon;
  final bool selected;
  final Widget trailing;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color:
          selected ? scheme.primary.withValues(alpha: .13) : Colors.transparent,
      borderRadius: BorderRadius.circular(7),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(7),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 11),
          child: Row(
            children: [
              Icon(
                icon,
                size: 20,
                color: selected ? scheme.primary : scheme.onSurfaceVariant,
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
              trailing,
            ],
          ),
        ),
      ),
    );
  }
}

class _ProgressRing extends StatelessWidget {
  const _ProgressRing({
    required this.done,
    required this.total,
    required this.color,
    required this.size,
    this.strokeWidth = 2.5,
  });

  final int done;
  final int total;
  final Color color;
  final double size;
  final double strokeWidth;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final safeDone = done < 0 ? 0 : (done > total ? total : done);
    final progress = total == 0 ? 0.0 : safeDone / total;
    final label = '$safeDone/$total';

    return Semantics(
      label: '$safeDone of $total complete',
      child: ExcludeSemantics(
        child: SizedBox.square(
          dimension: size,
          child: Stack(
            fit: StackFit.expand,
            children: [
              CircularProgressIndicator(
                value: progress,
                strokeWidth: strokeWidth,
                strokeCap: StrokeCap.round,
                color: color,
                backgroundColor: scheme.outline.withValues(alpha: .3),
              ),
              Padding(
                padding: EdgeInsets.all(size * .16),
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    label,
                    style: TextStyle(
                      color: color,
                      fontSize: size * .25,
                      fontWeight: FontWeight.w800,
                      fontFeatures: const [FontFeature.tabularFigures()],
                    ),
                  ),
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
  const _OverviewHeader({required this.compact});

  final bool compact;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;

    return Container(
      padding: EdgeInsets.all(compact ? 22 : 30),
      decoration: BoxDecoration(
        color: scheme.surfaceContainer,
        borderRadius: BorderRadius.circular(14),
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
      child: const _HeaderCopy(),
    );
  }
}

class _HeaderCopy extends StatelessWidget {
  const _HeaderCopy();

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
            borderRadius: BorderRadius.circular(6),
            border: Border.all(
              color: const Color(0xFF4285F4).withValues(alpha: .35),
            ),
          ),
          child: const Text(
            'FREE INTERVIEW GUIDE',
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
          'Master the fundamentals. Walk into L4–L6 interviews with confidence.',
          style: Theme.of(context).textTheme.headlineLarge?.copyWith(
            fontWeight: FontWeight.w700,
            height: 1.06,
            letterSpacing: -1.1,
          ),
        ),
        const SizedBox(height: 11),
        Text(
          'A carefully organized guide to the data structures, algorithms, and representative LeetCode questions that appear most often in software engineering interviews.',
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
              icon: Icons.workspace_premium_outlined,
              label: 'L4–L6 focused',
            ),
            _MemoryCue(
              icon: Icons.insights_rounded,
              label: 'High-frequency topics',
            ),
            _MemoryCue(
              icon: Icons.checklist_rounded,
              label: 'Representative problems',
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
        borderRadius: BorderRadius.circular(6),
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

class _TopicCard extends StatelessWidget {
  const _TopicCard({
    required this.headerKey,
    required this.topic,
    required this.problems,
    required this.completed,
    required this.expanded,
    required this.onOpen,
    required this.onChanged,
  });

  final GlobalKey? headerKey;
  final StudyTopic topic;
  final List<StudyProblem> problems;
  final Set<String> completed;
  final bool expanded;
  final VoidCallback onOpen;
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
          Semantics(
            key: headerKey,
            button: true,
            expanded: expanded,
            label: '${topic.title} section',
            child: InkWell(
              onTap: onOpen,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(22, 22, 18, 18),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        color: topic.color.withValues(alpha: .14),
                        borderRadius: BorderRadius.circular(8),
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
                          Row(
                            crossAxisAlignment: CrossAxisAlignment.center,
                            children: [
                              Flexible(
                                child: Text(
                                  topic.title,
                                  style: Theme.of(
                                    context,
                                  ).textTheme.titleLarge?.copyWith(
                                    fontWeight: FontWeight.w700,
                                    letterSpacing: -.3,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 8),
                              Tooltip(
                                message: 'Reference link for ${topic.title}',
                                child: Icon(
                                  Icons.link_rounded,
                                  size: 18,
                                  color: topic.color,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 5),
                          Text(
                            topic.note,
                            maxLines: expanded ? null : 2,
                            overflow: expanded ? null : TextOverflow.ellipsis,
                            style: Theme.of(
                              context,
                            ).textTheme.bodyMedium?.copyWith(
                              color: scheme.onSurfaceVariant,
                              height: 1.45,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      crossAxisAlignment: CrossAxisAlignment.end,
                      children: [
                        _ProgressRing(
                          done: done,
                          total: topic.problems.length,
                          color: topic.color,
                          size: 48,
                          strokeWidth: 3,
                        ),
                        const SizedBox(height: 10),
                        AnimatedRotation(
                          turns: expanded ? .5 : 0,
                          duration: const Duration(milliseconds: 220),
                          curve: Curves.easeOutCubic,
                          child: Icon(
                            Icons.keyboard_arrow_down_rounded,
                            color: scheme.onSurfaceVariant,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ),
          ),
          AnimatedContainer(
            duration: const Duration(milliseconds: 220),
            height: 3,
            color:
                expanded ? topic.color : scheme.outline.withValues(alpha: .35),
          ),
          AnimatedSize(
            duration: const Duration(milliseconds: 260),
            curve: Curves.easeOutCubic,
            alignment: Alignment.topCenter,
            child:
                expanded
                    ? Column(
                      children: [
                        LinearProgressIndicator(
                          value: fraction,
                          minHeight: 2,
                          backgroundColor: scheme.outline.withValues(alpha: .2),
                          color: topic.color.withValues(alpha: .62),
                        ),
                        for (
                          var index = 0;
                          index < problems.length;
                          index++
                        ) ...[
                          if (problems[index].subcategory case final label?)
                            if (index == 0 ||
                                problems[index - 1].subcategory != label)
                              _ProblemSubcategoryHeading(
                                label: label,
                                accent: topic.color,
                              ),
                          if (index > 0 &&
                              problems[index].subcategory ==
                                  problems[index - 1].subcategory)
                            Divider(
                              height: 1,
                              indent: 72,
                              color: scheme.outline.withValues(alpha: .45),
                            ),
                          _ProblemRow(
                            problem: problems[index],
                            complete: completed.contains(
                              problems[index].storageKey,
                            ),
                            accent: topic.color,
                            onChanged:
                                (value) => onChanged(
                                  problems[index].storageKey,
                                  value,
                                ),
                          ),
                        ],
                      ],
                    )
                    : const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}

class _ProblemSubcategoryHeading extends StatelessWidget {
  const _ProblemSubcategoryHeading({required this.label, required this.accent});

  final String label;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.fromLTRB(22, 18, 22, 6),
      child: Row(
        children: [
          Container(
            width: 6,
            height: 6,
            decoration: BoxDecoration(color: accent, shape: BoxShape.circle),
          ),
          const SizedBox(width: 9),
          Text(
            label.toUpperCase(),
            style: TextStyle(
              color: accent,
              fontSize: 14,
              fontWeight: FontWeight.w800,
              letterSpacing: .6,
            ),
          ),
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
                  borderRadius: BorderRadius.circular(3),
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
        borderRadius: BorderRadius.circular(5),
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
