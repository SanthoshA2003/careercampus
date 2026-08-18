import { motion } from "framer-motion";
import { Target, Check, Info, ArrowRight, Lightbulb } from "lucide-react";
import { Reveal, SectionTag, CountUp, PrimaryButton, Magnetic } from "@/features/career/components/landing/primitives";
import { criSkills, criBenefits, criImprovements } from "@/features/career/services/landingData";
import { useAuth } from "@/features/auth/components/AuthModal";

export default function CareerReadiness() {
  const { openAuth } = useAuth();
  const R = 170;
  const C = 2 * Math.PI * R;
  return (
    <section id="career-readiness" className="relative py-24 lg:py-32" data-testid="career-readiness-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionTag icon={Target}>Career Readiness Index</SectionTag>
          <h2 className="mt-6 text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
            Measure Your <span className="gradient-text-career">Career Readiness.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-600">
            Don't wait until graduation to know whether you're industry-ready. Track your growth continuously.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* LEFT: big CRI circle */}
          <Reveal>
            <div className="flex flex-col items-center">
              <div className="relative h-[300px] w-[300px] sm:h-[380px] sm:w-[380px]">
                <div className="aurora-blob inset-0 h-full w-full bg-gradient-to-br from-blue-400/30 to-green-400/30" />
                <svg viewBox="0 0 400 400" className="relative h-full w-full -rotate-90">
                  <circle cx="200" cy="200" r={R} fill="none" stroke="#E2E8F0" strokeWidth="22" />
                  <motion.circle
                    cx="200" cy="200" r={R} fill="none" stroke="url(#criBig)" strokeWidth="22" strokeLinecap="round"
                    strokeDasharray={C}
                    initial={{ strokeDashoffset: C }}
                    whileInView={{ strokeDashoffset: C * (1 - 0.45) }}
                    viewport={{ once: true }}
                    transition={{ duration: 2, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <defs>
                    <linearGradient id="criBig" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#2563EB" /><stop offset="50%" stopColor="#06B6D4" /><stop offset="100%" stopColor="#22C55E" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 grid place-items-center">
                  <div className="text-center">
                    <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">CRI</p>
                    <p className="text-7xl font-black tracking-tight text-slate-900 sm:text-8xl"><CountUp value={45} /></p>
                    <p className="text-sm font-semibold text-amber-600">Room to grow</p>
                  </div>
                </div>
              </div>

              <div className="mt-10 w-full max-w-md">
                <h3 className="text-xl font-bold text-slate-900">Why Your Career Readiness Score Matters</h3>
                <ul className="mt-5 space-y-3">
                  {criBenefits.map((b, i) => (
                    <motion.li key={b} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="flex items-center gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-green-500 text-white"><Check className="h-3.5 w-3.5" /></span>
                      <span className="text-[15px] text-slate-600">{b}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                  <p className="text-[14px] leading-relaxed text-slate-600">Your CRI updates automatically as you complete learning, projects, assessments and mentorship.</p>
                </div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT: skill bars + improvements */}
          <Reveal delay={0.1}>
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-medium">
              <p className="text-sm font-bold uppercase tracking-widest text-slate-400">Skill Breakdown</p>
              <div className="mt-6 space-y-5">
                {criSkills.map((s, i) => (
                  <div key={s.label}>
                    <div className="mb-2 flex justify-between text-[14px] font-semibold text-slate-700">
                      <span>{s.label}</span><span className="gradient-text">{s.value}%</span>
                    </div>
                    <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                      <motion.div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" initial={{ width: 0 }} whileInView={{ width: `${s.value}%` }} viewport={{ once: true }} transition={{ duration: 1.4, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-2xl bg-slate-50 p-5">
                <p className="flex items-center gap-2 text-sm font-bold text-slate-900"><Lightbulb className="h-4 w-4 text-amber-500" /> Improvement Suggestions</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {criImprovements.map((imp) => (
                    <span key={imp} className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-slate-600">{imp}</span>
                  ))}
                </div>
              </div>

              <Magnetic className="mt-8 block">
                <PrimaryButton onClick={openAuth} className="w-full" data-testid="cri-cta">
                  View Full Career Score <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </PrimaryButton>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
