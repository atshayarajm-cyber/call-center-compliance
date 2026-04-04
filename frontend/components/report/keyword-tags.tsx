export function KeywordTags({ keywords }: { keywords: string[] }) {
  return (
    <section className="glass rounded-3xl p-6">
      <div className="mb-4 text-sm uppercase tracking-[0.2em] text-cyan-300">Keywords</div>
      <div className="flex flex-wrap gap-3">
        {keywords.map((keyword) => (
          <span key={keyword} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-100">
            {keyword}
          </span>
        ))}
      </div>
    </section>
  );
}
