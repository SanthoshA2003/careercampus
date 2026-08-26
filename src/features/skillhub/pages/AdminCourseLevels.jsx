import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Zap, BookOpen, Loader2, ArrowLeft } from "lucide-react";
import Shell from "@/features/skillhub/components/Shell";
import { api } from "@/services/api";
import { toast } from "sonner";


const STAGES = ["Beginner", "Intermediate", "Expert"];

export default function AdminCourseLevels() {
  const { courseId } = useParams();
 const navigate = useNavigate();
  const [levels, setLevels] = useState([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FETCH LEVELS BY COURSE ID
  // ==========================================
  const loadLevels = async () => {
    try {
      setLoading(true);

      console.log("Fetching levels for course:", courseId);

     const response = await api.levels({
  course_id: courseId,
  skip: 0,
  limit: 100,
});

      console.log("LEVELS RESPONSE:", response);

      // Supports:
      // []
      // { data: [] }
      // { data: { data: [] } }
      const levelData =
        response?.data?.data ||
        response?.data ||
        response ||
        [];

      setLevels(Array.isArray(levelData) ? levelData : []);
    } catch (error) {
      console.error(
        "FAILED TO LOAD LEVELS:",
        error?.response?.data || error
      );

      toast.error("Failed to load levels");

      setLevels([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      loadLevels();
    }
  }, [courseId]);

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <Shell>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </Shell>
    );
  }

  // ==========================================
  // GROUP LEVELS BY STAGE
  // ==========================================

  const levelsByStage = STAGES.reduce((acc, stage) => {
    acc[stage] = levels
      .filter(
        (level) =>
          level.stage?.toLowerCase() === stage.toLowerCase()
      )
      .sort(
        (a, b) =>
          Number(a.level_number || 0) -
          Number(b.level_number || 0)
      );

    return acc;
  }, {});

  return (
    <Shell 
     showBackButton
    onBack={() => navigate("/skillhub/admin/courses")}
  >
      <div className="mx-auto max-w-[1400px]">

        {/* ======================================
            PAGE HEADER
        ====================================== */}

       <div className="mb-12">

  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-400">
    Course Levels
  </p>

  <h1 className="mt-3 text-3xl font-black tracking-tight text-white md:text-5xl">
    Manage Levels
  </h1>

  <p className="mt-3 text-sm leading-relaxed text-slate-400 md:text-base">
    View and manage all learning levels for this course.
  </p>
</div>

        {/* ======================================
            NO LEVELS
        ====================================== */}

        {levels.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10">
              <BookOpen
                size={30}
                className="text-cyan-400"
              />
            </div>

            <h3 className="mt-5 text-lg font-bold text-white">
              No levels available
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              No learning levels have been created for this course yet.
            </p>
          </div>
        )}

        {/* ======================================
            LEVELS BY STAGE
        ====================================== */}

        {levels.length > 0 && (
          <div className="space-y-12">

            {STAGES.map((stage) => {
              const stageLevels =
                levelsByStage[stage] || [];

              return (
                <section key={stage}>

                  {/* STAGE HEADER */}

                  <div className="mb-5 flex items-center justify-between">

                    <h2 className="text-xl font-black uppercase tracking-wide text-white">
                      {stage}
                    </h2>

                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                      {stageLevels.length}{" "}
                      {stageLevels.length === 1
                        ? "Level"
                        : "Levels"}
                    </span>

                  </div>

                  {/* EMPTY STAGE */}

                  {stageLevels.length === 0 && (
                    <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
                      <p className="text-sm text-slate-500">
                        No {stage.toLowerCase()} levels available.
                      </p>
                    </div>
                  )}

                  {/* LEVEL CARDS */}

                  {stageLevels.length > 0 && (
                    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

                      {stageLevels.map((level) => (

                        <div
                          key={level.id}
                          data-testid={`admin-level-${level.id}`}
                          className="
                            min-h-[160px]
                            rounded-2xl
                            border
                            border-white/10
                            bg-[#17181d]
                            p-6
                            transition-all
                            duration-200
                            hover:-translate-y-1
                            hover:border-cyan-400/30
                            hover:bg-white/[0.03]
                          "
                        >

                          {/* TOP */}

                          <div className="flex items-start justify-between">

                            <span className="text-4xl font-black tracking-tight text-blue-400">
                              L{level.level_number}
                            </span>

                           <Zap
  size={20}
  className="text-violet-400"
  fill="currentColor"
/>

                          </div>

                          {/* TITLE */}

                          <h3 className="mt-4 line-clamp-2 text-sm font-bold text-white">
                            {level.title}
                          </h3>

                          {/* DESCRIPTION */}

                          {level.description && (
                            <p className="mt-2 line-clamp-1 text-xs text-slate-400">
                              {level.description}
                            </p>
                          )}

                          {/* XP AND DURATION */}

                          <p className="mt-3 text-xs text-slate-500">

                            {level.xp ?? 0} XP

                            {" · "}

                            {level.duration || "0 min"}

                          </p>

                        </div>

                      ))}

                    </div>
                  )}

                </section>
              );
            })}

          </div>
        )}

      </div>
    </Shell>
  );
}