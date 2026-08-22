import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import {
  ArrowLeft,
  Loader2,
  Compass,
  Award,
  GraduationCap,
  UserCheck,
  Flame,
  Briefcase,
  Sparkles,
  Trophy,
  CheckCircle2,
  Circle,
  Lock,
  LogOut,
  Zap,
} from "lucide-react";

import { api } from "@/services/api";
import { Logo } from "@/features/career/components/landing/primitives";
import { useAuth } from "@/features/auth/components/AuthModal";
import { toast } from "sonner";


// ============================================================
// ICONS
// ============================================================

const ICONS = {
  compass: Compass,
  "graduation-cap": GraduationCap,
  "user-check": UserCheck,
  flame: Flame,
  briefcase: Briefcase,
  sparkles: Sparkles,
  trophy: Trophy,
};


// ============================================================
// TIER COLORS
// ============================================================

const TIER_COLORS = {
  Explorer: "from-slate-500 to-slate-600",

  "Rising Star":
    "from-blue-500 to-cyan-500",

  Achiever:
    "from-violet-500 to-blue-600",

  Elite:
    "from-amber-400 to-orange-500",

  "Career Champion":
    "from-emerald-500 to-teal-600",
};


// ============================================================
// SCORE RING
// ============================================================

function ScoreRing({ score = 0, tier = "Explorer" }) {
  const r = 88;
  const c = 2 * Math.PI * r;

  const [dash, setDash] = useState(c);

  useEffect(() => {
    const safeScore = Math.max(
      0,
      Math.min(100, Number(score) || 0)
    );

    const t = setTimeout(() => {
      setDash(c - (safeScore / 100) * c);
    }, 300);

    return () => clearTimeout(t);
  }, [score, c]);

  const tierClass =
    TIER_COLORS[tier] || TIER_COLORS.Explorer;

  return (
    <div
      className="relative grid place-items-center"
      data-testid="score-ring"
    >
      <svg
        width="208"
        height="208"
        className="-rotate-90"
      >
        <circle
          cx="104"
          cy="104"
          r={r}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth="14"
        />

        <defs>
          <linearGradient
            id="scoreGrad"
            x1="0"
            y1="0"
            x2="1"
            y2="1"
          >
            <stop
              offset="0%"
              stopColor="#2563eb"
            />

            <stop
              offset="100%"
              stopColor="#06b6d4"
            />
          </linearGradient>
        </defs>

        <circle
          cx="104"
          cy="104"
          r={r}
          fill="none"
          stroke="url(#scoreGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={dash}
          style={{
            transition:
              "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)",
          }}
        />
      </svg>

      <div className="absolute flex flex-col items-center">
        <motion.span
          initial={{
            opacity: 0,
            scale: 0.7,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          transition={{
            delay: 0.15,
            duration: 0.4,
            type: "spring",
          }}
          className="text-5xl font-black text-slate-900"
          data-testid="score-value"
        >
          {score}
        </motion.span>

        <span className="text-sm font-medium text-slate-400">
          / 100
        </span>

      </div>
    </div>
  );
}

// ============================================================
// PROFILE PAGE
// ============================================================

export default function ProfilePage() {
  const {
    ready,
    isAuthed,
    openAuth,
    logout,
     user,
  } = useAuth();

  const [data, setData] = useState({
  score: 0,

  tier: "Explorer",

  user: {
    name: "",
    careerGoal: "",
  },

  stats: {
    xp: 0,
    streak: 0,
    levelsCompleted: 0,
    totalLevels: 0,
    applications: 0,
    hasCareerPlan: false,
  },

  breakdown: [],
  journey: [],
  nextSteps: [],
});

const [scoreBreakdown, setScoreBreakdown] = useState(null);

const [breakdownLoading, setBreakdownLoading] =
  useState(false);
  const [scoreLoading, setScoreLoading] =
    useState(false);
const [journeyLoading, setJourneyLoading] = useState(false);

    const fetchScoreBreakdown = async () => {
  try {
    setBreakdownLoading(true);

    const result = await api.scoreBreakdown();

    console.log(
      "SCORE BREAKDOWN RESPONSE:",
      result
    );

    setScoreBreakdown(result);

  } catch (error) {
    console.error(
      "SCORE BREAKDOWN ERROR:",
      error
    );

    toast.error(
      error?.response?.data?.detail ||
      "Unable to load score breakdown"
    );

  } finally {
    setBreakdownLoading(false);
  }
};


  // ==========================================================
  // FETCH PROFILE SCORE
  // ==========================================================

  const fetchScore = async () => {
  try {
    setScoreLoading(true);

    const result = await api.profileScore();

    console.log(
      "PROFILE SUMMARY RESPONSE:",
      result
    );

    setData((prev) => ({
      ...prev,

      score: result?.score ?? 0,

      tier:
        result?.badge ??
        "Explorer",

      user: {
        name:
          result?.name ?? "",

        careerGoal:
          result?.career_goal ?? "",
      },

      stats: {
        xp:
          result?.xp ?? 0,

        streak:
          result?.day_streak ?? 0,

        levelsCompleted:
          result?.completed_levels ?? 0,

        totalLevels:
          result?.total_levels ?? 0,

        applications:
          result?.applications ?? 0,

        hasCareerPlan:
          Boolean(result?.career_goal),
      },
    }));

  } catch (error) {
    console.error(
      "PROFILE SUMMARY ERROR:",
      error
    );

    console.error(
      "STATUS:",
      error?.response?.status
    );

    console.error(
      "RESPONSE:",
      error?.response?.data
    );

    toast.error(
      error?.response?.data?.detail ||
      "Unable to load profile summary."
    );

  } finally {
    setScoreLoading(false);
  }
};

// ==========================================================
// FETCH JOURNEY
// ==========================================================

const fetchJourney = async () => {
  try {
    setJourneyLoading(true);

    const result = await api.journeyWithMyMentor();

    console.log(
      "JOURNEY RESPONSE:",
      result
    );

    setData((prev) => ({
      ...prev,
      journey: result?.journey || [],
    }));

  } catch (error) {

    console.error(
      "JOURNEY ERROR:",
      error
    );

    console.error(
      "STATUS:",
      error?.response?.status
    );

    console.error(
      "RESPONSE:",
      error?.response?.data
    );

    toast.error(
      error?.response?.data?.detail ||
      "Unable to load your journey."
    );

  } finally {
    setJourneyLoading(false);
  }
};


  // ==========================================================
  // LOAD SCORE AFTER AUTH
  // ==========================================================

useEffect(() => {
  if (!ready || !isAuthed) {
    return;
  }

  fetchScore();
  fetchScoreBreakdown();
  fetchJourney();

}, [ready, isAuthed]);

const breakdownItems = scoreBreakdown
  ? [
      {
        label: "Career Clarity",
        icon: Compass,
        value: scoreBreakdown.career_clarity,
        max: scoreBreakdown.career_clarity_max,
      },
      {
        label: "Learning Progress",
        icon: GraduationCap,
        value: scoreBreakdown.learning_progress,
        max: scoreBreakdown.learning_progress_max,
      },
      {
        label: "Profile Completeness",
        icon: UserCheck,
        value: scoreBreakdown.profile_completeness,
        max: scoreBreakdown.profile_completeness_max,
      },
      {
        label: "Consistency",
        icon: Flame,
        value: scoreBreakdown.consistency,
        max: scoreBreakdown.consistency_max,
      },
      {
        label: "Job Readiness",
        icon: Briefcase,
        value: scoreBreakdown.job_readiness,
        max: scoreBreakdown.job_readiness_max,
      },
    ]
  : [];


  // ==========================================================
  // PAGE UI
  // ==========================================================

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      <div className="noise-overlay" />


      {/* ======================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">

        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">

          <Logo />

          <div className="flex items-center gap-3">

            <Link
              to="/"
              className="hidden items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 sm:flex"
            >
              <ArrowLeft className="h-4 w-4" />

              Home
            </Link>


            {isAuthed && (
              <button
                onClick={logout}
                data-testid="profile-logout"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                <LogOut className="h-4 w-4" />

                Logout
              </button>
            )}

          </div>

        </div>

      </header>


      {/* ======================================================
          AUTH / LOADING
      ====================================================== */}

      {!ready ? (

        <div className="grid h-[70vh] place-items-center">

          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

        </div>

      ) : !isAuthed ? (

        <div className="mx-auto grid max-w-md place-items-center px-5 py-32 text-center">

          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-glow">

            <Lock className="h-7 w-7" />

          </span>


          <h1 className="mt-6 text-3xl font-black text-slate-900">
            Your Profile
          </h1>


          <p className="mt-3 text-slate-600">
            Log in to view and edit your profile.
          </p>


          <button
            onClick={() => openAuth()}
            data-testid="profile-login-cta"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3.5 font-semibold text-white shadow-medium"
          >
            Login to continue
          </button>

        </div>

      ) : (

        <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 lg:px-8">

{/* ==================================================
    PROFILE SUMMARY HERO
================================================== */}

<div className="mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-soft lg:p-12">

  <div className="flex flex-col items-center gap-10 lg:flex-row">

    {/* ================= SCORE RING ================= */}

    <div className="shrink-0">

      {scoreLoading ? (

        <div className="grid h-[208px] w-[208px] place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>

      ) : (

        <ScoreRing
          score={data.score}
          tier={data.tier}
        />

      )}

    </div>


    {/* ================= PROFILE INFO ================= */}

    <div className="flex-1 text-center lg:text-left">

      {/* Badge */}

     <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#334155] px-4 py-2 text-sm font-semibold text-white shadow-sm">
  <Award className="h-4 w-4 stroke-[2]" />
  <span>{data.tier || "Explorer"}</span>
</div>


      {/* Welcome */}

     <h1 className="text-4xl font-black tracking-tight text-slate-900">
  Hey {user?.name || data.user?.name || "there"} 👋
</h1>


      {/* Description */}

      <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 lg:text-lg">

        {data.user?.careerGoal
          ? `You're on your journey to become a ${data.user.careerGoal}. Here's your MyMentor Score and how far you've come with us.`
          : "Set a career goal to boost your clarity. Here's your MyMentor Score and how far you've come with us."
        }

      </p>


      {/* ================= STATS ================= */}

      <div className="mt-7 grid grid-cols-2 gap-3 sm:grid-cols-4">

        

        <HeroStat
          icon={Zap}
          value={data.stats.xp}
          label="XP"
        />

        <HeroStat
          icon={Flame}
          value={data.stats.streak}
          label="DAY STREAK"
        />

        <HeroStat
          icon={GraduationCap}
          value={`${data.stats.levelsCompleted}/${data.stats.totalLevels}`}
          label="LEVELS"
        />

        <HeroStat
          icon={Briefcase}
          value={data.stats.applications}
          label="APPLICATIONS"
        />

      </div>

    </div>

  </div>
  

</div>


          
           {/* ==================================================
              PROFILE EDITOR
          ================================================== */}

          <ProfileEditor />
          
          {/* ==================================================
              BREAKDOWN + JOURNEY
          ================================================== */}

          <div className="mt-8 grid gap-8 lg:grid-cols-2">

            {/* ==================================================
                SCORE BREAKDOWN
            ================================================== */}

            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">

              <h2 className="text-lg font-bold text-slate-900">
                Score Breakdown
              </h2>

              <p className="text-sm text-slate-500">
                What makes up your {data.score}-point score.
              </p>


            <div className="mt-6 space-y-5">

  {breakdownLoading ? (

    <div className="grid h-64 place-items-center">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>

  ) : breakdownItems.length === 0 ? (

    <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
      Complete your profile and start your career journey to build your score.
    </div>

  ) : (

    breakdownItems.map((b, i) => {

      const Icon = b.icon;

      const value = Number(b.value) || 0;
      const max = Number(b.max) || 1;

      const pct = Math.min(
        100,
        Math.round((value / max) * 100)
      );

      return (
        <div
          key={b.label}
          data-testid={`breakdown-${i}`}
        >

          <div className="mb-1.5 flex items-center justify-between text-sm">

            <span className="flex items-center gap-2 font-medium text-slate-700">

              <Icon className="h-4 w-4 text-blue-600" />

              {b.label}

            </span>

            <span className="font-bold text-slate-900">

              {value}

              <span className="font-normal text-slate-400">
                /{max}
              </span>

            </span>

          </div>

          <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{
                delay: 0.2 + i * 0.1,
                duration: 0.9,
              }}
              className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
            />

          </div>

        </div>
      );
    })

  )}

</div>
                    {/* return (
                      <div
                        key={b.label || i}
                        data-testid={`breakdown-${i}`}
                      >

                        <div className="mb-1.5 flex items-center justify-between text-sm">

                          <span className="flex items-center gap-2 font-medium text-slate-700">

                            <Icon className="h-4 w-4 text-blue-600" />

                            {b.label}

                          </span>


                          <span className="font-bold text-slate-900">

                            {value}

                            <span className="font-normal text-slate-400">
                              /{max}
                            </span>

                          </span>

                        </div>


                        <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">

                          <motion.div
                            initial={{
                              width: 0,
                            }}
                            animate={{
                              width: `${pct}%`,
                            }}
                            transition={{
                              delay:
                                0.2 +
                                i * 0.1,
                              duration: 0.9,
                              ease: [
                                0.22,
                                1,
                                0.36,
                                1,
                              ],
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                          />

                        </div>

                      </div>
                    );
                  })

                )}

              </div> */}

            </div>


            {/* ==================================================
                JOURNEY
            ================================================== */}

          <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">

  <h2 className="text-lg font-bold text-slate-900">
    Your Journey with MyMentor
  </h2>

  <p className="text-sm text-slate-500">
    Milestones you've reached and what's next.
  </p>

  <div className="mt-6 space-y-1">

    {journeyLoading ? (

      <div className="grid h-64 place-items-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>

    ) : data.journey.length === 0 ? (

      <div className="rounded-2xl bg-slate-50 p-5 text-sm text-slate-500">
        Your journey milestones will appear here as you progress.
      </div>

    ) : (

      data.journey.map((j, i) => {

        const Icon = ICONS[j.icon] || Sparkles;

        return (
          <motion.div
            key={j.key || i}
            initial={{
              opacity: 0,
              x: -12,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              delay: 0.15 + i * 0.08,
            }}
            className="relative flex gap-4 pb-6 last:pb-0"
            data-testid={`journey-${i}`}
          >

            {/* CONNECTING LINE */}
            {i < data.journey.length - 1 && (
              <span
                className={`absolute left-[19px] top-10 h-full w-0.5 ${
                  j.done
                    ? "bg-blue-200"
                    : "bg-slate-100"
                }`}
              />
            )}

            {/* ICON */}
            <span
              className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                j.done
                  ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-soft"
                  : "border-2 border-dashed border-slate-200 bg-white text-slate-300"
              }`}
            >
              <Icon className="h-5 w-5" />
            </span>

            {/* CONTENT */}
            <div className="pt-0.5">

              <div className="flex items-center gap-2">

                <h3
                  className={`font-semibold ${
                    j.done
                      ? "text-slate-900"
                      : "text-slate-500"
                  }`}
                >
                  {j.title}
                </h3>

                {j.done ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <Circle className="h-4 w-4 text-slate-300" />
                )}

              </div>

              <p className="text-sm text-slate-500">
                {j.description}
              </p>

            </div>

          </motion.div>
        );
      })

    )}

  </div>

</div>
                    {/* const Icon =
                      ICONS[j.icon] ||
                      Sparkles;

                    return (
                      <motion.div
                        key={i}
                        initial={{
                          opacity: 0,
                          x: -12,
                        }}
                        animate={{
                          opacity: 1,
                          x: 0,
                        }}
                        transition={{
                          delay:
                            0.15 +
                            i * 0.08,
                        }}
                        className="relative flex gap-4 pb-6 last:pb-0"
                        data-testid={`journey-${i}`}
                      >

                        {i <
                          data.journey.length -
                            1 && (
                          <span
                            className={`absolute left-[19px] top-10 h-full w-0.5 ${
                              j.done
                                ? "bg-blue-200"
                                : "bg-slate-100"
                            }`}
                          />
                        )}


                        <span
                          className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ${
                            j.done
                              ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-soft"
                              : "border-2 border-dashed border-slate-200 bg-white text-slate-300"
                          }`}
                        >

                          <Icon className="h-5 w-5" />

                        </span>


                        <div className="pt-0.5">

                          <div className="flex items-center gap-2">

                            <h3
                              className={`font-semibold ${
                                j.done
                                  ? "text-slate-900"
                                  : "text-slate-500"
                              }`}
                            >
                              {j.title}
                            </h3>


                            {j.done ? (

                              <CheckCircle2 className="h-4 w-4 text-emerald-500" />

                            ) : (

                              <Circle className="h-4 w-4 text-slate-300" />

                            )}

                          </div>


                          <p className="text-sm text-slate-500">
                            {j.description}
                          </p>

                        </div>

                      </motion.div>
                    );
                  })

                )} */}

              </div>

          


          {/* ==================================================
              NEXT STEPS
          ================================================== */}

        {(
  !data.stats.hasCareerPlan ||
  data.stats.levelsCompleted === 0 ||
  data.stats.applications === 0
) && (

  <div className="mt-8 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 p-8 sm:p-10">

              <h2 className="text-2xl font-black text-white">
                Boost your score
              </h2>

              <p className="mt-2 max-w-xl text-white/90">
                Complete these next steps to level up your MyMentor Score.
              </p>


              <div className="mt-6 flex flex-wrap gap-3">

                  <NextCTA
                    to="/career-path"
                    label="Generate career plan"
                  />
            

                {data.stats.levelsCompleted === 0 && (
                  <NextCTA
                    to="/skillhub"
                    label="Start learning"
                  />
                )}


                {data.stats.applications === 0 && (
                  <NextCTA
                    to="/jobs"
                    label="Explore jobs"
                  />
                )}

              </div>

            </div>

          )}

        </div>
      )}

    </div>
  );
}


// ============================================================
// HERO STAT COMPONENT
// ============================================================

const HeroStat = ({
  icon: Icon,
  value,
  label,
}) => (
  <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

    <div className="flex h-9 w-9 items-center justify-center">
      <Icon className="h-5 w-5 text-blue-600" />
    </div>

    <div className="min-w-0 text-left">

      <div className="text-lg font-black leading-tight text-slate-900">
        {value}
      </div>

      <div className="mt-1 whitespace-nowrap text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </div>

    </div>

  </div>
);




// ============================================================
// STAT COMPONENT
// ============================================================

const Stat = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5">

    <Icon className="h-4 w-4 text-blue-600" />

    <div className="leading-tight">

      <div className="text-lg font-black text-slate-900">
        {value}
      </div>

      <div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">
        {label}
      </div>

    </div>

  </div>
);


// ============================================================
// NEXT CTA
// ============================================================

const NextCTA = ({
  to,
  label,
}) => (
  <Link
    to={to}
    data-testid={`next-cta-${to.replace("/", "")}`}
    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-medium transition-transform hover:scale-105"
  >
    {label}
  </Link>
);


// ============================================================
// PROFILE CONSTANTS
// ============================================================

const CATEGORIES = [
  "School student",
  "College student",
  "Working professional",
];


const pfield =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-100";


const PLabel = ({
  children,
}) => (
  <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">
    {children}
  </label>
);


// ============================================================
// PROFILE EDITOR
// ============================================================

function ProfileEditor() {
  const { user } = useAuth();

  const [p, setP] = useState(null);

  const [saving, setSaving] =
    useState(false);

  const [profileLoading, setProfileLoading] =
    useState(true);

  const [profileExists, setProfileExists] =
    useState(false);


  // ==========================================================
  // FIELD SETTER
  // ==========================================================

  const set = (key) => (e) => {
    setP((state) => ({
      ...state,
      [key]: e.target.value,
    }));
  };


  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  useEffect(() => {

    const loadProfile = async () => {

      try {

        setProfileLoading(true);

        const data =
          await api.getProfile();

        console.log(
          "PROFILE API RESPONSE:",
          data
        );


        setProfileExists(true);


        setP({
          ...data,

          name:
            user?.name ?? "",

          dob:
            data?.dob ?? "",

          age:
            data?.age ?? null,

          profileCategory:
            data?.profile_category ?? "",

          education:
            data?.education ?? "",

          classYear:
            data?.class_year ?? "",

          institution:
            data?.institution ?? "",

          careerGoal:
            data?.career_goal ?? "",

          careerInterests:
            data?.career_interests ?? "",
        });

      } catch (error) {

        console.error(
          "PROFILE LOAD ERROR:",
          error
        );

        console.error(
          "STATUS:",
          error?.response?.status
        );

        console.error(
          "RESPONSE:",
          error?.response?.data
        );


        // ====================================================
        // PROFILE DOES NOT EXIST
        // ====================================================

        if (
          error?.response?.status === 404
        ) {

          setProfileExists(false);


          setP({
            name:
              user?.name || "",

            dob: "",

            age: null,

            profileCategory: "",

            education: "",

            classYear: "",

            institution: "",

            careerGoal: "",

            careerInterests: "",
          });

        } else {

          toast.error(
            error?.response?.data?.detail ||
              "Unable to load profile."
          );

        }

      } finally {

        setProfileLoading(false);

      }

    };


    if (user) {
      loadProfile();
    }

  }, [user]);


  // ==========================================================
  // PROFILE SAVE
  // ==========================================================

  const save = async () => {

    if (!p) {
      return;
    }


    setSaving(true);


    try {

      const body = {

        dob:
          p.dob || null,

        profile_category:
          p.profileCategory || null,

        education:
          p.education || null,

        class_year:
          p.classYear || null,

        institution:
          p.institution || null,

        career_goal:
          p.careerGoal || null,

        career_interests:
          p.careerInterests || null,
      };


      console.log(
        "PROFILE SAVE REQUEST:",
        body
      );


      let response;


      // ======================================================
      // UPDATE EXISTING PROFILE
      // ======================================================

      if (profileExists) {

        response =
          await api.updateProfile(body);

      }

      // ======================================================
      // CREATE NEW PROFILE
      // ======================================================

      else {

        response =
          await api.createProfile(body);

        setProfileExists(true);

      }


      console.log(
        "PROFILE SAVE RESPONSE:",
        response
      );


      // ======================================================
      // UPDATE LOCAL STATE
      // ======================================================

      setP({

        ...response,

        name:
          user?.name ||
          p.name ||
          "",

        dob:
          response?.dob ?? "",

        age:
          response?.age ?? null,

        profileCategory:
          response?.profile_category ?? "",

        education:
          response?.education ?? "",

        classYear:
          response?.class_year ?? "",

        institution:
          response?.institution ?? "",

        careerGoal:
          response?.career_goal ?? "",

        careerInterests:
          response?.career_interests ?? "",
      });


      toast.success(
        profileExists
          ? "Profile updated successfully"
          : "Profile created successfully"
      );


      } catch (error) {

    console.error(
      "PROFILE SAVE ERROR:",
      error
    );

    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      "Could not save profile";

    toast.error(message);

  } finally {
    setSaving(false);
  }
};
// ==========================================================
// PROFILE LOADING
// ==========================================================

if (profileLoading || !p) {
  return (
    <div className="mt-8 grid min-h-[300px] place-items-center rounded-3xl border border-slate-100 bg-white shadow-soft">
      <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
    </div>
  );
}
const profileFields = [
  p.dob,
  p.profileCategory,
  p.education,
  p.classYear,
  p.institution,
  p.careerGoal,
  p.careerInterests,
];

const completedFields = profileFields.filter(
  (value) => value && String(value).trim() !== ""
);

const pct = Math.round(
  (completedFields.length / profileFields.length) * 100
);

  // if (profileLoading || !p) {

  //   return (
  //     <div className="mt-8 grid min-h-[300px] place-items-center rounded-3xl border border-slate-100 bg-white shadow-soft">

  //       <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

  //     </div>
  //   );

  // }


  // ==========================================================
  // PROFILE COMPLETION
  // ==========================================================

  // const profileFields = [
  //   p.dob,
  //   p.profileCategory,
  //   p.education,
  //   p.classYear,
  //   p.institution,
  //   p.careerGoal,
  //   p.careerInterests,
  // ];

  


  // const completedFields =
  //   profileFields.filter(
  //     (value) =>
  //       value &&
  //       String(value).trim() !== ""
  //   );


  // const pct = Math.round(
  //   (completedFields.length /
  //     profileFields.length) *
  //     100
  // );


  // // ==========================================================
  // // PROFILE EDITOR UI
  // // ==========================================================

  return (
    <div
      className="mt-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-soft"
      data-testid="profile-editor"
    >

      {/* ====================================================
          HEADER
      ==================================================== */}

      <div className="flex flex-wrap items-center justify-between gap-4">

        <div>

          <h2 className="text-lg font-bold text-slate-900">
            My Profile
          </h2>

          <p className="text-sm text-slate-500">
            Complete your profile to unlock better recommendations.
          </p>

        </div>


        {/* ==================================================
            COMPLETION
        ================================================== */}

        <div className="flex items-center gap-3">

          <div className="w-40">

            <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">

              <span>
                Completion
              </span>

              <span data-testid="profile-completion">
                {pct}%
              </span>

            </div>


            <div className="h-2 overflow-hidden rounded-full bg-slate-100">

              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                style={{
                  width: `${pct}%`,
                }}
              />

            </div>

          </div>

        </div>

      </div>


      {/* ====================================================
          PROFILE FORM
      ==================================================== */}

      <div className="mt-6 grid gap-5 sm:grid-cols-2">


        {/* ==================================================
            FULL NAME
        ================================================== */}

        <div>

          <PLabel>
            Full Name
          </PLabel>

          <input
            className={pfield}
            value={p.name || ""}
            onChange={set("name")}
            data-testid="profile-name"
            disabled
          />

        </div>


        {/* ==================================================
            DATE OF BIRTH
        ================================================== */}

        <div>

          <PLabel>
            Date of Birth
          </PLabel>

          <input
            type="date"
            className={pfield}
            value={
              (p.dob || "").slice(0, 10)
            }
            onChange={set("dob")}
            max={
              new Date()
                .toISOString()
                .slice(0, 10)
            }
            data-testid="profile-dob"
          />

        </div>


        {/* ==================================================
            PROFILE CATEGORY
        ================================================== */}

        <div>

          <PLabel>
            Profile Category{" "}

            {p.age != null && (
              <span className="text-slate-300">
                · age {p.age}
              </span>
            )}

          </PLabel>


          <select
            className={pfield}
            value={
              p.profileCategory || ""
            }
            onChange={set("profileCategory")}
            data-testid="profile-category"
          >

            <option value="">
              Select
            </option>

            {CATEGORIES.map(
              (category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              )
            )}

          </select>

        </div>


        {/* ==================================================
            CLASS / YEAR
        ================================================== */}

        <div>

          <PLabel>
            Class / Year
          </PLabel>

          <input
            className={pfield}
            value={
              p.classYear || ""
            }
            onChange={set("classYear")}
            placeholder="e.g. Class 12 / 2nd Year"
            data-testid="profile-classyear"
          />

        </div>


        {/* ==================================================
            SCHOOL / COLLEGE
        ================================================== */}

        <div>

          <PLabel>
            School / College
          </PLabel>

          <input
            className={pfield}
            value={
              p.institution || ""
            }
            onChange={set("institution")}
            data-testid="profile-institution"
          />

        </div>


        {/* ==================================================
            EDUCATION LEVEL
        ================================================== */}

        <div>

          <PLabel>
            Education Level
          </PLabel>

          <input
            className={pfield}
            value={
              p.education || ""
            }
            onChange={set("education")}
            placeholder="e.g. Higher Secondary"
            data-testid="profile-education"
          />

        </div>


        {/* ==================================================
            CAREER GOAL
        ================================================== */}

        <div>

          <PLabel>
            Career Goal
          </PLabel>

          <input
            className={pfield}
            value={
              p.careerGoal || ""
            }
            onChange={set("careerGoal")}
            placeholder="e.g. I want to become a Doctor"
            data-testid="profile-goal"
          />

        </div>


        {/* ==================================================
            CAREER INTERESTS
        ================================================== */}

        <div>

          <PLabel>
            Career Interests
          </PLabel>

          <input
            className={pfield}
            value={
              p.careerInterests || ""
            }
            onChange={set("careerInterests")}
            placeholder="e.g. Medicine, Research"
            data-testid="profile-interests"
          />

        </div>

      </div>


      {/* ====================================================
          SAVE PROFILE
      ==================================================== */}

      <button
        onClick={save}
        disabled={saving}
        data-testid="profile-save"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 font-semibold text-white shadow-medium transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
      >

        {saving ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />

            Saving...
          </>
        ) : (
          <>
            {profileExists
              ? "Update Profile"
              : "Save Profile"}
          </>
        )}

      </button>

    </div>
  );
}

