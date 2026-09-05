import 'package:flutter/material.dart';

class StudyProblem {
  const StudyProblem(this.id, this.title, {this.initiallyComplete = false});

  final String id;
  final String title;
  final bool initiallyComplete;

  String get storageKey => id;
}

class StudyTopic {
  const StudyTopic({
    required this.title,
    required this.shortTitle,
    required this.icon,
    required this.color,
    required this.note,
    required this.problems,
  });

  final String title;
  final String shortTitle;
  final IconData icon;
  final Color color;
  final String note;
  final List<StudyProblem> problems;
}

const studyTopics = <StudyTopic>[
  StudyTopic(
    title: 'HashMap, Frequency & Top-K',
    shortTitle: 'HashMap & Top-K',
    icon: Icons.data_object_rounded,
    color: Color(0xFF4285F4),
    note:
        'Count first, then organize. A frequency map turns repeated scans into direct lookups; a heap keeps only the best k candidates.',
    problems: [
      StudyProblem('1', 'Two Sum', initiallyComplete: true),
      StudyProblem('49', 'Group Anagrams', initiallyComplete: true),
      StudyProblem('347', 'Top K Frequent Elements', initiallyComplete: true),
      StudyProblem(
        '451',
        'Sort Characters By Frequency',
        initiallyComplete: true,
      ),
      StudyProblem(
        '295',
        'Find Median from Data Stream',
        initiallyComplete: true,
      ),
      StudyProblem('23', 'Merge K Sorted Lists', initiallyComplete: true),
      StudyProblem(
        '378',
        'Kth Smallest Element in a Sorted Matrix',
        initiallyComplete: true,
      ),
      StudyProblem(
        '632',
        'Smallest Range Covering Elements from K Lists',
        initiallyComplete: true,
      ),
    ],
  ),
  StudyTopic(
    title: 'Partitioning & Merge Sort',
    shortTitle: 'Sorting',
    icon: Icons.sort_rounded,
    color: Color(0xFF8AB4F8),
    note:
        'For two or three groups, maintain regions with pointers. For general sorting, split, solve each half, and merge in linear time.',
    problems: [
      StudyProblem('75', 'Sort Colors', initiallyComplete: true),
      StudyProblem('905', 'Sort Array By Parity', initiallyComplete: true),
      StudyProblem('912', 'Sort an Array', initiallyComplete: true),
    ],
  ),
  StudyTopic(
    title: 'Sliding Window',
    shortTitle: 'Sliding Window',
    icon: Icons.view_week_rounded,
    color: Color(0xFF34A853),
    note:
        'Cue: a longest or shortest valid contiguous window. Expand the right side, then shrink from the left while the condition allows it.',
    problems: [
      StudyProblem(
        '3',
        'Longest Substring Without Repeating Characters',
        initiallyComplete: true,
      ),
      StudyProblem('567', 'Permutation in String', initiallyComplete: true),
      StudyProblem(
        '424',
        'Longest Repeating Character Replacement',
        initiallyComplete: true,
      ),
      StudyProblem('76', 'Minimum Window Substring', initiallyComplete: true),
      StudyProblem(
        '1358',
        'Number of Substrings Containing All Three Characters',
        initiallyComplete: true,
      ),
      StudyProblem(
        '2962',
        'Count Subarrays Where Max Element Appears at Least K Times',
        initiallyComplete: true,
      ),
    ],
  ),
  StudyTopic(
    title: 'Two Pointers',
    shortTitle: 'Two Pointers',
    icon: Icons.compare_arrows_rounded,
    color: Color(0xFFFFD166),
    note:
        'Use two pointers when each comparison lets you safely discard one side of the search space.',
    problems: [
      StudyProblem('125', 'Valid Palindrome', initiallyComplete: true),
      StudyProblem('15', '3Sum', initiallyComplete: true),
      StudyProblem('11', 'Container With Most Water', initiallyComplete: true),
      StudyProblem('42', 'Trapping Rain Water', initiallyComplete: true),
      StudyProblem('287', 'Find the Duplicate Number', initiallyComplete: true),
    ],
  ),
  StudyTopic(
    title: 'Prefix Sum & Subarray',
    shortTitle: 'Prefix Sum',
    icon: Icons.stacked_line_chart_rounded,
    color: Color(0xFF46BDC6),
    note:
        'Cue: an exact subarray sum when values may be negative. Store earlier prefix sums so the needed complement becomes a lookup.',
    problems: [
      StudyProblem(
        '303',
        'Range Sum Query — Immutable',
        initiallyComplete: true,
      ),
      StudyProblem('560', 'Subarray Sum Equals K', initiallyComplete: true),
      StudyProblem('523', 'Continuous Subarray Sum', initiallyComplete: true),
      StudyProblem(
        '238',
        'Product of Array Except Self',
        initiallyComplete: true,
      ),
    ],
  ),
  StudyTopic(
    title: 'Stack & Monotonic Stack',
    shortTitle: 'Stack',
    icon: Icons.layers_rounded,
    color: Color(0xFFFBBC04),
    note:
        'A monotonic stack answers next or previous greater or smaller questions by removing candidates that can no longer win.',
    problems: [
      StudyProblem('20', 'Valid Parentheses', initiallyComplete: true),
      StudyProblem('155', 'Min Stack', initiallyComplete: true),
      StudyProblem('739', 'Daily Temperatures', initiallyComplete: true),
      StudyProblem('503', 'Next Greater Element II', initiallyComplete: true),
      StudyProblem(
        '84',
        'Largest Rectangle in Histogram',
        initiallyComplete: true,
      ),
    ],
  ),
  StudyTopic(
    title: 'Binary Search',
    shortTitle: 'Binary Search',
    icon: Icons.manage_search_rounded,
    color: Color(0xFF669DF6),
    note:
        'Exact search uses a closed range. Boundary search uses a half-open range and keeps the first position that could still satisfy the condition.',
    problems: [
      StudyProblem('704', 'Binary Search', initiallyComplete: true),
      StudyProblem('35', 'Search Insert Position', initiallyComplete: true),
      StudyProblem(
        '34',
        'Find First and Last Position of Element in Sorted Array',
        initiallyComplete: true,
      ),
      StudyProblem(
        '33',
        'Search in Rotated Sorted Array',
        initiallyComplete: true,
      ),
      StudyProblem('153', 'Find Minimum in Rotated Sorted Array'),
      StudyProblem('875', 'Koko Eating Bananas', initiallyComplete: true),
      StudyProblem('981', 'Time Based Key-Value Store'),
      StudyProblem('4', 'Median of Two Sorted Arrays'),
    ],
  ),
  StudyTopic(
    title: 'Intervals',
    shortTitle: 'Intervals',
    icon: Icons.calendar_view_week_rounded,
    color: Color(0xFF81C995),
    note:
        'Sort by end for maximum non-overlap, use a sweep line for simultaneous events, sort by start to merge, and use two pointers for intersections.',
    problems: [
      StudyProblem('435', 'Non-overlapping Intervals'),
      StudyProblem('452', 'Minimum Number of Arrows to Burst Balloons'),
      StudyProblem('253', 'Meeting Rooms II'),
      StudyProblem('1094', 'Car Pooling'),
      StudyProblem('56', 'Merge Intervals'),
      StudyProblem('57', 'Insert Interval'),
      StudyProblem('986', 'Interval List Intersections'),
      StudyProblem('1229', 'Meeting Scheduler'),
    ],
  ),
  StudyTopic(
    title: 'Linked List',
    shortTitle: 'Linked List',
    icon: Icons.account_tree_outlined,
    color: Color(0xFFF28B82),
    note:
        'Draw the links before changing them. Dummy nodes simplify head changes; slow and fast pointers reveal cycles and midpoints.',
    problems: [
      StudyProblem('206', 'Reverse Linked List', initiallyComplete: true),
      StudyProblem('142', 'Linked List Cycle II', initiallyComplete: true),
      StudyProblem('19', 'Remove Nth Node From End', initiallyComplete: true),
      StudyProblem('143', 'Reorder List', initiallyComplete: true),
      StudyProblem('23', 'Merge K Sorted Lists', initiallyComplete: true),
    ],
  ),
  StudyTopic(
    title: 'Trees: DFS & BFS',
    shortTitle: 'Trees',
    icon: Icons.park_outlined,
    color: Color(0xFF78D9EC),
    note:
        'DFS is natural for values returned from children. BFS is natural for levels, minimum depth, and nearest-node questions.',
    problems: [
      StudyProblem(
        '104',
        'Maximum Depth of Binary Tree',
        initiallyComplete: true,
      ),
      StudyProblem(
        '102',
        'Binary Tree Level Order Traversal',
        initiallyComplete: true,
      ),
      StudyProblem(
        '98',
        'Validate Binary Search Tree',
        initiallyComplete: true,
      ),
      StudyProblem(
        '236',
        'Lowest Common Ancestor of a Binary Tree',
        initiallyComplete: true,
      ),
      StudyProblem(
        '124',
        'Binary Tree Maximum Path Sum',
        initiallyComplete: true,
      ),
      StudyProblem('543', 'Diameter of Binary Tree', initiallyComplete: true),
    ],
  ),
  StudyTopic(
    title: 'Topological Sort',
    shortTitle: 'Topological Sort',
    icon: Icons.route_rounded,
    color: Color(0xFFB39DDB),
    note:
        'Kahn’s algorithm starts with zero-indegree nodes. If fewer than n nodes are processed, a cycle is preventing progress.',
    problems: [
      StudyProblem('207', 'Course Schedule', initiallyComplete: true),
      StudyProblem(
        '1857',
        'Largest Color Value in a Directed Graph',
        initiallyComplete: true,
      ),
    ],
  ),
  StudyTopic(
    title: 'Flood Fill & Grid DFS',
    shortTitle: 'Grid DFS',
    icon: Icons.grid_view_rounded,
    color: Color(0xFF57BB8A),
    note:
        'Treat every cell as a graph node. Mark a cell when it is discovered so each component is visited once.',
    problems: [
      StudyProblem('200', 'Number of Islands', initiallyComplete: true),
      StudyProblem('695', 'Max Area of Island', initiallyComplete: true),
      StudyProblem('130', 'Surrounded Regions', initiallyComplete: true),
      StudyProblem('1254', 'Number of Closed Islands', initiallyComplete: true),
      StudyProblem(
        '417',
        'Pacific Atlantic Water Flow',
        initiallyComplete: true,
      ),
    ],
  ),
  StudyTopic(
    title: 'Backtracking',
    shortTitle: 'Backtracking',
    icon: Icons.fork_right_rounded,
    color: Color(0xFFFF8A65),
    note:
        'Choose, recurse, then undo. Define the decision at one tree level and prevent duplicate paths at that same level.',
    problems: [
      StudyProblem('46', 'Permutations', initiallyComplete: true),
      StudyProblem('78', 'Subsets', initiallyComplete: true),
      StudyProblem('39', 'Combination Sum', initiallyComplete: true),
      StudyProblem('79', 'Word Search', initiallyComplete: true),
      StudyProblem('131', 'Palindrome Partitioning', initiallyComplete: true),
    ],
  ),
  StudyTopic(
    title: 'BFS & Shortest Path',
    shortTitle: 'BFS',
    icon: Icons.hub_outlined,
    color: Color(0xFF5BB9D4),
    note:
        'BFS explores an unweighted graph layer by layer, so the first arrival is the shortest path. Put all equivalent starting points in the initial queue.',
    problems: [
      StudyProblem(
        '1091',
        'Shortest Path in Binary Matrix',
        initiallyComplete: true,
      ),
      StudyProblem('542', '01 Matrix', initiallyComplete: true),
      StudyProblem('433', 'Minimum Genetic Mutation', initiallyComplete: true),
      StudyProblem('909', 'Snakes and Ladders', initiallyComplete: true),
      StudyProblem(
        '1293',
        'Shortest Path in a Grid with Obstacles Elimination',
        initiallyComplete: true,
      ),
      StudyProblem('847', 'Shortest Path Visiting All Nodes'),
    ],
  ),
  StudyTopic(
    title: 'Dijkstra & Weighted Graphs',
    shortTitle: 'Dijkstra',
    icon: Icons.alt_route_rounded,
    color: Color(0xFF7BAAF7),
    note:
        'Keep the best known cumulative cost and use a min-heap for the next state. Relax an edge only when it improves that cost.',
    problems: [
      StudyProblem(
        '1514',
        'Path with Maximum Probability',
        initiallyComplete: true,
      ),
      StudyProblem('1631', 'Path With Minimum Effort', initiallyComplete: true),
      StudyProblem(
        '787',
        'Cheapest Flights Within K Stops',
        initiallyComplete: true,
      ),
      StudyProblem(
        '3341',
        'Find Minimum Time to Reach Last Room I',
        initiallyComplete: true,
      ),
    ],
  ),
  StudyTopic(
    title: 'Union Find & MST',
    shortTitle: 'Union Find',
    icon: Icons.join_inner_rounded,
    color: Color(0xFF66C2A5),
    note:
        'Each set points to a representative root. Path compression speeds up find; Kruskal sorts edges and unions until n − 1 edges connect the graph.',
    problems: [
      StudyProblem('547', 'Number of Provinces', initiallyComplete: true),
      StudyProblem(
        '990',
        'Satisfiability of Equality Equations',
        initiallyComplete: true,
      ),
      StudyProblem(
        '1584',
        'Min Cost to Connect All Points',
        initiallyComplete: true,
      ),
    ],
  ),
  StudyTopic(
    title: 'Greedy',
    shortTitle: 'Greedy',
    icon: Icons.trending_up_rounded,
    color: Color(0xFFFFC857),
    note:
        'Make the locally safe choice and state why it cannot hurt a future decision. The proof matters as much as the implementation.',
    problems: [
      StudyProblem('53', 'Maximum Subarray', initiallyComplete: true),
      StudyProblem('55', 'Jump Game', initiallyComplete: true),
      StudyProblem('45', 'Jump Game II', initiallyComplete: true),
      StudyProblem('134', 'Gas Station', initiallyComplete: true),
    ],
  ),
  StudyTopic(
    title: 'Trie',
    shortTitle: 'Trie',
    icon: Icons.schema_rounded,
    color: Color(0xFFCE93D8),
    note:
        'Walk one character per level. Store terminal markers separately from children so prefixes and complete words remain distinct.',
    problems: [
      StudyProblem('208', 'Implement Trie', initiallyComplete: true),
      StudyProblem('211', 'Design Add and Search Words'),
    ],
  ),
  StudyTopic(
    title: 'Design & Data Structures',
    shortTitle: 'Design',
    icon: Icons.developer_board_rounded,
    color: Color(0xFFA7C7FA),
    note:
        'Start with the operations and their target complexity, then combine structures so each operation has exactly the information it needs.',
    problems: [
      StudyProblem('146', 'LRU Cache', initiallyComplete: true),
      StudyProblem(
        '380',
        'Insert Delete GetRandom O(1)',
        initiallyComplete: true,
      ),
    ],
  ),
];

Set<String> get initialCompletedProblems => {
  for (final topic in studyTopics)
    for (final problem in topic.problems)
      if (problem.initiallyComplete) problem.storageKey,
};

List<StudyProblem> get uniqueProblems {
  final byId = <String, StudyProblem>{};
  for (final topic in studyTopics) {
    for (final problem in topic.problems) {
      byId.putIfAbsent(problem.storageKey, () => problem);
    }
  }
  return byId.values.toList();
}
