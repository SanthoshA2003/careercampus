import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowUp,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  GraduationCap,
  Target,
  BookOpen,
  Award,
  Building2,
  ChevronRight,
  Clock,
  Loader2,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Background from "@/features/career/components/Background";
import TypeRotator from "@/features/career/components/TypeRotator";

// ============================================================
// LOGO
// ============================================================

const LOGO =
  "https://customer-assets-v7afamib.emergentagent.net/job_9aefb62e-7f57-4728-958f-65a239b06a22/artifacts/16k7ho7s_MY%20MENOTR%20LOGO.png";

// ============================================================
// ROTATING PLACEHOLDER TEXT
// ============================================================

const ROTATE = [
  "I want to become a Doctor",
  "I want to become an IAS Officer",
  "I want to become an AI Engineer",
  "I want to become a Product Manager",
  "I want to become a Pilot",
  "I want to become a Chartered Accountant",
  "I want to become a Scientist",
  "I want to become an Entrepreneur",
  "I want to study in IIT",
  "I want to work at Google",
  "I want to become a UI UX Designer",
];

// ============================================================
// CAREER CHIPS
// ============================================================

const CHIPS = [
  ["🩺", "Become a Doctor", "I want to become a Doctor"],
  ["🤖", "AI Engineer", "I want to become an AI Engineer"],
  ["⚖️", "Lawyer", "I want to become a Lawyer"],
  ["🎨", "UI UX Designer", "I want to become a UI UX Designer"],
  ["🚀", "Startup Founder", "I want to become a Startup Founder"],
  ["✈️", "Pilot", "I want to become a Pilot"],
  [
    "📈",
    "Chartered Accountant",
    "I want to become a Chartered Accountant",
  ],
  ["🏛", "IAS Officer", "I want to become an IAS Officer"],
];

// ============================================================
// COURSE DATA
// ============================================================


// ============================================================
// API BASE URL
// ============================================================

const API_BASE_URL =
  process.env.REACT_APP_BACKEND_URL ||
  "https://mymentor-api.onrender.com";

// ============================================================
// TOKEN
// ============================================================

const getToken = () => {
  return (
    localStorage.getItem("dp_token") ||
    localStorage.getItem("access_token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("token")
  );
};

// ============================================================
// CAREER PATH PAGE
// ============================================================
export default function CareerPath() {
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);

  const [careerPersona, setCareerPersona] = useState(null);
  const [error, setError] = useState("");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState([]);
  const [enrollingCourseId, setEnrollingCourseId] = useState(null);

  // COURSE STATE
  const [showCourses, setShowCourses] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);
  const [courseError, setCourseError] = useState("");
  const [courses, setCourses] = useState([]);
  // ==========================================================
  // GET TOKEN
  // ==========================================================

  const token = getToken();
  const navigate = useNavigate();


  const loadMyEnrollments = async () => {
    if (!token) return;

    try {
      const url = `${API_BASE_URL}/api/courses/my-enrollments`;

      console.log("MY ENROLLMENTS API:", url);

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => null);

      console.log("MY ENROLLMENTS RESPONSE:", data);

      if (!response.ok) {
        console.error("Failed to load enrollments:", data);
        return;
      }

      // API may return an array directly
      const enrollments = Array.isArray(data)
        ? data
        : data?.enrollments || data?.data || [];

      const ids = enrollments
        .map((item) => {
          return (
            item.course_id ||
            item.courseId ||
            item.course?.id ||
            item.id
          );
        })
        .filter(Boolean);

      console.log("ENROLLED COURSE IDS:", ids);

      setEnrolledCourseIds(ids);
    } catch (err) {
      console.error("MY ENROLLMENTS ERROR:", err);
    }
  };

  const enroll = async (courseId) => {
    if (!token) {
      setCourseError("Please login first to enroll in a course.");
      return;
    }

    try {
      setEnrollingCourseId(courseId);
      setCourseError("");

      const url = `${API_BASE_URL}/api/courses/${courseId}/enroll`;

      console.log("ENROLL API:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json().catch(() => null);

      console.log("ENROLLMENT RESPONSE:", data);

      // =====================================================
      // ALREADY ENROLLED
      // =====================================================

      if (
        response.status === 409 &&
        data?.detail === "You are already enrolled in this course."
      ) {
        console.log("Already enrolled. Opening course...");

        setEnrolledCourseIds((prev) =>
          prev.includes(courseId)
            ? prev
            : [...prev, courseId]
        );

        navigate(`/skillhub/journey/${courseId}`);

        return;
      }

      // =====================================================
      // OTHER ERRORS
      // =====================================================

      if (!response.ok) {
        throw new Error(
          data?.detail ||
          data?.message ||
          data?.error ||
          "Unable to enroll in course."
        );
      }

      // =====================================================
      // NEW ENROLLMENT SUCCESS
      // =====================================================

      setEnrolledCourseIds((prev) =>
        prev.includes(courseId)
          ? prev
          : [...prev, courseId]
      );

      navigate(`/skillhub/journey/${courseId}`);

    } catch (err) {
      console.error("ENROLL ERROR:", err);

      setCourseError(
        err?.message || "Unable to enroll in this course."
      );
    } finally {
      setEnrollingCourseId(null);
    }
  };
  // ==========================================================
  // COURSE YES / NO + GET COURSE SUGGESTIONS
  // IMPORTANT: This function must stay INSIDE CareerPath().
  // ==========================================================
  const updateCoursePreference = async (wantCourses) => {
    if (!token) {
      setCourseError("Please login first.");
      return;
    }

    try {
      setCourseLoading(true);
      setCourseError("");

      const url = `${API_BASE_URL}/api/career-persona/calendar`;

      console.log("COURSE PREFERENCE API:", url);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          career_persona_id: careerPersona?.id,
          show_courses: wantCourses,
          add_to_calendar: false,
        }),
      });

      const data = await response.json().catch(() => null);

      console.log("COURSE PREFERENCE RESPONSE:", data);

      if (!response.ok) {
        const message =
          typeof data?.detail === "string"
            ? data.detail
            : Array.isArray(data?.detail)
              ? data.detail
                .map((item) => item?.msg || JSON.stringify(item))
                .join(", ")
              : data?.message ||
              data?.error ||
              `Course preference API failed with status ${response.status}`;

        throw new Error(message);
      }

      // NO
      if (!wantCourses) {
        setShowCourses(false);
        setCourses([]);
        return;
      }

      // YES → Get recommended courses
      const courseUrl =
        `${API_BASE_URL}/api/courses`;

      console.log("GET COURSE SUGGESTIONS:", courseUrl);

      const courseResponse = await fetch(courseUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const courseData = await courseResponse.json().catch(() => null);

      console.log("COURSE SUGGESTIONS RESPONSE:", courseData);

      if (!courseResponse.ok) {
        const message =
          typeof courseData?.detail === "string"
            ? courseData.detail
            : Array.isArray(courseData?.detail)
              ? courseData.detail
                .map((item) => item?.msg || JSON.stringify(item))
                .join(", ")
              : courseData?.message ||
              courseData?.error ||
              `Course suggestions API failed with status ${courseResponse.status}`;

        throw new Error(message);
      }
      setCourses(Array.isArray(courseData) ? courseData : []);

      // Get user's existing enrollments
      await loadMyEnrollments();

      // Show courses after successful API response
      setShowCourses(true);
    } catch (err) {
      console.error("COURSE ERROR:", err);

      setCourseError(
        err?.message || "Unable to load recommended courses."
      );

      setShowCourses(false);
    } finally {
      setCourseLoading(false);
    }
  };

  const createCareerPersona = async (careerGoal) => {
    if (!token) {
      throw new Error(
        "Authentication token not found. Please login first."
      );
    }

    const url = `${API_BASE_URL}/api/career-personas/me`;

    console.log("POST:", url);

    const response = await fetch(url, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        goal: careerGoal.trim(),
      }),
    });

    const data = await response.json().catch(() => null);

    console.log("Career Persona Response:", data);

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        data?.error ||
        `Career persona API failed with status ${response.status}`;

      throw new Error(message);
    }

    return data;
  };

  // ==========================================================
  // GET CAREER PERSONA
  // GET /api/career-personas/{persona_id}
  // ==========================================================

  const getCareerPersona = async (personaId) => {
    if (!token) {
      throw new Error(
        "Authentication token not found. Please login first."
      );
    }

    const url = `${API_BASE_URL}/api/career-personas/${personaId}`;

    console.log("GET:", url);

    const response = await fetch(url, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json().catch(() => null);

    console.log("Career Persona Details:", data);

    if (!response.ok) {
      const message =
        data?.detail ||
        data?.message ||
        data?.error ||
        `Career persona details API failed with status ${response.status}`;

      throw new Error(message);
    }

    return data;
  };

  // ==========================================================
  // SEND CAREER GOAL
  // ==========================================================

  const send = async () => {
    setError("");
    setCourseError("");
    setShowCourses(false);

    if (!goal.trim()) {
      setError("Please enter your career goal.");
      return;
    }

    if (!token) {
      setError(
        "Please login first to create your career path."
      );
      return;
    }

    try {
      setLoading(true);

      // ======================================================
      // STEP 1
      // CREATE CAREER PERSONA
      // ======================================================

      console.log(
        "Creating career persona..."
      );

      const postResponse =
        await createCareerPersona(
          goal.trim()
        );

      console.log(
        "CAREER PERSONA CREATED:",
        postResponse
      );

      // ======================================================
      // STEP 2
      // GET PERSONA ID
      // ======================================================

      const personaId =
        postResponse?.career_persona?.id ||
        postResponse?.id ||
        postResponse?.persona_id;

      if (!personaId) {
        console.error(
          "Persona ID missing:",
          postResponse
        );

        throw new Error(
          "Career persona ID was not returned by the API."
        );
      }

      console.log(
        "CAREER PERSONA ID:",
        personaId
      );

      // ======================================================
      // STEP 3
      // GET COMPLETE CAREER PERSONA
      // ======================================================

      const getResponse =
        await getCareerPersona(
          personaId
        );

      console.log(
        "COMPLETE CAREER PERSONA:",
        getResponse
      );

      // ======================================================
      // STEP 4
      // SHOW RESULT
      // ======================================================

      setCareerPersona(
        getResponse
      );
    } catch (err) {
      console.error("CAREER PERSONA ERROR:", err);

      const message = err?.message || "";

      if (message.includes("503") || message.includes("high demand")) {
        setError(
          "The AI service is currently experiencing high demand. Please try again in a few moments."
        );
      } else {
        setError(
          message || "Unable to generate your career path. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // EXTRACT RESULT
  // ==========================================================

  const persona =
    careerPersona?.career_persona ||
    careerPersona;

  const result = persona?.result;

  const roadmap =
    result?.roadmap || [];

  const targetExams =
    result?.target_exams || [];

  const recommendedColleges =
    result?.recommended_colleges || [];

  // ==========================================================
  // UI
  // ==========================================================

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200">

      <Background />

      {/* ======================================================
          BACK BUTTON
      ====================================================== */}

      <Link
        to="/"
        className="absolute left-6 top-6 z-30 flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        MyMentor
      </Link>

      {/* ======================================================
          MAIN
      ====================================================== */}

      <div className="relative z-10 mx-auto min-h-screen max-w-6xl px-4 py-24">

        {/* ====================================================
            HERO
        ==================================================== */}

        <div className="mx-auto flex max-w-3xl flex-col items-center text-center">

          {/* LOGO */}

          <motion.div
            initial={{
              opacity: 0,
              y: -10,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
          >
            <div className="absolute inset-0 -z-10 rounded-full bg-white/10 blur-2xl" />

            <img
              src={LOGO}
              alt="MyMentor"
              className="mx-auto h-24 w-auto drop-shadow-[0_4px_24px_rgba(56,189,248,0.35)]"
            />
          </motion.div>

          {/* HEADING */}

          <motion.h1
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.1,
            }}
            className="mt-8 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            Your{" "}
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">
              AI Career Intelligence
            </span>{" "}
            Platform
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.2,
            }}
            className="mt-4 text-lg text-slate-400"
          >
            One conversation can shape your entire future.
          </motion.p>

          {/* ==================================================
              INPUT
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              delay: 0.3,
            }}
            className="group relative mt-10 w-full"
          >

            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/40 to-violet-500/40 opacity-60 blur transition-opacity group-focus-within:opacity-100" />

            <div className="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-2.5 backdrop-blur-xl">

              <div className="relative flex-1">

                <input
                  value={goal}
                  onChange={(e) => {
                    setGoal(e.target.value);
                    setError("");
                  }}
                  onKeyDown={(e) => {
                    if (
                      e.key === "Enter" &&
                      !loading
                    ) {
                      send();
                    }
                  }}
                  disabled={loading}
                  className="w-full bg-transparent px-4 py-3 text-[17px] text-white outline-none disabled:cursor-not-allowed disabled:opacity-60"
                  data-testid="career-prompt-input"
                  aria-label="Career goal"
                />

                {!goal && !loading && (
                  <div className="pointer-events-none absolute inset-0 flex items-center px-4 text-[17px] text-slate-500">
                    <TypeRotator
                      phrases={ROTATE}
                    />
                  </div>
                )}

              </div>

              <button
                type="button"
                onClick={send}
                disabled={loading}
                className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white transition-transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <ArrowUp className="h-5 w-5" />
                )}
              </button>

            </div>
          </motion.div>

          {/* ERROR */}

          {error && (
            <motion.div
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              className="mt-4 w-full rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-left text-sm text-red-300"
            >
              {error}
            </motion.div>
          )}

          {/* CHIPS */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 0.5,
            }}
            className="mt-6 flex flex-wrap justify-center gap-2"
          >
            {CHIPS.map(
              ([emoji, label, value]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    setGoal(value);
                    setError("");
                  }}
                  disabled={loading}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-400/50 hover:bg-white/10 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="mr-1.5">
                    {emoji}
                  </span>

                  {label}
                </button>
              )
            )}
          </motion.div>

        </div>

        {/* ====================================================
            CAREER RESULT
        ==================================================== */}

        {result && (
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="mx-auto mt-16 max-w-5xl"
          >

            {/* ==================================================
                CAREER HEADER
            ================================================== */}

            <div className="rounded-3xl border border-white/10 bg-slate-900/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold text-cyan-300">
                    <CheckCircle2 className="h-4 w-4" />
                    Career Path Generated
                  </div>

                  <h2 className="text-3xl font-bold text-white sm:text-4xl">
                    {result.career}
                  </h2>

                  {result.career_overview && (
                    <p className="mt-3 max-w-3xl leading-7 text-slate-400">
                      {result.career_overview}
                    </p>
                  )}

                </div>

                {result.confidence_score !== undefined && (
                  <div className="shrink-0 rounded-2xl border border-white/10 bg-white/5 p-5 text-center">

                    <div className="text-3xl font-bold text-cyan-400">
                      {result.confidence_score}%
                    </div>

                    <div className="mt-1 text-xs text-slate-400">
                      Confidence Score
                    </div>

                  </div>
                )}

              </div>

            </div>

            {/* ==================================================
                QUICK DETAILS
            ================================================== */}

            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

              {/* CURRENT STAGE */}

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                  <GraduationCap className="h-5 w-5" />
                </div>

                <p className="text-xs text-slate-500">
                  Current Stage
                </p>

                <p className="mt-1 font-semibold text-white">
                  {result.current_stage || "-"}
                </p>

              </div>

              {/* PRIMARY SKILL */}

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Target className="h-5 w-5" />
                </div>

                <p className="text-xs text-slate-500">
                  Primary Skill
                </p>

                <p className="mt-1 font-semibold text-white">
                  {result.primary_skill || "-"}
                </p>

              </div>

              {/* RECOMMENDED STREAM */}

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                  <BookOpen className="h-5 w-5" />
                </div>

                <p className="text-xs text-slate-500">
                  Recommended Stream
                </p>

                <p className="mt-1 font-semibold text-white">
                  {result.recommended_stream || "-"}
                </p>

              </div>

              {/* TARGET EXAMS */}

              <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">

                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
                  <Award className="h-5 w-5" />
                </div>

                <p className="text-xs text-slate-500">
                  Target Exams
                </p>

                <p className="mt-1 font-semibold text-white">
                  {targetExams.length
                    ? targetExams.join(", ")
                    : "-"}
                </p>

              </div>

            </div>

            {/* ==================================================
                ROADMAP
            ================================================== */}

            {roadmap.length > 0 && (
              <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">

                <div className="mb-8">

                  <h3 className="text-2xl font-bold text-white">
                    Your Career Roadmap
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Follow these steps to reach your career goal.
                  </p>

                </div>

                <div className="space-y-6">

                  {roadmap.map(
                    (item, index) => (
                      <div
                        key={
                          item.step ||
                          index
                        }
                        className="relative flex gap-5"
                      >

                        {index <
                          roadmap.length - 1 && (
                            <div className="absolute left-5 top-12 h-full w-px bg-gradient-to-b from-cyan-400/40 to-violet-500/10" />
                          )}

                        <div className="relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-500 text-sm font-bold text-white shadow-lg shadow-cyan-500/10">
                          {item.step ||
                            index + 1}
                        </div>

                        <div className="flex-1 rounded-2xl border border-white/10 bg-white/[0.03] p-5">

                          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

                            <h4 className="text-lg font-semibold text-white">
                              {item.title}
                            </h4>

                            <span className="w-fit rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-medium text-cyan-300">
                              {item.stage}
                            </span>

                          </div>

                          {item.description && (
                            <p className="mt-3 leading-7 text-slate-400">
                              {item.description}
                            </p>
                          )}

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* ==================================================
                RECOMMENDED COLLEGES
            ================================================== */}

            {recommendedColleges.length > 0 && (
              <div className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">

                <div className="mb-6">

                  <h3 className="text-2xl font-bold text-white">
                    Recommended Colleges
                  </h3>

                  <p className="mt-2 text-sm text-slate-400">
                    Institutions recommended for your career path.
                  </p>

                </div>

                <div className="grid gap-4 md:grid-cols-2">

                  {recommendedColleges.map(
                    (college, index) => (
                      <div
                        key={
                          college.name ||
                          index
                        }
                        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-cyan-400/30 hover:bg-white/[0.05]"
                      >

                        <div className="flex gap-4">

                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
                            <Building2 className="h-5 w-5" />
                          </div>

                          <div className="min-w-0 flex-1">

                            <h4 className="font-semibold text-white">
                              {college.name}
                            </h4>

                            <div className="mt-2 space-y-1 text-sm text-slate-400">

                              <p>
                                <span className="text-slate-500">
                                  Type:
                                </span>{" "}
                                {college.type || "-"}
                              </p>

                              <p>
                                <span className="text-slate-500">
                                  Location:
                                </span>{" "}
                                {college.location || "-"}
                              </p>

                              <p>
                                <span className="text-slate-500">
                                  Admission:
                                </span>{" "}
                                {college.admission || "-"}
                              </p>

                            </div>

                          </div>

                          <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-slate-600" />

                        </div>

                      </div>
                    )
                  )}

                </div>

              </div>
            )}

            {/* ==================================================
                NEXT STEP
            ================================================== */}

            {result.recommended_next_step && (
              <div className="mt-8 rounded-3xl border border-cyan-400/20 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 p-6 sm:p-8">

                <div className="flex gap-4">

                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                    <Target className="h-5 w-5" />
                  </div>

                  <div>

                    <h3 className="text-lg font-bold text-white">
                      Recommended Next Step
                    </h3>

                    <p className="mt-2 leading-7 text-slate-300">
                      {result.recommended_next_step}
                    </p>

                  </div>

                </div>

              </div>
            )}

            {/* ==================================================
                COURSE QUESTION
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: 0.2,
              }}
              className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-xl backdrop-blur-xl sm:p-8"
            >

              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">

                <div className="flex gap-4">

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <BookOpen className="h-6 w-6" />
                  </div>

                  <div>

                    <h3 className="text-xl font-bold text-white">
                      Want to improve your skills?
                    </h3>

                    <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                      Would you like to explore courses
                      recommended specifically for your
                      career path?
                    </p>

                  </div>

                </div>

                {/* YES / NO */}

                <div className="flex shrink-0 gap-3">

                  <button
                    type="button"
                    disabled={courseLoading}
                    onClick={() =>
                      updateCoursePreference(true)
                    }
                    className="rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/10 transition hover:scale-105 hover:shadow-cyan-500/20 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {courseLoading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Saving...
                      </span>
                    ) : (
                      "Yes, Show Courses"
                    )}
                  </button>

                  <button
                    type="button"
                    disabled={courseLoading}
                    onClick={() =>
                      updateCoursePreference(false)
                    }
                    className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/10 hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    No
                  </button>

                </div>

              </div>

              {/* COURSE API ERROR */}

              {courseError && (
                <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {courseError}
                </div>
              )}

            </motion.div>

            {/* ==================================================
                RECOMMENDED COURSES
            ================================================== */}

            {/* ==================================================
    RECOMMENDED COURSES
================================================== */}

            {showCourses && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 25,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="mt-8 rounded-3xl border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8"
              >
                {/* COURSE HEADER */}
                <div className="mb-7">
                  <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-3 py-1 text-xs font-semibold text-violet-300">
                    <BookOpen className="h-4 w-4" />
                    Recommended Courses
                  </div>

                  <h3 className="mt-4 text-2xl font-bold text-white">
                    Courses for Your Career
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Build the skills you need to move closer to your career goal with
                    these recommended courses.
                  </p>
                </div>

                {/* COURSE CARDS */}

                {courses.length > 0 ? (
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {courses.map((course, i) => {
                      /*
                       * Check enrollment from both:
                       * 1. enrolledCourseIds state
                       * 2. course.enrolled returned by API
                       */
                      const isEnrolled =
                        enrolledCourseIds.includes(course.id) ||
                        course.enrolled === true;

                      return (
                        <motion.div
                          key={course.id}
                          initial={{
                            opacity: 0,
                            y: 20,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay: i * 0.06,
                          }}
                          whileHover={{
                            y: -6,
                          }}
                          className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-xl transition hover:border-cyan-400/30 hover:bg-white/[0.05]"
                        >
                          {/* ==================================================
                  IMAGE
              ================================================== */}

                          <div className="relative h-44 overflow-hidden bg-slate-800">
                            {course.thumbnail ? (
                              <img
                                src={course.thumbnail}
                                alt={course.title || "Course"}
                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-cyan-500/20 to-violet-500/20">
                                <BookOpen className="h-12 w-12 text-cyan-400/70" />
                              </div>
                            )}

                            {/* CATEGORY */}

                            <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-slate-950/80 px-3 py-1 text-xs font-bold text-slate-200 backdrop-blur">
                              {course.category?.name ||
                                course.category_name ||
                                course.category ||
                                "Course"}
                            </span>

                            {/* ENROLLED BADGE */}

                            {isEnrolled && (
                              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-emerald-400/30 bg-emerald-500/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Enrolled
                              </span>
                            )}
                          </div>

                          {/* ==================================================
                  CONTENT
              ================================================== */}

                          <div className="flex flex-1 flex-col p-6">
                            {/* TITLE */}

                            <h4 className="text-[17px] font-bold text-white">
                              {course.title || "Course"}
                            </h4>

                            {/* DESCRIPTION */}

                            <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-400">
                              {course.description ||
                                "Recommended course for your career path."}
                            </p>

                            {/* DETAILS */}

                            <div className="mt-4 flex items-center justify-between text-[13px] text-slate-400">
                              {/* DURATION */}

                              <span className="flex items-center gap-1">
                                <Clock className="h-4 w-4" />

                                {course.duration || "Self paced"}
                              </span>

                              {/* DIFFICULTY */}

                              <span className="flex items-center gap-1">
                                <BookOpen className="h-4 w-4" />

                                {course.difficulty || "Beginner"}
                              </span>
                            </div>

                            {/* LANGUAGE */}

                            {course.language && (
                              <div className="mt-3 text-xs text-slate-500">
                                Language:{" "}
                                <span className="text-slate-400">
                                  {course.language}
                                </span>
                              </div>
                            )}

                            {/* ==================================================
                    BUTTON
                ================================================== */}

                            <button
                              type="button"
                              disabled={enrollingCourseId === course.id}
                              onClick={() => {
                                if (isEnrolled) {
                                  navigate(`/skillhub/journey/${course.id}`);
                                } else {
                                  enroll(course.id);
                                }
                              }}
                              className={`mt-5 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white transition ${isEnrolled
                                ? "bg-emerald-500 hover:bg-emerald-600"
                                : "bg-gradient-to-r from-blue-600 to-cyan-500"
                                } disabled:cursor-not-allowed disabled:opacity-60`}
                            >
                              {enrollingCourseId === course.id ? (
                                <>
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                  Enrolling...
                                </>
                              ) : isEnrolled ? (
                                <>
                                  Continue
                                  <ArrowRight className="h-4 w-4" />
                                </>
                              ) : (
                                <>
                                  Enroll Now
                                  <ChevronRight className="h-4 w-4" />
                                </>
                              )}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center text-sm text-slate-400">
                    No recommended courses found for your career path.
                  </div>
                )}
              </motion.div>
            )}




          </motion.div>
        )}

      </div>
    </div>
  );
}