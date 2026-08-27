import { motion } from "framer-motion";
import { ArrowDown, X, Check, Compass, Wrench, FolderKanban, Users } from "lucide-react";
import { Reveal, SectionTag } from "@/features/career/components/landing/primitives";

const traditional = ["Study", "Marks", "Degree", "Job Search", "Confusion"];
const withMentor = ["Dream", "Discover", "Plan", "Learn", "Build Skills", "Projects", "Career Graph", "Career Readiness", "Placement", "Career Growth"];

function FlowColumn({ items, variant }) {
  const dark = variant === "traditional";
  return (
    <div className="flex flex-col items-center">
      {items.map((step, i) => (
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.06 }}
          className="flex w-full flex-col items-center"
        >
          <div
            className={`w-full max-w-[240px] rounded-2xl px-5 py-3.5 text-center text-[15px] font-semibold ${
              dark
                ? "border border-slate-200 bg-slate-50 text-slate-500"
                : "border border-transparent bg-white text-slate-900 shadow-soft"
            }`}
            style={!dark ? { backgroundImage: "linear-gradient(white,white), linear-gradient(90deg,#2563EB,#22C55E)", backgroundOrigin: "border-box", backgroundClip: "padding-box, border-box", border: "1.5px solid transparent" } : {}}
          >
            {step}
          </div>
          {i < items.length - 1 && (
            <ArrowDown className={`my-2 h-4 w-4 ${dark ? "text-slate-300" : "text-cyan-500"}`} />
          )}
        </motion.div>
      ))}
    </div>
  );
}

export default function ProblemSection() {
  return (
    <section id="problem" className="relative pt-12 pb-24 lg:pt-16 lg:pb-32" data-testid="problem-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionTag icon={X}>The Problem</SectionTag>
<h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
  <span className="block leading-[1]">
    The Education System Was
  </span>

  <span className="mt-2 block leading-[1]">
    Designed To Help You <span className="text-slate-400">Pass</span>
  </span>

  <span className="mt-2 block leading-[1]">
    <span className="text-slate-400">Exams.</span>{" "}
    <span className="gradient-text-career">
      Not Build Careers.
    </span>
  </span>
</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-600">
            Most students spend years studying without understanding which career suits them,
            which skills they need, how to build projects, and how to become industry ready.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-2 lg:gap-8">
        <Reveal>
  <div className="h-full rounded-3xl border border-slate-200 bg-slate-50/60 p-8">
    <div className="mb-6 flex items-center gap-2">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-slate-500">
        <X className="h-4 w-4" />
      </span>

      <h3 className="text-xl font-bold text-slate-500">
        Traditional Education
      </h3>
    </div>

    <FlowColumn items={traditional} variant="traditional" />

  {/* What's Missing */}
<div className="relative mt-10 overflow-hidden rounded-3xl border border-rose-100 bg-gradient-to-br from-rose-50 via-white to-orange-50 p-6 pt-8">

  {/* Soft background effect */}
  <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-rose-200/30 blur-3xl" />
  <div className="pointer-events-none absolute -bottom-16 -left-16 h-40 w-40 rounded-full bg-orange-200/30 blur-3xl" />

  <div className="relative">
    {/* Heading */}
    <div className="flex flex-col items-center text-center">
      <motion.div
        animate={{
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-rose-500 to-orange-400 text-white shadow-lg shadow-rose-200"
      >
        <X className="h-5 w-5" />
      </motion.div>

      <p className="mt-3 text-[12px] font-bold uppercase tracking-[0.2em] text-rose-500">
        What's Missing?
      </p>

      <p className="mt-1 text-sm text-slate-500">
        The gaps students often face in their career journey.
      </p>
    </div>

    {/* Missing cards */}
    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">

      {/* Career Direction */}
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group rounded-2xl border border-rose-100 bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-rose-50 text-rose-500 transition-transform group-hover:scale-110">
            <Compass className="h-4 w-4" />
          </span>

          <div>
            <p className="text-sm font-bold text-slate-800">
              Career Direction
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              No clear roadmap for choosing the right career.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Industry Skills */}
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group rounded-2xl border border-orange-100 bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-orange-50 text-orange-500 transition-transform group-hover:scale-110">
            <Wrench className="h-4 w-4" />
          </span>

          <div>
            <p className="text-sm font-bold text-slate-800">
              Industry Skills
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Limited focus on real-world skills.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Real Projects */}
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group rounded-2xl border border-amber-100 bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-amber-50 text-amber-500 transition-transform group-hover:scale-110">
            <FolderKanban className="h-4 w-4" />
          </span>

          <div>
            <p className="text-sm font-bold text-slate-800">
              Real Projects
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Less opportunity to build practical experience.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Career Guidance */}
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group rounded-2xl border border-violet-100 bg-white/90 p-4 shadow-sm transition-shadow hover:shadow-md"
      >
        <div className="flex items-start gap-3">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-violet-50 text-violet-500 transition-transform group-hover:scale-110">
            <Users className="h-4 w-4" />
          </span>

          <div>
            <p className="text-sm font-bold text-slate-800">
              Career Guidance
            </p>

            <p className="mt-1 text-xs leading-relaxed text-slate-500">
              Students often navigate their future alone.
            </p>
          </div>
        </div>
      </motion.div>

    </div>

    {/* Final Outcome */}
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.01 }}
      className="mt-6 rounded-2xl border border-rose-200 bg-gradient-to-r from-rose-500 to-orange-500 p-[1px] shadow-lg shadow-rose-100"
    >
      <div className="rounded-2xl bg-white/95 px-5 py-4 text-center">
        <p className="text-xs font-bold uppercase tracking-widest text-rose-500">
          The Result
        </p>

        <p className="mt-1 text-lg font-extrabold text-slate-800">
          A Degree Without A Clear Direction.
        </p>
      </div>
    </motion.div>
  </div>
</div>
  </div>
</Reveal>

          <Reveal delay={0.1}>
            <div className="relative h-full overflow-hidden rounded-3xl border border-blue-100 bg-white p-8 shadow-medium">
              <div className="aurora-blob right-[-20%] top-[-10%] h-64 w-64 bg-cyan-300/30" />
              <div className="relative mb-6 flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-blue-600 to-green-500 text-white"><Check className="h-4 w-4" /></span>
                <h3 className="text-xl font-bold text-slate-900">With MyMentor</h3>
              </div>
              <div className="relative">
                <FlowColumn items={withMentor} variant="mentor" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
