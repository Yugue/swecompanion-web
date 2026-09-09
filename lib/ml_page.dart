import 'dart:async';

import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'ml_lesson_view.dart';
import 'ml_study_data.dart';
import 'url_reference.dart';

enum MlTopicFilter { all, review, complete }

const _blue = Color(0xFF4285F4);
const _red = Color(0xFFEA4335);
const _yellow = Color(0xFFFBBC04);
const _green = Color(0xFF34A853);

const _googleMlInterviewDomains = [
  'Agentic AI Development',
  'Applied Machine Learning → Basics of ML',
  'Recommendations / Ranking / Predictions (RRP)',
  'Computer Vision (CV) / Image Processing',
  'Natural Language Processing / Understanding (NLP / NLU)',
  'Speech / Audio',
  'Deep Learning / Neural Networks',
  'Reinforcement Learning',
  'Distributed Machine Learning',
  'Generative AI → Large Language Models (LLM)',
];

class MlReviewPage extends StatefulWidget {
  const MlReviewPage({
    super.key,
    required this.darkMode,
    required this.onThemeChanged,
    this.initialReference,
  });

  final bool darkMode;
  final Future<void> Function() onThemeChanged;
  final String? initialReference;

  @override
  State<MlReviewPage> createState() => _MlReviewPageState();
}

class _MlReviewPageState extends State<MlReviewPage> {
  static const _completedKey = 'ml_completed_topics_v1';
  static const _expandedKey = 'ml_expanded_part_v1';
  static const _expandedTopicKey = 'ml_expanded_topic_v1';

  final _scaffoldKey = GlobalKey<ScaffoldState>();
  final _searchController = TextEditingController();
  final _scrollController = ScrollController();
  final _partKeys = <String, GlobalKey>{
    for (final part in mlParts) part.id: GlobalKey(),
  };
  final _topicKeys = <String, GlobalKey>{
    for (final part in mlParts)
      for (final topic in part.topics) topic.id: GlobalKey(),
  };

  Set<String> _completed = {};
  final Set<String> _revealedAnswers = {};
  String _query = '';
  MlTopicFilter _filter = MlTopicFilter.all;
  String? _expandedPartId = mlParts.first.id;
  String? _expandedTopicId;
  bool _ready = false;

  @override
  void initState() {
    super.initState();
    unawaited(_restore());
  }

  @override
  void dispose() {
    _searchController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  MlPart? _partForReference(String? reference) {
    if (reference == null) return null;
    if (mlPartsById[reference] case final part?) return part;
    for (final part in mlParts) {
      if (part.topics.any((topic) => topic.id == reference)) return part;
    }
    return null;
  }

  Future<void> _restore() async {
    final preferences = await SharedPreferences.getInstance();
    final reference = widget.initialReference ?? readMlReference();
    final linkedPart = _partForReference(reference);
    final savedPart = mlPartsById[preferences.getString(_expandedKey)];
    final expanded = linkedPart?.id ?? savedPart?.id ?? mlParts.first.id;
    final linkedTopic = mlTopicsById[reference];
    final savedTopic = mlTopicsById[preferences.getString(_expandedTopicKey)];
    if (!mounted) return;
    setState(() {
      _completed = preferences.getStringList(_completedKey)?.toSet() ?? {};
      _expandedPartId = expanded;
      _expandedTopicId = linkedTopic?.id ?? savedTopic?.id;
      _ready = true;
    });
    if (reference != null) unawaited(_scrollToReference(reference));
  }

  Future<void> _setCompleted(String topicId, bool value) async {
    setState(
      () => value ? _completed.add(topicId) : _completed.remove(topicId),
    );
    final preferences = await SharedPreferences.getInstance();
    await preferences.setStringList(_completedKey, _completed.toList()..sort());
  }

  Future<void> _scrollToReference(String reference) async {
    await WidgetsBinding.instance.endOfFrame;
    await Future<void>.delayed(const Duration(milliseconds: 360));
    if (!mounted || !_scrollController.hasClients) return;
    final targetKey = _topicKeys[reference] ?? _partKeys[reference];
    final targetContext = targetKey?.currentContext;
    if (targetContext == null || !targetContext.mounted) return;
    final renderBox = targetContext.findRenderObject();
    if (renderBox is! RenderBox) return;
    final target = (_scrollController.offset +
            renderBox.localToGlobal(Offset.zero).dy -
            88)
        .clamp(0.0, _scrollController.position.maxScrollExtent);
    await _scrollController.animateTo(
      target,
      duration: const Duration(milliseconds: 440),
      curve: Curves.easeOutCubic,
    );
  }

  void _openPart(MlPart part, {bool scroll = false}) {
    final next = _expandedPartId == part.id ? null : part.id;
    setState(() {
      _expandedPartId = next;
      _expandedTopicId = null;
    });
    replaceMlReference(next);
    unawaited(
      SharedPreferences.getInstance().then(
        (preferences) => preferences.setString(_expandedKey, next ?? ''),
      ),
    );
    unawaited(
      SharedPreferences.getInstance().then(
        (preferences) => preferences.setString(_expandedTopicKey, ''),
      ),
    );
    if (scroll && next != null) unawaited(_scrollToReference(part.id));
  }

  void _openReference(MlPart part, String reference) {
    final topic = mlTopicsById[reference];
    setState(() {
      _expandedPartId = part.id;
      _expandedTopicId = topic?.id;
    });
    replaceMlReference(reference);
    unawaited(
      SharedPreferences.getInstance().then(
        (preferences) => preferences.setString(_expandedKey, part.id),
      ),
    );
    unawaited(
      SharedPreferences.getInstance().then(
        (preferences) =>
            preferences.setString(_expandedTopicKey, topic?.id ?? ''),
      ),
    );
    unawaited(_scrollToReference(reference));
    if (_scaffoldKey.currentState?.isDrawerOpen ?? false) {
      Navigator.of(context).pop();
    }
  }

  void _toggleTopic(MlPart part, MlTopic topic) {
    final next = _expandedTopicId == topic.id ? null : topic.id;
    setState(() {
      _expandedPartId = part.id;
      _expandedTopicId = next;
    });
    replaceMlReference(next ?? part.id);
    unawaited(
      SharedPreferences.getInstance().then((preferences) async {
        await preferences.setString(_expandedKey, part.id);
        await preferences.setString(_expandedTopicKey, next ?? '');
      }),
    );
    if (next != null) unawaited(_scrollToReference(topic.id));
  }

  List<_MlPartResult> get _visibleParts {
    final query = _query.trim().toLowerCase();
    return mlParts
        .map((part) {
          final partMatches =
              query.isNotEmpty &&
              '${part.title} ${part.description}'.toLowerCase().contains(query);
          final topics =
              part.topics.where((topic) {
                final complete = _completed.contains(topic.id);
                final filterMatch = switch (_filter) {
                  MlTopicFilter.all => true,
                  MlTopicFilter.review => !complete,
                  MlTopicFilter.complete => complete,
                };
                final queryMatch =
                    query.isEmpty ||
                    partMatches ||
                    '${topic.title} ${topic.summary} ${topic.keyPoints.join(' ')}'
                        .toLowerCase()
                        .contains(query);
                return filterMatch && queryMatch;
              }).toList();
          return _MlPartResult(part, topics);
        })
        .where((result) => result.topics.isNotEmpty)
        .toList();
  }

  @override
  Widget build(BuildContext context) {
    if (!_ready) {
      return const Scaffold(body: Center(child: CircularProgressIndicator()));
    }
    final width = MediaQuery.sizeOf(context).width;
    final desktop = width >= 1060;
    final compact = width < 1320;
    final results = _visibleParts;

    final navigation = _MlNavigation(
      completed: _completed,
      expandedPartId: _expandedPartId,
      onPartSelected: (part) => _openReference(part, part.id),
    );

    return Scaffold(
      key: _scaffoldKey,
      drawer:
          desktop
              ? null
              : Drawer(width: 304, child: SafeArea(child: navigation)),
      body: Stack(
        children: [
          const Positioned.fill(child: _MlGridBackdrop()),
          SafeArea(
            child: Row(
              children: [
                if (desktop) SizedBox(width: 286, child: navigation),
                Expanded(
                  child: Column(
                    children: [
                      _MlTopBar(
                        compact: compact,
                        showMenu: !desktop,
                        darkMode: widget.darkMode,
                        onMenuPressed:
                            () => _scaffoldKey.currentState?.openDrawer(),
                        onThemePressed: widget.onThemeChanged,
                      ),
                      Expanded(
                        child: SingleChildScrollView(
                          controller: _scrollController,
                          padding: EdgeInsets.fromLTRB(
                            compact ? 16 : 32,
                            12,
                            compact ? 16 : 32,
                            56,
                          ),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              const _MlHero(),
                              const SizedBox(height: 24),
                              _MlControls(
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
                                _MlEmptyResults(
                                  onClear: () {
                                    _searchController.clear();
                                    setState(() {
                                      _query = '';
                                      _filter = MlTopicFilter.all;
                                    });
                                  },
                                )
                              else
                                for (final result in results) ...[
                                  _MlPartCard(
                                    headerKey: _partKeys[result.part.id],
                                    topicKeys: _topicKeys,
                                    part: result.part,
                                    topics: result.topics,
                                    completed: _completed,
                                    expanded: _expandedPartId == result.part.id,
                                    expandedTopicId: _expandedTopicId,
                                    revealedAnswers: _revealedAnswers,
                                    onOpen: () => _openPart(result.part),
                                    onReference:
                                        (reference) => _openReference(
                                          result.part,
                                          reference,
                                        ),
                                    onTopicOpen:
                                        (topic) =>
                                            _toggleTopic(result.part, topic),
                                    onCompleted: _setCompleted,
                                    onReveal: (key) {
                                      setState(() {
                                        _revealedAnswers.contains(key)
                                            ? _revealedAnswers.remove(key)
                                            : _revealedAnswers.add(key);
                                      });
                                    },
                                  ),
                                  const SizedBox(height: 16),
                                ],
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

class _MlPartResult {
  const _MlPartResult(this.part, this.topics);
  final MlPart part;
  final List<MlTopic> topics;
}

class _MlTopBar extends StatelessWidget {
  const _MlTopBar({
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
              tooltip: 'Open curriculum',
              onPressed: onMenuPressed,
              icon: const Icon(Icons.menu_rounded),
            ),
          if (showMenu) const SizedBox(width: 4),
          if (showMenu) const _MlProductMark(size: 28),
          if (showMenu) const SizedBox(width: 8),
          if (!compact)
            Expanded(
              child: Text(
                'Interview study workspace',
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: Theme.of(context).textTheme.titleMedium?.copyWith(
                  fontWeight: FontWeight.w600,
                  letterSpacing: -.2,
                ),
              ),
            )
          else
            const Spacer(),
          _MlTrackSwitcher(
            onLeetCode:
                () => Navigator.of(
                  context,
                ).pushNamedAndRemoveUntil('/', (_) => false),
          ),
          const SizedBox(width: 8),
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

class _MlTrackSwitcher extends StatelessWidget {
  const _MlTrackSwitcher({required this.onLeetCode});

  final VoidCallback onLeetCode;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(3),
      decoration: BoxDecoration(
        color: scheme.surfaceContainer,
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: scheme.outline.withValues(alpha: .75)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          _MlTrackButton(label: 'LeetCode', selected: false, onTap: onLeetCode),
          const _MlTrackButton(label: 'ML', selected: true),
        ],
      ),
    );
  }
}

class _MlTrackButton extends StatelessWidget {
  const _MlTrackButton({
    required this.label,
    required this.selected,
    this.onTap,
  });

  final String label;
  final bool selected;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color:
          selected ? scheme.primary.withValues(alpha: .16) : Colors.transparent,
      borderRadius: BorderRadius.circular(5),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(5),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          child: Text(
            label,
            style: TextStyle(
              color: selected ? scheme.primary : scheme.onSurfaceVariant,
              fontSize: 13,
              fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
            ),
          ),
        ),
      ),
    );
  }
}

class _MlNavigation extends StatelessWidget {
  const _MlNavigation({
    required this.completed,
    required this.expandedPartId,
    required this.onPartSelected,
  });

  final Set<String> completed;
  final String? expandedPartId;
  final ValueChanged<MlPart> onPartSelected;

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
                _MlProductMark(size: 34),
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
            child: _MlNavTile(
              label: 'ML interview guide',
              icon: Icons.psychology_outlined,
              selected: true,
              trailing: _MlProgressRing(
                done: completed.length,
                total: mlTopicCount,
                color: scheme.primary,
                size: 40,
              ),
              onTap: () {},
            ),
          ),
          const Padding(
            padding: EdgeInsets.fromLTRB(22, 22, 22, 8),
            child: Text(
              'CURRICULUM',
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
                for (final part in mlParts)
                  Padding(
                    padding: const EdgeInsets.only(bottom: 4),
                    child: _MlNavTile(
                      label: 'Chapter ${part.number} · ${part.title}',
                      icon: part.icon,
                      selected: expandedPartId == part.id,
                      trailing: _MlProgressRing(
                        done:
                            part.topics
                                .where((topic) => completed.contains(topic.id))
                                .length,
                        total: part.topics.length,
                        color: part.color,
                        size: 34,
                      ),
                      onTap: () => onPartSelected(part),
                    ),
                  ),
              ],
            ),
          ),
          Padding(
            padding: const EdgeInsets.all(18),
            child: Row(
              children: [
                Icon(Icons.save_outlined, size: 17, color: scheme.primary),
                const SizedBox(width: 9),
                Expanded(
                  child: Text(
                    'Review progress saved on this device',
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

class _MlNavTile extends StatelessWidget {
  const _MlNavTile({
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
          selected ? scheme.primary.withValues(alpha: .11) : Colors.transparent,
      borderRadius: BorderRadius.circular(7),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(7),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 9),
          child: Row(
            children: [
              Icon(
                icon,
                size: 19,
                color: selected ? scheme.primary : scheme.onSurfaceVariant,
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  label,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    fontSize: 13,
                    fontWeight: selected ? FontWeight.w600 : FontWeight.w400,
                  ),
                ),
              ),
              const SizedBox(width: 6),
              trailing,
            ],
          ),
        ),
      ),
    );
  }
}

class _MlHero extends StatelessWidget {
  const _MlHero();

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(30),
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
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 6),
            decoration: BoxDecoration(
              color: _blue.withValues(alpha: .13),
              borderRadius: BorderRadius.circular(6),
              border: Border.all(color: _blue.withValues(alpha: .35)),
            ),
            child: const Text(
              'GOOGLE ML DOMAIN INTERVIEW STUDY GUIDE',
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
            'Deep Learning / Neural Networks',
            style: Theme.of(context).textTheme.headlineLarge?.copyWith(
              fontWeight: FontWeight.w700,
              height: 1.06,
              letterSpacing: -1.1,
            ),
          ),
          const SizedBox(height: 11),
          Text(
            'This section is an exhaustive, structured review of the Deep Learning / Neural Networks domain. It covers fundamentals, architectures, Transformers, representation learning, and practical ML reasoning with the explanations, diagrams, formulas, tables, and quizzes needed for an interview-ready review.',
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(
              color: scheme.onSurfaceVariant,
              height: 1.5,
            ),
          ),
          const SizedBox(height: 20),
          const _MlDomainOverview(),
          const SizedBox(height: 20),
          const Wrap(
            spacing: 10,
            runSpacing: 10,
            children: [
              _MlCue(icon: Icons.layers_outlined, label: '57 full lessons'),
              _MlCue(
                icon: Icons.psychology_alt_outlined,
                label: 'Interview prompts',
              ),
              _MlCue(icon: Icons.quiz_outlined, label: '50 revealable answers'),
            ],
          ),
        ],
      ),
    );
  }
}

class _MlDomainOverview extends StatelessWidget {
  const _MlDomainOverview();

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest.withValues(alpha: .45),
        borderRadius: BorderRadius.circular(7),
        border: Border.all(color: scheme.outline.withValues(alpha: .55)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.tune_rounded, size: 18, color: scheme.primary),
              const SizedBox(width: 9),
              Expanded(
                child: Text(
                  'Candidate-selectable Google ML domains',
                  style: Theme.of(
                    context,
                  ).textTheme.titleSmall?.copyWith(fontWeight: FontWeight.w700),
                ),
              ),
            ],
          ),
          const SizedBox(height: 7),
          Text(
            'Candidates can prepare for one of the following domain areas. The highlighted domain is the guide currently presented on this page.',
            style: Theme.of(context).textTheme.bodySmall?.copyWith(
              color: scheme.onSurfaceVariant,
              height: 1.45,
            ),
          ),
          const SizedBox(height: 14),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: [
              for (final domain in _googleMlInterviewDomains)
                _MlDomainChip(
                  label: domain,
                  selected: domain == 'Deep Learning / Neural Networks',
                ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MlDomainChip extends StatelessWidget {
  const _MlDomainChip({required this.label, required this.selected});

  final String label;
  final bool selected;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 520),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 11, vertical: 8),
        decoration: BoxDecoration(
          color:
              selected
                  ? scheme.primary.withValues(alpha: .15)
                  : scheme.surface.withValues(alpha: .5),
          borderRadius: BorderRadius.circular(5),
          border: Border.all(
            color:
                selected
                    ? scheme.primary.withValues(alpha: .65)
                    : scheme.outline.withValues(alpha: .45),
          ),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            if (selected) ...[
              Icon(Icons.check_circle_rounded, size: 15, color: scheme.primary),
              const SizedBox(width: 7),
            ],
            Flexible(
              child: Text(
                label,
                style: TextStyle(
                  color: selected ? scheme.primary : scheme.onSurfaceVariant,
                  fontSize: 12.5,
                  fontWeight: selected ? FontWeight.w700 : FontWeight.w500,
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

class _MlCue extends StatelessWidget {
  const _MlCue({required this.icon, required this.label});
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

class _MlControls extends StatelessWidget {
  const _MlControls({
    required this.controller,
    required this.filter,
    required this.compact,
    required this.onSearchChanged,
    required this.onFilterChanged,
  });
  final TextEditingController controller;
  final MlTopicFilter filter;
  final bool compact;
  final ValueChanged<String> onSearchChanged;
  final ValueChanged<MlTopicFilter> onFilterChanged;

  @override
  Widget build(BuildContext context) {
    final search = TextField(
      controller: controller,
      onChanged: onSearchChanged,
      decoration: const InputDecoration(
        hintText: 'Search ML concepts or interview prompts',
        prefixIcon: Icon(Icons.search_rounded),
      ),
    );
    final filters = SegmentedButton<MlTopicFilter>(
      showSelectedIcon: false,
      segments: const [
        ButtonSegment(value: MlTopicFilter.all, label: Text('All')),
        ButtonSegment(value: MlTopicFilter.review, label: Text('To review')),
        ButtonSegment(value: MlTopicFilter.complete, label: Text('Reviewed')),
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

class _MlPartCard extends StatelessWidget {
  const _MlPartCard({
    required this.headerKey,
    required this.topicKeys,
    required this.part,
    required this.topics,
    required this.completed,
    required this.expanded,
    required this.expandedTopicId,
    required this.revealedAnswers,
    required this.onOpen,
    required this.onReference,
    required this.onTopicOpen,
    required this.onCompleted,
    required this.onReveal,
  });
  final GlobalKey? headerKey;
  final Map<String, GlobalKey> topicKeys;
  final MlPart part;
  final List<MlTopic> topics;
  final Set<String> completed;
  final bool expanded;
  final String? expandedTopicId;
  final Set<String> revealedAnswers;
  final VoidCallback onOpen;
  final ValueChanged<String> onReference;
  final ValueChanged<MlTopic> onTopicOpen;
  final Future<void> Function(String, bool) onCompleted;
  final ValueChanged<String> onReveal;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    final done =
        part.topics.where((topic) => completed.contains(topic.id)).length;
    return Card(
      clipBehavior: Clip.antiAlias,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Semantics(
            key: headerKey,
            button: true,
            expanded: expanded,
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
                        color: part.color.withValues(alpha: .14),
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(
                          color: part.color.withValues(alpha: .35),
                        ),
                      ),
                      child: Icon(part.icon, color: part.color, size: 23),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              Flexible(
                                child: Text(
                                  'Chapter ${part.number} — ${part.title}',
                                  style: Theme.of(
                                    context,
                                  ).textTheme.titleLarge?.copyWith(
                                    fontWeight: FontWeight.w700,
                                    letterSpacing: -.3,
                                  ),
                                ),
                              ),
                              const SizedBox(width: 4),
                              IconButton(
                                tooltip: 'Reference link for ${part.title}',
                                onPressed: () => onReference(part.id),
                                visualDensity: VisualDensity.compact,
                                icon: Icon(
                                  Icons.link_rounded,
                                  size: 19,
                                  color: part.color,
                                ),
                              ),
                            ],
                          ),
                          Text(
                            part.description,
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
                      children: [
                        _MlProgressRing(
                          done: done,
                          total: part.topics.length,
                          color: part.color,
                          size: 48,
                          strokeWidth: 3,
                        ),
                        const SizedBox(height: 10),
                        AnimatedRotation(
                          turns: expanded ? .5 : 0,
                          duration: const Duration(milliseconds: 220),
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
                expanded ? part.color : scheme.outline.withValues(alpha: .35),
          ),
          AnimatedSize(
            duration: const Duration(milliseconds: 260),
            alignment: Alignment.topCenter,
            child:
                expanded
                    ? Container(
                      color: scheme.surface.withValues(alpha: .22),
                      padding: const EdgeInsets.all(18),
                      child: Column(
                        children: [
                          for (final topic in topics) ...[
                            _MlTopicCard(
                              key: topicKeys[topic.id],
                              chapterNumber:
                                  '${part.number}.${part.topics.indexOf(topic) + 1}',
                              topic: topic,
                              accent: part.color,
                              complete: completed.contains(topic.id),
                              expanded: expandedTopicId == topic.id,
                              onOpen: () => onTopicOpen(topic),
                              onCompleted:
                                  (value) => onCompleted(topic.id, value),
                              onReference: () => onReference(topic.id),
                            ),
                            const SizedBox(height: 12),
                          ],
                          if (part.quiz.isNotEmpty)
                            _MlQuizSection(
                              part: part,
                              revealedAnswers: revealedAnswers,
                              onReveal: onReveal,
                            ),
                        ],
                      ),
                    )
                    : const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}

class _MlTopicCard extends StatelessWidget {
  const _MlTopicCard({
    super.key,
    required this.chapterNumber,
    required this.topic,
    required this.accent,
    required this.complete,
    required this.expanded,
    required this.onOpen,
    required this.onCompleted,
    required this.onReference,
  });
  final String chapterNumber;
  final MlTopic topic;
  final Color accent;
  final bool complete;
  final bool expanded;
  final VoidCallback onOpen;
  final ValueChanged<bool> onCompleted;
  final VoidCallback onReference;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      decoration: BoxDecoration(
        color: scheme.surfaceContainer,
        borderRadius: BorderRadius.circular(9),
        border: Border.all(
          color:
              complete
                  ? accent.withValues(alpha: .55)
                  : scheme.outline.withValues(alpha: .65),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          Semantics(
            button: true,
            expanded: expanded,
            label: '$chapterNumber ${topic.title} lesson',
            child: InkWell(
              onTap: onOpen,
              child: Padding(
                padding: const EdgeInsets.fromLTRB(14, 12, 10, 12),
                child: Row(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Checkbox(
                      value: complete,
                      onChanged: (value) => onCompleted(value ?? false),
                      activeColor: accent,
                      checkColor: Colors.black87,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(3),
                      ),
                    ),
                    const SizedBox(width: 4),
                    Expanded(
                      child: Padding(
                        padding: const EdgeInsets.only(top: 10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              '$chapterNumber  ${topic.title}',
                              style: Theme.of(
                                context,
                              ).textTheme.titleMedium?.copyWith(
                                fontWeight: FontWeight.w700,
                                decoration:
                                    complete
                                        ? TextDecoration.lineThrough
                                        : null,
                                decorationColor: scheme.onSurfaceVariant,
                              ),
                            ),
                            if (!expanded) ...[
                              const SizedBox(height: 6),
                              Text(
                                topic.summary,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  color: scheme.onSurfaceVariant,
                                  height: 1.4,
                                ),
                              ),
                            ],
                          ],
                        ),
                      ),
                    ),
                    IconButton(
                      tooltip: 'Reference link for ${topic.title}',
                      onPressed: onReference,
                      icon: Icon(Icons.link_rounded, color: accent, size: 19),
                    ),
                    AnimatedRotation(
                      turns: expanded ? .5 : 0,
                      duration: const Duration(milliseconds: 220),
                      child: Padding(
                        padding: const EdgeInsets.only(top: 10, right: 6),
                        child: Icon(
                          Icons.keyboard_arrow_down_rounded,
                          color: scheme.onSurfaceVariant,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
          AnimatedSize(
            duration: const Duration(milliseconds: 260),
            alignment: Alignment.topCenter,
            child:
                expanded
                    ? Column(
                      crossAxisAlignment: CrossAxisAlignment.stretch,
                      children: [
                        Divider(
                          height: 1,
                          color: scheme.outline.withValues(alpha: .55),
                        ),
                        Padding(
                          padding: const EdgeInsets.fromLTRB(24, 6, 24, 30),
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.stretch,
                            children: [
                              _MlLessonOverview(topic: topic, accent: accent),
                              Padding(
                                padding: const EdgeInsets.only(
                                  top: 30,
                                  bottom: 2,
                                ),
                                child: Row(
                                  children: [
                                    Expanded(
                                      child: Divider(
                                        color: scheme.outline.withValues(
                                          alpha: .55,
                                        ),
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Text(
                                      'FULL LESSON',
                                      style: TextStyle(
                                        color: accent,
                                        fontSize: 12,
                                        fontWeight: FontWeight.w800,
                                        letterSpacing: 1.1,
                                      ),
                                    ),
                                    const SizedBox(width: 12),
                                    Expanded(
                                      child: Divider(
                                        color: scheme.outline.withValues(
                                          alpha: .55,
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              MlLessonView(topicId: topic.id, accent: accent),
                            ],
                          ),
                        ),
                      ],
                    )
                    : const SizedBox.shrink(),
          ),
        ],
      ),
    );
  }
}

class _MlLessonOverview extends StatelessWidget {
  const _MlLessonOverview({required this.topic, required this.accent});

  final MlTopic topic;
  final Color accent;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      margin: const EdgeInsets.only(top: 22),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: accent.withValues(alpha: .07),
        borderRadius: BorderRadius.circular(7),
        border: Border.all(color: accent.withValues(alpha: .3)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'INTERVIEW-READY OVERVIEW',
            style: TextStyle(
              color: accent,
              fontSize: 12,
              fontWeight: FontWeight.w800,
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 10),
          Text(
            topic.summary,
            style: Theme.of(context).textTheme.bodyLarge?.copyWith(height: 1.5),
          ),
          const SizedBox(height: 13),
          for (final point in topic.keyPoints)
            Padding(
              padding: const EdgeInsets.only(bottom: 7),
              child: Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    margin: const EdgeInsets.only(top: 7),
                    width: 5,
                    height: 5,
                    decoration: BoxDecoration(
                      color: accent,
                      shape: BoxShape.circle,
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      point,
                      style: TextStyle(
                        color: scheme.onSurfaceVariant,
                        height: 1.45,
                      ),
                    ),
                  ),
                ],
              ),
            ),
          if (topic.code case final code?) ...[
            const SizedBox(height: 8),
            Container(
              width: double.infinity,
              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
              decoration: BoxDecoration(
                color: scheme.surfaceContainerHighest.withValues(alpha: .65),
                borderRadius: BorderRadius.circular(5),
              ),
              child: SelectableText(
                code,
                style: const TextStyle(
                  fontFamily: 'monospace',
                  fontSize: 13,
                  height: 1.4,
                ),
              ),
            ),
          ],
          const SizedBox(height: 13),
          Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Icon(Icons.record_voice_over_outlined, size: 18, color: accent),
              const SizedBox(width: 9),
              Expanded(
                child: Text(
                  'Interview probe: ${topic.interviewPrompt}',
                  style: const TextStyle(
                    fontSize: 13.5,
                    height: 1.45,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

class _MlQuizSection extends StatelessWidget {
  const _MlQuizSection({
    required this.part,
    required this.revealedAnswers,
    required this.onReveal,
  });
  final MlPart part;
  final Set<String> revealedAnswers;
  final ValueChanged<String> onReveal;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Container(
      width: double.infinity,
      margin: const EdgeInsets.only(top: 8),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: scheme.surfaceContainerHighest.withValues(alpha: .35),
        borderRadius: BorderRadius.circular(9),
        border: Border.all(color: part.color.withValues(alpha: .35)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Icon(Icons.quiz_outlined, color: part.color),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  'Chapter ${part.number} knowledge check',
                  style: Theme.of(
                    context,
                  ).textTheme.titleLarge?.copyWith(fontWeight: FontWeight.w700),
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 5),
                decoration: BoxDecoration(
                  color: part.color.withValues(alpha: .12),
                  borderRadius: BorderRadius.circular(5),
                ),
                child: Text(
                  '${part.quiz.length} questions',
                  style: TextStyle(
                    color: part.color,
                    fontSize: 12,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            'Answer aloud first, then reveal the concise interview-ready answer.',
            style: TextStyle(color: scheme.onSurfaceVariant),
          ),
          const SizedBox(height: 14),
          for (var index = 0; index < part.quiz.length; index++) ...[
            _MlQuizQuestionCard(
              index: index,
              question: part.quiz[index],
              accent: part.color,
              revealed: revealedAnswers.contains('${part.id}-$index'),
              onReveal: () => onReveal('${part.id}-$index'),
            ),
            if (index != part.quiz.length - 1) const SizedBox(height: 9),
          ],
        ],
      ),
    );
  }
}

class _MlQuizQuestionCard extends StatelessWidget {
  const _MlQuizQuestionCard({
    required this.index,
    required this.question,
    required this.accent,
    required this.revealed,
    required this.onReveal,
  });
  final int index;
  final MlQuizQuestion question;
  final Color accent;
  final bool revealed;
  final VoidCallback onReveal;

  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return Material(
      color: scheme.surfaceContainer,
      borderRadius: BorderRadius.circular(7),
      child: InkWell(
        onTap: onReveal,
        borderRadius: BorderRadius.circular(7),
        child: Container(
          padding: const EdgeInsets.all(14),
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(7),
            border: Border.all(
              color:
                  revealed
                      ? accent.withValues(alpha: .48)
                      : scheme.outline.withValues(alpha: .6),
            ),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: 26,
                    height: 26,
                    alignment: Alignment.center,
                    decoration: BoxDecoration(
                      color: accent.withValues(alpha: .14),
                      borderRadius: BorderRadius.circular(5),
                    ),
                    child: Text(
                      '${index + 1}',
                      style: TextStyle(
                        color: accent,
                        fontWeight: FontWeight.w800,
                        fontSize: 12,
                      ),
                    ),
                  ),
                  const SizedBox(width: 10),
                  Expanded(
                    child: Text(
                      question.question,
                      style: const TextStyle(
                        fontWeight: FontWeight.w600,
                        height: 1.4,
                      ),
                    ),
                  ),
                  Icon(
                    revealed
                        ? Icons.visibility_off_outlined
                        : Icons.visibility_outlined,
                    size: 19,
                    color: scheme.onSurfaceVariant,
                  ),
                ],
              ),
              AnimatedSize(
                duration: const Duration(milliseconds: 220),
                alignment: Alignment.topCenter,
                child:
                    revealed
                        ? Padding(
                          padding: const EdgeInsets.fromLTRB(36, 12, 4, 2),
                          child: Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: const Color(
                                0xFF34A853,
                              ).withValues(alpha: .1),
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(
                                color: const Color(
                                  0xFF34A853,
                                ).withValues(alpha: .32),
                              ),
                            ),
                            child: Text(
                              question.answer,
                              style: const TextStyle(
                                color: Color(0xFF65C987),
                                height: 1.45,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        )
                        : const SizedBox.shrink(),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _MlProgressRing extends StatelessWidget {
  const _MlProgressRing({
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
    final safeDone = done.clamp(0, total);
    return SizedBox.square(
      dimension: size,
      child: Stack(
        fit: StackFit.expand,
        children: [
          CircularProgressIndicator(
            value: total == 0 ? 0 : safeDone / total,
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
                '$safeDone/$total',
                style: TextStyle(
                  color: color,
                  fontSize: size * .25,
                  fontWeight: FontWeight.w800,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

class _MlProductMark extends StatelessWidget {
  const _MlProductMark({required this.size});
  final double size;

  @override
  Widget build(BuildContext context) {
    return SizedBox.square(
      dimension: size,
      child: GridView.count(
        crossAxisCount: 2,
        physics: const NeverScrollableScrollPhysics(),
        padding: EdgeInsets.zero,
        mainAxisSpacing: 2,
        crossAxisSpacing: 2,
        children: const [
          _MlMarkTile(color: _blue, radius: 3),
          _MlMarkTile(color: _red, radius: 3),
          _MlMarkTile(color: _yellow, radius: 3),
          _MlMarkTile(color: _green, radius: 3),
        ],
      ),
    );
  }
}

class _MlMarkTile extends StatelessWidget {
  const _MlMarkTile({required this.color, required this.radius});
  final Color color;
  final double radius;
  @override
  Widget build(BuildContext context) => Container(
    decoration: BoxDecoration(
      color: color,
      borderRadius: BorderRadius.circular(radius),
    ),
  );
}

class _MlGridBackdrop extends StatelessWidget {
  const _MlGridBackdrop();
  @override
  Widget build(BuildContext context) {
    final scheme = Theme.of(context).colorScheme;
    return CustomPaint(
      painter: _MlGridPainter(
        scheme.outline.withValues(
          alpha: Theme.of(context).brightness == Brightness.dark ? .12 : .09,
        ),
      ),
    );
  }
}

class _MlGridPainter extends CustomPainter {
  const _MlGridPainter(this.color);
  final Color color;
  @override
  void paint(Canvas canvas, Size size) {
    final paint =
        Paint()
          ..color = color
          ..strokeWidth = .6;
    const spacing = 32.0;
    for (double x = 0; x < size.width; x += spacing) {
      canvas.drawLine(Offset(x, 0), Offset(x, size.height), paint);
    }
    for (double y = 0; y < size.height; y += spacing) {
      canvas.drawLine(Offset(0, y), Offset(size.width, y), paint);
    }
  }

  @override
  bool shouldRepaint(covariant _MlGridPainter oldDelegate) =>
      oldDelegate.color != color;
}

class _MlEmptyResults extends StatelessWidget {
  const _MlEmptyResults({required this.onClear});
  final VoidCallback onClear;
  @override
  Widget build(BuildContext context) => Card(
    child: Padding(
      padding: const EdgeInsets.all(32),
      child: Column(
        children: [
          const Icon(Icons.search_off_rounded, size: 40),
          const SizedBox(height: 12),
          Text(
            'No review topics match those filters.',
            style: Theme.of(context).textTheme.titleMedium,
          ),
          const SizedBox(height: 12),
          TextButton(onPressed: onClear, child: const Text('Clear filters')),
        ],
      ),
    ),
  );
}
