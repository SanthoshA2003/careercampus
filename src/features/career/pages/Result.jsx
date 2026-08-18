import { motion } from "framer-motion";
import { Target, Compass, User, GitBranch, Gauge, FileText, ArrowRight, Sparkles, BookOpen, Award, CheckCircle2, Building2, MapPin } from "lucide-react";

const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function Result({ result, onContinue }) {
  const r = result;
  return (
    <motion.div initial="hidden" animate="show" transition={{ staggerChildren: 0.08 }}
      className="mx-auto w-full max-w-3xl px-4 py-10">
      <motion.div variants={item} className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300"><Sparkles className="h-3.5 w-3.5" /> Your Career Persona</span>
        <h2 className="mt-4 text-3xl font-black tracking-tight text-white sm:text-4xl">{r.careerPersona}</h2>
        <p className="mt-2 text-slate-400">{r.careerGoal}</p>
      </motion.div>

      {/* top stats */}
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {[
          { icon: Compass, label: "Current Stage", value: r.currentStage },
          { icon: GitBranch, label: "Recommended Stream", value: r.recommendedStream },
          { icon: Gauge, label: "Confidence Score", value: `${r.confidenceScore}%` },
        ].map((s) => (
          <motion.div key={s.label} variants={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <s.icon className="h-5 w-5 text-cyan-400" />
            <p className="mt-3 text-xs text-slate-400">{s.label}</p>
            <p className="text-lg font-bold text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

      {/* overview */}
      <motion.div variants={item} className="mt-4 rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-6">
        <p className="flex items-center gap-2 text-sm font-bold text-white"><FileText className="h-4 w-4 text-cyan-400" /> Career Overview</p>
        <p className="mt-2 text-[15px] leading-relaxed text-slate-300">{r.careerOverview}</p>
      </motion.div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <motion.div variants={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="flex items-center gap-2 text-sm font-bold text-white"><Target className="h-4 w-4 text-emerald-400" /> Recommended Next Step</p>
          <p className="mt-2 text-sm text-slate-300">{r.recommendedNextStep}</p>
          <p className="mt-4 flex items-center gap-2 text-sm font-bold text-white"><BookOpen className="h-4 w-4 text-violet-400" /> Primary Skill</p>
          <p className="mt-2 text-sm text-slate-300">{r.primarySkill}</p>
        </motion.div>
        <motion.div variants={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="flex items-center gap-2 text-sm font-bold text-white"><Award className="h-4 w-4 text-amber-400" /> Target Exams</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {(r.targetExams || []).map((e) => <span key={e} className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-200">{e}</span>)}
          </div>
        </motion.div>
      </div>

      {/* roadmap */}
      <motion.div variants={item} className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
        <p className="flex items-center gap-2 text-sm font-bold text-white"><GitBranch className="h-4 w-4 text-cyan-400" /> Initial Career Roadmap</p>
        <div className="mt-4 space-y-3">
          {(r.roadmap || []).map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-xs font-black text-white">{i + 1}</span>
              <div>
                <p className="text-sm font-bold text-white">{step.title} <span className="font-medium text-slate-500">· {step.phase}</span></p>
                <p className="text-sm text-slate-400">{step.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* college list */}
      {(r.colleges || []).length > 0 && (
        <motion.div variants={item} className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6" data-testid="career-colleges">
          <p className="flex items-center gap-2 text-sm font-bold text-white"><Building2 className="h-4 w-4 text-emerald-400" /> Recommended Colleges <span className="text-xs font-medium text-slate-500">(indicative cutoffs)</span></p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {r.colleges.map((c, i) => (
              <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-4" data-testid={`college-${i}`}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-white">{c.name}</p>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${c.type === "Government" ? "bg-emerald-500/15 text-emerald-300" : "bg-violet-500/15 text-violet-300"}`}>{c.type}</span>
                </div>
                <p className="mt-1 flex items-center gap-1 text-xs text-slate-400"><MapPin className="h-3 w-3" /> {c.location}</p>
                {c.cutoff && <p className="mt-2 text-xs font-semibold text-cyan-300">{c.cutoff}</p>}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* profile completion */}
      <motion.div variants={item} className="mt-4">
        <div className="mb-1 flex justify-between text-xs font-semibold text-slate-400"><span>Profile Completion</span><span>{r.profileCompletion}%</span></div>
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400" initial={{ width: 0 }} animate={{ width: `${r.profileCompletion}%` }} transition={{ duration: 1.2 }} />
        </div>
      </motion.div>

      <motion.button variants={item} onClick={onContinue} data-testid="continue-dashboard-btn"
        className="group mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-4 font-bold text-white shadow-glow transition-transform hover:scale-[1.02]">
        Continue to Dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
      </motion.button>
    </motion.div>
  );
}
