import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Sparkles, GraduationCap, Compass, ClipboardCheck, BookOpen, Building2, Code2, Hammer, LineChart, Target, Briefcase, Award, TrendingUp, Crown, HeartHandshake } from "lucide-react";
import { SectionTag } from "@/features/career/components/landing/primitives";
import { transformationSteps } from "@/features/career/services/landingData";

const icons = [GraduationCap, Compass, ClipboardCheck, BookOpen, Award, Building2, Code2, Hammer, LineChart, Target, Briefcase, Sparkles, TrendingUp, Crown, HeartHandshake];

export default function TransformationTimeline() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start center", "end center"] });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="relative overflow-hidden bg-[#0D1B2A] py-24 lg:py-32" data-testid="transformation-section">
      <div className="aurora-blob left-[-5%] top-[10%] h-96 w-96 bg-blue-600/30" />
      <div className="aurora-blob right-[-5%] bottom-[10%] h-96 w-96 bg-cyan-500/20" />
      <div className="grid-pattern absolute inset-0 opacity-[0.07]" />

      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mx-auto max-w-3xl text-center">
          <SectionTag dark>One Journey</SectionTag>
          <h2 className="mt-6 text-3xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[52px]">
            One Decision.{" "}
            <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 bg-clip-text text-transparent">One Journey. One Transformation.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-300">
            A single career decision made at the right time can completely transform someone's future.
            MyMentor guides learners through every important milestone.
          </p>
        </motion.div>

        {/* Timeline */}
        <div ref={ref} className="relative mx-auto mt-16 max-w-3xl">
          {/* central line */}
          <div className="absolute left-6 top-0 h-full w-px bg-white/10 md:left-1/2 md:-translate-x-1/2">
            <motion.div className="absolute left-0 top-0 w-full origin-top bg-gradient-to-b from-blue-500 via-cyan-400 to-green-400" style={{ scaleY: lineScale, height: "100%" }} />
          </div>

          <div className="space-y-8">
            {transformationSteps.map((step, i) => {
              const Icon = icons[i % icons.length];
              const left = i % 2 === 0;
              return (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: left ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6 }}
                  className={`relative flex items-center gap-5 pl-16 md:pl-0 ${left ? "md:flex-row" : "md:flex-row-reverse"}`}
                >
                  <div className={`hidden md:block md:w-1/2 ${left ? "md:pr-12 md:text-right" : "md:pl-12 md:text-left"}`}>
                    <div className="glass-dark inline-block rounded-2xl px-5 py-4">
                      <p className="text-[12px] font-semibold uppercase tracking-widest text-cyan-300">Milestone {i + 1}</p>
                      <p className="mt-1 text-lg font-bold text-white">{step}</p>
                    </div>
                  </div>

                  {/* node */}
                  <div className="absolute left-6 -translate-x-1/2 md:left-1/2">
                    <motion.span whileInView={{ scale: [0.6, 1] }} viewport={{ once: true }} className="grid h-11 w-11 place-items-center rounded-full border-2 border-[#0D1B2A] bg-gradient-to-br from-blue-500 to-cyan-400 text-white shadow-[0_0_20px_rgba(6,182,212,0.5)]">
                      <Icon className="h-5 w-5" />
                    </motion.span>
                  </div>

                  {/* mobile label */}
                  <div className="md:hidden">
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-cyan-300">Milestone {i + 1}</p>
                    <p className="text-lg font-bold text-white">{step}</p>
                  </div>
                  <div className="hidden md:block md:w-1/2" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
