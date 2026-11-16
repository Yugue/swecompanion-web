import Foundation

// Concise, complete landing-page examples rendered by the native app's views.
// Website fixtures live here so capture changes do not alter the app's free previews.
enum LandingPreviewAnswers {
  static let slidingWindow = """
  def length_of_longest_substring(s):
      last = {}
      left = best = 0
      for right, ch in enumerate(s):
          left = max(left, last.get(ch, -1) + 1)
          last[ch] = right
          best = max(best, right - left + 1)
      return best
  """

  static func markdown(for name: String) -> String {
    switch name {
    case "coding":
      return """
      ## Explanation
      Keep a unique-character window. Jump its left edge past a repeated character; never move it backward. For `abba`, the answer stays **2**.

      ## Solution
      ```python
      \(slidingWindow)
      ```

      ## Complexity
      - Time: O(n), one pass.
      - Space: O(min(n, alphabet size)).
      """
    case "debug":
      let fixed = slidingWindow.replacingOccurrences(
        of: "left = max(left, last.get(ch, -1) + 1)",
        with: "left = max(left, last.get(ch, -1) + 1)  # <<< \(UIStrings.changeMarker)")
      return """
      ## Error Summary
      On the final `a` in `abba`, `left` moves backward from 2 to 1. Use `max` to keep it monotonic and avoid counting the repeated `b`.

      ## Working Solution
      ```python
      \(fixed)
      ```

      ## Complexity
      - Time: O(n), one pass.
      - Space: O(min(n, alphabet size)).
      """
    case "optimize":
      return """
      ## Improvements
      Reuse one window instead of restarting at every index. Store each character's latest position and skip directly past duplicates.

      ## Optimized Solution
      ```python
      \(slidingWindow)
      ```

      ## Complexity
      - **Before**: O(n²) worst-case time. **After**: O(n) time, O(min(n, alphabet size)) space.
      """
    case "system-design":
      return """
      ## Design
      - **Admission**: Hash each API key to one Redis owner. One atomic Lua script trims entries older than 60 s, counts, and inserts a unique request ID only below 100. Use the store clock; refresh a 60 s TTL.
      - **Responses**: Allow → backend. Full → **429**, with Retry-After from the oldest entry. Uncertain state → **503**.
      - **Scale & recovery**: Start with 8 shards (~6,250 checks/s each); load-test hot keys against p95 ≤ 5 ms. Fence a failed owner and pause its shard for 60 s before admitting on a stale replacement.

      ## Architecture
      ```mermaid
      flowchart LR
          C[Client] --> G[Stateless gateway]
          G -->|Atomic Lua| S[(Redis owner)]
          G -->|Allowed| B[Backend]
          S -.->|Replicate| R[(Replica)]
          G -.->|429 or 503| C
          classDef core fill:#20233b,stroke:#8c9eff,color:#f2f2f2
          class G,S core
      ```
      """
    default:
      precondition(name == "ml-design", "Unknown landing workflow: \(name)")
      return """
      ## Model & Training
      - **Data**: Reviewed multilabel messages; mask unknown annotations. Split by time and conversation; cover rare labels and mixed languages.
      - **Model**: XLM-R → 150 sigmoid outputs + a no-known-label head. Train with weighted binary cross-entropy.
      - **Decisions**: Calibrate per-label cutoffs. Borderline → review. No accepted labels + confident unknown head → no known label.
      - **Quality**: Micro/macro F1 and recall at target precision, by language and category. Audit every outcome.
      - **Serving**: Version weights, tokenizer, and cutoffs together. Batch inference; canary releases. Model failure → review.

      ## Architecture
      ```mermaid
      flowchart TB
          subgraph Online
              direction LR
              M[Message] --> X[XLM-R] --> P[150 scores + policy] --> O[Labels / review / unknown]
          end
          subgraph Learning
              direction LR
              D[(Reviewed data)] --> T[Train + calibrate + evaluate] --> V[Versioned bundle]
          end
          O -.->|Audits| D
          V -.->|Approved release| X
          classDef core fill:#20233b,stroke:#8c9eff,color:#f2f2f2
          class X,P core
      ```
      """
    }
  }
}
