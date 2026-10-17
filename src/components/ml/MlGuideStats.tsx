export function MlGuideStats({
  lessonCount,
  chapterCount,
  quizCount,
}: {
  lessonCount: number;
  chapterCount: number;
  quizCount: number;
}) {
  return (
    <div className="mb-4 flex flex-wrap gap-2.5 text-[13px] font-medium text-text">
      <span className="rounded-md bg-surface-high/60 px-3 py-2">{lessonCount} lessons</span>
      <span className="rounded-md bg-surface-high/60 px-3 py-2">{chapterCount} chapters</span>
      <span className="rounded-md bg-surface-high/60 px-3 py-2">{quizCount} mock questions (premium)</span>
    </div>
  );
}
