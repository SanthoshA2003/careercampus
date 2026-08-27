import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Gamepad2, Lock, Check, Zap, Trophy, Star } from "lucide-react";
import { Reveal, SectionTag } from "@/features/career/components/landing/primitives";
import { levels } from "@/features/career/services/landingData";

const stateStyles = {
  completed: {
    card: "border-amber-200 bg-gradient-to-b from-amber-50 to-white shadow-[0_0_30px_rgba(245,158,11,0.25)]",
    icon: "bg-gradient-to-br from-amber-400 to-orange-500 text-white",
    badge: "bg-amber-100 text-amber-700",
  },
  current: {
    card: "border-transparent bg-white shadow-glow ring-2 ring-blue-500/40",
    icon: "bg-gradient-to-br from-blue-600 to-green-500 text-white",
    badge: "bg-blue-100 text-blue-700",
  },
  locked: {
    card: "border-slate-200 bg-slate-50/70",
    icon: "bg-slate-200 text-slate-400",
    badge: "bg-slate-100 text-slate-400",
  },
};

export default function CareerElevator() {
  const trackRef = useRef(null);
  const completed = levels.filter((l) => l.state === "completed").length;
  const current = levels.find((l) => l.state === "current");
  const progressPct = ((completed + 0.5) / levels.length) * 100;

  return (
<section
  id="career-elevator"
  className="relative overflow-hidden bg-[#F1F5F9] pt-12 pb-24 lg:pt-16 lg:pb-32"
  data-testid="career-elevator-section"
>
        <div className="aurora-blob left-[10%] top-[0%] h-80 w-80 bg-blue-300/30" />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionTag icon={Gamepad2}>Career Elevator</SectionTag>
<h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
    <span className="block leading-[1]">

  Your Career Doesn't Grow Overnight.{" "}
  </span>
    <span className="gradient-text-career leading-[1]">
    It Grows One Step At A Time.
  </span>
</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-600">
            Every achievement unlocks the next opportunity. MyMentor transforms your career journey into a
            structured progression where every milestone prepares you for the next.
          </p>
        </Reveal>

        {/* Progress bar */}
        <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
          <div className="flex items-center justify-between text-sm font-semibold text-slate-500">
            <span>Level 1</span>
            <span className="flex items-center gap-1 text-blue-600"><Zap className="h-4 w-4 fill-current" /> Your progress</span>
            <span>Level 11</span>
          </div>
          <div className="relative mt-2 h-3 w-full overflow-hidden rounded-full bg-slate-200">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 via-blue-600 to-cyan-500"
              initial={{ width: 0 }}
              whileInView={{ width: `${progressPct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
        </Reveal>
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} className="no-scrollbar gaming-track mt-14 flex gap-5 overflow-x-auto px-5 pb-8 lg:px-8">
        <div className="hidden shrink-0 lg:block lg:w-[calc((100vw-1280px)/2)]" />
        {levels.map((lvl, i) => {
          const s = stateStyles[lvl.state];
          const Icon = lvl.icon;
          return (
            <motion.div
              key={lvl.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 6) * 0.05 }}
              whileHover={{ y: -10 }}
              className={`group relative w-[210px] shrink-0 rounded-3xl border p-6 transition-shadow ${s.card}`}
              data-testid={`elevator-level-${lvl.n}`}
            >
              {lvl.state === "completed" && (
                <>
                  <span className="absolute right-4 top-4 text-amber-400 opacity-0 transition-opacity group-hover:opacity-100"><Star className="h-3 w-3 animate-ping fill-current" /></span>
                  <span className="absolute left-5 top-6 text-orange-400 opacity-0 transition-opacity group-hover:opacity-100"><Star className="h-2 w-2 fill-current" style={{ animation: "pulse-ring 1s ease-out infinite" }} /></span>
                </>
              )}
              <div className="flex items-center justify-between">
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${s.badge}`}>LEVEL {lvl.n}</span>
                {lvl.state === "completed" ? <Check className="h-4 w-4 text-amber-500" /> : lvl.state === "locked" ? <Lock className="h-4 w-4 text-slate-300" /> : <Zap className="h-4 w-4 fill-current text-blue-600" />}
              </div>
              <div className={`mt-5 grid h-14 w-14 place-items-center rounded-2xl ${s.icon}`}>
                <Icon className="h-7 w-7" />
              </div>
              <h3 className={`mt-4 text-lg font-bold ${lvl.state === "locked" ? "text-slate-400" : "text-slate-900"}`}>{lvl.title}</h3>
              <p className={`mt-1 text-[13px] leading-snug ${lvl.state === "locked" ? "text-slate-400" : "text-slate-500"}`}>{lvl.desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-sm font-black">
                <Zap className="h-4 w-4 fill-current text-cyan-500" />
                <span className={lvl.state === "locked" ? "text-slate-400" : "gradient-text"}>{lvl.xp} XP</span>
              </div>
              {/* reward reveal */}
              <div className="mt-3 max-h-0 overflow-hidden opacity-0 transition-all duration-300 group-hover:max-h-24 group-hover:opacity-100">
                <div className="rounded-xl bg-slate-900 px-3 py-2 text-[11px] font-semibold text-white">
                  🏆 Unlocks Level {Math.min(lvl.n + 1, 11)} · +{lvl.xp} XP reward
                </div>
              </div>
            </motion.div>
          );
        })}
        <div className="hidden shrink-0 lg:block lg:w-[calc((100vw-1280px)/2)]" />
      </div>

      {/* Achievement summary */}
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal delay={0.1}>
          <div className="mt-6 grid grid-cols-2 gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-medium sm:grid-cols-4 sm:p-8">
            {[
              { icon: Trophy, label: "Current Level", value: `Level ${current?.n} · ${current?.title}` },
              { icon: Zap, label: "Total XP", value: "650 XP" },
              { icon: Star, label: "Career Score", value: "812" },
              { icon: Gamepad2, label: "Next Unlock", value: "Projects" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white"><item.icon className="h-5 w-5" /></span>
                <div>
                  <p className="text-[12px] font-medium text-slate-400">{item.label}</p>
                  <p className="text-[15px] font-bold text-slate-900">{item.value}</p>
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
