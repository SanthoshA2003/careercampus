import { motion } from "framer-motion";
import { Hammer, Clock, Gauge, Trophy, Target, CheckCircle2 } from "lucide-react";
import { Reveal, SectionTag } from "@/features/career/components/landing/primitives";
import { projects } from "@/features/career/services/landingData";

const diffColor = {
  Beginner: "text-emerald-600 bg-emerald-50",
  Intermediate: "text-amber-600 bg-amber-50",
  Advanced: "text-rose-600 bg-rose-50",
};

export default function ProjectsSection() {
  return (
<section
  className="relative overflow-hidden bg-[#0D1B2A] pt-2 pb-24 lg:pt-5 lg:pb-32"
  data-testid="projects-section"
>
        <div className="aurora-blob left-[0%] top-[10%] h-80 w-80 bg-blue-600/25" />
      <div className="aurora-blob right-[0%] bottom-[5%] h-80 w-80 bg-green-500/20" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionTag dark icon={Hammer}>Projects</SectionTag>
          <h2 className="mt-6 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl lg:text-[64px]">
            <span className="text-white">Learn.</span>{" "}
            <span className="text-blue-400">Build.</span>{" "}
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">Score.</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-300">
            Every completed project increases your Career Score and improves your Career Readiness.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {projects.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 4) * 0.06 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur transition-colors hover:bg-white/[0.07]"
              data-testid={`project-${i}`}
            >
              <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-blue-500/40 to-cyan-400/20 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${diffColor[p.difficulty]}`}>{p.difficulty}</span>
                <CheckCircle2 className="h-5 w-5 text-white/20 transition-colors group-hover:text-green-400" />
              </div>
              <h3 className="mt-4 text-[18px] font-bold leading-snug text-white">{p.title}</h3>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {p.skills.map((s) => (
                  <span key={s} className="rounded-md bg-white/10 px-2 py-0.5 text-[11px] font-medium text-slate-200">{s}</span>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-4 text-[12px] text-slate-400">
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {p.duration}</span>
                <span className="flex items-center gap-1"><Gauge className="h-3.5 w-3.5" /> {p.difficulty}</span>
              </div>
              <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4">
                <span className="flex items-center gap-1 rounded-full bg-blue-500/15 px-2.5 py-1 text-[12px] font-bold text-blue-300"><Trophy className="h-3.5 w-3.5" /> +{p.score} Score</span>
                <span className="flex items-center gap-1 rounded-full bg-green-500/15 px-2.5 py-1 text-[12px] font-bold text-green-300"><Target className="h-3.5 w-3.5" /> +{p.readiness} CRI</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
