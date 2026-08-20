import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Compass, GraduationCap, UserCheck, Flame, Briefcase, Sparkles, Trophy, CheckCircle2, Circle, Lock, LogOut, Zap, Award } from "lucide-react";
import { api } from "@/services/api";
import { Logo } from "@/features/career/components/landing/primitives";
import { useAuth } from "@/features/auth/components/AuthModal";
import { toast } from "sonner";

const ICONS = { compass: Compass, "graduation-cap": GraduationCap, "user-check": UserCheck, flame: Flame, briefcase: Briefcase, sparkles: Sparkles, trophy: Trophy };
const TIER_COLORS = {
  Explorer: "from-slate-500 to-slate-600",
  "Rising Star": "from-blue-500 to-cyan-500",
  Achiever: "from-violet-500 to-blue-600",
  Elite: "from-amber-400 to-orange-500",
};

function ScoreRing({ score, tier }) {
  const r = 88, c = 2 * Math.PI * r;
  const [dash, setDash] = useState(c);
  useEffect(() => { const t = setTimeout(() => setDash(c - (score / 100) * c), 300); return () => clearTimeout(t); }, [score, c]);
  return (
    <div className="relative grid place-items-center" data-testid="score-ring">
      <svg width="208" height="208" className="-rotate-90">
        <circle cx="104" cy="104" r={r} fill="none" stroke="#e2e8f0" strokeWidth="14" />
        <defs>
          <linearGradient id="scoreGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2563eb" /><stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx="104" cy="104" r={r} fill="none" stroke="url(#scoreGrad)" strokeWidth="14" strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={dash} style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(0.22,1,0.36,1)" }} />
      </svg>
      <div className="absolute flex flex-col items-center">
        <motion.span initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15, duration: 0.4, type: "spring" }} className="text-5xl font-black text-slate-900" data-testid="score-value">{score}</motion.span>
        <span className="text-sm font-medium text-slate-400">/ 100</span>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const { ready, isAuthed, openAuth, logout } = useAuth();

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
    applications: 0,
    hasCareerPlan: false,
  },
  breakdown: [],
  journey: [],
  nextSteps: [],
});

const [scoreLoading, setScoreLoading] = useState(false);

const fetchScore = async () => {
  try {
    setScoreLoading(true);

    const result = await api.profileScore();

    console.log("PROFILE SCORE RESPONSE:", result);

    setData(result);
  } catch (error) {
    console.error("PROFILE SCORE ERROR:", error);
    console.error("STATUS:", error.response?.status);
    console.error("RESPONSE:", error.response?.data);

    // Keep the profile page usable even if score API doesn't exist yet
    setData({
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
        applications: 0,
        hasCareerPlan: false,
      },
      breakdown: [],
      journey: [],
      nextSteps: [],
    });
  } finally {
    setScoreLoading(false);
  }
};

useEffect(() => {
  if (!ready || !isAuthed) return;

  fetchScore();
}, [ready, isAuthed]);

  // const fetchScore = async () => {
  //   try {
  //     setScoreLoading(true);

  //     const result = await api.profileScore();

  //     console.log("PROFILE SCORE:", result);
  //     setData(result);
  //   } catch (error) {
  //     console.error("PROFILE SCORE ERROR:", error);
  //     console.error("STATUS:", error.response?.status);
  //     console.error("RESPONSE:", error.response?.data);

  //     // IMPORTANT:
  //     // Don't keep the whole page blocked if score API fails.
  //     setData(null);
  //   } finally {
  //     setScoreLoading(false);
  //   }
  // };

  // useEffect(() => {
  //   if (!ready || !isAuthed) return;

  //   fetchScore();
  // }, [ready, isAuthed]);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="noise-overlay" />
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/" className="hidden items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 sm:flex"><ArrowLeft className="h-4 w-4" /> Home</Link>
            {isAuthed && (
              <button onClick={logout} data-testid="profile-logout"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"><LogOut className="h-4 w-4" /> Logout</button>
            )}
          </div>
        </div>
      </header>

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

    <div className="mb-8">
      <h1 className="text-4xl font-black tracking-tight text-slate-900">
        My Profile
      </h1>

      <p className="mt-2 text-slate-600">
        Complete your profile to get better career recommendations.
      </p>
    </div>

    <ProfileEditor />

  


          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {/* Breakdown */}
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
              <h2 className="text-lg font-bold text-slate-900">Score Breakdown</h2>
              <p className="text-sm text-slate-500">What makes up your {data.score}-point score.</p>
              <div className="mt-6 space-y-5">
                {data.breakdown.map((b, i) => {
                  const Icon = ICONS[b.icon] || Sparkles;
                  const pct = Math.round((b.value / b.max) * 100);
                  return (
                    <div key={b.label} data-testid={`breakdown-${i}`}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 font-medium text-slate-700"><Icon className="h-4 w-4 text-blue-600" /> {b.label}</span>
                        <span className="font-bold text-slate-900">{b.value}<span className="font-normal text-slate-400">/{b.max}</span></span>
                      </div>
                      <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ delay: 0.2 + i * 0.1, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Journey */}
            <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
              <h2 className="text-lg font-bold text-slate-900">Your Journey with MyMentor</h2>
              <p className="text-sm text-slate-500">Milestones you've reached and what's next.</p>
              <div className="mt-6 space-y-1">
                {data.journey.map((j, i) => {
                  const Icon = ICONS[j.icon] || Sparkles;
                  return (
                    <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }} className="relative flex gap-4 pb-6 last:pb-0" data-testid={`journey-${i}`}>
                      {i < data.journey.length - 1 && <span className={`absolute left-[19px] top-10 h-full w-0.5 ${j.done ? "bg-blue-200" : "bg-slate-100"}`} />}
                      <span className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ${j.done ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-soft" : "border-2 border-dashed border-slate-200 bg-white text-slate-300"}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <div className="pt-0.5">
                        <div className="flex items-center gap-2">
                          <h3 className={`font-semibold ${j.done ? "text-slate-900" : "text-slate-500"}`}>{j.title}</h3>
                          {j.done ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <Circle className="h-4 w-4 text-slate-300" />}
                        </div>
                        <p className="text-sm text-slate-500">{j.desc}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Next steps CTAs */}
          {data.nextSteps.length > 0 && (
            <div className="mt-8 rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 p-8 sm:p-10">
              <h2 className="text-2xl font-black text-white">Boost your score</h2>
              <p className="mt-2 max-w-xl text-white/90">Complete these next steps to level up your MyMentor Score.</p>
              <div className="mt-6 flex flex-wrap gap-3">
                {!data.stats.hasCareerPlan && <NextCTA to="/career-path" label="Generate career plan" />}
                {data.stats.levelsCompleted === 0 && <NextCTA to="/skillhub" label="Start learning" />}
                {data.stats.applications === 0 && <NextCTA to="/jobs" label="Explore jobs" />}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const Stat = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-2.5 rounded-2xl border border-slate-100 bg-slate-50 px-4 py-2.5">
    <Icon className="h-4 w-4 text-blue-600" />
    <div className="leading-tight"><div className="text-lg font-black text-slate-900">{value}</div><div className="text-[11px] font-medium uppercase tracking-wide text-slate-400">{label}</div></div>
  </div>
);

const NextCTA = ({ to, label }) => (
  <Link to={to} data-testid={`next-cta-${to.replace("/", "")}`} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-semibold text-slate-900 shadow-medium transition-transform hover:scale-105">
    {label}
  </Link>
);

const CATEGORIES = ["School student", "College student", "Working professional"];
const pfield = "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
const PLabel = ({ children }) => <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-400">{children}</label>;

function ProfileEditor() {
  const { user } = useAuth();

  const [p, setP] = useState(null);
  const [saving, setSaving] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const set = (k) => (e) => setP((s) => ({ ...s, [k]: e.target.value }));

useEffect(() => {
  const loadProfile = async () => {
  try {
    setProfileLoading(true);

    const data = await api.getProfile();
    setProfileExists(true);

    console.log("PROFILE API RESPONSE:", data);

    setP({
      ...data,
       name: user?.name ?? "",
      profileCategory: data.profile_category ?? "",
      classYear: data.class_year ?? "",
      careerGoal: data.career_goal ?? "",
      careerInterests: data.career_interests ?? "",
    });

  } catch (error) {
    console.error("PROFILE LOAD ERROR:", error);
    console.error("STATUS:", error.response?.status);
    console.error("RESPONSE:", error.response?.data);

    // If profile does not exist yet,
    // show an empty profile form instead of infinite loading.
   if (error.response?.status === 404) {
    setProfileExists(false);
  setP({
    name: user?.name || "",
    dob: "",
    age: null,
    profileCategory: "",
    education: "",
    classYear: "",
    institution: "",
    careerGoal: "",
    careerInterests: "",
  });
}
  } finally {
    setProfileLoading(false);
  }
};

  loadProfile();
}, [user]);

 const save = async () => {
  setSaving(true);

  try {
    const body = {
      dob: p.dob || null,
      profile_category: p.profileCategory || null,
      education: p.education || null,
      class_year: p.classYear || null,
      institution: p.institution || null,
      career_goal: p.careerGoal || null,
      career_interests: p.careerInterests || null,
    };

    console.log("PROFILE SAVE REQUEST:", body);

    let r;

    if (profileExists) {
      // Profile already exists → UPDATE
      r = await api.updateProfile(body);
    } else {
      // Profile does not exist → CREATE
      r = await api.createProfile(body);
      setProfileExists(true);
    }

    console.log("PROFILE SAVE RESPONSE:", r);

    setP({
      ...r,
      name: user?.name || p.name || "",
      profileCategory: r.profile_category ?? "",
      classYear: r.class_year ?? "",
      careerGoal: r.career_goal ?? "",
      careerInterests: r.career_interests ?? "",
    });

    toast.success("Profile saved successfully");

  } catch (error) {
    console.error("PROFILE SAVE ERROR:", error);
    console.error("STATUS:", error.response?.status);
    console.error("RESPONSE:", error.response?.data);

    toast.error(
      error.response?.data?.detail || "Could not save profile"
    );
  } finally {
    setSaving(false);
  }
};

if (!p) {
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
  return (
    <div className="mt-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-soft" data-testid="profile-editor">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">My Profile</h2>
          <p className="text-sm text-slate-500">Complete your profile to unlock better recommendations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-40">
            <div className="mb-1 flex justify-between text-xs font-medium text-slate-500"><span>Completion</span><span data-testid="profile-completion">{pct}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500" style={{ width: `${pct}%` }} /></div>
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div><PLabel>Full Name</PLabel><input className={pfield} value={p.name || ""} onChange={set("name")} data-testid="profile-name" /></div>
        <div><PLabel>Date of Birth</PLabel><input type="date" className={pfield} value={(p.dob || "").slice(0, 10)} onChange={set("dob")} max={new Date().toISOString().slice(0, 10)} data-testid="profile-dob" /></div>
        <div>
          <PLabel>Profile Category {p.age != null && <span className="text-slate-300">· age {p.age}</span>}</PLabel>
          <select className={pfield} value={p.profileCategory || ""} onChange={set("profileCategory")} data-testid="profile-category">
            <option value="">Select</option>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><PLabel>Class / Year</PLabel><input className={pfield} value={p.classYear || ""} onChange={set("classYear")} placeholder="e.g. Class 12 / 2nd Year" data-testid="profile-classyear" /></div>
        <div><PLabel>School / College</PLabel><input className={pfield} value={p.institution || ""} onChange={set("institution")} data-testid="profile-institution" /></div>
        <div><PLabel>Education Level</PLabel><input className={pfield} value={p.education || ""} onChange={set("education")} placeholder="e.g. Higher Secondary" data-testid="profile-education" /></div>
        <div><PLabel>Career Goal</PLabel><input className={pfield} value={p.careerGoal || ""} onChange={set("careerGoal")} placeholder="e.g. I want to become a Doctor" data-testid="profile-goal" /></div>
        <div><PLabel>Career Interests</PLabel><input className={pfield} value={p.careerInterests || ""} onChange={set("careerInterests")} placeholder="e.g. Medicine, Research" data-testid="profile-interests" /></div>
      </div>

      <button onClick={save} disabled={saving} data-testid="profile-save"
        className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 font-semibold text-white shadow-medium transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60">
        {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Profile"}
      </button>
    </div>
  );
}
