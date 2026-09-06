import 'package:flutter/material.dart';

class StudyProblem {
  const StudyProblem(
    this.id,
    this.title, {
    this.initiallyComplete = false,
    this.difficulty,
    this.slug,
    this.subcategory,
  });

  final String id;
  final String title;
  final bool initiallyComplete;
  final String? difficulty;
  final String? slug;
  final String? subcategory;

  String get storageKey => id;

  String get leetCodeSlug =>
      slug ??
      title
          .toLowerCase()
          .replaceAll(RegExp(r'[^a-z0-9]+'), '-')
          .replaceAll(RegExp(r'^-+|-+$'), '');

  String get leetCodeUrl => 'https://leetcode.com/problems/$leetCodeSlug/';
}

class StudyTopic {
  const StudyTopic({
    required this.group,
    required this.title,
    required this.shortTitle,
    required this.icon,
    required this.color,
    required this.note,
    required this.problems,
  });

  final String group;
  final String title;
  final String shortTitle;
  final IconData icon;
  final Color color;
  final String note;
  final List<StudyProblem> problems;
}

const coreStudyTopics = <StudyTopic>[
  StudyTopic(
    group: 'Arrays & Hashing',
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
    group: 'Arrays & Hashing',
    title: 'Sorting',
    shortTitle: 'Sorting',
    icon: Icons.sort_rounded,
    color: Color(0xFF8AB4F8),
    note:
        'For two or three groups, maintain regions with pointers. For general sorting, split, solve each half, and merge in linear time.',
    problems: [
      StudyProblem(
        '905',
        'Sort Array By Parity',
        initiallyComplete: true,
        subcategory: 'Two-group partitioning',
      ),
      StudyProblem(
        '75',
        'Sort Colors',
        initiallyComplete: true,
        subcategory: 'Three-group partitioning',
      ),
      StudyProblem(
        '912',
        'Sort an Array',
        initiallyComplete: true,
        subcategory: 'Merge sort',
      ),
    ],
  ),
  StudyTopic(
    group: 'Scanning Patterns',
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
    group: 'Scanning Patterns',
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
    group: 'Arrays & Hashing',
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
    group: 'Scanning Patterns',
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
    group: 'Search & Optimization',
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
    group: 'Scanning Patterns',
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
    group: 'Core Data Structures',
    title: 'Linked List',
    shortTitle: 'Linked List',
    icon: Icons.account_tree_outlined,
    color: Color(0xFFF28B82),
    note:
        'Draw the links before changing them. Dummy nodes simplify head changes; slow and fast pointers reveal cycles and midpoints.',
    problems: [
      StudyProblem('206', 'Reverse Linked List', initiallyComplete: true),
      StudyProblem('142', 'Linked List Cycle II', initiallyComplete: true),
      StudyProblem(
        '19',
        'Remove Nth Node From End of List',
        initiallyComplete: true,
      ),
      StudyProblem('143', 'Reorder List', initiallyComplete: true),
      StudyProblem('23', 'Merge K Sorted Lists', initiallyComplete: true),
    ],
  ),
  StudyTopic(
    group: 'DFS & Recursion',
    title: 'DFS',
    shortTitle: 'DFS',
    icon: Icons.park_outlined,
    color: Color(0xFF78D9EC),
    note:
        'Use tree DFS to combine values returned by children, backtracking to explore decisions, and grid DFS to traverse connected regions.',
    problems: [
      StudyProblem(
        '104',
        'Maximum Depth of Binary Tree',
        initiallyComplete: true,
        subcategory: 'Tree DFS',
      ),
      StudyProblem(
        '98',
        'Validate Binary Search Tree',
        initiallyComplete: true,
        subcategory: 'Tree DFS',
      ),
      StudyProblem(
        '236',
        'Lowest Common Ancestor of a Binary Tree',
        initiallyComplete: true,
        subcategory: 'Tree DFS',
      ),
      StudyProblem(
        '124',
        'Binary Tree Maximum Path Sum',
        initiallyComplete: true,
        subcategory: 'Tree DFS',
      ),
      StudyProblem(
        '543',
        'Diameter of Binary Tree',
        initiallyComplete: true,
        subcategory: 'Tree DFS',
      ),
      StudyProblem(
        '46',
        'Permutations',
        initiallyComplete: true,
        subcategory: 'Backtracking',
      ),
      StudyProblem(
        '78',
        'Subsets',
        initiallyComplete: true,
        subcategory: 'Backtracking',
      ),
      StudyProblem(
        '39',
        'Combination Sum',
        initiallyComplete: true,
        subcategory: 'Backtracking',
      ),
      StudyProblem(
        '79',
        'Word Search',
        initiallyComplete: true,
        subcategory: 'Backtracking',
      ),
      StudyProblem(
        '131',
        'Palindrome Partitioning',
        initiallyComplete: true,
        subcategory: 'Backtracking',
      ),
      StudyProblem(
        '200',
        'Number of Islands',
        initiallyComplete: true,
        subcategory: 'Flood fill / Grid DFS',
      ),
      StudyProblem(
        '695',
        'Max Area of Island',
        initiallyComplete: true,
        subcategory: 'Flood fill / Grid DFS',
      ),
      StudyProblem(
        '130',
        'Surrounded Regions',
        initiallyComplete: true,
        subcategory: 'Flood fill / Grid DFS',
      ),
      StudyProblem(
        '1254',
        'Number of Closed Islands',
        initiallyComplete: true,
        subcategory: 'Flood fill / Grid DFS',
      ),
      StudyProblem(
        '417',
        'Pacific Atlantic Water Flow',
        initiallyComplete: true,
        subcategory: 'Flood fill / Grid DFS',
      ),
    ],
  ),
  StudyTopic(
    group: 'Graph Algorithms',
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
    group: 'Graph Algorithms',
    title: 'BFS',
    shortTitle: 'BFS',
    icon: Icons.hub_outlined,
    color: Color(0xFF5BB9D4),
    note:
        'BFS explores an unweighted graph layer by layer, so the first arrival is the shortest path. Put all equivalent starting points in the initial queue.',
    problems: [
      StudyProblem(
        '102',
        'Binary Tree Level Order Traversal',
        initiallyComplete: true,
        subcategory: 'Tree BFS',
      ),
      StudyProblem(
        '1091',
        'Shortest Path in Binary Matrix',
        initiallyComplete: true,
        subcategory: 'Shortest path',
      ),
      StudyProblem(
        '542',
        '01 Matrix',
        initiallyComplete: true,
        subcategory: 'Shortest path',
      ),
      StudyProblem(
        '433',
        'Minimum Genetic Mutation',
        initiallyComplete: true,
        subcategory: 'Shortest path',
      ),
      StudyProblem(
        '909',
        'Snakes and Ladders',
        initiallyComplete: true,
        subcategory: 'Shortest path',
      ),
      StudyProblem(
        '1293',
        'Shortest Path in a Grid with Obstacles Elimination',
        initiallyComplete: true,
        subcategory: 'Shortest path',
      ),
      StudyProblem(
        '847',
        'Shortest Path Visiting All Nodes',
        subcategory: 'Shortest path',
      ),
    ],
  ),
  StudyTopic(
    group: 'Graph Algorithms',
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
    group: 'Graph Algorithms',
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
    group: 'Search & Optimization',
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
    group: 'Core Data Structures',
    title: 'Trie',
    shortTitle: 'Trie',
    icon: Icons.schema_rounded,
    color: Color(0xFFCE93D8),
    note:
        'Walk one character per level. Store terminal markers separately from children so prefixes and complete words remain distinct.',
    problems: [
      StudyProblem(
        '208',
        'Implement Trie (Prefix Tree)',
        initiallyComplete: true,
      ),
      StudyProblem('211', 'Design Add and Search Words Data Structure'),
    ],
  ),
  StudyTopic(
    group: 'Core Data Structures',
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
        slug: 'insert-delete-getrandom-o1',
      ),
    ],
  ),
];

const challengeTopics = <StudyTopic>[
  StudyTopic(
    group: 'Challenge Rounds',
    title: 'Mixed LeetCode Challenge Set — Round 4',
    shortTitle: 'Round 4',
    icon: Icons.flag_rounded,
    color: Color(0xFFFF8A65),
    note:
        'A compact mixed round spanning search, graphs, trees, stacks, tries, and array techniques.',
    problems: [
      StudyProblem(
        '1102',
        'Path With Maximum Minimum Value',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '151',
        'Reverse Words in a String',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '378',
        'Kth Smallest Element in a Sorted Matrix',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '103',
        'Binary Tree Zigzag Level Order Traversal',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '678',
        'Valid Parenthesis String',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '646',
        'Maximum Length of Pair Chain',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '48',
        'Rotate Image',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1857',
        'Largest Color Value in a Directed Graph',
        initiallyComplete: true,
        difficulty: 'Hard',
      ),
      StudyProblem(
        '75',
        'Sort Colors',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '297',
        'Serialize and Deserialize Binary Tree',
        initiallyComplete: true,
        difficulty: 'Hard',
      ),
      StudyProblem(
        '1019',
        'Next Greater Node In Linked List',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '410',
        'Split Array Largest Sum',
        initiallyComplete: true,
        difficulty: 'Hard',
      ),
      StudyProblem(
        '1358',
        'Number of Substrings Containing All Three Characters',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '912',
        'Sort an Array',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '677',
        'Map Sum Pairs',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '287',
        'Find the Duplicate Number',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '815',
        'Bus Routes',
        initiallyComplete: true,
        difficulty: 'Hard',
      ),
      StudyProblem(
        '73',
        'Set Matrix Zeroes',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1101',
        'The Earliest Moment When Everyone Become Friends',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '235',
        'Lowest Common Ancestor of a Binary Search Tree',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
    ],
  ),
  StudyTopic(
    group: 'Challenge Rounds',
    title: 'Mixed LeetCode Challenge Set — Round 3',
    shortTitle: 'Round 3',
    icon: Icons.flag_rounded,
    color: Color(0xFFCE93D8),
    note:
        'A broad mixed round with extra interval scheduling, traversal, graph, and design practice.',
    problems: [
      StudyProblem(
        '1642',
        'Furthest Building You Can Reach',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '886',
        'Possible Bipartition',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '394',
        'Decode String',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1482',
        'Minimum Number of Days to Make m Bouquets',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '77',
        'Combinations',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1448',
        'Count Good Nodes in Binary Tree',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '904',
        'Fruit Into Baskets',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '947',
        'Most Stones Removed with Same Row or Column',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '24',
        'Swap Nodes in Pairs',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1976',
        'Number of Ways to Arrive at Destination',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1334',
        'Find the City With the Smallest Number of Neighbors at a Threshold Distance',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '2662',
        'Minimum Cost of a Path With Special Roads',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1368',
        'Minimum Cost to Make at Least One Valid Path in a Grid',
        initiallyComplete: true,
        difficulty: 'Hard',
      ),
      StudyProblem(
        '3112',
        'Minimum Time to Visit Disappearing Nodes',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1024',
        'Video Stitching',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '648',
        'Replace Words',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1268',
        'Search Suggestions System',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '721',
        'Accounts Merge',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1061',
        'Lexicographically Smallest Equivalent String',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1584',
        'Min Cost to Connect All Points',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1168',
        'Optimize Water Distribution in a Village',
        initiallyComplete: true,
        difficulty: 'Hard',
      ),
      StudyProblem(
        '2958',
        'Length of Longest Subarray With at Most K Frequency',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '921',
        'Minimum Add to Make Parentheses Valid',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '122',
        'Best Time to Buy and Sell Stock II',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '735',
        'Asteroid Collision',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '2462',
        'Total Cost to Hire K Workers',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1110',
        'Delete Nodes And Return Forest',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '162',
        'Find Peak Element',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '40',
        'Combination Sum II',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '90',
        'Subsets II',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '328',
        'Odd Even Linked List',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '863',
        'All Nodes Distance K in Binary Tree',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1396',
        'Design Underground System',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '763',
        'Partition Labels',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '2812',
        'Find the Safest Path in a Grid',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1146',
        'Snapshot Array',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '211',
        'Design Add and Search Words Data Structure',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
    ],
  ),
  StudyTopic(
    group: 'Challenge Rounds',
    title: 'Mixed LeetCode Challenge Set — Round 2',
    shortTitle: 'Round 2',
    icon: Icons.flag_rounded,
    color: Color(0xFF46BDC6),
    note:
        'A mixed review of matrices, graphs, heaps, intervals, linked lists, and scanning patterns.',
    problems: [
      StudyProblem(
        '2658',
        'Maximum Number of Fish in a Grid',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '199',
        'Binary Tree Right Side View',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '74',
        'Search a 2D Matrix',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '399',
        'Evaluate Division',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '767',
        'Reorganize String',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '930',
        'Binary Subarrays With Sum',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '881',
        'Boats to Save People',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1011',
        'Capacity To Ship Packages Within D Days',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '2',
        'Add Two Numbers',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '85',
        'Maximal Rectangle',
        initiallyComplete: true,
        difficulty: 'Hard',
      ),
      StudyProblem(
        '851',
        'Loud and Rich',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '729',
        'My Calendar I',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1162',
        'As Far from Land as Possible',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '138',
        'Copy List with Random Pointer',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '2050',
        'Parallel Courses III',
        initiallyComplete: true,
        difficulty: 'Hard',
      ),
      StudyProblem(
        '454',
        '4Sum II',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '436',
        'Find Right Interval',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1004',
        'Max Consecutive Ones III',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '437',
        'Path Sum III',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '373',
        'Find K Pairs with Smallest Sums',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '167',
        'Two Sum II — Input Array Is Sorted',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1926',
        'Nearest Exit from Entrance in Maze',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '907',
        'Sum of Subarray Minimums',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1129',
        'Shortest Path with Alternating Colors',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '36',
        'Valid Sudoku',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '713',
        'Subarray Product Less Than K',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '304',
        'Range Sum Query 2D — Immutable',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
    ],
  ),
  StudyTopic(
    group: 'Challenge Rounds',
    title: 'Mixed LeetCode Challenge Set — Round 1',
    shortTitle: 'Round 1',
    icon: Icons.flag_rounded,
    color: Color(0xFF81C995),
    note:
        'The original mixed round, covering core array, graph, tree, heap, stack, and interval patterns.',
    problems: [
      StudyProblem(
        '128',
        'Longest Consecutive Sequence',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '973',
        'K Closest Points to Origin',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '934',
        'Shortest Bridge',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '153',
        'Find Minimum in Rotated Sorted Array',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '525',
        'Contiguous Array',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '16',
        '3Sum Closest',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '230',
        'Kth Smallest Element in a BST',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '209',
        'Minimum Size Subarray Sum',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '92',
        'Reverse Linked List II',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1034',
        'Coloring A Border',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '310',
        'Minimum Height Trees',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '692',
        'Top K Frequent Words',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '22',
        'Generate Parentheses',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '974',
        'Subarray Sums Divisible by K',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '981',
        'Time Based Key-Value Store',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '402',
        'Remove K Digits',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '864',
        'Shortest Path to Get All Keys',
        initiallyComplete: true,
        difficulty: 'Hard',
      ),
      StudyProblem(
        '1094',
        'Car Pooling',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1219',
        'Path with Maximum Gold',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '452',
        'Minimum Number of Arrows to Burst Balloons',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '105',
        'Construct Binary Tree from Preorder and Inorder Traversal',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '992',
        'Subarrays with K Different Integers',
        difficulty: 'Hard',
      ),
      StudyProblem('18', '4Sum', initiallyComplete: true, difficulty: 'Medium'),
      StudyProblem(
        '827',
        'Making A Large Island',
        initiallyComplete: true,
        difficulty: 'Hard',
      ),
      StudyProblem(
        '2192',
        'All Ancestors of a Node in a Directed Acyclic Graph',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '25',
        'Reverse Nodes in k-Group',
        initiallyComplete: true,
        difficulty: 'Hard',
      ),
      StudyProblem(
        '901',
        'Online Stock Span',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
      StudyProblem(
        '1834',
        'Single-Threaded CPU',
        initiallyComplete: true,
        difficulty: 'Medium',
      ),
    ],
  ),
];

const studyTopics = <StudyTopic>[...coreStudyTopics, ...challengeTopics];

Set<String> get coreProblemIds => {
  for (final topic in coreStudyTopics)
    for (final problem in topic.problems) problem.storageKey,
};

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
