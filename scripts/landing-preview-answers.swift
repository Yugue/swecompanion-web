import Foundation

// Concise, complete landing-page examples rendered by the native app's views.
// Website fixtures live here so capture changes do not alter the app's free previews.
enum LandingPreviewAnswers {
  static let twoPointers = """
  def trap(height):
      left, right = 0, len(height) - 1
      left_max = right_max = water = 0
      while left < right:
          if height[left] <= height[right]:
              left_max = max(left_max, height[left])
              water += left_max - height[left]
              left += 1
          else:
              right_max = max(right_max, height[right])
              water += right_max - height[right]
              right -= 1
      return water
  """

  static func markdown(for name: String) -> String {
    switch name {
    case "coding":
      return """
      ## Explanation
      Move the pointer at the shorter bar. Its running maximum bounds the water there; the opposite side is tall enough. Add the depth, then move inward. The examples trap **6** and **9** units.

      ## Solution
      ```python
      \(twoPointers)
      ```

      ## Complexity
      - Time: **O(n)**. Space: **O(1)** extra.
      """
    case "debug":
      let fixed = twoPointers
        .replacingOccurrences(of: "water += left_max - height[left]", with: "# water = left_max - height[left]  # <<< \(UIStrings.removedMarker)\n            water += left_max - height[left]  # <<< \(UIStrings.changeMarker)")
        .replacingOccurrences(of: "right_max = max(right_max, height[right])", with: "# right_max = min(right_max, height[right])  # <<< \(UIStrings.removedMarker)\n            right_max = max(right_max, height[right])  # <<< \(UIStrings.changeMarker)")
      return """
      ## Two Bugs
      1. **Overwritten total**: `=` discards earlier water. Use `+=`.
      2. **Wrong right boundary**: `min` loses the tallest bar. Use `max`.

      ## Code Diff · red removed / amber added
      ```python
      \(fixed)
      ```

      ## Complexity
      - Time: **O(n)**. Space: **O(1)** extra.
      """
    case "optimize":
      let removed = """
      def trap(height):
          water = 0
          for i in range(1, len(height) - 1):
              left_max = max(height[:i + 1])
              right_max = max(height[i:])
              water += min(left_max, right_max) - height[i]
          return water
      """.components(separatedBy: "\n")
        .map { "# " + $0 + "  # <<< " + UIStrings.removedMarker }
        .joined(separator: "\n")
      let added = twoPointers.components(separatedBy: "\n")
        .map { $0 + "  # <<< " + UIStrings.changeMarker }
        .joined(separator: "\n")
      return """
      ## Two Improvements
      1. **Faster**: Replace repeated maximum scans with one two-pointer pass. **O(n²) → O(n)** time.
      2. **Less memory**: Remove array slices; keep two running maxima. **O(n) → O(1)** extra space.

      ## Code Diff · red removed / amber added
      ```python
      \(removed)
      \(added)
      ```
      """
    case "system-design":
      return """
      ## Design
      - **Flash sale**: Cache search and seat maps. A signed waiting room meters 1M fans into checkout; cached availability is advisory.
      - **No double booking**: One SQL writer per event. Lock selected seats in sorted order; claim all or none. Store hold ID, owner, state, and DB-clock expiry. Atomically reclaim expired 5-minute holds.
      - **Safe payment**: Before expiry, save an order and move its hold to PAYMENT_PENDING in one transaction. Order ID deduplicates provider retries. Verified success confirms seats + ticket outbox atomically; dedupe callbacks there. Failure → release. Unknown → reconcile before release; late success after cancellation → refund.
      - **Recovery**: Retry outbox delivery; unique ticket per order/seat. Sweep expired holds. Shard by event; throttle hot sales. Fence failed writers; pause bookings during uncertain failover.

      ## Architecture
      ```mermaid
      flowchart LR
          C[Fans] --> W[Waiting room]
          C --> R[Search / seat cache]
          W -->|Token| B[Booking]
          B -->|Transaction| S[(SQL + outbox)]
          B -->|Order ID| P[Payments]
          P -->|Callback| B
          S -->|Retry| T[Tickets]
          classDef core fill:#20233b,stroke:#8c9eff,color:#f2f2f2
          class B,S core
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
