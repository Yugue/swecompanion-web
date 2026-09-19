import { studyTopics, type StudyTopic } from "./studyData";

/**
 * URL layout for the coding (LeetCode) section:
 *
 *   /coding                        hub (all chapters, interactive checklist)
 *   /coding/<chapter>              a chapter's overview page
 *   /coding/<chapter>/quiz         that chapter's premium mock-interview quiz
 *
 * `topic.slug` is the stable identity of a chapter (Firestore quiz ids are `lc-<slug>`), so it
 * never changes. The URL segment is a separate, human-readable name of at most two words,
 * declared here.
 */
export const CODING_PATH = "/coding";

const CHAPTER_PATHS: Record<string, string> = {
  "hashmap-frequency-and-top-k": "hashmap",
  sorting: "sorting",
  "sliding-window": "sliding-window",
  "two-pointers": "two-pointers",
  "prefix-sum-and-subarray": "prefix-sum",
  "stack-and-monotonic-stack": "stack",
  "binary-search": "binary-search",
  intervals: "intervals",
  "linked-list": "linked-list",
  dfs: "dfs",
  bfs: "bfs",
  "dijkstra-and-weighted-graphs": "dijkstra",
  "union-find-and-mst": "union-find",
  greedy: "greedy",
  trie: "trie",
  "data-structures-to-know": "data-structures",
  "mixed-leetcode-challenge-set-round-4": "challenge-4",
  "mixed-leetcode-challenge-set-round-3": "challenge-3",
  "mixed-leetcode-challenge-set-round-2": "challenge-2",
  "mixed-leetcode-challenge-set-round-1": "challenge-1",
};

// Checked when the module loads, so a new chapter without a valid URL fails the build instead of
// shipping a broken link.
const TWO_WORDS_MAX = /^[a-z0-9]+(-[a-z0-9]+)?$/;
const owners = new Map<string, string>();
for (const topic of studyTopics) {
  const path = CHAPTER_PATHS[topic.slug];
  if (!path) {
    throw new Error(`Coding chapter "${topic.slug}" has no URL path - add it to CHAPTER_PATHS.`);
  }
  if (!TWO_WORDS_MAX.test(path)) {
    throw new Error(`URL path "${path}" for "${topic.slug}" must be at most two hyphenated words.`);
  }
  const clash = owners.get(path);
  if (clash) throw new Error(`URL path "${path}" is used by both "${clash}" and "${topic.slug}".`);
  owners.set(path, topic.slug);
}

export const chapterPath = (topic: StudyTopic): string => CHAPTER_PATHS[topic.slug];
export const chapterHref = (topic: StudyTopic): string => `${CODING_PATH}/${chapterPath(topic)}`;
export const chapterQuizHref = (topic: StudyTopic): string => `${chapterHref(topic)}/quiz`;

export const studyTopicsByPath: Record<string, StudyTopic> = Object.fromEntries(
  studyTopics.map((topic) => [chapterPath(topic), topic] as const)
);
