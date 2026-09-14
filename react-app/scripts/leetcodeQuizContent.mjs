// New content (not ported from Dart): mock-interview Q&A for the LeetCode guide's premium quiz
// feature, keyed by topic slug. Only the 16 core pattern topics get a quiz - the four "Mixed
// Challenge Set" rounds are grab-bags, not a single interview pattern, so they're skipped.
// Flagged in the plan for the user's own review/editing pass before treating this as final.
export const LEETCODE_QUIZZES = {
  "hashmap-frequency-and-top-k": [
    {
      question: "Walk me through your approach to Two Sum — start with the brute force, then optimize.",
      answer:
        "Brute force checks every pair, O(n²) time and O(1) space. To optimize, walk the array once and keep a hash map from value to index. For each element x, check whether target - x is already in the map before inserting x — this gives one pass, O(n) time and O(n) space, and correctly handles duplicates because you check before inserting the current element.",
    },
    {
      question:
        "You need the k most frequent elements in a stream that's too large to sort fully. What's the pattern and why not just sort?",
      answer:
        "Sorting the whole frequency list is O(n log n) when you only need the top k. Instead, count frequencies with a hash map, then use a min-heap of size k: push elements and pop the smallest whenever the heap exceeds k. That's O(n log k), which is much better when k is small relative to n.",
    },
    {
      question:
        "Two Sum uses a hash map for O(1) lookups. What's the trade-off versus sorting the array and using two pointers?",
      answer:
        "Sorting + two pointers is O(n log n) time but O(1) extra space (or O(n) if you must preserve original indices, since sorting loses them). The hash map approach is O(n) time but O(n) space. If you need the original indices and space isn't constrained, the hash map wins on time; if memory is tight and you don't need indices, sorting is a reasonable trade.",
    },
  ],
  sorting: [
    {
      question:
        "How do you decide between two-pointer partitioning and a full merge sort for a 'sort this array' question?",
      answer:
        "If the values fall into a small, known number of categories (e.g. two or three distinct groups like 0/1 or red/white/blue), a single-pass partitioning scheme with pointers gets O(n) time and O(1) space — that's the Dutch National Flag pattern. If the values are arbitrary and you need a general-purpose sort, you fall back to divide-and-conquer: split, recursively sort each half, and merge in linear time for O(n log n).",
    },
    {
      question: "Walk through the invariant that makes the Dutch National Flag (Sort Colors) partitioning correct.",
      answer:
        "Maintain three pointers: low, mid, high. Everything before low is 0s, between low and mid is 1s, and after high is 2s; mid is the current element being examined. If arr[mid] is 0, swap with low and advance both low and mid. If it's 1, just advance mid. If it's 2, swap with high and decrement high without advancing mid, since the swapped-in value still needs examining. The loop ends when mid passes high.",
    },
    {
      question: "Merge sort is O(n log n) — where does the log n come from, and why is the merge step linear?",
      answer:
        "The log n factor comes from recursively halving the array until subarrays have one element, which takes log n levels. At each level, merging all the subarrays back together touches every element once, so each level costs O(n), and log n levels gives O(n log n) total. The merge step itself is linear because you only ever advance through each of the two sorted halves once, comparing fronts and taking the smaller.",
    },
  ],
  "sliding-window": [
    {
      question:
        "What tells you a problem is a sliding window problem rather than, say, a two-pointer or prefix-sum problem?",
      answer:
        "The signal is usually 'longest' or 'shortest' contiguous subarray or substring satisfying some condition. If shrinking or growing a window from one side lets you incrementally maintain the condition — like a running count or a set of seen characters — that's sliding window. If you instead need a fixed relationship between two indices computed independently, that's more likely two pointers or prefix sum.",
    },
    {
      question:
        "In 'Minimum Window Substring', why do you expand the right pointer and shrink the left pointer, and what invariant do you maintain?",
      answer:
        "You expand the window by moving right until it contains all required characters, then shrink from the left as far as possible while it still satisfies that condition, recording the minimum length window seen. The invariant is a count map of required characters remaining to satisfy; expanding decreases the count, shrinking only proceeds while the count is fully satisfied.",
    },
    {
      question:
        "How would you adapt a sliding window solution if the array can contain negative numbers, breaking the usual monotonic sum assumption?",
      answer:
        "Classic sliding window relies on the window's sum or count changing monotonically as you expand or shrink — negative numbers break that, since growing the window can decrease the sum. In that case, you typically switch to prefix sums combined with a hash map (to find complementary sums) or a different structure like a monotonic deque, rather than a simple two-pointer window.",
    },
  ],
  "two-pointers": [
    {
      question:
        "For 'Container With Most Water', why do you move the pointer at the shorter line inward rather than the taller one?",
      answer:
        "The area is limited by the shorter of the two lines. If you move the pointer at the taller line inward, the width shrinks but the limiting height can only stay the same or get worse, so the area can't improve. Moving the shorter line's pointer is the only move that has a chance of finding a taller line and increasing the area, so it's the only move worth making.",
    },
    {
      question: "When do two pointers require the array to be sorted first, and when do they not?",
      answer:
        "Two pointers need sorting when you're exploiting order to decide which side to move — for example, in Two Sum on a sorted array, comparing the sum to the target tells you whether to move the left or right pointer inward. When pointers are just tracking positions for something like fast/slow cycle detection or in-place partitioning, order isn't required at all.",
    },
    {
      question:
        "What's the time complexity trade-off of two pointers on a sorted array versus a hash-map approach for pair-sum problems?",
      answer:
        "Two pointers on a pre-sorted array is O(n log n) if you have to sort first, then O(n) to scan, so O(n log n) overall, with O(1) extra space. The hash-map approach is O(n) time but O(n) space. If the array is already sorted, two pointers is strictly better; if it isn't and you can't destroy the original order, the hash map avoids the sort cost.",
    },
  ],
  "prefix-sum-and-subarray": [
    {
      question: "Why does a prefix sum turn 'count subarrays with sum k' into a hash map lookup problem?",
      answer:
        "If prefix[i] is the sum of the first i elements, the sum of any subarray (i, j] equals prefix[j] - prefix[i]. So you're looking for pairs of prefix sums that differ by exactly k. As you scan and compute each prefix sum, you check how many times prefix[j] - k has already occurred, using a hash map of prefix-sum frequencies seen so far, which turns an O(n²) brute force into O(n).",
    },
    {
      question: "What edge case do people forget when initializing the prefix-sum frequency map?",
      answer:
        "You have to seed the map with prefix sum 0 occurring once before you start scanning, to account for subarrays that start from index 0 and already equal the target sum exactly. Forgetting that undercounts any subarray beginning at the very start of the array.",
    },
    {
      question: "How does prefix sum extend to 2D range-sum queries, and why is it worth it?",
      answer:
        "You precompute a 2D prefix sum where each cell holds the sum of the rectangle from the origin to that cell, built in O(rows × cols). Then any rectangular sub-rectangle sum can be computed in O(1) using inclusion-exclusion on four corner values, instead of resumming the rectangle every query. It's worth it whenever you have many range queries on a static grid.",
    },
  ],
  "stack-and-monotonic-stack": [
    {
      question: "What invariant does a monotonic stack maintain, and what problem shape does that solve?",
      answer:
        "A monotonic stack keeps its elements in strictly increasing or decreasing order by popping elements that violate that order as you push a new one. That's exactly the right tool for 'next greater/smaller element' style problems, because popping an element means you've just found its next greater (or smaller) neighbor — the current element you're pushing.",
    },
    {
      question: "Walk through how a monotonic decreasing stack finds the next greater element for every array position.",
      answer:
        "Scan left to right, and for each new value, pop everything on the stack smaller than it — each pop's next-greater answer is the current value, since it's the first larger element to its right. After popping, push the current value's index. Anything still on the stack at the end has no next greater element.",
    },
    {
      question: "How is 'Largest Rectangle in Histogram' related to monotonic stacks?",
      answer:
        "You keep a stack of indices with increasing bar heights. When you hit a bar shorter than the stack's top, that top bar can't extend any further right, so you pop it and compute the rectangle using its height and a width spanning from the new stack top to the current index. This finds, for every bar, the maximal rectangle where it's the shortest bar, in O(n) total.",
    },
  ],
  "binary-search": [
    {
      question:
        "Binary search assumes a sorted array — how do you recognize a problem where it applies even though nothing looks explicitly sorted?",
      answer:
        "The real requirement isn't a sorted array, it's a monotonic predicate — a yes/no answer that flips exactly once as you move along a range. If you can define 'is this candidate answer feasible' and that feasibility is monotonic in the candidate value, you can binary search on the answer itself, like minimizing the maximum load or finding a minimum capacity.",
    },
    {
      question: "What's the classic off-by-one bug in binary search, and how do you avoid it?",
      answer:
        "The usual bug is an infinite loop or missed element from inconsistent boundary updates — for example using mid = (lo+hi)/2 with hi = mid instead of hi = mid - 1 when you've already ruled out mid. The fix is to be explicit about whether your range is inclusive or half-open and keep the invariant consistent every iteration; a safe default is lo <= hi with hi = mid - 1 and lo = mid + 1 for a closed range.",
    },
    {
      question: "How does binary search adapt for a rotated sorted array, like 'Search in Rotated Sorted Array'?",
      answer:
        "At each step, at least one half of the array (from lo to mid, or mid to hi) is still properly sorted. Check which half is sorted by comparing arr[lo] to arr[mid], then check whether the target falls within that sorted half's range — if so recurse there, otherwise recurse into the other half. This keeps it O(log n) despite the rotation.",
    },
  ],
  intervals: [
    {
      question: "What's the first step in nearly every interval-merging problem, and why does it matter so much?",
      answer:
        "Sort the intervals by start time. Once sorted, you only ever need to compare each interval to the last one you've kept, because any overlap must happen with the most recently added interval — you never have to look back further than that. Skipping the sort turns an O(n log n) problem into something that needs much more bookkeeping.",
    },
    {
      question: "How do you decide if two intervals overlap, and how do you merge them?",
      answer:
        "Two intervals [a,b] and [c,d], sorted so a <= c, overlap when c <= b. If they overlap, merge them into [a, max(b,d)]; if not, the first interval is finalized and you move on to comparing the next pair.",
    },
    {
      question:
        "For 'Meeting Rooms II' — minimum number of rooms needed — why do you need both start and end events, not just merging?",
      answer:
        "You're not merging overlapping meetings, you're counting the maximum number that are simultaneously in progress. Separate and sort all start times and end times independently; sweep through them in order, incrementing a room counter on a start and decrementing on an end when it happens before or at the next start. The maximum value the counter reaches is the answer. A min-heap of end times is an equivalent way to track this.",
    },
  ],
  "linked-list": [
    {
      question:
        "How do you detect a cycle in a linked list without extra memory, and how do you then find where it begins?",
      answer:
        "Floyd's cycle detection: a slow pointer moves one step, a fast pointer moves two; if there's a cycle they'll eventually meet inside it. To find the cycle's start, reset one pointer to the head and advance both one step at a time from there — they meet exactly at the cycle's entry point, because of the distance relationship between the head, the cycle start, and the meeting point.",
    },
    {
      question: "Walk through reversing a singly linked list iteratively.",
      answer:
        "Keep three pointers: prev starting at null, curr starting at head, and a temporary next. At each step, save next = curr.next, point curr.next back to prev, then advance prev = curr and curr = next. When curr is null, prev is the new head. It's O(n) time, O(1) space.",
    },
    {
      question: "How is 'Copy List with Random Pointer' harder than a normal deep copy, and what's the O(1)-space trick?",
      answer:
        "The random pointer can point anywhere in the list, including forward, so you can't build the copy in one pass with a simple hash map unless you accept O(n) extra space. The O(1)-space trick interleaves each cloned node right after its original (A→A'→B→B'→...), which lets you set each clone's random pointer as original.random.next, then unweave the interleaved list back into two separate lists.",
    },
  ],
  dfs: [
    {
      question: "When would you reach for DFS over BFS on a tree or graph problem?",
      answer:
        "DFS is the natural fit when you need to explore full paths before backtracking — counting paths, exploring all combinations, or when you need to process a subtree's results before its parent, like computing heights or validating a BST. BFS is better when you specifically need shortest-path-in-unweighted-graph or level-by-level structure.",
    },
    {
      question:
        "How do you handle a grid flood-fill / island-counting DFS without risking a stack overflow on very large grids?",
      answer:
        "Recursive DFS is clean but can blow the call stack on very large connected regions since many runtimes have shallow default recursion limits. An explicit stack (iterative DFS) avoids that risk while preserving the same visited-set logic — push neighbors instead of recursing, and pop until the stack is empty.",
    },
    {
      question:
        "For backtracking problems like generating permutations or subsets, what makes the difference between DFS and plain recursion explicit?",
      answer:
        "It's the same idea, but backtracking explicitly undoes a choice after exploring it — add a candidate to the current path, recurse, then remove it before trying the next candidate. That mutate-recurse-undo pattern is what lets you reuse one array/path structure across the whole search instead of allocating a new one at every level.",
    },
  ],
  bfs: [
    {
      question: "Why is BFS the right tool for shortest path in an unweighted graph, but not in a weighted one?",
      answer:
        "BFS explores nodes in increasing order of distance from the source because it processes the graph level by level using a queue — the first time you reach a node is guaranteed to be via a shortest path, but only when every edge has the same 'cost' of 1. With weighted edges, a longer path in terms of edge count can have a smaller total weight, so you need something like Dijkstra's that accounts for edge weight.",
    },
    {
      question: "Walk through multi-source BFS and give an example of when it's needed.",
      answer:
        "Instead of starting the queue with a single node, you seed it with every source node at distance 0 simultaneously, then run standard BFS. This correctly computes, for every cell, the shortest distance to the nearest of multiple sources at once — for example, 'Rotting Oranges,' where every already-rotten orange is a simultaneous source.",
    },
    {
      question: "How do you detect a cycle in a directed graph using BFS, and how does that relate to topological sort?",
      answer:
        "Kahn's algorithm: compute in-degrees for every node, start a BFS queue with all zero-in-degree nodes, and each time you process a node, decrement its neighbors' in-degrees, enqueuing any that hit zero. If you process fewer nodes than exist in the graph by the time the queue empties, there's a cycle, because some nodes never reached in-degree zero. If you process all nodes, the order you dequeued them in is a valid topological sort.",
    },
  ],
  "dijkstra-and-weighted-graphs": [
    {
      question: "Why does Dijkstra's algorithm fail on graphs with negative edge weights?",
      answer:
        "Dijkstra greedily finalizes the shortest distance to a node as soon as it's popped from the priority queue, assuming no future relaxation could improve it — that assumption only holds if all remaining edge weights are non-negative. A negative edge could later reduce the distance to an already-finalized node, which Dijkstra would miss. Bellman-Ford handles negative weights by relaxing every edge repeatedly instead of greedily finalizing.",
    },
    {
      question: "What data structure makes Dijkstra's algorithm efficient, and what's the resulting complexity?",
      answer:
        "A min-heap (priority queue) keyed on current best-known distance, so you always expand the closest unvisited node next. With a binary heap, that gives O((V + E) log V) time — each edge can trigger a heap insertion, and each is O(log V).",
    },
    {
      question: "How would you adapt Dijkstra to also reconstruct the actual shortest path, not just its length?",
      answer:
        "Keep a parent/predecessor array alongside the distance array; whenever you relax an edge and improve a node's distance, record the node you relaxed it from. Once the algorithm finishes, walk backward from the destination through the parent pointers to reconstruct the path, then reverse it.",
    },
  ],
  "union-find-and-mst": [
    {
      question: "What do path compression and union by rank/size each contribute to Union-Find's efficiency?",
      answer:
        "Path compression flattens the tree during find operations by pointing nodes directly to the root, so future lookups are faster. Union by rank/size attaches the smaller tree under the bigger one's root during union, preventing the tree from growing tall in the first place. Together they give near-constant amortized time per operation — technically O(α(n)), the inverse Ackermann function.",
    },
    {
      question: "Why is Union-Find the natural structure for 'number of connected components' or 'redundant connection' problems?",
      answer:
        "Those problems are fundamentally asking whether two nodes already belong to the same group, and merging groups as you process edges — exactly what union and find operations do. You process each edge once: if the two endpoints are already connected, that edge is redundant (or would create a cycle); otherwise, you union them.",
    },
    {
      question: "Walk through Kruskal's algorithm for minimum spanning tree and explain where Union-Find comes in.",
      answer:
        "Sort all edges by weight ascending. Go through them in order, and for each edge, use Union-Find to check if its two endpoints are already connected — if not, add the edge to the MST and union the two sets; if they are already connected, adding it would create a cycle, so skip it. You stop once you've added n-1 edges for n nodes.",
    },
  ],
  greedy: [
    {
      question: "How do you tell whether a problem actually has the greedy-choice property, versus needing DP?",
      answer:
        "You need to be able to argue that a locally optimal choice at each step never precludes reaching a globally optimal solution — usually via an exchange argument, showing that any optimal solution can be transformed into one that includes your greedy choice without getting worse. If the optimal choice at a step depends on what you choose later, or overlapping subproblems interact, that's a sign you need DP instead.",
    },
    {
      question: "For 'Jump Game II' (minimum jumps to reach the end), what's the greedy insight?",
      answer:
        "Track the farthest index reachable from the current 'jump window,' and the end of the current window. As you scan, keep extending the farthest reachable index; once you reach the end of the current window, you must take a jump, so increment the jump count and extend the window to the farthest index found so far. This greedily commits to a jump only when forced to, which minimizes total jumps.",
    },
    {
      question:
        "In interval scheduling — maximizing the number of non-overlapping intervals you can select — why does sorting by end time (not start time) give the greedy optimum?",
      answer:
        "Sorting by end time and always picking the interval that finishes earliest among those still compatible leaves the most room for future intervals. Sorting by start time doesn't have that guarantee, because an early-starting interval can still block out a lot of the timeline if it runs long. The exchange argument shows any optimal solution can be rearranged to match this earliest-finish-first choice without losing intervals.",
    },
  ],
  trie: [
    {
      question: "What's the time complexity advantage a trie gives you over a hash set of strings for prefix queries?",
      answer:
        "A hash set can tell you if an exact string exists in O(1) average, but checking whether any string starts with a given prefix requires scanning every entry, O(n · L) in the worst case. A trie answers 'does any word start with this prefix' in O(L) time, where L is the prefix length, by just walking down L trie nodes, regardless of how many words are stored.",
    },
    {
      question: "How is a trie node typically structured, and how do you mark the end of a word?",
      answer:
        "Each node holds an array or map of children keyed by character, plus a boolean flag (often isEndOfWord) marking whether a valid word ends at that node. Insertion walks character by character, creating child nodes as needed, and sets that flag true at the final character's node.",
    },
    {
      question: "When would a trie be the wrong choice compared to a simpler hash set, even for prefix problems?",
      answer:
        "If you never actually need prefix queries — only exact membership checks — a trie adds memory overhead (a node per character, potentially with a full alphabet-sized children array) for no benefit over a hash set's O(1) average lookup. Tries earn their keep specifically when prefix matching, autocomplete, or word-with-wildcard search is part of the requirement.",
    },
  ],
  "data-structures-to-know": [
    {
      question:
        "'Insert Delete GetRandom O(1)' asks for average O(1) insert, delete, and random access all at once — why doesn't a plain hash set or array alone satisfy that?",
      answer:
        "An array alone gives O(1) random access via a random index, but deletion from the middle is O(n) if you shift elements. A hash set alone gives O(1) insert/delete/lookup but has no way to pick a uniformly random element in O(1). The trick is combining both: an array for O(1) random-index access, plus a hash map from value to its array index for O(1) lookup, and on deletion, swap the target with the last array element before popping, updating the map, to avoid shifting.",
    },
    {
      question: "When would you reach for a heap versus a balanced BST when you need ordered access to a dynamic set?",
      answer:
        "A heap gives you O(log n) insert and O(log n) extract-min/max, but only efficient access to the single min or max — no efficient arbitrary rank or range queries. A balanced BST (or a language's ordered map/set) supports O(log n) insert, delete, and lookup of arbitrary elements, plus in-order traversal and range queries. If you only ever need the extreme element, a heap is simpler and often faster in practice; if you need general ordered access, use a BST-backed structure.",
    },
    {
      question: "What's the core design idea behind an LRU cache, and which two structures does it combine?",
      answer:
        "You need O(1) get and put while always knowing which entry was least recently used. A hash map gives O(1) lookup from key to a node, and a doubly linked list maintains usage order — moving a node to the front on every access, and evicting from the back when the cache is full. The combination gives O(1) for both operations, which neither structure alone would provide.",
    },
  ],
};
