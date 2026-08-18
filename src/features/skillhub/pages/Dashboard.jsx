import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Zap, Flame, Trophy, Award, CheckCircle2, ArrowRight, Loader2, BookOpen, Target } from "lucide-react";
import Shell from "@/features/skillhub/components/Shell";
import { api } from "@/services/api";

const Card = ({ children, className = "" }) => (
  <div className={`rounded-3xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur ${className}`}>{children}</div>
);

export default function Dashboard() {
  const [data, setData] = useState(null);
  const nav = useNavigate();
  useEffect(() => { api.myProgress().then(setData).catch(() => {}); }, []);

  if (!data) return <Shell><div className="grid h-[60vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div></Shell>;

  const cur = data.currentLevel;
  return (
    <Shell>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Continue learning hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-cyan-500/15 via-violet-500/10 to-slate-900 p-8">
          <div className="aurora-blob right-[0%] top-[-20%] h-64 w-64 bg-cyan-500/30" />
          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">Continue Learning</p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-white">{data.course?.title || "Your Course"}</h1>
              {cur ? (
                <p className="mt-2 text-slate-300">{cur.stage} · Level {cur.levelNumber} — <span className="text-white">{cur.title}</span></p>
              ) : <p className="mt-2 text-emerald-400">🎉 You've completed everything available!</p>}
              <div className="mt-4 flex items-center gap-4 text-sm text-slate-300">
                <span className="flex items-center gap-1.5"><Zap className="h-4 w-4 text-cyan-400 fill-current" /> {data.xp} XP</span>
                <span className="flex items-center gap-1.5"><Flame className="h-4 w-4 text-amber-400" /> {data.streak} day streak</span>
                <span className="flex items-center gap-1.5"><Target className="h-4 w-4 text-emerald-400" /> {data.completedLevels}/{data.totalLevels} levels</span>
              </div>
            </div>
            {cur && (
              <button onClick={() => nav(`/skillhub/level/${cur.id}`)} data-testid="continue-learning-btn"
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-slate-900 shadow-large transition-transform hover:scale-105">
                <Play className="h-5 w-5 fill-current" /> Continue
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>
          {/* progress bar */}
          <div className="relative mt-6">
            <div className="mb-1 flex justify-between text-xs font-semibold text-slate-400"><span>Course Progress</span><span>{data.progressPct}%</span></div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500" initial={{ width: 0 }} animate={{ width: `${data.progressPct}%` }} transition={{ duration: 1 }} />
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Achievements */}
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-bold text-white"><Trophy className="h-5 w-5 text-amber-400" /> Achievements</h3>
            <div className="mt-4 space-y-3">
              {data.achievements.map((a) => (
                <div key={a.label} className={`flex items-center gap-3 rounded-xl border p-3 ${a.unlocked ? "border-amber-400/30 bg-amber-400/10" : "border-white/5 bg-white/[0.02]"}`}>
                  <span className={`grid h-9 w-9 place-items-center rounded-lg ${a.unlocked ? "bg-gradient-to-br from-amber-400 to-orange-500 text-white" : "bg-white/5 text-slate-500"}`}><Trophy className="h-4 w-4" /></span>
                  <span className={`text-sm font-semibold ${a.unlocked ? "text-white" : "text-slate-500"}`}>{a.label}</span>
                  {a.unlocked && <CheckCircle2 className="ml-auto h-4 w-4 text-amber-400" />}
                </div>
              ))}
            </div>
          </Card>

          {/* Recent completed */}
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-bold text-white"><CheckCircle2 className="h-5 w-5 text-emerald-400" /> Recently Completed</h3>
            <div className="mt-4 space-y-3">
              {data.recent.length === 0 && <p className="text-sm text-slate-500">Complete a level to see it here.</p>}
              {data.recent.map((r) => (
                <div key={r.id} className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3">
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400"><BookOpen className="h-4 w-4" /></span>
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-white">{r.title}</p><p className="text-xs text-slate-400">{r.stage}</p></div>
                  <span className="ml-auto text-xs font-bold text-cyan-400">+{r.xp}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Certificates */}
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-bold text-white"><Award className="h-5 w-5 text-violet-400" /> Certificates</h3>
            <div className="mt-4 space-y-3">
              {data.certificates.length === 0 && <p className="text-sm text-slate-500">Complete a full stage to earn a certificate.</p>}
              {data.certificates.map((c, i) => (
                <div key={i} className="rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-cyan-500/10 p-4">
                  <Award className="h-5 w-5 text-violet-300" />
                  <p className="mt-2 text-sm font-bold text-white">{c.stage} Certificate</p>
                  <p className="text-xs text-slate-400">{c.course}</p>
                </div>
              ))}
              <Link to="/skillhub/journey" className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-cyan-400 transition-colors hover:bg-white/5" data-testid="view-journey-link">
                View Full Journey <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </Card>
        </div>
      </div>
    </Shell>
  );
}
