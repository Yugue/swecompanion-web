export function MlGuideStats({
  lessonCount,
  chapterCount,
  quizCount,
  sectionLabel = "Chapter",
  lessonLabel,
}: {
  lessonCount: number;
  chapterCount: number;
  quizCount: number;
  sectionLabel?: "Chapter" | "Part";
  lessonLabel?: "lessons" | "chapters";
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2.5 text-[13px] font-medium text-text">
      <span className="rounded-md bg-surface-high/60 px-3 py-2">{lessonCount} {lessonLabel ?? (sectionLabel === "Part" ? "chapters" : "lessons")}</span>
      <span className="rounded-md bg-surface-high/60 px-3 py-2">{chapterCount} {sectionLabel === "Part" ? "Parts" : "chapters"}</span>
      {quizCount > 0 && <span className="rounded-md bg-surface-high/60 px-3 py-2">{quizCount} mock questions (premium)</span>}
    </div>
  );
}
