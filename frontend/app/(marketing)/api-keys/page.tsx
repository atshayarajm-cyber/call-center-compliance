"use client";

import { useEffect, useState } from "react";

import { PageShell } from "@/components/shared/page-shell";

export default function ApiKeysPage() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    setApiKey(window.localStorage.getItem("call-center-api-key") ?? process.env.NEXT_PUBLIC_DEFAULT_API_KEY ?? "");
  }, []);

  return (
    <PageShell>
      <div className="space-y-6">
        <section className="glass rounded-[32px] p-8">
          <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">API Key</div>
          <h1 className="mt-3 text-4xl font-semibold text-white">Manage authenticated access</h1>
        </section>
        <div className="glass rounded-3xl p-6">
          <label className="text-sm text-slate-300">Bearer API Key</label>
          <input
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm outline-none"
          />
          <button
            type="button"
            onClick={() => window.localStorage.setItem("call-center-api-key", apiKey)}
            className="mt-4 rounded-full bg-cyan-400 px-5 py-3 font-medium text-slate-950"
          >
            Save Key
          </button>
        </div>
      </div>
    </PageShell>
  );
}
