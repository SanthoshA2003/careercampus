import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users,
  BookOpen,
  Layers,
  Video,
  Code2,
  CheckCircle2,
  Activity,
  TrendingUp,
  Loader2,
  Clock,
  Flame,
} from "lucide-react";

import Shell from "@/features/skillhub/components/Shell";
import { api } from "@/services/api";

const STATS = [
  {
    key: "total_students",
    label: "Total Students",
    icon: Users,
    c: "from-blue-400 to-indigo-500",
  },
  {
    key: "active_students",
    label: "Active Students",
    icon: Activity,
    c: "from-emerald-400 to-teal-500",
  },
  {
    key: "total_courses",
    label: "Total Courses",
    icon: BookOpen,
    c: "from-violet-400 to-fuchsia-500",
  },
  {
    key: "total_levels",
    label: "Total Levels",
    icon: Layers,
    c: "from-cyan-400 to-blue-500",
  },
  {
    key: "total_videos",
    label: "Total Videos",
    icon: Video,
    c: "from-pink-400 to-rose-500",
  },
  {
    key: "total_coding_challenges",
    label: "Coding Challenges",
    icon: Code2,
    c: "from-orange-400 to-red-500",
  },
  {
    key: "completed_levels",
    label: "Completed Levels",
    icon: CheckCircle2,
    c: "from-green-400 to-emerald-500",
  },
  {
    key: "learning_hours",
    label: "Learning Hours",
    icon: Clock,
    c: "from-purple-400 to-violet-500",
  },
  {
    key: "daily_active",
    label: "Daily Active",
    icon: TrendingUp,
    c: "from-fuchsia-400 to-purple-500",
  },
  {
    key: "monthly_active",
    label: "Monthly Active",
    icon: Activity,
    c: "from-cyan-400 to-teal-500",
  },
];

export default function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    api
      .skillHubDashboard()
      .then((data) => {
        console.log("Admin Dashboard:", data);
        setDashboard(data);
      })
      .catch((error) => {
        console.error("Dashboard API error:", error);
      });
  }, []);

  if (!dashboard) {
    return (
      <Shell>
        <div className="grid h-[60vh] place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </Shell>
    );
  }

  const students = dashboard.recently_active_students || [];

  return (
    <Shell>
      <div className="mx-auto max-w-6xl">
        <h1 className="text-3xl font-black tracking-tight text-white">
          Admin Dashboard
        </h1>

        <p className="mt-2 text-slate-400">
          Platform overview and learning analytics.
        </p>

        {/* Stats */}
        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {STATS.map((s, i) => (
            <motion.div
              key={s.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-white/5 bg-white/[0.03] p-5"
            >
              <span
                className={`grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br ${s.c} text-white`}
              >
                <s.icon className="h-5 w-5" />
              </span>

              <p className="mt-3 text-2xl font-black text-white">
                {dashboard[s.key] ?? 0}
              </p>

              <p className="text-xs text-slate-400">
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Recently Active Students */}
        <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.03] p-6">
          <h3 className="text-lg font-bold text-white">
            Recently Active Students
          </h3>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[520px] text-sm">

              <thead>
                <tr className="border-b border-white/5 text-left text-xs uppercase tracking-wider text-slate-500">
                  <th className="py-2">Name</th>
                  <th>Email</th>
                  <th>XP</th>
                  <th>Streak</th>
                  <th>Levels</th>
                </tr>
              </thead>

              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="py-8 text-center text-slate-500"
                    >
                      No active students found.
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr
                      key={`${student.email}-${index}`}
                      className="border-b border-white/5"
                    >
                      <td className="py-3 font-semibold text-white">
                        {student.name}
                      </td>

                      <td className="text-slate-400">
                        {student.email}
                      </td>

                      <td className="font-bold text-cyan-400">
                        {student.xp ?? 0}
                      </td>

                      <td className="text-amber-400">
                        {student.streak ?? 0} 🔥
                      </td>

                      <td className="text-emerald-400">
                        {student.levels ?? 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </Shell>
  );
}