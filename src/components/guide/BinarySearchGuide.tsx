const templates = [
  {
    id: "exact",
    title: "Exact Search",
    name: "exact_search",
    cue: "Find an index containing the target in a sorted array.",
    difference: "Use left <= right because both endpoints are included. Return on ==; otherwise discard mid with mid + 1 or mid - 1. With duplicates, any matching index is valid.",
    code: `def exact_search(arr, target):
    left, right = 0, len(arr) - 1

    while left <= right:
        mid = (left + right) // 2

        if arr[mid] == target:
            return mid
        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1

    return -1`,
  },
  {
    id: "left",
    title: "Boundary Search: Left",
    name: "bisect_left",
    cue: "Find the first value >= target, or the insertion point before equal values.",
    difference: "Use left < right with right = len(arr). Move left only when arr[mid] < target. On equality, keep mid with right = mid so the search continues toward the first equal value.",
    code: `def bisect_left(arr, target):
    left, right = 0, len(arr)

    while left < right:
        mid = (left + right) // 2

        if arr[mid] < target:
            left = mid + 1
        else:
            right = mid

    return left`,
  },
  {
    id: "right",
    title: "Boundary Search: Right",
    name: "bisect_right",
    cue: "Find the first value > target, or the insertion point after equal values.",
    difference: "The loop and endpoints match bisect_left. Change < to <= in the value comparison: equality now moves left to mid + 1, skipping all equal values.",
    code: `def bisect_right(arr, target):
    left, right = 0, len(arr)

    while left < right:
        mid = (left + right) // 2

        if arr[mid] <= target:
            left = mid + 1
        else:
            right = mid

    return left`,
  },
];

function highlightComparisons(code: string) {
  return code.split(/(<=|>=|==|<|>)/g).map((part, index) =>
    /^(<=|>=|==|<|>)$/.test(part) ? (
      <mark key={index} className="rounded bg-accent-blue/15 px-0.5 font-bold text-accent-ink">
        {part}
      </mark>
    ) : part
  );
}

export function BinarySearchGuide() {
  return (
    <section aria-labelledby="binary-search-templates" className="min-w-0 space-y-4">
      <div>
        <h4 id="binary-search-templates" className="text-base font-bold text-text">
          Three binary search templates
        </h4>
        <p className="mt-1 text-sm leading-relaxed text-text-muted">
          For an array sorted in ascending order, choose what the returned index should mean.
          The highlighted comparison signs determine how equality is handled.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-outline/70">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Binary search comparison signs and return values</caption>
          <thead className="bg-surface-high/60 text-text">
            <tr>
              <th scope="col" className="px-3 py-2.5">Template</th>
              <th scope="col" className="px-3 py-2.5">Loop</th>
              <th scope="col" className="px-3 py-2.5">Value comparison</th>
              <th scope="col" className="px-3 py-2.5">Return</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline/60 text-text-muted">
            <tr>
              <th scope="row" className="whitespace-nowrap px-3 py-3 font-medium text-text">Exact search</th>
              <td className="whitespace-nowrap px-3 py-3 font-mono">{highlightComparisons("left <= right")}</td>
              <td className="whitespace-nowrap px-3 py-3 font-mono">{highlightComparisons("arr[mid] == target")}</td>
              <td className="px-3 py-3">Matching index, or <code>-1</code></td>
            </tr>
            <tr>
              <th scope="row" className="whitespace-nowrap px-3 py-3 font-mono font-medium text-text">bisect_left</th>
              <td className="whitespace-nowrap px-3 py-3 font-mono">{highlightComparisons("left < right")}</td>
              <td className="whitespace-nowrap px-3 py-3 font-mono">{highlightComparisons("arr[mid] < target")}</td>
              <td className="px-3 py-3">First index with a value <code>{">="}</code> target</td>
            </tr>
            <tr>
              <th scope="row" className="whitespace-nowrap px-3 py-3 font-mono font-medium text-text">bisect_right</th>
              <td className="whitespace-nowrap px-3 py-3 font-mono">{highlightComparisons("left < right")}</td>
              <td className="whitespace-nowrap px-3 py-3 font-mono">{highlightComparisons("arr[mid] <= target")}</td>
              <td className="px-3 py-3">First index with a value <code>{">"}</code> target</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="text-sm leading-relaxed text-text-muted">
        The boundary templates return <code>len(arr)</code> when no value qualifies, including for an empty array.
        They return an insertion position even if the target is absent.
      </p>

      <div className="grid min-w-0 gap-4">
        {templates.map((template) => (
          <article key={template.id} className="min-w-0 overflow-hidden rounded-lg border border-outline/70 md:grid md:grid-cols-2">
            <div className="space-y-3 p-4">
              <div>
                <h5 className="font-bold text-text">{template.title}</h5>
                <p className="mt-1 text-sm leading-relaxed text-text-muted">{highlightComparisons(template.cue)}</p>
              </div>
              <p className="text-sm leading-relaxed text-text-muted">{highlightComparisons(template.difference)}</p>
            </div>
            <div className="min-w-0 border-t border-outline/60 bg-surface-high/40 md:border-t-0 md:border-l">
              <div className="border-b border-outline/60 px-4 py-2 font-mono text-xs text-text-muted">
                Python · {template.name}
              </div>
              <pre className="overflow-x-auto p-4 text-xs leading-relaxed text-text sm:text-[13px]">
                <code>{highlightComparisons(template.code)}</code>
              </pre>
            </div>
          </article>
        ))}
      </div>

      <div className="rounded-lg border border-outline/70 bg-surface-high/40 p-4 text-sm leading-relaxed text-text-muted">
        <p className="font-semibold text-text">Watch what happens to duplicates</p>
        <p className="mt-1">
          With <code>[1, 2, 2, 2, 4]</code> and target <code>2</code>, exact search can return any index from 1 to 3.
          <code> bisect_left</code> returns <strong className="text-text">1</strong> (before the first 2);
          <code> bisect_right</code> returns <strong className="text-text">4</strong> (after the last 2).
          The only change between the boundary templates is <strong className="text-accent-ink"><code>{"<"}</code> versus <code>{"<="}</code></strong> in the value comparison.
        </p>
      </div>
    </section>
  );
}
