import { motion } from "framer-motion";
import { BarChart3 } from "lucide-react";
import { Reveal, SectionTag, CountUp } from "@/features/career/components/landing/primitives";
import { insightCards } from "@/features/career/services/landingData";

function Ring({ value, accent }) {
  const R = 30, C = 2 * Math.PI * R;
  return (
    <div className="relative h-20 w-20">
      <svg viewBox="0 0 80 80" className="h-20 w-20 -rotate-90">
        <circle cx="40" cy="40" r={R} fill="none" stroke="#E2E8F0" strokeWidth="7" />
        <motion.circle cx="40" cy="40" r={R} fill="none" stroke={accent} strokeWidth="7" strokeLinecap="round"
          strokeDasharray={C} initial={{ strokeDashoffset: C }} whileInView={{ strokeDashoffset: C * (1 - value / 100) }} viewport={{ once: true }} transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }} />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-[15px] font-black text-slate-900"><CountUp value={value} suffix="%" /></div>
    </div>
  );
}

function Bars({ accent }) {
  const hs = [40, 65, 50, 80, 70, 95];
  return (
    <div className="flex h-16 items-end gap-1.5">
      {hs.map((h, i) => (
        <motion.span key={i} className="w-2.5 rounded-full" style={{ background: accent }} initial={{ height: 0 }} whileInView={{ height: `${h}%` }} viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }} />
      ))}
    </div>
  );
}

function Spark({ accent }) {
  return (
    <svg viewBox="0 0 120 50" className="h-16 w-full">
      <motion.path d="M2,42 C25,38 35,20 55,24 C78,28 88,8 118,6" fill="none" stroke={accent} strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }} transition={{ duration: 1.6 }} />
    </svg>
  );
}

export default function CareerInsights() {
  return (
    <section className="relative py-24 lg:py-32" data-testid="career-insights-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionTag icon={BarChart3}>Career Insights</SectionTag>
          <h2 className="mt-6 text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
            Make Smarter Career Decisions <span className="gradient-text">With Data</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-600">
            Every action you take inside MyMentor contributes to your career growth.
          </p>
        </Reveal>

        <div className="mt-16 grid grid-cols-2 gap-5 md:grid-cols-3 lg:grid-cols-4">
          {insightCards.map((c, i) => (
            <motion.div
              key={c.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.06 }}
              whileHover={{ y: -6 }}
              className={`rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-large ${i === 0 ? "col-span-2 lg:col-span-1" : ""}`}
              data-testid={`insight-${i}`}
            >
              <p className="text-[13px] font-semibold text-slate-500">{c.label}</p>
              <div className="mt-4 flex items-center justify-between">
                {c.kind === "counter" && <span className="text-4xl font-black tracking-tight" style={{ color: c.accent }}><CountUp value={c.value} suffix={c.suffix} /></span>}
                {c.kind === "ring" && <Ring value={c.value} accent={c.accent} />}
                {c.kind === "bar" && (
                  <>
                    <span className="text-3xl font-black tracking-tight text-slate-900"><CountUp value={c.value} suffix={c.suffix} /></span>
                    <Bars accent={c.accent} />
                  </>
                )}
                {c.kind === "line" && (
                  <div className="w-full">
                    <span className="text-3xl font-black tracking-tight text-slate-900"><CountUp value={c.value} suffix={c.suffix} /></span>
                    <Spark accent={c.accent} />
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
