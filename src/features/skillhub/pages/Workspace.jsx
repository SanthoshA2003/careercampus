import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import {
  ArrowLeft,
  Play,
  Lock,
  Loader2,
  CheckCircle2,
  XCircle,
  Terminal,
  Zap,
  Target,
  BookOpen,
  Lightbulb,
  AlertTriangle,
  ListChecks,
  ChevronRight,
  PartyPopper,
  Flag,
} from "lucide-react";

import CodeEditor from "@/features/skillhub/components/CodeEditor";
import { api } from "@/services/api";
import { useAcademyAuth } from "@/context/AuthContext";
import { toast } from "sonner";

const LANGS = [
  {
    id: "python",
    label: "Python",
  },
  {
    id: "javascript",
    label: "JavaScript",
  },
  {
    id: "java",
    label: "Java (soon)",
  },
];

const fmt = (s) =>
  `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

export default function Workspace() {
  const { levelId } = useParams();
  const nav = useNavigate();
  const { refresh } = useAcademyAuth();

  // ==================================================
  // STATE
  // ==================================================

  const [level, setLevel] = useState(null);
  const [nextLevelId, setNextLevelId] = useState(null);

  const [passed, setPassed] = useState(new Set());

  const [videoDone, setVideoDone] = useState(false);

  const [activeCp, setActiveCp] = useState(null);

  const [language, setLanguage] = useState("python");

  const [codeByCp, setCodeByCp] = useState({});

  const [stdin, setStdin] = useState("");

  const [tab, setTab] = useState("tests");

  const [runOut, setRunOut] = useState(null);

  const [results, setResults] = useState(null);

  const [running, setRunning] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);

  const [duration, setDuration] = useState(0);

  const [completedModal, setCompletedModal] = useState(false);

  const [videoError, setVideoError] = useState(false);

  const videoRef = useRef(null);

  // ==================================================
  // CHECKPOINTS
  // ==================================================

  const checkpoints = useMemo(() => {
    return (level?.checkpoints || [])
      .slice()
      .sort((a, b) => a.order - b.order);
  }, [level]);

  const firstUnpassed = useMemo(() => {
    return checkpoints.find((c) => !passed.has(c.id));
  }, [checkpoints, passed]);

  const allPassed =
    checkpoints.length > 0 &&
    checkpoints.every((c) => passed.has(c.id));

  // ==================================================
  // LOAD LEVEL
  // ==================================================

  useEffect(() => {
    let mounted = true;

    const loadLevel = async () => {
      try {
        // Reset previous level state
        setLevel(null);
        setActiveCp(null);
        setResults(null);
        setRunOut(null);
        setVideoError(false);
        setCurrentTime(0);
        setDuration(0);

        console.log("Loading level:", levelId);

        const d = await api.level(levelId);

        console.log("LEVEL API RESPONSE:", d);

        if (!mounted) return;

        // ------------------------------------------------
        // IMPORTANT:
        // API response itself is the level object
        // ------------------------------------------------

        setLevel(d);

        // ------------------------------------------------
        // Next level
        // ------------------------------------------------

        setNextLevelId(d?.nextLevelId || d?.next_level_id || null);

        // ------------------------------------------------
        // Progress
        // ------------------------------------------------

        const progress = d?.progress || {};

        console.log("LEVEL PROGRESS:", progress);

        // Backend may return:
        //
        // checkpointsPassed: ["id1", "id2"]
        //
        // OR
        //
        // checkpointsPassed: 2
        //
        // Handle both safely.

        let passedIds = [];

        if (Array.isArray(progress.checkpointsPassed)) {
          passedIds = progress.checkpointsPassed;
        } else if (Array.isArray(progress.checkpoints_passed)) {
          passedIds = progress.checkpoints_passed;
        }

        setPassed(new Set(passedIds));

        // ------------------------------------------------
        // Video progress
        // ------------------------------------------------

        setVideoDone(
          Boolean(
            progress.videoCompleted ??
              progress.video_completed ??
              d?.videoCompleted ??
              d?.video_completed ??
              false
          )
        );

        console.log("Level loaded successfully:", d);
      } catch (e) {
        console.error("LEVEL API ERROR:", e);

        console.error(
          "LEVEL API RESPONSE:",
          e?.response?.data
        );

        if (!mounted) return;

        toast.error(
          e?.response?.data?.detail ||
            e?.response?.data?.message ||
            "Cannot open level"
        );

        // There is no `/skillhub/journey` route
        // in your current SkillHubApp.
        nav("/skillhub", { replace: true });
      }
    };

    loadLevel();

    return () => {
      mounted = false;
    };
  }, [levelId, nav]);

  // ==================================================
  // ACTIVE CODE
  // ==================================================

  const activeCode = activeCp
    ? codeByCp[activeCp.id] ??
      activeCp.starterCode?.[language] ??
      ""
    : codeByCp.__scratch ?? "";

  const setActiveCode = (code) => {
    setCodeByCp((m) => ({
      ...m,
      [activeCp ? activeCp.id : "__scratch"]: code,
    }));
  };

  // ==================================================
  // LANGUAGE CHANGE
  // ==================================================

  useEffect(() => {
    if (
      activeCp &&
      codeByCp[activeCp.id] === undefined
    ) {
      setCodeByCp((m) => ({
        ...m,
        [activeCp.id]:
          activeCp.starterCode?.[language] ?? "",
      }));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCp, language]);

  // ==================================================
  // VIDEO TIME
  // ==================================================

  const allowedTime = firstUnpassed
    ? firstUnpassed.atSeconds
    : duration || Infinity;

  const onTimeUpdate = () => {
    const v = videoRef.current;

    if (!v) return;

    const time = v.currentTime;

    setCurrentTime(time);

    // Unlock checkpoint
    if (
      firstUnpassed &&
      time >= firstUnpassed.atSeconds - 0.15 &&
      !activeCp
    ) {
      v.pause();

      v.currentTime = Math.min(
        firstUnpassed.atSeconds,
        v.duration || firstUnpassed.atSeconds
      );

      openCheckpoint(firstUnpassed);

      return;
    }

    // Prevent skipping ahead
    if (time > allowedTime + 0.4) {
      v.currentTime = allowedTime;
    }
  };

  // ==================================================
  // OPEN CHECKPOINT
  // ==================================================

  const openCheckpoint = (cp) => {
    setActiveCp(cp);

    setResults(null);
    setRunOut(null);
    setTab("tests");

    setCodeByCp((m) => {
      if (m[cp.id] !== undefined) {
        return m;
      }

      return {
        ...m,
        [cp.id]:
          cp.starterCode?.[language] ?? "",
      };
    });

    toast.info(
      `Checkpoint ${cp.order}: ${cp.title} — solve to continue`
    );
  };

  // ==================================================
  // VIDEO COMPLETION
  // ==================================================

  const onEnded = async () => {
    if (allPassed && !videoDone) {
      try {
        const r = await api.videoComplete(levelId);

        setVideoDone(true);

        if (r?.levelCompleted) {
          setCompletedModal(true);
          refresh();
        }
      } catch (e) {
        console.error(
          "Video completion failed:",
          e
        );
      }
    }
  };

  // ==================================================
  // MANUAL VIDEO COMPLETE
  // ==================================================

  const finishVideoManually = async () => {
    try {
      const r = await api.videoComplete(levelId);

      setVideoDone(true);

      if (r?.levelCompleted) {
        setCompletedModal(true);
        refresh();
      }
    } catch (e) {
      console.error(
        "Manual video completion failed:",
        e
      );

      toast.error("Could not complete level");
    }
  };

  // ==================================================
  // RUN CODE
  // ==================================================

 const runCode = async () => {
  if (!activeCp) {
    toast.error("Watch the video to unlock a challenge");
    return;
  }

  setRunning(true);
  setTab("output");

  try {
    const r = await api.execute(
      activeCp.id,
      language,
      activeCode,
      stdin
    );

    console.log("RUN RESPONSE:", r);

    setRunOut(r);
  } catch (e) {
    console.error("Run failed:", e);

    toast.error(
      e?.response?.data?.detail ||
      e?.response?.data?.message ||
      "Run failed"
    );
  } finally {
    setRunning(false);
  }
};

  // ==================================================
  // SUBMIT
  // ==================================================

  const submit = async () => {
    if (!activeCp) {
      toast.error(
        "Open a checkpoint before submitting"
      );
      return;
    }

    setSubmitting(true);

    try {
     const r = await api.submit(
  activeCp.id,
  language,
  activeCode
);

      console.log("SUBMIT RESPONSE:", r);

      setResults(r);
      setTab("tests");

      if (r?.allPassed) {
        const np = new Set(passed);

        np.add(activeCp.id);

        setPassed(np);

        toast.success(
          `Checkpoint solved! +${r.xpAwarded || 0} XP`
        );

        refresh();

        const doneAll = checkpoints.every((c) =>
          np.has(c.id)
        );

        setActiveCp(null);

        if (r?.levelCompleted) {
          setVideoDone(true);
          setCompletedModal(true);
        } else if (doneAll) {
          toast.info(
            "All challenges solved! Finish the video to complete the level."
          );
        } else {
          setTimeout(() => {
            videoRef.current?.play();
          }, 400);
        }
      } else {
        toast.error(
          `${r?.passedCount || 0}/${r?.total || 0} test cases passed. Keep trying!`
        );
      }
    } catch (e) {
      console.error(
        "Submission failed:",
        e
      );

      console.error(
        "Submission response:",
        e?.response?.data
      );

      toast.error(
        e?.response?.data?.detail ||
          e?.response?.data?.message ||
          "Submission failed"
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ==================================================
  // LOADING
  // ==================================================

  if (!level) {
    return (
      <div className="grid h-screen place-items-center bg-slate-950">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />

          <p className="text-sm text-slate-400">
            Loading level...
          </p>
        </div>
      </div>
    );
  }

  // ==================================================
  // THEORY
  // ==================================================

  const theory = level.theory || {};

  // ==================================================
  // RENDER
  // ==================================================

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">

      {/* ==================================================
          TOP BAR
      ================================================== */}

      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-slate-950/90 px-5 py-3 backdrop-blur-xl">

        <button
          onClick={() => nav(-1)}
          className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-white"
          data-testid="workspace-back"
        >
          <ArrowLeft className="h-4 w-4" />

          Journey
        </button>

        <div className="text-center">

          <p className="text-xs text-slate-500">
            {level.stage} · Level{" "}
            {level.levelNumber ??
              level.level_number}
          </p>

          <p className="text-sm font-bold text-white">
            {level.title}
          </p>

        </div>

        <div className="flex items-center gap-1.5">

          {checkpoints.map((c) => (
            <span
              key={c.id}
              title={c.title}
              className={`
                h-2.5 w-8 rounded-full
                ${
                  passed.has(c.id)
                    ? "bg-emerald-400"
                    : activeCp?.id === c.id
                    ? "bg-cyan-400"
                    : "bg-white/10"
                }
              `}
            />
          ))}

        </div>

      </header>

      {/* ==================================================
          MAIN
      ================================================== */}

      <div className="grid gap-4 p-4 lg:grid-cols-2">

        {/* ==================================================
            LEFT
        ================================================== */}

        <div className="space-y-4">

          {/* VIDEO */}

          <div className="overflow-hidden rounded-2xl border border-white/5 bg-black">

            <div className="relative">

              <video
                ref={videoRef}
                src={
                  level.video?.url?.startsWith("http")
                    ? level.video.url
                    : `${process.env.REACT_APP_BACKEND_URL || ""}${
                        level.video?.url || ""
                      }`
                }
                poster={level.video?.thumbnail}
                controls
                onTimeUpdate={onTimeUpdate}
                onLoadedMetadata={(e) =>
                  setDuration(
                    e.target.duration || 0
                  )
                }
                onSeeking={onTimeUpdate}
                onPlay={(e) => {
                  if (activeCp) {
                    e.target.pause();
                  }
                }}
                onEnded={onEnded}
                onError={() =>
                  setVideoError(true)
                }
                className="aspect-video w-full bg-black"
                data-testid="lesson-video"
              />

              {/* VIDEO ERROR */}

              <AnimatePresence>
                {videoError && !activeCp && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 grid place-items-center bg-slate-900/95 p-6 text-center"
                  >
                    <div>

                      <p className="text-sm text-slate-300">
                        Video couldn't load right now.
                      </p>

                      {firstUnpassed ? (
                        <button
                          onClick={() =>
                            openCheckpoint(
                              firstUnpassed
                            )
                          }
                          data-testid="video-fallback-open-cp"
                          className="mt-4 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white"
                        >
                          Start Checkpoint{" "}
                          {firstUnpassed.order}
                        </button>
                      ) : !videoDone ? (
                        <button
                          onClick={
                            finishVideoManually
                          }
                          data-testid="video-fallback-complete"
                          className="mt-4 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 px-5 py-2.5 text-sm font-bold text-white"
                        >
                          Complete Level
                        </button>
                      ) : (
                        <p className="mt-3 text-emerald-400">
                          Level complete!
                        </p>
                      )}

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* CHECKPOINT LOCK */}

              <AnimatePresence>
                {activeCp && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 grid place-items-center bg-slate-950/85 backdrop-blur-sm"
                  >
                    <div className="text-center">

                      <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 text-white">
                        <Lock className="h-7 w-7" />
                      </span>

                      <p className="mt-4 text-lg font-bold text-white">
                        Checkpoint{" "}
                        {activeCp.order}
                      </p>

                      <p className="text-sm text-slate-300">
                        Solve the challenge on the
                        right to continue →
                      </p>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* VIDEO TIMELINE */}

            <div className="relative h-8 bg-slate-900 px-3">

              <div className="relative top-3 h-1.5 w-full rounded-full bg-white/10">

                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-cyan-400 to-violet-500"
                  style={{
                    width: `${
                      duration
                        ? Math.min(
                            100,
                            (currentTime /
                              duration) *
                              100
                          )
                        : 0
                    }%`,
                  }}
                />

                {checkpoints.map((c) => (
                  <span
                    key={c.id}
                    title={`${fmt(
                      c.atSeconds
                    )} · ${c.title}`}
                    className={`
                      absolute -top-1 grid h-3.5 w-3.5
                      -translate-x-1/2 place-items-center
                      rounded-full border-2 border-slate-900
                      ${
                        passed.has(c.id)
                          ? "bg-emerald-400"
                          : "bg-amber-400"
                      }
                    `}
                    style={{
                      left: `${
                        duration
                          ? Math.min(
                              100,
                              (c.atSeconds /
                                duration) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />
                ))}

              </div>

            </div>

          </div>

          {/* THEORY */}

          <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">

            <h3 className="flex items-center gap-2 text-lg font-bold text-white">
              <BookOpen className="h-5 w-5 text-cyan-400" />

              Theory & Concepts
            </h3>

            <div className="mt-4 space-y-5 text-sm leading-relaxed">

              <div>

                <p className="mb-2 font-semibold text-slate-300">
                  Learning Objectives
                </p>

                <ul className="space-y-1.5">

                  {(theory.objectives || []).map(
                    (o) => (
                      <li
                        key={o}
                        className="flex items-start gap-2 text-slate-400"
                      >
                        <Target className="mt-0.5 h-3.5 w-3.5 shrink-0 text-cyan-400" />

                        {o}
                      </li>
                    )
                  )}

                </ul>

              </div>

              {theory.explanation && (
                <p className="text-slate-400">
                  {theory.explanation}
                </p>
              )}

              {(theory.codeExamples || []).map(
                (ex) => (
                  <div key={ex.title}>

                    <p className="mb-1.5 font-semibold text-slate-300">
                      {ex.title}
                    </p>

                    <pre className="overflow-x-auto rounded-xl border border-white/5 bg-slate-950 p-3 text-xs text-cyan-200">
                      <code>{ex.code}</code>
                    </pre>

                  </div>
                )
              )}

              <div className="grid gap-4 sm:grid-cols-2">

                <div>

                  <p className="mb-2 flex items-center gap-1.5 font-semibold text-emerald-400">
                    <ListChecks className="h-4 w-4" />

                    Best Practices
                  </p>

                  <ul className="space-y-1 text-slate-400">

                    {(theory.bestPractices || []).map(
                      (b) => (
                        <li key={b}>
                          • {b}
                        </li>
                      )
                    )}

                  </ul>

                </div>

                <div>

                  <p className="mb-2 flex items-center gap-1.5 font-semibold text-amber-400">
                    <AlertTriangle className="h-4 w-4" />

                    Common Mistakes
                  </p>

                  <ul className="space-y-1 text-slate-400">

                    {(theory.commonMistakes || []).map(
                      (b) => (
                        <li key={b}>
                          • {b}
                        </li>
                      )
                    )}

                  </ul>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ==================================================
            RIGHT
        ================================================== */}

        <div className="space-y-4">

          {/* CHALLENGE */}

          <div
            className={`
              rounded-2xl border p-6 transition-colors
              ${
                activeCp
                  ? "border-cyan-400/40 bg-cyan-400/[0.06]"
                  : "border-white/5 bg-white/[0.03]"
              }
            `}
            data-testid="challenge-panel"
          >

            {activeCp ? (
              <>

                <div className="flex items-center justify-between">

                  <span className="rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-3 py-1 text-xs font-bold text-white">
                    Checkpoint{" "}
                    {activeCp.order} ·{" "}
                    {activeCp.difficulty}
                  </span>

                  <span className="flex items-center gap-1 text-xs font-bold text-cyan-400">

                    <Zap className="h-3.5 w-3.5 fill-current" />

                    {activeCp.xp} XP

                  </span>

                </div>

                <h3 className="mt-3 text-lg font-bold text-white">
                  {activeCp.title}
                </h3>

                <p className="mt-1 text-sm italic text-slate-400">
                  {activeCp.scenario}
                </p>

                <p className="mt-3 whitespace-pre-line text-sm text-slate-300">
                  {activeCp.problemStatement}
                </p>

                {activeCp.hints?.length > 0 && (
                  <details className="mt-3">

                    <summary className="cursor-pointer text-xs font-semibold text-amber-400">

                      <Lightbulb className="mr-1 inline h-3.5 w-3.5" />

                      Hints

                    </summary>

                    <ul className="mt-2 space-y-1 text-xs text-slate-400">

                      {activeCp.hints.map(
                        (h) => (
                          <li key={h}>
                            • {h}
                          </li>
                        )
                      )}

                    </ul>

                  </details>
                )}

              </>
            ) : (

              <div className="py-4 text-center">

                <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-white/5 text-slate-400">

                  <Play className="h-6 w-6" />

                </span>

                <p className="mt-3 font-semibold text-white">

                  {allPassed
                    ? "All challenges solved 🎉"
                    : "Watch the video to unlock challenges"}

                </p>

                <p className="mt-1 text-sm text-slate-400">

                  {allPassed
                    ? videoDone
                      ? "Level complete!"
                      : "Finish the video to complete this level."
                    : `A coding challenge appears at each checkpoint (${checkpoints
                        .map((c) =>
                          fmt(c.atSeconds)
                        )
                        .join(
                          ", "
                        )}). Use the editor below to experiment.`}

                </p>

              </div>

            )}

          </div>

          {/* CODING WORKSPACE */}

          <div className="overflow-hidden rounded-2xl border border-white/5 bg-slate-900">

            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">

              <div className="flex items-center gap-2">

                <Terminal className="h-4 w-4 text-cyan-400" />

                <select
                  value={language}
                  onChange={(e) =>
                    setLanguage(e.target.value)
                  }
                  data-testid="language-select"
                  className="rounded-lg border border-white/10 bg-slate-950 px-2.5 py-1.5 text-xs font-semibold text-white outline-none"
                >

                  {LANGS.map((l) => (
                    <option
                      key={l.id}
                      value={l.id}
                      disabled={l.id === "java"}
                    >
                      {l.label}
                    </option>
                  ))}

                </select>

              </div>

              <div className="flex items-center gap-2">

                <button
                  onClick={runCode}
                  disabled={running}
                  data-testid="run-btn"
                  className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3.5 py-1.5 text-xs font-semibold text-slate-200 transition-colors hover:bg-white/10 disabled:opacity-60"
                >

                  {running ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Play className="h-3.5 w-3.5" />
                  )}

                  Run

                </button>

                <button
                  onClick={submit}
                  disabled={
                    submitting || !activeCp
                  }
                  data-testid="submit-btn"
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-violet-500 px-4 py-1.5 text-xs font-bold text-white transition-transform hover:scale-105 disabled:opacity-50"
                >

                  {submitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  )}

                  Submit

                </button>

              </div>

            </div>

            <div className="h-[300px]">

              <CodeEditor
                language={language}
                value={activeCode}
                onChange={setActiveCode}
              />

            </div>

            {/* CONSOLE */}

            <div className="border-t border-white/5">

              <div className="flex items-center gap-1 px-3 pt-2">

                {["tests", "output"].map(
                  (t) => (
                    <button
                      key={t}
                      onClick={() =>
                        setTab(t)
                      }
                      className={`
                        rounded-t-lg px-3 py-1.5
                        text-xs font-semibold capitalize
                        ${
                          tab === t
                            ? "bg-slate-950 text-white"
                            : "text-slate-400"
                        }
                      `}
                    >
                      {t === "tests"
                        ? "Test Cases"
                        : "Output"}
                    </button>
                  )
                )}

              </div>

              <div className="max-h-52 overflow-auto bg-slate-950 p-4 text-xs">

                {tab === "output" ? (

                  <div>

                    <div className="mb-2">

                      <label className="text-slate-500">
                        Custom Input (stdin)
                      </label>

                      <textarea
                        value={stdin}
                        onChange={(e) =>
                          setStdin(
                            e.target.value
                          )
                        }
                        rows={2}
                        placeholder="Type input for Run..."
                        className="mt-1 w-full rounded-lg border border-white/10 bg-slate-900 p-2 font-mono text-slate-200 outline-none"
                      />

                    </div>

                    {runOut ? (
                      <>

                        {runOut.stdout && (
                          <pre className="whitespace-pre-wrap text-emerald-300">
                            {runOut.stdout}
                          </pre>
                        )}

                        {runOut.stderr && (
                          <pre className="whitespace-pre-wrap text-rose-400">
                            {runOut.stderr}
                          </pre>
                        )}

                        <p className="mt-1 text-slate-500">
                          Exit{" "}
                          {runOut.exit_code} ·{" "}
                          {runOut.time_ms}ms
                        </p>

                      </>
                    ) : (
                      <p className="text-slate-500">
                        Press Run to execute your
                        code.
                      </p>
                    )}

                  </div>

                ) : (

                  <div className="space-y-2">

                    {activeCp?.visibleTestCases?.map(
                      (tc, i) => {

                        const res =
                          results?.results?.find(
                            (r) =>
                              r.index === i
                          );

                        return (
                          <div
                            key={i}
                            className={`
                              rounded-lg border p-2.5
                              ${
                                res
                                  ? res.passed
                                    ? "border-emerald-500/40 bg-emerald-500/5"
                                    : "border-rose-500/40 bg-rose-500/5"
                                  : "border-white/5"
                              }
                            `}
                          >

                            <div className="flex items-center justify-between">

                              <span className="font-semibold text-slate-300">
                                Test {i + 1}
                              </span>

                              {res &&
                                (res.passed ? (
                                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                                ) : (
                                  <XCircle className="h-4 w-4 text-rose-400" />
                                ))}

                            </div>

                            <p className="mt-1 text-slate-500">

                              Input:{" "}

                              <span className="text-slate-300">
                                {JSON.stringify(
                                  tc.input
                                )}
                              </span>

                            </p>

                            <p className="text-slate-500">

                              Expected:{" "}

                              <span className="text-slate-300">
                                {JSON.stringify(
                                  tc.expectedOutput
                                )}
                              </span>

                            </p>

                            {res &&
                              !res.passed &&
                              res.actual !==
                                undefined && (
                                <p className="text-rose-400">
                                  Got:{" "}
                                  {JSON.stringify(
                                    res.actual
                                  )}
                                </p>
                              )}

                          </div>
                        );
                      }
                    )}

                    {activeCp && (
                      <p className="text-slate-500">
                        +{" "}
                        {activeCp.hiddenCount ||
                          0}{" "}
                        hidden test case(s) run on
                        submit.
                      </p>
                    )}

                    {results && (
                      <div className="mt-1 flex flex-wrap gap-2">

                        {(results.results || [])
                          .filter(
                            (r) => r.hidden
                          )
                          .map((r) => (
                            <span
                              key={r.index}
                              className={`
                                rounded-md px-2 py-0.5
                                text-[11px] font-semibold
                                ${
                                  r.passed
                                    ? "bg-emerald-500/15 text-emerald-300"
                                    : "bg-rose-500/15 text-rose-300"
                                }
                              `}
                            >
                              Hidden #
                              {r.index + 1}{" "}
                              {r.passed
                                ? "✓"
                                : "✗"}
                            </span>
                          ))}

                      </div>
                    )}

                    {!activeCp && (
                      <p className="text-slate-500">
                        Test cases appear when a
                        checkpoint challenge is
                        active.
                      </p>
                    )}

                  </div>

                )}

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* ==================================================
          COMPLETION MODAL
      ================================================== */}

      <AnimatePresence>

        {completedModal && (
          <motion.div
            className="fixed inset-0 z-50 grid place-items-center bg-slate-950/70 p-4 backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >

            <motion.div
              initial={{
                scale: 0.9,
                y: 20,
              }}
              animate={{
                scale: 1,
                y: 0,
              }}
              className="glass-dark w-full max-w-md rounded-3xl p-8 text-center"
              data-testid="level-complete-modal"
            >

              <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-glow">

                <PartyPopper className="h-8 w-8" />

              </span>

              <h3 className="mt-5 text-2xl font-black text-white">
                Level Complete!
              </h3>

              <p className="mt-2 text-slate-300">
                You solved all checkpoints and
                finished {level.title}. The next
                level is unlocked.
              </p>

              <div className="mt-6 flex flex-col gap-3">

                {nextLevelId ? (
                  <button
                    onClick={() => {
                      setCompletedModal(
                        false
                      );

                      nav(
                        `/skillhub/level/${nextLevelId}`
                      );
                    }}
                    data-testid="next-level-btn"
                    className="flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 font-bold text-white"
                  >

                    Next Level

                    <ChevronRight className="h-4 w-4" />

                  </button>
                ) : (
                  <p className="flex items-center justify-center gap-2 text-emerald-400">

                    <Flag className="h-4 w-4" />

                    You reached the end of the
                    path!

                  </p>
                )}

                <Link
                  to="/skillhub"
                  className="rounded-full border border-white/10 px-6 py-3 font-semibold text-slate-200 hover:bg-white/5"
                >
                  Back to SkillHub
                </Link>

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>

    </div>
  );
}