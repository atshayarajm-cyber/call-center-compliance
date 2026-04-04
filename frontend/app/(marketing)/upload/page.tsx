"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { AudioPlayer } from "@/components/shared/audio-player";
import { PageShell } from "@/components/shared/page-shell";
import { UploadBox } from "@/components/upload/upload-box";
import { createAnalysisJob } from "@/lib/api";

export default function UploadPage() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [batchUrls, setBatchUrls] = useState("");
  const [languageHint, setLanguageHint] = useState("auto");
  const [error, setError] = useState("");
  const [isPending, startTransition] = useTransition();

  return (
    <PageShell>
      <div className="space-y-6">
        <section className="glass rounded-[32px] p-8">
          <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">Upload Console</div>
          <h1 className="mt-3 text-4xl font-semibold text-white">Submit call recordings for advanced analysis</h1>
        </section>
        <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <UploadBox onFileSelect={setSelectedFile} selectedFileName={selectedFile?.name} />
            <div className="glass rounded-3xl p-6">
              <label className="text-sm text-slate-300">Single Audio URL</label>
              <input
                value={audioUrl}
                onChange={(event) => setAudioUrl(event.target.value)}
                placeholder="https://..."
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none"
              />
              <label className="mt-4 block text-sm text-slate-300">Batch URLs</label>
              <textarea
                value={batchUrls}
                onChange={(event) => setBatchUrls(event.target.value)}
                placeholder={"https://audio-1\nhttps://audio-2"}
                className="mt-2 min-h-32 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none"
              />
              <label className="mt-4 block text-sm text-slate-300">Language Hint</label>
              <select
                value={languageHint}
                onChange={(event) => setLanguageHint(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none"
              >
                <option value="auto">Auto-detect</option>
                <option value="hi">Hindi / Hinglish</option>
                <option value="ta">Tamil / Tanglish</option>
              </select>
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    try {
                      setError("");
                      const formData = new FormData();
                      if (selectedFile) formData.append("audio_file", selectedFile);
                      if (audioUrl) formData.append("audio_url", audioUrl);
                      if (batchUrls) formData.append("audio_urls", batchUrls);
                      formData.append("language_hint", languageHint);
                      const result = await createAnalysisJob(formData);
                      router.push(`/status/${result.job_id}`);
                    } catch (err) {
                      setError(err instanceof Error ? err.message : "Upload failed");
                    }
                  })
                }
                className="mt-6 rounded-full bg-cyan-400 px-6 py-3 font-medium text-slate-950 disabled:opacity-50"
              >
                {isPending ? "Submitting..." : "Analyze Call"}
              </button>
              {error ? <div className="mt-4 text-sm text-rose-300">{error}</div> : null}
            </div>
          </div>
          <AudioPlayer source={selectedFile ? URL.createObjectURL(selectedFile) : audioUrl || undefined} />
        </div>
      </div>
    </PageShell>
  );
}
