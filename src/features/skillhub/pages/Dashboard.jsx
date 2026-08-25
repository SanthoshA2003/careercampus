import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Play,
  Zap,
  Flame,
  Trophy,
  Award,
  CheckCircle2,
  ArrowRight,
  Loader2,
  BookOpen,
  Target,
} from "lucide-react";

import Shell from "@/features/skillhub/components/Shell";
import { api } from "@/services/api";

const Card = ({ children, className = "" }) => (
  <div
    className={`rounded-3xl border border-white/5 bg-white/[0.03] p-6 backdrop-blur ${className}`}
  >
    {children}
  </div>
);

export default function Dashboard() {
const [data, setData] = useState(null);
const [enrolledCourses, setEnrolledCourses] = useState([]);
const [loading, setLoading] = useState(true);

const nav = useNavigate();

 useEffect(() => {
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [dashboardResponse, enrolledResponse] =
        await Promise.all([
          api.studentSkillHubDashboard(),
          api.enrolledCourses(),
        ]);

      console.log("Dashboard:", dashboardResponse);
      console.log("Enrolled Courses:", enrolledResponse);

      setData(dashboardResponse);

      setEnrolledCourses(
        Array.isArray(enrolledResponse)
          ? enrolledResponse
          : []
      );

    } catch (error) {
      console.error(
        "Dashboard error:",
        error?.response?.data || error
      );
    } finally {
      setLoading(false);
    }
  };

  fetchDashboard();
}, []);

  if (loading) {
    return (
      <Shell>
        <div className="grid h-[60vh] place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </Shell>
    );
  }

  // API mapping
const course = enrolledCourses.length > 0
  ? enrolledCourses[0]
  : null;
  const achievements = data.achievements || [];
  const recentlyCompleted = data.recently_completed || [];
  const certificates = data.certificates || [];

  return (
    <Shell>
      <div className="mx-auto max-w-6xl space-y-6">

        {/* Continue Learning */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl border border-white/5 bg-gradient-to-br from-cyan-500/15 via-violet-500/10 to-slate-900 p-8"
        >
          <div className="aurora-blob right-[0%] top-[-20%] h-64 w-64 bg-cyan-500/30" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-cyan-300">
                Continue Learning
              </p>

              <h1 className="mt-2 text-3xl font-black tracking-tight text-white">
                {course?.title || "No Course Available"}
              </h1>

              {course ? (
                <p className="mt-2 text-slate-300">
                  {course.difficulty} · {course.stage}
                </p>
              ) : (
                <p className="mt-2 text-slate-400">
                  Start your learning journey.
                </p>
              )}

              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-300">

                <span className="flex items-center gap-1.5">
                  <Zap className="h-4 w-4 fill-current text-cyan-400" />
                  {data.xp ?? 0} XP
                </span>

                <span className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-amber-400" />
                  {data.streak ?? 0} day streak
                </span>

                <span className="flex items-center gap-1.5">
                  <Target className="h-4 w-4 text-emerald-400" />
                  {course?.completed_levels ?? 0}/
                  {course?.total_levels ?? 0} levels
                </span>

              </div>
            </div>

            {course && (
              <button
                onClick={() =>
                  nav(`/skillhub/journey/${course.course_id || course.id}`)
                }
                className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-7 py-4 font-bold text-slate-900 shadow-large transition-transform hover:scale-105"
              >
                <Play className="h-5 w-5 fill-current" />

                {course.progress_percentage === 100
                  ? "View Course"
                  : "Continue"}

                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            )}
          </div>

          {/* Progress Bar */}
          <div className="relative mt-6">
            <div className="mb-1 flex justify-between text-xs font-semibold text-slate-400">
              <span>Course Progress</span>

              <span>
                {course?.progress_percentage ?? 0}%
              </span>
            </div>

            <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${course?.progress_percentage ?? 0}%`,
                }}
                transition={{ duration: 1 }}
              />
            </div>
          </div>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Achievements */}
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <Trophy className="h-5 w-5 text-amber-400" />
              Achievements
            </h3>

            <div className="mt-4 space-y-3">

              {achievements.length === 0 && (
                <p className="text-sm text-slate-500">
                  Complete learning milestones to earn achievements.
                </p>
              )}

              {achievements.map((achievement, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-amber-400/30 bg-amber-400/10 p-3"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-500 text-white">
                    <Trophy className="h-4 w-4" />
                  </span>

                  <span className="text-sm font-semibold text-white">
                    {achievement.label || achievement.name}
                  </span>

                  <CheckCircle2 className="ml-auto h-4 w-4 text-amber-400" />
                </div>
              ))}

            </div>
          </Card>

          {/* Recently Completed */}
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Recently Completed
            </h3>

            <div className="mt-4 space-y-3">

              {recentlyCompleted.length === 0 && (
                <p className="text-sm text-slate-500">
                  Complete a course to see it here.
                </p>
              )}

              {recentlyCompleted.map((courseName, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-500/15 text-emerald-400">
                    <BookOpen className="h-4 w-4" />
                  </span>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-white">
                      {courseName}
                    </p>

                    <p className="text-xs text-slate-400">
                      Completed
                    </p>
                  </div>

                  <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-400" />
                </div>
              ))}

            </div>
          </Card>

          {/* Certificates */}
          <Card>
            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <Award className="h-5 w-5 text-violet-400" />
              Certificates
            </h3>

            <div className="mt-4 space-y-3">

              {certificates.length === 0 && (
                <p className="text-sm text-slate-500">
                  Complete a full stage to earn a certificate.
                </p>
              )}

              {certificates.map((certificate, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 to-cyan-500/10 p-4"
                >
                  <Award className="h-5 w-5 text-violet-300" />

                  <p className="mt-2 text-sm font-bold text-white">
                    {certificate.stage || "Course"} Certificate
                  </p>

                  <p className="text-xs text-slate-400">
                    {certificate.course || ""}
                  </p>
                </div>
              ))}
              {course && (
                <Link
                  to={`/skillhub/journey/${course.course_id || course.id}`}
                  className="mt-2 flex items-center justify-center gap-2 rounded-xl border border-white/10 py-2.5 text-sm font-semibold text-cyan-400 transition-colors hover:bg-white/5"
                >
                  View Full Journey
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}

            </div>
          </Card>

        </div>
      </div>
    </Shell>
  );
}