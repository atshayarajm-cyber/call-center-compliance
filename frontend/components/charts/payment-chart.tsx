"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

const COLORS = ["#22d3ee", "#818cf8", "#34d399", "#f59e0b"];

export function PaymentChart({ counts }: { counts: Record<string, number> }) {
  const data = Object.entries(counts).map(([name, value]) => ({ name, value }));

  return (
    <section className="glass rounded-3xl p-6">
      <div className="mb-5 text-sm uppercase tracking-[0.2em] text-cyan-300">Payment Categorization</div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={72} outerRadius={96}>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
