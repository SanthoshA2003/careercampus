import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock, Check, Play, Loader2 } from "lucide-react";
import Shell from "@/features/skillhub/components/Shell";
import { api } from "@/services/api";

const OFFSETS = [0, 70, 110, 70, 0, -70, -110, -70];

function Node({ node, index, onClick }) {
  const locked = !node.unlocked;
  const completed = node.completed;
  const current = node.unlocked && !node.completed;

  const offset = OFFSETS[index % OFFSETS.length];

  const ring = completed
    ? "from-amber-400 to-orange-500"
    : current
    ? "from-cyan-400 to-violet-500"
    : "from-slate-700 to-slate-800";

  return (
    <div
      className="relative flex flex-col items-center"
      style={{
        transform: `translateX(${offset}px)`,
      }}
    >
      <motion.button
        initial={{ opacity: 0, scale: 0.6 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        whileHover={!locked ? { scale: 1.08, y: -4 } : {}}
        onClick={() => !locked && onClick(node)}
        disabled={locked}
        className={`
          relative grid h-20 w-20 place-items-center
          rounded-full bg-gradient-to-br
          ${ring}
          ${
            current
              ? "shadow-glow ring-4 ring-cyan-400/40"
              : "shadow-medium"
          }
          ${
            locked
              ? "cursor-not-allowed opacity-60"
              : "cursor-pointer"
          }
        `}
      >
        <span className="grid h-16 w-16 place-items-center rounded-full bg-slate-950/40 text-white backdrop-blur">
          {locked ? (
            <Lock className="h-6 w-6 text-slate-400" />
          ) : completed ? (
            <Check className="h-7 w-7" />
          ) : (
            <Play className="h-6 w-6 fill-current" />
          )}
        </span>

        <span className="absolute -right-1 -top-1 grid h-7 w-7 place-items-center rounded-full border-2 border-slate-950 bg-white text-xs font-black text-slate-900">
          {node.level_number}
        </span>
      </motion.button>

      <div className="mt-2 text-center">
        <p
          className={`text-xs font-bold ${
            locked ? "text-slate-500" : "text-white"
          }`}
        >
          {node.completed_checkpoints}/
          {node.total_checkpoints} · {node.xp} XP
        </p>
      </div>
    </div>
  );
}

export default function Journey() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const nav = useNavigate();

  
  const { courseId } = useParams();

  useEffect(() => {
    const fetchJourney = async () => {
      try {
        setError(null);
        setData(null);

        if (!courseId) {
          throw new Error("Course ID not found");
        }

        console.log("Journey Course ID:", courseId);

        const journeyData = await api.journey(courseId);

        console.log("Journey Data:", journeyData);

        setData(journeyData);
      } catch (err) {
        console.error("Journey API Error:", err);

        setError(
          err?.response?.data?.detail ||
          err?.message ||
          "Failed to load journey"
        );
      }
    };

    fetchJourney();
  }, [courseId]);

  if (error) {
    return (
      <Shell>
        <div className="grid h-[60vh] place-items-center">
          <p className="text-red-400">{error}</p>
        </div>
      </Shell>
    );
  }

  if (!data) {
    return (
      <Shell>
        <div className="grid h-[60vh] place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-3xl">

        <h1 className="text-3xl font-black tracking-tight text-white">
          {data.course?.title}
        </h1>

        <p className="mt-2 text-slate-400">
          Follow the path. Complete every level. No skipping.
        </p>

        <div className="mt-10 space-y-16">
          {data.stages?.map((stage) => {
            const total = stage.total_levels;
            const done = stage.completed_levels;

            return (
              <div key={stage.stage} className="relative">

                <div className="sticky top-20 z-10 mb-8 flex items-center gap-3">
                  <span className="rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-1.5 text-sm font-black text-white shadow-medium">
                    {stage.stage}
                  </span>

                  <span className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-slate-400">
                    {done}/{total} completed
                  </span>
                </div>

                <div className="relative flex flex-col items-center gap-8">
                  <div className="absolute inset-y-0 left-1/2 w-1 -translate-x-1/2 bg-gradient-to-b from-white/5 via-white/10 to-white/5" />

                  {stage.levels?.map((node, i) => (
                    <Node
                      key={node.id}
                      node={node}
                      index={i}
                      onClick={(n) =>
                        nav(`/skillhub/level/${n.id}`)
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </Shell>
  );
}