import { motion } from "framer-motion";
import { ArrowDown, X, Check } from "lucide-react";
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
  <span className="block leading-[1.15]">
    The Education System Was
  </span>

  <span className="mt-2 block leading-[1.15]">
    Designed To Help You <span className="text-slate-400">Pass</span>
  </span>

  <span className="mt-2 block leading-[1.15]">
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
                <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-200 text-slate-500"><X className="h-4 w-4" /></span>
                <h3 className="text-xl font-bold text-slate-500">Traditional Education</h3>
              </div>
              <FlowColumn items={traditional} variant="traditional" />
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
