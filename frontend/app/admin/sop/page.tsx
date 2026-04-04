import { PageShell } from "@/components/shared/page-shell";
import { getSopTemplate } from "@/lib/api";

export default async function SopAdminPage() {
  let template: Record<string, string[]> = {};
  try {
    template = (await getSopTemplate()).template;
  } catch {
    template = {};
  }

  return (
    <PageShell>
      <div className="space-y-6">
        <section className="glass rounded-[32px] p-8">
          <div className="text-sm uppercase tracking-[0.2em] text-cyan-300">Admin SOP Editor</div>
          <h1 className="mt-3 text-4xl font-semibold text-white">Reference validation template</h1>
        </section>
        <div className="grid gap-4 md:grid-cols-2">
          {Object.entries(template).map(([section, phrases]) => (
            <div key={section} className="glass rounded-3xl p-6">
              <div className="text-lg font-medium text-white">{section}</div>
              <div className="mt-4 flex flex-wrap gap-2">
                {phrases.map((phrase) => (
                  <span key={phrase} className="rounded-full bg-white/5 px-3 py-2 text-xs text-slate-200">
                    {phrase}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
