"use client";

export function AudioPlayer({ source }: { source?: string }) {
  return (
    <div className="glass rounded-3xl p-5">
      <div className="mb-4 text-sm font-medium text-slate-200">Audio Preview</div>
      <audio controls className="w-full" src={source}>
        Your browser does not support audio playback.
      </audio>
      <div className="mt-4 flex h-14 items-end gap-2">
        {[24, 18, 32, 14, 28, 40, 22, 30, 16, 34, 20, 26].map((height, index) => (
          <span
            key={`${height}-${index}`}
            className="w-full rounded-full bg-gradient-to-t from-cyan-400/40 to-indigo-400/90"
            style={{ height }}
          />
        ))}
      </div>
    </div>
  );
}
