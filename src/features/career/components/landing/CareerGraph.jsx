import { motion } from "framer-motion";
import { LineChart, ArrowRight } from "lucide-react";
import { Reveal, SectionTag, PrimaryButton, Magnetic } from "@/features/career/components/landing/primitives";
import { careerGraphCards, careerGraphTimeline } from "@/features/career/services/landingData";
import { useAuth } from "@/features/auth/components/AuthModal";

export default function CareerGraph() {
  const { openAuth } = useAuth();
  return (
<section
  className="relative overflow-hidden bg-[#F1F5F9] pt-2 pb-24 lg:pt-4 lg:pb-32"
  data-testid="career-graph-section"
>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
    <Reveal className="mx-auto max-w-3xl text-center">
      <SectionTag icon={LineChart}>Career Graph</SectionTag>

<h2 className="mt-3 text-3xl font-extrabold leading-[1.3] tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
          Your Career Is More Than A{" "}
        <span className="mt-2 block leading-[1.2] gradient-text">Resume.</span>
      </h2>

      <p className="mx-auto mt-8 max-w-2xl text-[18px] leading-relaxed text-slate-600">
        Traditional resumes only show where you've been. Your Career Graph
        shows where you're going.
      </p>
    </Reveal>

        <div className="mt-16 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-8">
          {/* Left dashboard */}
          <Reveal>
            <div className="h-full rounded-3xl border border-slate-100 bg-white p-8 shadow-medium">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Career Dashboard</p>
              <div className="mt-6 grid grid-cols-2 gap-4">
                {careerGraphCards.map((c, i) => (
                  <motion.div
                    key={c.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -4 }}
                    className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white"><c.icon className="h-5 w-5" /></span>
                    <p className="mt-3 text-[13px] font-medium text-slate-500">{c.label}</p>
                    <p className="text-[15px] font-bold text-slate-900">{c.value}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </Reveal>

          {/* Right growth chart */}
          <Reveal delay={0.1}>
            <div className="relative flex h-full flex-col overflow-hidden rounded-3xl bg-[#0D1B2A] p-8 shadow-large">
              <div className="aurora-blob right-[-10%] top-[-10%] h-64 w-64 bg-cyan-500/30" />
              <p className="relative text-sm font-bold uppercase tracking-widest text-cyan-300">Career Growth</p>
              <div className="relative mt-6 flex-1">
                <svg viewBox="0 0 400 200" className="h-full w-full">
                  {[0, 1, 2, 3].map((g) => (
                    <line key={g} x1="0" y1={50 * g + 10} x2="400" y2={50 * g + 10} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
                  ))}
                  <motion.path
                    d="M10,170 C70,160 90,120 150,110 C210,100 240,60 300,45 C340,35 370,20 390,15"
                    fill="none" stroke="url(#cg)" strokeWidth="4" strokeLinecap="round"
                    initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} viewport={{ once: true }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <motion.path
                    d="M10,170 C70,160 90,120 150,110 C210,100 240,60 300,45 C340,35 370,20 390,15 L390,190 L10,190 Z"
                    fill="url(#cgFill)" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1, duration: 1 }}
                  />
                  <defs>
                    <linearGradient id="cg" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#2563EB" /><stop offset="50%" stopColor="#06B6D4" /><stop offset="100%" stopColor="#22C55E" /></linearGradient>
                    <linearGradient id="cgFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="rgba(6,182,212,0.4)" /><stop offset="100%" stopColor="rgba(6,182,212,0)" /></linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="relative mt-6 flex flex-wrap items-center justify-between gap-2">
                {careerGraphTimeline.map((t, i) => (
                  <div key={t} className="flex flex-col items-center gap-1.5">
                    <span className={`h-2.5 w-2.5 rounded-full ${i >= 3 ? "bg-green-400" : "bg-cyan-400"}`} />
                    <span className="text-[11px] font-semibold text-slate-300">{t}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.1} className="mt-12 flex justify-center">
          <Magnetic>
            <PrimaryButton onClick={openAuth} data-testid="career-graph-cta">
              View Full Career Score <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </PrimaryButton>
          </Magnetic>
        </Reveal>
      </div>
    </section>
  );
}
