import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Users, BookOpen, Layers, Video, Code2, CheckCircle2, Clock, Activity, TrendingUp, Loader2 } from "lucide-react";
import Shell from "@/features/skillhub/components/Shell";
import { api } from "@/services/api";

const STATS = [
  { key: "totalStudents", label: "Total Students", icon: Users, c: "from-cyan-400 to-blue-500" },
  { key: "activeStudents", label: "Active Students", icon: Activity, c: "from-emerald-400 to-teal-500" },
  { key: "totalCourses", label: "Courses", icon: BookOpen, c: "from-violet-400 to-fuchsia-500" },
  { key: "totalLevels", label: "Levels", icon: Layers, c: "from-amber-400 to-orange-500" },
  { key: "videosUploaded", label: "Videos", icon: Video, c: "from-rose-400 to-pink-500" },
  { key: "codingChallenges", label: "Coding Challenges", icon: Code2, c: "from-cyan-400 to-violet-500" },
  { key: "completedLevels", label: "Completed Levels", icon: CheckCircle2, c: "from-green-400 to-emerald-500" },
  { key: "learningHours", label: "Learning Hours", icon: Clock, c: "from-blue-400 to-indigo-500" },
  { key: "dailyActiveUsers", label: "Daily Active", icon: TrendingUp, c: "from-fuchsia-400 to-purple-500" },
  { key: "monthlyActiveUsers", label: "Monthly Active", icon: TrendingUp, c: "from-teal-400 to-cyan-500" },
];

export default function AdminDashboard() {
  const [a, setA] = useState(null);
  const [students, setStudents] = useState([]);
  useEffect(() => {
    api.analytics().then(setA).catch(() => {});
    api.students().then(setStudents).catch(() => {});
  }, []);
  if (!a) return <Shell><div className="grid h-[60vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div></Shell>;
  return (
    <Shell>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black tracking-tight text-white">Admin Dashboard</h1>
        <p className="mt-2 text-slate-400">Platform overview and learning analytics.</p>
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <motion.div key={s.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <span className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.c} text-white`}><s.icon className="h-5 w-5" /></span>
              <p className="mt-3 text-2xl font-black text-white">{a[s.key]}</p>
              <p className="text-xs text-slate-400">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <h3 className="text-lg font-bold text-white">Recently Active Students</h3>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">
              <thead><tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-slate-500">
                <th className="py-2">Name</th><th>Email</th><th>XP</th><th>Streak</th><th>Levels</th>
              </tr></thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id} className="border-b border-white/5">
                    <td className="py-3 font-semibold text-white">{s.name}</td>
                    <td className="text-slate-400">{s.email}</td>
                    <td className="font-bold text-cyan-400">{s.xp}</td>
                    <td className="text-amber-400">{s.streak}🔥</td>
                    <td className="text-emerald-400">{s.completedLevels}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}
