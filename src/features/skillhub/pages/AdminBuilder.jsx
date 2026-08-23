import { useEffect, useState } from "react";
import { Plus, Loader2, Upload, Film, Layers, Flag, CheckCircle2 } from "lucide-react";
import Shell from "@/features/skillhub/components/Shell";
import { api } from "@/services/api";
import { toast } from "sonner";

const Input = (p) => <input {...p} className={`w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 ${p.className || ""}`} />;
const Area = (p) => <textarea {...p} className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-400" />;
const Label = ({ children }) => <label className="mb-1 block text-xs font-semibold uppercase tracking-wider text-slate-400">{children}</label>;
const Section = ({ title, icon: Icon, children }) => (
  <div className="rounded-2xl border border-white/5 bg-white/[0.03] p-6">
    <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-white"><Icon className="h-5 w-5 text-cyan-400" /> {title}</h3>
    {children}
  </div>
);

export default function AdminBuilder() {
  const [courses, setCourses] = useState([]);
  const [courseId, setCourseId] = useState("");
  const [levels, setLevels] = useState([]);
  const [levelId, setLevelId] = useState("");
  const [levelCheckpoints, setLevelCheckpoints] = useState([]);

const [course, setCourse] = useState({
  title: "",
  description: "",
  language: "Python",
  difficulty: "Beginner",
  duration: "",
  thumbnail: "",
  status: "published", 
  certificate_template: "",
});

const [level, setLevel] = useState({ stage: "Beginner", levelNumber: 1, title: "", description: "", xp: 100, video: { url: "" } });
  const [cp, setCp] = useState({ order: 1, atSeconds: 5, title: "", scenario: "", problemStatement: "", difficulty: "Easy", xp: 25, starter: "# write your code\n", vin: "", vout: "", hin: "", hout: "" });
  const [uploading, setUploading] = useState(false);
  const [busy, setBusy] = useState(false);

  const loadCourses = () => api.courses().then((c) => { setCourses(c); if (!courseId && c[0]) setCourseId(c[0].id); });
  useEffect(() => { loadCourses(); /* eslint-disable-next-line */ }, []);

useEffect(() => {
  if (!levelId) {
    setLevelCheckpoints([]);
    return;
  }

  const fetchCheckpoints = async () => {
    try {
      const data = await api.level(levelId);

      console.log("LEVEL WITH CHECKPOINTS:", data);

      setLevelCheckpoints(
        data?.checkpoints || []
      );
    } catch (error) {
      console.error(
        "Failed to load checkpoints:",
        error
      );

      setLevelCheckpoints([]);
    }
  };

  fetchCheckpoints();
}, [levelId]);


useEffect(() => {
  if (!courseId) return;

  const fetchLevels = async () => {
    try {
      const levelsData = await api.courseLevelsDropdown(courseId);

      console.log("Dropdown Levels:", levelsData);

      setLevels(levelsData);

      if (levelsData.length > 0) {
        setLevelId(levelsData[0].id);
      } else {
        setLevelId("");
      }
    } catch (error) {
      console.error(
        "Failed to fetch levels:",
        error.response?.data || error
      );

      setLevels([]);
      setLevelId("");
    }
  };

  fetchLevels();
}, [courseId]);

  const createCourse = async () => {
    if (!course.title) return toast.error("Course title required");
    setBusy(true);
    try { const c = await api.createCourse(course); toast.success("Course created"); setCourse({ ...course, title: "", description: "" }); await loadCourses(); setCourseId(c.id); }
    catch { toast.error("Failed"); } finally { setBusy(false); }
  };

const createLevel = async () => {
  if (!courseId) {
    return toast.error("Select a course");
  }

  if (!level.title.trim()) {
    return toast.error("Level title required");
  }

  setBusy(true);

  try {
    const l = await api.createLevel({
      course_id: courseId,
      stage: level.stage,
      stage_order: 1,
      level_number: Number(level.levelNumber),
      global_order: Number(level.levelNumber),
      title: level.title,
      description: level.description || "",
      objectives: [],
      xp: Number(level.xp),
      pass_percentage: 100,
      duration: "30 minutes",

      video: level.video.url
        ? {
            url: level.video.url,
          }
        : {},

      theory: {},
    });

    toast.success("Level created");

//     const list = await api.courseLevelsDropdown(courseId);

// setLevels(list);

    setLevelId(l.id);

    setLevel({
      stage: "Beginner",
      levelNumber: Number(level.levelNumber) + 1,
      title: "",
      description: "",
      xp: 100,
      video: { url: "" },
    });

  } catch (error) {
    console.error("Create level error:", error.response?.data || error);
    toast.error(
      error.response?.data?.message ||
      "Failed to create level"
    );
  } finally {
    setBusy(false);
  }
};

  const uploadVideo = async (e) => {
  const file = e.target.files?.[0];

  if (!file) return;

  setUploading(true);

  try {
    const response = await api.upload(file);

    console.log("Upload response:", response);

    setLevel((prev) => ({
      ...prev,
      video: {
        url: response.file_url,
      },
    }));

    toast.success("Video uploaded successfully");

  } catch (error) {
    console.error(
      "Video upload error:",
      error.response?.data || error
    );

    toast.error(
      error.response?.data?.message || "Video upload failed"
    );

  } finally {
    setUploading(false);
  }
};

  const addCheckpoint = async () => {
  if (!levelId) {
    return toast.error("Select a level");
  }

  if (!cp.title.trim()) {
    return toast.error("Challenge title required");
  }

  if (!cp.problemStatement.trim()) {
    return toast.error("Problem statement required");
  }

  setBusy(true);

  try {
  const newCheckpoint = await api.addCheckpoint({
    level_id: levelId,

    checkpoint_order: Number(cp.order),

    at_seconds: Number(cp.atSeconds),

    title: cp.title,

    scenario: cp.scenario || "",

    problem_statement: cp.problemStatement,

    objective: "",

    difficulty: cp.difficulty,

    marks: 25,

    xp: Number(cp.xp),

    retry_limit: 5,

    language: "python",

    starter_code: {
      code: cp.starter,
    },

    constraints: "",

    hints: [],

    solution: "",

    explanation: "",

    visible_test_cases:
      cp.vin || cp.vout
        ? [
            {
              input: cp.vin,
              expected_output: cp.vout,
            },
          ]
        : [],

    hidden_test_cases:
      cp.hin || cp.hout
        ? [
            {
              input: cp.hin,
              expected_output: cp.hout,
            },
          ]
        : [],
  });

  toast.success("Checkpoint added");


  setLevelCheckpoints((prev) => [
  ...prev,
  {
    id: newCheckpoint?.id || Date.now(),
    order: newCheckpoint?.order ?? Number(cp.order),
    atSeconds:
      newCheckpoint?.atSeconds ??
      newCheckpoint?.at_seconds ??
      Number(cp.atSeconds),
    title: newCheckpoint?.title ?? cp.title,
  },
]);

  // ADD THIS HERE
  const checkpointData = {
    id: newCheckpoint?.id || Date.now(),
    order: Number(cp.order),
    atSeconds: Number(cp.atSeconds),
    title: cp.title,
  };

  setLevels((prevLevels) =>
    prevLevels.map((level) =>
      level.id === levelId
        ? {
            ...level,
            checkpoints: [
              ...(level.checkpoints || []),
              checkpointData,
            ],
            checkpoint_count:
              (level.checkpoint_count || 0) + 1,
          }
        : level
    )
  );

  // Reset checkpoint form
  setCp((prev) => ({
    ...prev,
    order: Number(prev.order) + 1,
    atSeconds: Number(prev.atSeconds) + 5,
    title: "",
    scenario: "",
    problemStatement: "",
    starter: "# write your code\n",
    vin: "",
    vout: "",
    hin: "",
    hout: "",
  }));

} catch (error) {
  console.error(
    "Checkpoint error:",
    error.response?.data || error
  );

  toast.error(
    error.response?.data?.message ||
    "Failed to add checkpoint"
  );
} finally {
    setBusy(false);
  }
};

  const selectedLevel = levels.find((l) => l.id === levelId);

  return (
    <Shell>
      <div className="mx-auto max-w-5xl space-y-6">
        <h1 className="text-3xl font-black tracking-tight text-white">Course Builder</h1>

        {/* Create course */}
        <Section title="Create Course" icon={Plus}>
          <div className="grid gap-3 sm:grid-cols-2">
            <div><Label>Course Name</Label><Input value={course.title} onChange={(e) => setCourse({ ...course, title: e.target.value })} placeholder="Java Programming" data-testid="course-title" /></div>
            <div><Label>Programming Language</Label><Input value={course.language} onChange={(e) => setCourse({ ...course, language: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>Description</Label><Area rows={2} value={course.description} onChange={(e) => setCourse({ ...course, description: e.target.value })} /></div>
            <div><Label>Difficulty</Label><Input value={course.difficulty} onChange={(e) => setCourse({ ...course, difficulty: e.target.value })} /></div>
            <div><Label>Thumbnail URL</Label><Input value={course.thumbnail} onChange={(e) => setCourse({ ...course, thumbnail: e.target.value })} /></div>
          </div>
          <button onClick={createCourse} disabled={busy} data-testid="create-course-btn" className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white hover:scale-105 transition-transform disabled:opacity-60"><Plus className="h-4 w-4" /> Create Course</button>
        </Section>

        {/* Select course + add level */}
        <Section title="Add Stage & Level" icon={Layers}>
          <div className="mb-4"><Label>Course</Label>
            <select value={courseId} onChange={(e) => setCourseId(e.target.value)} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white">
              {courses.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div><Label>Stage</Label>
              <select value={level.stage} onChange={(e) => setLevel({ ...level, stage: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white">
                <option>Beginner</option><option>Intermediate</option><option>Expert</option>
              </select>
            </div>
            <div><Label>Level Number</Label><Input type="number" value={level.levelNumber} onChange={(e) => setLevel({ ...level, levelNumber: Number(e.target.value) })} /></div>
            <div><Label>XP Reward</Label><Input type="number" value={level.xp} onChange={(e) => setLevel({ ...level, xp: Number(e.target.value) })} /></div>
            <div className="sm:col-span-2"><Label>Level Title</Label><Input value={level.title} onChange={(e) => setLevel({ ...level, title: e.target.value })} data-testid="level-title" /></div>
            <div>
              <Label>Video</Label>
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-white/15 px-3 py-2.5 text-sm text-slate-300 hover:bg-white/5">
                {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />} {level.video.url ? "Video set ✓" : "Upload"}
                <input type="file" accept="video/*" className="hidden" onChange={uploadVideo} data-testid="video-upload" />
              </label>
            </div>
            <div className="sm:col-span-3"><Label>Or Video URL</Label><Input value={level.video.url} onChange={(e) => setLevel({ ...level, video: { url: e.target.value } })} placeholder="https://..." /></div>
          </div>
          <button onClick={createLevel} disabled={busy} data-testid="create-level-btn" className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white hover:scale-105 transition-transform disabled:opacity-60"><Plus className="h-4 w-4" /> Add Level</button>
        </Section>

        {/* Interactive timeline + challenge builder */}
        <Section title="Interactive Timeline & Challenge Builder" icon={Flag}>
          <div className="mb-4"><Label>Level</Label>
   <select
  value={levelId}
  onChange={(e) => setLevelId(e.target.value)}
  className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white"
>
  <option value="">Select Level</option>

  {levels.map((l) => (
    <option key={l.id} value={l.id}>
      {l.stage} · Level {l.level_number} ({l.checkpoint_count} checkpoints)
    </option>
  ))}
</select>
          </div>
          {/* timeline visual */}
          <div className="mb-5 rounded-xl border border-white/5 bg-slate-950 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs text-slate-400"><Film className="h-4 w-4" /> Click positions represent checkpoints on the video</div>
            <div className="relative h-2 w-full rounded-full bg-white/10">
              {levelCheckpoints.map((c) => (
                <span key={c.id} title={`${c.atSeconds}s · ${c.title}`} className="absolute -top-1 grid h-4 w-4 -translate-x-1/2 place-items-center rounded-full bg-amber-400" style={{ left: `${Math.min(c.atSeconds / 20 * 100, 100)}%` }} />
              ))}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {levelCheckpoints.map((c) => (
                <span key={c.id} className="rounded-lg bg-white/5 px-2.5 py-1 text-xs text-slate-300"><CheckCircle2 className="mr-1 inline h-3 w-3 text-emerald-400" />{c.order}. {c.title} @ {c.atSeconds}s</span>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div><Label>Order</Label><Input type="number" value={cp.order} onChange={(e) => setCp({ ...cp, order: e.target.value })} /></div>
            <div><Label>At Seconds</Label><Input type="number" value={cp.atSeconds} onChange={(e) => setCp({ ...cp, atSeconds: e.target.value })} /></div>
            <div><Label>Difficulty</Label>
              <select value={cp.difficulty} onChange={(e) => setCp({ ...cp, difficulty: e.target.value })} className="w-full rounded-xl border border-white/10 bg-slate-900 px-3 py-2.5 text-sm text-white"><option>Easy</option><option>Medium</option><option>Hard</option></select>
            </div>
            <div><Label>XP</Label><Input type="number" value={cp.xp} onChange={(e) => setCp({ ...cp, xp: e.target.value })} /></div>
            <div className="sm:col-span-4"><Label>Challenge Title</Label><Input value={cp.title} onChange={(e) => setCp({ ...cp, title: e.target.value })} data-testid="cp-title" /></div>
            <div className="sm:col-span-4"><Label>Business Scenario</Label><Input value={cp.scenario} onChange={(e) => setCp({ ...cp, scenario: e.target.value })} placeholder="You are building a billing system..." /></div>
            <div className="sm:col-span-4"><Label>Problem Statement</Label><Area rows={2} value={cp.problemStatement} onChange={(e) => setCp({ ...cp, problemStatement: e.target.value })} /></div>
            <div className="sm:col-span-4"><Label>Starter Code (Python)</Label><Area rows={2} value={cp.starter} onChange={(e) => setCp({ ...cp, starter: e.target.value })} className="font-mono" /></div>
            <div className="sm:col-span-2"><Label>Visible Test — Input</Label><Input value={cp.vin} onChange={(e) => setCp({ ...cp, vin: e.target.value })} placeholder="3 5" /></div>
            <div className="sm:col-span-2"><Label>Visible Test — Expected</Label><Input value={cp.vout} onChange={(e) => setCp({ ...cp, vout: e.target.value })} placeholder="8" /></div>
            <div className="sm:col-span-2"><Label>Hidden Test — Input</Label><Input value={cp.hin} onChange={(e) => setCp({ ...cp, hin: e.target.value })} /></div>
            <div className="sm:col-span-2"><Label>Hidden Test — Expected</Label><Input value={cp.hout} onChange={(e) => setCp({ ...cp, hout: e.target.value })} /></div>
          </div>
          <button onClick={addCheckpoint} disabled={busy} data-testid="add-checkpoint-btn" className="mt-4 flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-5 py-2.5 text-sm font-bold text-white hover:scale-105 transition-transform disabled:opacity-60"><Plus className="h-4 w-4" /> Add Checkpoint</button>
        </Section>
      </div>
    </Shell>
  );
}
