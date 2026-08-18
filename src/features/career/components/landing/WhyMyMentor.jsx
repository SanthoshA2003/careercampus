import { motion } from "framer-motion";
import { Check, Minus, Layers } from "lucide-react";
import { Reveal, SectionTag } from "@/features/career/components/landing/primitives";
import { comparisonColumns, comparisonRows } from "@/features/career/services/landingData";

export default function WhyMyMentor() {
  const last = comparisonColumns.length - 1;
  return (
    <section className="relative py-24 lg:py-32" data-testid="why-mymentor-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionTag icon={Layers}>Why MyMentor</SectionTag>
          <h2 className="mt-6 text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
            Why Students Choose <span className="gradient-text">MyMentor</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-600">
            Many platforms solve one part of your career journey. MyMentor connects every part together.
          </p>
        </Reveal>

        <Reveal delay={0.1} className="mt-14 overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-medium">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="p-5 text-left text-[13px] font-bold uppercase tracking-wider text-slate-400">Feature</th>
                  {comparisonColumns.map((col, i) => (
                    <th key={col} className={`p-5 text-center text-[14px] font-bold ${i === last ? "relative text-white" : "text-slate-500"}`}>
                      {i === last && <span className="absolute inset-2 -z-0 rounded-2xl bg-gradient-to-b from-blue-600 to-cyan-500" />}
                      <span className="relative z-10">{col}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparisonRows.map((row, ri) => (
                  <motion.tr
                    key={row.feature}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-20px" }}
                    transition={{ delay: ri * 0.04 }}
                    className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60"
                  >
                    <td className="p-4 pl-5 text-left text-[15px] font-semibold text-slate-700">{row.feature}</td>
                    {row.cells.map((ok, ci) => (
                      <td key={ci} className={`p-4 text-center ${ci === last ? "relative" : ""}`}>
                        {ci === last && <span className="absolute inset-y-0 left-2 right-2 -z-0 bg-gradient-to-b from-blue-50/80 to-cyan-50/80" />}
                        <span className="relative z-10 inline-grid place-items-center">
                          {ok ? (
                            <span className={`grid h-7 w-7 place-items-center rounded-full ${ci === last ? "bg-gradient-to-br from-blue-600 to-green-500 text-white shadow-soft" : "bg-emerald-100 text-emerald-600"}`}><Check className="h-4 w-4" /></span>
                          ) : (
                            <span className="grid h-7 w-7 place-items-center rounded-full bg-slate-100 text-slate-300"><Minus className="h-4 w-4" /></span>
                          )}
                        </span>
                      </td>
                    ))}
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </Reveal>

        <Reveal delay={0.15} className="mt-10">
          <div className="relative overflow-hidden rounded-3xl bg-[#0D1B2A] p-8 text-center shadow-large sm:p-12">
            <div className="aurora-blob left-1/2 top-0 h-64 w-64 -translate-x-1/2 bg-blue-500/30" />
            <p className="relative text-2xl font-bold leading-snug text-white sm:text-3xl">
              MyMentor isn't another learning platform.<br />
              <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">It's your Career Operating System.</span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
