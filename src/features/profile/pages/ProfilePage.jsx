import { useEffect, useState, useRef } from "react";
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
  Pencil,
  Camera,
  X,
  Trash2,
  Upload,
  Plus,
  MapPin,
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
  "Rising Star": "from-blue-500 to-cyan-500",
  Achiever: "from-violet-500 to-blue-600",
  Elite: "from-amber-400 to-orange-500",
  "Career Champion": "from-emerald-500 to-teal-600",
};


// ============================================================
// PROFILE CATEGORIES
// ============================================================

const CATEGORIES = [
  {
    value: "School student",
    label: "School Student",
  },
  {
    value: "College student",
    label: "College Student",
  },
  {
    value: "Working professional",
    label: "Working Professional",
  },
];


// ============================================================
// COMMON FIELD STYLE
// ============================================================

const pfield =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[15px] text-slate-900 outline-none transition-colors focus:border-blue-500 focus:ring-4 focus:ring-blue-100 disabled:bg-slate-50";

// ============================================================
// PROFILE LABEL
// ============================================================

function PLabel({ children }) {
  return (
    <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
      {children}
    </label>
  );
}


// ============================================================
// SCORE RING
// ============================================================
function ScoreRing({
  score = 0,
  tier = "Explorer",
  photoUrl = "",
  name = "",
  uploading = false,
  onPhotoChange,
}) {
  const r = 88;
  const c = 2 * Math.PI * r;

  const [dash, setDash] = useState(c);

  const fileInputRef = useRef(null);

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

  const initial =
    name?.trim()?.charAt(0)?.toUpperCase() || "A";

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      await onPhotoChange(file);
    } finally {
      event.target.value = "";
    }
  };

  return (
    <div
      className="flex shrink-0 flex-col items-center"
      data-testid="score-ring"
    >

      {/* =====================================================
          SCORE RING + PHOTO
      ===================================================== */}

      <div className="relative h-[208px] w-[208px]">

        {/* Score ring */}
        <svg
          width="208"
          height="208"
          className="absolute inset-0 -rotate-90"
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

        {/* =================================================
            PHOTO
        ================================================= */}

        <div
          className="
            absolute
            inset-[18px]
            overflow-hidden
            rounded-full
            border-4
            border-white
            bg-gradient-to-br
            from-blue-600
            to-cyan-500
            shadow-lg
          "
        >

          {photoUrl ? (
            <img
              src={photoUrl}
              alt="Profile"
              className="h-full w-full object-cover"
              onError={(event) => {
                console.error(
                  "PROFILE PHOTO IMAGE LOAD ERROR:",
                  photoUrl
                );

                event.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div
              className="
                grid
                h-full
                w-full
                place-items-center
                text-5xl
                font-black
                text-white
              "
            >
              {initial}
            </div>
          )}

          {/* Upload loading */}
          {uploading && (
            <div
              className="
                absolute
                inset-0
                grid
                place-items-center
                bg-slate-900/50
              "
            >
              <Loader2
                className="
                  h-8
                  w-8
                  animate-spin
                  text-white
                "
              />
            </div>
          )}
        </div>

        {/* =================================================
            CAMERA BUTTON
        ================================================= */}

        <button
          type="button"
          onClick={() =>
            fileInputRef.current?.click()
          }
          disabled={uploading}
          title={
            photoUrl
              ? "Change profile photo"
              : "Add profile photo"
          }
          aria-label={
            photoUrl
              ? "Change profile photo"
              : "Add profile photo"
          }
          className="
            absolute
            bottom-2
            right-2
            z-20
            grid
            h-10
            w-10
            place-items-center
            rounded-full
            border-4
            border-white
            bg-blue-600
            text-white
            shadow-lg
            transition
            hover:scale-105
            hover:bg-blue-700
            disabled:cursor-not-allowed
            disabled:opacity-70
          "
        >
          {uploading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Camera className="h-5 w-5" />
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />

      </div>

      {/* =====================================================
          SCORE
      ===================================================== */}

      <div className="mt-4 text-center">

        <motion.div
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
          className="
            text-5xl
            font-black
            leading-none
            text-slate-900
          "
        >
          {score}
        </motion.div>

        <div className="mt-1 text-sm font-medium text-slate-400">
          / 100
        </div>

      </div>

    </div>
  );
}


// ============================================================
// HERO STAT
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
// PROFILE VALUE
// ============================================================

function ProfileValue({
  label,
  value,
}) {
  return (
    <div className="min-w-0">
      <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-slate-400">
        {label}
      </div>

      <div className="break-words text-[15px] font-medium text-slate-800">
        {value || "—"}
      </div>
    </div>
  );
}


// ============================================================
// PROFILE PAGE
// ============================================================ 

export default function ProfilePage() {
  const [workExperience, setWorkExperience] = useState(null);
  const [workExperienceLoading, setWorkExperienceLoading] = useState(false);
  const [workExperienceError, setWorkExperienceError] = useState("");

  // your existing states...

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

  const [scoreBreakdown, setScoreBreakdown] =
    useState(null);
  const [photoUrl, setPhotoUrl] = useState("");
  const [photoUploading, setPhotoUploading] = useState(false);




  const [breakdownLoading, setBreakdownLoading] =
    useState(false);

  const [scoreLoading, setScoreLoading] =
    useState(false);

  const [journeyLoading, setJourneyLoading] =
    useState(false);

  // ==========================================================
  // PROFILE PHOTO
  // ==========================================================

  const loadProfilePhoto = async () => {
    try {
      const profile = await api.getProfile();

      console.log(
        "PROFILE PHOTO LOAD RESPONSE:",
        profile
      );

      const returnedPhoto =
        profile?.profile_photo_url ||
        profile?.profilePhotoUrl ||
        profile?.photo_url ||
        profile?.photoUrl ||
        profile?.profile_photo ||
        profile?.photo ||
        profile?.file_url ||
        profile?.fileUrl ||
        profile?.url ||
        "";

      setPhotoUrl(returnedPhoto || "");

    } catch (error) {

      if (error?.response?.status !== 404) {
        console.warn(
          "PROFILE PHOTO LOAD ERROR:",
          error
        );
      }

    }
  };
  
// ============================================================
// FETCH WORK EXPERIENCE
// ============================================================
const fetchWorkExperience = async () => {
  try {
    setWorkExperienceLoading(true);
    setWorkExperienceError("");

    // IMPORTANT:
    // api.js already contains getWorkExperiences()
    // which calls GET /work-experiences/me
    const response = await api.getWorkExperiences();

    console.log(
      "WORK EXPERIENCE GET RESPONSE:",
      response
    );

    // API returns an array
    const experiences = Array.isArray(response)
      ? response
      : response
        ? [response]
        : [];

    setWorkExperience(experiences[0] || null);

    return experiences[0] || null;

  } catch (error) {
    console.error(
      "WORK EXPERIENCE FETCH ERROR:",
      error?.response?.status,
      error?.response?.data || error?.message
    );

    setWorkExperience(null);

    setWorkExperienceError(
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      "Unable to load work experience."
    );

    return null;

  } finally {
    setWorkExperienceLoading(false);
  }
};
  // ============================================================
  // PROFILE PHOTO UPLOAD
  // ============================================================

  const uploadProfilePhoto = async (file) => {
    if (!file) return;

    // Validate image
    if (!file.type?.startsWith("image/")) {
      toast.error("Please select an image file.");
      return;
    }

    // Max 5 MB
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile photo must be smaller than 5MB.");
      return;
    }

    try {
      setPhotoUploading(true);

      console.log("PROFILE PHOTO REQUEST:", {
        fileName: file.name,
        type: file.type,
        size: file.size,
        existingPhoto: Boolean(photoUrl),
      });

      let result;

      // --------------------------------------------------------
      // FIRST PHOTO
      // POST /api/files/profile-photo
      // --------------------------------------------------------

      if (!photoUrl) {
        result = await api.uploadProfilePhoto(file);
      }

      // --------------------------------------------------------
      // REPLACE EXISTING PHOTO
      // PUT /api/files/profile-photo
      // --------------------------------------------------------

      else {
        result = await api.updateProfilePhoto(file);
      }

      console.log("PROFILE PHOTO RESPONSE:", result);

      // Backend response:
      //
      // {
      //   id: "...",
      //   file_name: "...",
      //   file_url: "https://res.cloudinary.com/...",
      //   content_type: "image/jpeg",
      //   size: 256464
      // }

      const newPhoto =
        result?.file_url ||
        result?.fileUrl ||
        result?.url ||
        result?.photo_url ||
        result?.profile_photo_url ||
        result?.profilePhotoUrl ||
        "";

      if (!newPhoto) {
        throw new Error(
          "Photo uploaded, but image URL was not returned by the server."
        );
      }

      // Show newly uploaded Cloudinary image immediately
      setPhotoUrl(newPhoto);

      toast.success(
        photoUrl
          ? "Profile photo updated successfully."
          : "Profile photo uploaded successfully."
      );

    } catch (error) {
      console.error("PROFILE PHOTO UPLOAD ERROR:", error);

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.message ||
        "Unable to upload profile photo.";

      toast.error(message);

    } finally {
      setPhotoUploading(false);
    }
  };

 

  // ==========================================================
  // FETCH SCORE BREAKDOWN
  // ==========================================================

  const fetchScoreBreakdown = async () => {
    try {
      setBreakdownLoading(true);

      const result =
        await api.scoreBreakdown();

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

      const result =
        await api.profileScore();

      setData((prev) => ({
        ...prev,

        score: result?.score ?? 0,

        tier:
          result?.badge ||
          "Explorer",

        user: {
          name:
            result?.name || "",

          careerGoal:
            result?.career_goal || "",
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

      const result =
        await api.journeyWithMyMentor();

      setData((prev) => ({
        ...prev,
        journey:
          result?.journey || [],
      }));
    } catch (error) {
      console.error(
        "JOURNEY ERROR:",
        error
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
  // LOAD DATA
  // ==========================================================

  useEffect(() => {
    if (!ready || !isAuthed) {
      return;
    }

    fetchScore();
    fetchScoreBreakdown();
    fetchJourney();
    loadProfilePhoto();
    fetchWorkExperience();
  }, [ready, isAuthed]);


  // ==========================================================
  // SCORE BREAKDOWN ITEMS
  // ==========================================================

  const breakdownItems = scoreBreakdown
    ? [
      {
        label: "Career Clarity",
        icon: Compass,
        value:
          scoreBreakdown.career_clarity,
        max:
          scoreBreakdown.career_clarity_max,
      },
      {
        label: "Learning Progress",
        icon: GraduationCap,
        value:
          scoreBreakdown.learning_progress,
        max:
          scoreBreakdown.learning_progress_max,
      },
      {
        label: "Profile Completeness",
        icon: UserCheck,
        value:
          scoreBreakdown.profile_completeness,
        max:
          scoreBreakdown.profile_completeness_max,
      },
      {
        label: "Consistency",
        icon: Flame,
        value:
          scoreBreakdown.consistency,
        max:
          scoreBreakdown.consistency_max,
      },
      {
        label: "Job Readiness",
        icon: Briefcase,
        value:
          scoreBreakdown.job_readiness,
        max:
          scoreBreakdown.job_readiness_max,
      },
    ]
    : [];

  // ==========================================================
  // PAGE
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
              SCORE / PROFILE HERO
          ================================================== */}

          <div className="mt-8 overflow-hidden rounded-3xl border border-slate-100 bg-white p-8 shadow-soft lg:p-12">

            <div className="flex flex-col items-center gap-10 lg:flex-row">

              {/* SCORE */}

              <div className="shrink-0">
                {scoreLoading ? (
                  <div className="grid h-[250px] w-[208px] place-items-center">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                  </div>
                ) : (
                  <ScoreRing
                    score={data.score}
                    tier={data.tier}
                    name={user?.name || data.user?.name || ""}
                    photoUrl={photoUrl}
                    uploading={photoUploading}
                    onPhotoChange={uploadProfilePhoto}
                  />
                )}
              </div>


              {/* PROFILE INFO */}

              <div className="flex-1 text-center lg:text-left">

                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-[#334155] px-4 py-2 text-sm font-semibold text-white shadow-sm">
                  <Award className="h-4 w-4" />
                  <span>
                    {data.tier || "Explorer"}
                  </span>
                </div>

                <h1 className="text-4xl font-black tracking-tight text-slate-900">
                  Hey{" "}
                  {user?.name ||
                    data.user?.name ||
                    "there"}{" "}
                  👋
                </h1>

                <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-600 lg:text-lg">
                  {data.user?.careerGoal
                    ? `You're on your journey to become a ${data.user.careerGoal}. Here's your MyMentor Score and how far you've come with us.`
                    : "Set a career goal to boost your clarity. Here's your MyMentor Score and how far you've come with us."}
                </p>


                {/* STATS */}

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
<ProfileEditor
  user={user}
  workExperience={workExperience}
  onWorkExperienceSaved={fetchWorkExperience}
/>

          {/* ==================================================
              BREAKDOWN + JOURNEY
          ================================================== */}



    {/* ==================================================
    WORK EXPERIENCE
================================================== */}

<div className="mt-8">
  {workExperienceLoading ? (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">
      <p className="text-sm text-slate-500">
        Loading work experience...
      </p>
    </div>
  ) : workExperienceError ? (
    <div className="rounded-3xl border border-red-100 bg-white p-8 shadow-soft">
      <p className="text-sm text-red-500">
        {workExperienceError}
      </p>
    </div>
  ) : workExperience ? (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">

        <div className="flex items-start gap-4">

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Briefcase className="h-6 w-6" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Work Experience
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your professional experience
            </p>
          </div>

        </div>

        {workExperience.currently_working && (
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
            Currently Working
          </span>
        )}

      </div>

      {/* Job Details */}
      <div className="mt-7 grid gap-x-8 gap-y-6 sm:grid-cols-2">

        <ProfileValue
          label="Job Title / Role"
          value={workExperience.job_title || "-"}
        />

        <ProfileValue
          label="Organization / Company"
          value={workExperience.company_name || "-"}
        />

        <ProfileValue
          label="Employment Type"
          value={workExperience.employment_type || "-"}
        />

        <ProfileValue
          label="Location"
          value={workExperience.location || "-"}
        />

        <ProfileValue
          label="Start Date"
          value={
            workExperience.start_date
              ? new Date(
                  workExperience.start_date
                ).toLocaleDateString("en-IN", {
                  month: "long",
                  year: "numeric",
                })
              : "-"
          }
        />

        {!workExperience.currently_working &&
          workExperience.end_date && (
            <ProfileValue
              label="End Date"
              value={new Date(
                workExperience.end_date
              ).toLocaleDateString("en-IN", {
                month: "long",
                year: "numeric",
              })}
            />
          )}

      </div>

      {/* Description */}
      {workExperience.description && (
        <div className="mt-7 border-t border-slate-100 pt-6">

          <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Highlights
          </div>

          <p className="whitespace-pre-line text-[15px] leading-7 text-slate-700">
            {workExperience.description}
          </p>

        </div>
      )}

      {/* Skills */}
      {workExperience.skills && (
        <div className="mt-6">

          <div className="mb-3 text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Skills
          </div>

          <div className="flex flex-wrap gap-2">

            {workExperience.skills
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-full bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
                >
                  {skill}
                </span>
              ))}

          </div>

        </div>
      )}

    </div>
  ) : (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 shadow-soft">

      <div className="flex items-center gap-4">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
          <Briefcase className="h-6 w-6" />
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900">
            Work Experience
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            No work experience added yet.
          </p>
        </div>

      </div>

    </div>
  )}
</div>


{/* ==================================================
    BREAKDOWN + JOURNEY
================================================== */}

<div className="mt-8 grid gap-8 lg:grid-cols-2">

  {/* SCORE BREAKDOWN */}

            {/* SCORE BREAKDOWN */}

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

                    const value =
                      Number(b.value) || 0;

                    const max =
                      Number(b.max) || 1;

                    const pct =
                      Math.min(
                        100,
                        Math.round(
                          (value / max) * 100
                        )
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
                            }}
                            className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
                          />

                        </div>

                      </div>
                    );
                  })

                )}

              </div>

            </div>


            {/* JOURNEY */}

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

                    const Icon =
                      ICONS[j.icon] ||
                      Sparkles;

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
                              className={`absolute left-[19px] top-10 h-full w-0.5 ${j.done
                                ? "bg-blue-200"
                                : "bg-slate-100"
                                }`}
                            />
                          )}

                        <span
                          className={`relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full ${j.done
                            ? "bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-soft"
                            : "border-2 border-dashed border-slate-200 bg-white text-slate-300"
                            }`}
                        >
                          <Icon className="h-5 w-5" />
                        </span>

                        <div className="pt-0.5">

                          <div className="flex items-center gap-2">

                            <h3
                              className={`font-semibold ${j.done
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

                  {!data.stats.hasCareerPlan && (
                    <NextCTA
                      to="/career-path"
                      label="Generate career plan"
                    />
                  )}

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
// PROFILE EDITOR
// ============================================================
function ProfileEditor({
  user,
  workExperience,
  onWorkExperienceSaved,
}) {
   const [p, setP] = useState(null);
  const [saving, setSaving] = useState(false);

  const [profileLoading, setProfileLoading] = useState(true);


  const [profileExists, setProfileExists] = useState(false);

  const [isEditing, setIsEditing] = useState(false);

  const [draftBeforeEdit, setDraftBeforeEdit] = useState(null);
  const [professionalPopupOpen, setProfessionalPopupOpen] =
    useState(false);




  // ==========================================================
  // SET FIELD
  // ==========================================================

  const set = (key) => (e) => {
    setP((state) => ({
      ...state,
      [key]: e.target.value,
    }));
  };

// ============================================================
// SAVE WORK EXPERIENCE
// ============================================================
const saveWorkExperience = async () => {
  if (!p) {
    return false;
  }

  // ----------------------------------------------------------
  // VALIDATION
  // ----------------------------------------------------------

  if (!p.role?.trim()) {
    toast.error(
      "Please enter your job title / role."
    );
    return false;
  }

  if (!p.organization?.trim()) {
    toast.error(
      "Please enter your organization / company."
    );
    return false;
  }

  if (
    p.yearsExperience === "" ||
    p.yearsExperience === null ||
    p.yearsExperience === undefined
  ) {
    toast.error(
      "Please enter your years of experience."
    );
    return false;
  }

  if (!p.location?.trim()) {
    toast.error(
      "Please enter your location."
    );
    return false;
  }

  if (!p.locationType) {
    toast.error(
      "Please select your location type."
    );
    return false;
  }

  if (!p.employmentType) {
    toast.error(
      "Please select your employment type."
    );
    return false;
  }

  if (!p.startMonth) {
    toast.error(
      "Please select your start month."
    );
    return false;
  }

  if (!p.startYear) {
    toast.error(
      "Please select your start year."
    );
    return false;
  }

  try {
    const payload = {
      company_name:
        p.organization.trim(),

      job_title:
        p.role.trim(),

      employment_type:
        p.employmentType,

      location:
        p.location.trim(),

      start_date:
        `${p.startYear}-${String(
          p.startMonth
        ).padStart(2, "0")}-01`,

      end_date:
        p.currentlyWorking
          ? null
          : null,

      currently_working:
        Boolean(p.currentlyWorking),

      description:
        p.highlights?.trim() || "",

      skills:
        "",
    };

    console.log(
      "WORK EXPERIENCE SAVE REQUEST:",
      payload
    );

    let result;

    // --------------------------------------------------------
    // UPDATE EXISTING EXPERIENCE
    // --------------------------------------------------------

    if (workExperience?.id) {
      result =
        await api.updateWorkExperience(
          workExperience.id,
          payload
        );
    }

    // --------------------------------------------------------
    // CREATE NEW EXPERIENCE
    // --------------------------------------------------------

    else {
      result =
        await api.createWorkExperience(
          payload
        );
    }

    console.log(
      "WORK EXPERIENCE SAVE RESPONSE:",
      result
    );

    // --------------------------------------------------------
    // REFRESH PARENT DATA
    // --------------------------------------------------------

    if (onWorkExperienceSaved) {
      await onWorkExperienceSaved();
    }

    return true;

  } catch (error) {
    console.error(
      "WORK EXPERIENCE SAVE ERROR:",
      error
    );

    const message =
      error?.response?.data?.detail ||
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      "Unable to save work experience.";

    toast.error(message);

    return false;
  }
};
  // ==========================================================
  // NORMALIZE PROFILE
  // ==========================================================

  const normalizeProfile = (
    data,
    currentUser
  ) => {

    const category =
      data?.profile_category ||
      data?.profileCategory ||
      "";

    return {

      ...data,

      name:
        currentUser?.name ||
        data?.name ||
        "",

      dob:
        data?.dob ||
        "",

      age:
        data?.age ??
        null,

      profileCategory:
        category,

      education:
        data?.education ||
        data?.education_level ||
        data?.educationLevel ||
        "",

      // Student
      currentYear:
        data?.class_year ||
        data?.current_year ||
        data?.currentYear ||
        "",

      schoolCollege:
        data?.institution ||
        data?.school_college ||
        data?.schoolCollege ||
        "",

      // Working professional
      yearsExperience:
        data?.years_experience ??
        data?.experience_years ??
        data?.yearsExperience ??
        "",

      role:
        data?.role ||
        "",

      careerGoal:
        data?.career_goal ||
        data?.careerGoal ||
        "",

      careerInterests:
        data?.career_interests ||
        data?.careerInterests ||
        "",

      // Other professional details
      organization:
        data?.organization ||
        "",

      location:
        data?.location ||
        "",

      locationType:
        data?.location_type ||
        "",

      employmentType:
        data?.employment_type ||
        "",
      currentlyWorking:
        data?.currently_working ?? data?.currentlyWorking ?? false,
      startMonth:
        data?.start_month ?? data?.startMonth ?? "",
      startYear:
        data?.start_year ?? data?.startYear ?? "",
      highlights:
        data?.highlights || "",
    };
  };



  
  const fetchWorkExperience = async () => {
    try {
      const response = await api.get("/api/work-experiences/me");

      console.log(
        "WORK EXPERIENCE API RESPONSE:",
        response.data
      );

      const experiences = Array.isArray(response.data)
        ? response.data
        : response.data
          ? [response.data]
          : [];

      return experiences[0] || null;

    } catch (error) {
      console.error(
        "WORK EXPERIENCE FETCH ERROR:",
        error?.response?.status,
        error?.response?.data || error.message
      );

      return null;
    }
  };

 
    // ============================================================
// OPEN WORK EXPERIENCE POPUP
// ============================================================
const handleOpenProfessionalPopup = () => {
  if (workExperience) {
    const startDate =
      workExperience.start_date || "";

    setP((current) => ({
      ...current,

      role:
        workExperience.job_title ||
        current?.role ||
        "",

      organization:
        workExperience.company_name ||
        current?.organization ||
        "",

      location:
        workExperience.location ||
        current?.location ||
        "",

      locationType:
        current?.locationType ||
        "",

      employmentType:
        workExperience.employment_type ||
        current?.employmentType ||
        "",

      currentlyWorking:
        workExperience.currently_working ??
        current?.currentlyWorking ??
        false,

      startMonth:
        startDate
          ? startDate.substring(5, 7)
          : current?.startMonth || "",

      startYear:
        startDate
          ? startDate.substring(0, 4)
          : current?.startYear || "",

      highlights:
        workExperience.description ||
        current?.highlights ||
        "",
    }));
  }

  setProfessionalPopupOpen(true);
};
  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  useEffect(() => {

    const loadProfile =
      async () => {

        if (!user) {
          return;
        }

        try {

          setProfileLoading(true);

          const data =
            await api.getProfile();

          console.log(
            "PROFILE API RESPONSE:",
            data
          );

          setProfileExists(true);

          const normalized =
            normalizeProfile(
              data,
              user
            );

          setP(normalized);

await fetchWorkExperience();
          // ------------------------------------------------
          // PHOTO
          // ------------------------------------------------

          const returnedPhoto =
            data?.profile_photo_url ||
            data?.profilePhotoUrl ||
            data?.photo_url ||
            data?.photo ||
            data?.profile_photo ||
            "";

          if (returnedPhoto) {
            setPhotoUrl(returnedPhoto);
          }

        } catch (error) {

          console.error(
            "PROFILE LOAD ERROR:",
            error
          );

          if (
            error?.response?.status ===
            404
          ) {

            setProfileExists(false);

            setP({
              name:
                user?.name || "",

              dob: "",

              age: null,

              profileCategory: "",

              currentYear: "",

              schoolCollege: "",

              yearsExperience: "",

              role: "",

              education: "",

              careerGoal: "",

              careerInterests: "",

              organization: "",

              location: "",

              locationType: "",

              employmentType: "",
              currentlyWorking: false,
              startMonth: "",
              startYear: "",
              highlights: "",
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

    loadProfile();

  }, [user]);


  // ==========================================================
  // SAVE WORK EXPERIENCE
  // ==========================================================

  
  // ==========================================================
  // SAVE PROFILE
  // ==========================================================

  const save = async () => {

    if (!p) {
      return;
    }

    // --------------------------------------------------------
    // Basic validation
    // --------------------------------------------------------

    if (!p.profileCategory) {
      toast.error(
        "Please select your profile category."
      );
      return;
    }


    if (
      p.profileCategory ===
      "School student" ||
      p.profileCategory ===
      "College student"
    ) {

      if (!p.currentYear) {
        toast.error(
          "Please enter your current year / class."
        );
        return;
      }

      if (!p.schoolCollege) {
        toast.error(
          "Please enter your school / college."
        );
        return;
      }

    }


    if (
      p.profileCategory ===
      "Working professional"
    ) {
      if (!p.role?.trim()) { toast.error("Please enter your job title / role in the + popup."); return; }
      if (!p.organization?.trim()) { toast.error("Please enter your organization / company in the + popup."); return; }
      if (p.yearsExperience === "" || p.yearsExperience === null || p.yearsExperience === undefined) { toast.error("Please enter your years of experience in the + popup."); return; }
      if (!p.location?.trim()) { toast.error("Please enter your location in the + popup."); return; }
      if (!p.locationType) { toast.error("Please select your location type in the + popup."); return; }
      if (!p.employmentType) { toast.error("Please select your employment type in the + popup."); return; }
      if (!p.startMonth || !p.startYear) { toast.error("Please select your start month and start year in the + popup."); return; }
    }

    setSaving(true);

    try {

      // ------------------------------------------------------
      // BUILD REQUEST
      // ------------------------------------------------------

      const body = {

        dob:
          p.dob || null,

        profile_category:
          p.profileCategory || null,

        education:
          p.education || null,

        career_goal:
          p.careerGoal || null,

        career_interests:
          p.careerInterests || null,

        // Working-professional details
        organization:
          p.organization || null,
        location:
          p.location || null,
        location_type:
          p.locationType || null,
        employment_type:
          p.employmentType || null,
        currently_working:
          Boolean(p.currentlyWorking),
        start_month:
          p.startMonth || null,
        start_year:
          p.startYear ? Number(p.startYear) : null,
        highlights:
          p.highlights || null,
      };


      // ------------------------------------------------------
      // STUDENT
      // ------------------------------------------------------

      if (
        p.profileCategory ===
        "School student" ||
        p.profileCategory ===
        "College student"
      ) {

        body.class_year =
          p.currentYear || null;

        body.institution =
          p.schoolCollege || null;

        /*
         * Explicitly clear professional fields.
         */

        body.years_experience =
          null;

        body.role =
          null;
        body.organization =
          null;
        body.location =
          null;
        body.location_type =
          null;
        body.employment_type =
          null;
        body.currently_working = null;
        body.start_month = null;
        body.start_year = null;
        body.highlights = null;
      }


      // ------------------------------------------------------
      // WORKING PROFESSIONAL
      // ------------------------------------------------------

      if (
        p.profileCategory ===
        "Working professional"
      ) {

        body.years_experience =
          p.yearsExperience !== ""
            ? Number(
              p.yearsExperience
            )
            : null;

        body.role =
          p.role || null;

        /*
         * Explicitly clear student fields.
         */

        body.class_year =
          null;

        body.institution =
          null;

        body.organization =
          p.organization || null;
        body.location =
          p.location || null;
        body.location_type =
          p.locationType || null;
        body.employment_type =
          p.employmentType || null;
      }


      console.log(
        "PROFILE SAVE REQUEST:",
        body
      );


      // ------------------------------------------------------
      // UPDATE / CREATE
      // ------------------------------------------------------

      let response;

      if (profileExists) {

        response =
          await api.updateProfile(
            body
          );

      } else {

        response =
          await api.createProfile(
            body
          );

        setProfileExists(true);
      }


      console.log(
        "PROFILE SAVE RESPONSE:",
        response
      );


      // ------------------------------------------------------
      // UPDATE LOCAL STATE
      // ------------------------------------------------------

      const normalized =
        normalizeProfile(
          response || body,
          user
        );

      /*
       * Preserve current local values when
       * backend doesn't return every field.
       */

      setP({
        ...p,
        ...normalized,

        name:
          user?.name ||
          p.name ||
          "",

        dob:
          normalized.dob ||
          p.dob ||
          "",

        profileCategory:
          normalized.profileCategory ||
          p.profileCategory ||
          "",

        currentYear:
          normalized.currentYear ||
          p.currentYear ||
          "",

        schoolCollege:
          normalized.schoolCollege ||
          p.schoolCollege ||
          "",

        yearsExperience:
          normalized.yearsExperience !== ""
            ? normalized.yearsExperience
            : p.yearsExperience,

        role:
          normalized.role ||
          p.role ||
          "",

        education:
          normalized.education ||
          p.education ||
          "",

        careerGoal:
          normalized.careerGoal ||
          p.careerGoal ||
          "",

        careerInterests:
          normalized.careerInterests ||
          p.careerInterests ||
          "",

        organization:
          normalized.organization ||
          p.organization ||
          "",
        location:
          normalized.location ||
          p.location ||
          "",
        locationType:
          normalized.locationType ||
          p.locationType ||
          "",
        employmentType:
          normalized.employmentType ||
          p.employmentType ||
          "",
        currentlyWorking:
          normalized.currentlyWorking ?? p.currentlyWorking ?? false,
        startMonth:
          normalized.startMonth || p.startMonth || "",
        startYear:
          normalized.startYear || p.startYear || "",
        highlights:
          normalized.highlights || p.highlights || "",
      });


      /*
       * VERY IMPORTANT:
       *
       * After save the profile becomes
       * read-only.
       *
       * User must click Edit again.
       */

      setDraftBeforeEdit(null);
      setIsEditing(false);


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
        error?.message ||
        "Could not save profile";

      toast.error(message);

    } finally {

      setSaving(false);

    }
  };


  // ==========================================================
  // PROFILE COMPLETION
  // ==========================================================

  const calculateCompletion =
    () => {

      if (!p) {
        return 0;
      }

      const commonFields = [
        p.name,
        p.dob,
        p.profileCategory,
        p.education,
        p.careerGoal,
        p.careerInterests,
      ];

      let requiredFields =
        [...commonFields];


      if (
        p.profileCategory ===
        "School student" ||
        p.profileCategory ===
        "College student"
      ) {

        requiredFields.push(
          p.currentYear
        );

        requiredFields.push(
          p.schoolCollege
        );
      }


      if (
        p.profileCategory ===
        "Working professional"
      ) {
        requiredFields.push(
          p.yearsExperience,
          p.role,
          p.organization,
          p.location,
          p.locationType,
          p.employmentType,
          p.startMonth,
          p.startYear,
          p.highlights,
          p.currentlyWorking ? "yes" : ""
        );
      }


      const completed =
        requiredFields.filter(
          (value) =>
            value !== null &&
            value !== undefined &&
            String(value).trim() !== ""
        );


      return Math.round(
        (completed.length /
          requiredFields.length) *
        100
      );
    };


  // ==========================================================
  // LOADING
  // ==========================================================

  if (
    profileLoading ||
    !p
  ) {

    return (
      <div className="mt-8 grid min-h-[300px] place-items-center rounded-3xl border border-slate-100 bg-white shadow-soft">

        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />

      </div>
    );
  }


  const completionPercentage =
    calculateCompletion();


  // ==========================================================
  // CATEGORY HELPERS
  // ==========================================================

  const isStudent =
    p.profileCategory ===
    "School student" ||
    p.profileCategory ===
    "College student";

  const isProfessional =
    p.profileCategory ===
    "Working professional";


  // ==========================================================
  // RENDER
  // ==========================================================

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

        {/* COMPLETION + ADD + EDIT */}
        <div className="flex items-center gap-3">
          <div className="w-36">
            <div className="mb-1 flex justify-between text-xs font-medium text-slate-500">
              <span>Completion</span>
              <span data-testid="profile-completion">{completionPercentage}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 transition-all" style={{ width: `${completionPercentage}%` }} />
            </div>
          </div>
          {isProfessional && (
            <button
              type="button"
              onClick={handleOpenProfessionalPopup}
              className="..."
              title="Add job details"
            >
              +Add
            </button>
          )}
          {!isEditing && (
            <button type="button" onClick={() => { setDraftBeforeEdit({ ...p }); setIsEditing(true); }} data-testid="profile-edit" className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600">
              <Pencil className="h-4 w-4" />
              Edit
            </button>
          )}
        </div>

      </div>
      {/* ====================================================
          WORKING PROFESSIONAL POPUP
      ==================================================== */}
      {professionalPopupOpen && isProfessional && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm" onMouseDown={(e) => { if (e.target === e.currentTarget) setProfessionalPopupOpen(false); }}>
          <div role="dialog" aria-modal="true" aria-labelledby="professional-details-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-2 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><Briefcase className="h-5 w-5" /></div>
                <h3 id="professional-details-title" className="text-2xl font-black text-slate-900">Working Professional Details</h3>
                <p className="mt-1 text-sm text-slate-500">Add your work experience, role, company and location details.</p>
              </div>
              <button type="button" onClick={() => setProfessionalPopupOpen(false)} className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900" aria-label="Close professional details"><X className="h-5 w-5" /></button>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div><PLabel>Job Title / Role *</PLabel><input className={pfield} value={p.role || ""} onChange={set("role")} placeholder="e.g. Software Engineer" /></div>
              <div><PLabel>Organization / Company *</PLabel><input className={pfield} value={p.organization || ""} onChange={set("organization")} placeholder="e.g. Microsoft" /></div>
              <div><PLabel>Years of Experience *</PLabel><input type="number" min="0" max="60" step="0.5" className={pfield} value={p.yearsExperience ?? ""} onChange={set("yearsExperience")} placeholder="e.g. 3" /></div>
              <div><PLabel>Location *</PLabel><div className="relative"><MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" /><input className={`${pfield} pl-9`} value={p.location || ""} onChange={set("location")} placeholder="e.g. Chennai, Tamil Nadu" /></div></div>
              <div><PLabel>Location Type *</PLabel><select className={pfield} value={p.locationType || ""} onChange={set("locationType")}><option value="">Select</option><option value="On-site">On-site</option><option value="Hybrid">Hybrid</option><option value="Remote">Remote</option></select></div>
              <div><PLabel>Employment Type *</PLabel><select className={pfield} value={p.employmentType || ""} onChange={set("employmentType")}><option value="">Select</option><option value="Full-time">Full-time</option><option value="Part-time">Part-time</option><option value="Contract">Contract</option><option value="Freelance">Freelance</option><option value="Internship">Internship</option><option value="Self-employed">Self-employed</option></select></div>
              <div><PLabel>Start Month *</PLabel><select className={pfield} value={p.startMonth || ""} onChange={set("startMonth")}><option value="">Select month</option>{Array.from({ length: 12 }, (_, index) => { const month = String(index + 1).padStart(2, "0"); const label = new Date(2000, index, 1).toLocaleString("en-US", { month: "long" }); return <option key={month} value={month}>{label}</option>; })}</select></div>
              <div><PLabel>Start Year *</PLabel><select className={pfield} value={p.startYear || ""} onChange={set("startYear")}><option value="">Select year</option>{Array.from({ length: new Date().getFullYear() - 1970 + 1 }, (_, index) => { const year = new Date().getFullYear() - index; return <option key={year} value={year}>{year}</option>; })}</select></div>
            </div>

            <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm font-medium text-slate-700"><input type="checkbox" checked={Boolean(p.currentlyWorking)} onChange={(e) => setP((state) => ({ ...state, currentlyWorking: e.target.checked }))} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />I currently work here</label>

            <div className="mt-6"><div className="flex items-center justify-between"><PLabel>Highlights</PLabel><span className="text-xs text-slate-400">{(p.highlights || "").length}/2000</span></div><textarea rows={5} maxLength={2000} className={`${pfield} resize-none`} value={p.highlights || ""} onChange={set("highlights")} placeholder="Projects, problems you solved, or results you achieved" /></div>

            <div className="mt-7 flex flex-wrap justify-end gap-3">
              <button type="button" onClick={() => setProfessionalPopupOpen(false)} disabled={saving} className="rounded-full border border-slate-200 bg-white px-6 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60">Cancel</button>
              <button type="button" disabled={saving} onClick={async () => {
                if (!p.role?.trim()) return toast.error("Please enter your job title / role.");
                if (!p.organization?.trim()) return toast.error("Please enter your organization / company.");
                if (p.yearsExperience === "" || p.yearsExperience === null || p.yearsExperience === undefined) return toast.error("Please enter your years of experience.");
                if (!p.location?.trim()) return toast.error("Please enter your location.");
                if (!p.locationType) return toast.error("Please select your location type.");
                if (!p.employmentType) return toast.error("Please select your employment type.");
                if (!p.startMonth) return toast.error("Please select your start month.");
                if (!p.startYear) return toast.error("Please select your start year.");
                try {
                  setSaving(true);
                  await saveWorkExperience();
                  await save();
                  setProfessionalPopupOpen(false);
                } catch (error) {
                  console.error("WORK EXPERIENCE SAVE ERROR:", error);

                  const message =
                    error?.response?.data?.detail ||
                    error?.response?.data?.message ||
                    error?.response?.data?.error ||
                    error?.message ||
                    "Unable to save work experience.";

                  toast.error(message);
                } finally {
                  setSaving(false);
                }
              }} className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-medium disabled:opacity-60">{saving && <Loader2 className="h-4 w-4 animate-spin" />}{saving ? "Saving..." : "Save Details"}</button>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================
          READ ONLY PROFILE
      ==================================================== */}

      {!isEditing ? (

        <div className="mt-7 grid gap-x-8 gap-y-7 sm:grid-cols-2">

          {/* ROW 1 */}

          <ProfileValue
            label="Full Name"
            value={p.name}
          />

          <ProfileValue
            label="Date of Birth"
            value={
              p.dob
                ? String(p.dob).slice(
                  0,
                  10
                )
                : ""
            }
          />


          {/* ROW 2 */}

          <ProfileValue
            label="Profile Category"
            value={
              p.profileCategory
            }
          />


          {!isProfessional && (
            <>
              <ProfileValue label="Class / Year" value={p.currentYear} />
              <ProfileValue label="School / College" value={p.schoolCollege} />
            </>
          )}

          <ProfileValue
            label="Education Level"
            value={p.education}
          />




          {/* ROW 4 */}

          <ProfileValue
            label="Career Goal"
            value={
              p.careerGoal
            }
          />

          <ProfileValue
            label="Career Interests"
            value={
              p.careerInterests
            }
          />

        </div>

      ) : (

        /* ==================================================
           EDIT FORM
        ================================================== */

        <div className="mt-7">

          <div className="grid gap-5 sm:grid-cols-2">

            {/* FULL NAME */}

            <div>
              <PLabel>
                Full Name
              </PLabel>

              <input
                className={`${pfield} bg-slate-50`}
                value={
                  p.name || ""
                }
                disabled
                readOnly
              />
            </div>


            {/* DOB */}

            <div>

              <PLabel>
                Date of Birth
              </PLabel>

              <input
                type="date"
                className={pfield}
                value={
                  (
                    p.dob ||
                    ""
                  ).slice(
                    0,
                    10
                  )
                }
                onChange={set(
                  "dob"
                )}
                max={
                  new Date()
                    .toISOString()
                    .slice(
                      0,
                      10
                    )
                }
                data-testid="profile-dob"
              />

            </div>


            {/* CATEGORY */}

            <div>

              <PLabel>
                Profile Category
              </PLabel>

              <select
                className={pfield}
                value={
                  p.profileCategory ||
                  ""
                }
                onChange={(e) => {

                  const category =
                    e.target.value;

                  setP(
                    (state) => ({
                      ...state,

                      profileCategory:
                        category,

                      /*
                       * Clear category-specific
                       * fields when changing category.
                       */

                      currentYear:
                        "",

                      schoolCollege:
                        "",

                      yearsExperience:
                        "",

                      role:
                        "",
                      organization:
                        "",
                      location:
                        "",
                      locationType:
                        "",
                      employmentType:
                        "",
                      currentlyWorking:
                        false,
                      startMonth:
                        "",
                      startYear:
                        "",
                      highlights:
                        "",
                    })
                  );
                }}
                data-testid="profile-category"
              >

                <option value="">
                  Select
                </option>

                {CATEGORIES.map(
                  (category) => (

                    <option
                      key={
                        category.value
                      }
                      value={
                        category.value
                      }
                    >
                      {
                        category.label
                      }
                    </option>

                  )
                )}

              </select>

            </div>


            {/* ==================================================
                STUDENT: CLASS / YEAR
            ================================================== */}

            {isStudent && (

              <div>

                <PLabel>
                  Class / Year
                </PLabel>

                <input
                  className={pfield}
                  value={
                    p.currentYear ||
                    ""
                  }
                  onChange={set(
                    "currentYear"
                  )}
                  placeholder={
                    p.profileCategory ===
                      "School student"
                      ? "e.g. Class 12"
                      : "e.g. 2nd Year"
                  }
                  data-testid="profile-classyear"
                />

              </div>

            )}


            {/* ==================================================
                STUDENT: SCHOOL / COLLEGE
            ================================================== */}

            {isStudent && (

              <div>

                <PLabel>
                  School / College
                </PLabel>

                <input
                  className={pfield}
                  value={
                    p.schoolCollege ||
                    ""
                  }
                  onChange={set(
                    "schoolCollege"
                  )}
                  placeholder={
                    p.profileCategory ===
                      "School student"
                      ? "e.g. ABC Higher Secondary School"
                      : "e.g. Anna University"
                  }
                  data-testid="profile-institution"
                />

              </div>

            )}


            {/* EDUCATION */}

            <div>

              <PLabel>
                Education Level
              </PLabel>

              <input
                className={pfield}
                value={
                  p.education ||
                  ""
                }
                onChange={set(
                  "education"
                )}
                placeholder="e.g. Bachelor's Degree"
                data-testid="profile-education"
              />

            </div>


            {/* CAREER GOAL */}

            <div>

              <PLabel>
                Career Goal
              </PLabel>

              <input
                className={pfield}
                value={
                  p.careerGoal ||
                  ""
                }
                onChange={set(
                  "careerGoal"
                )}
                placeholder="e.g. I want to become a Doctor"
                data-testid="profile-goal"
              />

            </div>


            {/* CAREER INTERESTS */}

            <div>

              <PLabel>
                Career Interests
              </PLabel>

              <input
                className={pfield}
                value={
                  p.careerInterests ||
                  ""
                }
                onChange={set(
                  "careerInterests"
                )}
                placeholder="e.g. Medicine, Research"
                data-testid="profile-interests"
              />

            </div>

          </div>


          {/* ==================================================
              SAVE / CANCEL
          ================================================== */}

          <div className="mt-7 flex flex-wrap items-center gap-3">

            <button
              type="button"
              onClick={save}
              disabled={saving}
              data-testid="profile-save"
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 font-semibold text-white shadow-medium transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60"
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


            <button
              type="button"
              onClick={() => {
                if (draftBeforeEdit) {
                  setP(draftBeforeEdit);
                }
                setDraftBeforeEdit(null);
                setIsEditing(false);
              }}
              disabled={saving}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
            >
              Cancel
            </button>

          </div>

        </div>

      )}

    </div>
  );
}