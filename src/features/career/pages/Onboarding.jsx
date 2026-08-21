import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { api } from "@/services/api";
import Result from "@/features/career/pages/Result";

const CLASSES = ["Class 8", "Class 9", "Class 10", "Class 11", "Class 12", "Diploma", "College First Year", "College Second Year", "College Third Year", "Working Professional", "Other"];
const THINKING = ["Understanding your goal...", "Analyzing your profile...", "Matching careers...", "Preparing your Career Persona...", "Building your Career Graph...", "Generating your personalized roadmap..."];

const ageFromDob = (dob) => {
  if (!dob) return null;
  const d = new Date(dob); if (isNaN(d)) return null;
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
};


const Bubble = ({ children }) => (
  <div className="flex items-start gap-3">
    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500"><Sparkles className="h-4 w-4 text-white" /></span>
    <div className="rounded-2xl rounded-tl-sm border border-white/10 bg-white/[0.05] px-5 py-4 text-[17px] leading-relaxed text-white">{children}</div>
  </div>
);

const field = "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400 transition-colors";
const nextBtn = "mt-5 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3 text-sm font-bold text-white transition-transform hover:-translate-y-0.5 disabled:opacity-50";

// Steps: 0 = name+dob, 1 = class, 2 = thinking, 3 = result
export default function Onboarding({ goal, user, onContinueDashboard }) {
  const [step, setStep] = useState(user?.name && user?.dob ? 1 : 0);
  const [name, setName] = useState(user?.name || "");
  const [dob, setDob] = useState(user?.dob || "");
  const [klass, setKlass] = useState("");
  const [result, setResult] = useState(null);
  const [thinkIdx, setThinkIdx] = useState(0);
  const firstName = (name || "there").split(" ")[0];
  const age = ageFromDob(dob);
  const progress = Math.min((step / 3) * 100, 100);

  const genRef = useRef(false);
 

useEffect(() => {
  if (step !== 2 || genRef.current) return;

  genRef.current = true;

  const started = Date.now();

  const iv = setInterval(() => {
    setThinkIdx((i) =>
      Math.min(i + 1, THINKING.length - 1)
    );
  }, 800);

  api
    .careerPersonaCreate(goal, {
      name,
      dob,
      klass,
    })
    .then(async (r) => {
      const elapsed = Date.now() - started;

      if (elapsed < 4500) {
        await new Promise((res) =>
          setTimeout(res, 4500 - elapsed)
        );
      }

      clearInterval(iv);

      console.log("Career Persona Created:", r);

      setResult(r);
      setStep(3);
    })
    .catch((error) => {
      clearInterval(iv);

      console.error(
        "Career Persona creation failed:",
        error?.response?.data || error
      );

      setStep(3);
    });

  return () => clearInterval(iv);

  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [step]);

  return (
    <div className="relative z-10 mx-auto flex min-h-screen max-w-2xl flex-col px-4 pt-24 pb-16">
      {step <= 2 && (
        <div className="fixed inset-x-0 top-0 z-20 h-1 bg-white/5">
          <motion.div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500" animate={{ width: `${progress}%` }} transition={{ duration: 0.5 }} />
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* Step 0 — Welcome: name + dob */}
        {step === 0 && (
          <motion.div key="welcome" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} className="space-y-5">
            <Bubble>Let's begin your career journey. ✨<br />First, what should I call you?</Bubble>
            <div className="space-y-3 pl-12">
              <input className={field} placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} data-testid="onb-name" autoFocus />
              <div>
                <label className="mb-1 block text-xs text-slate-400">Date of birth</label>
                <input className={field} type="date" value={dob} onChange={(e) => setDob(e.target.value)} data-testid="onb-dob" />
              </div>
              <button className={nextBtn} disabled={!name || !dob} onClick={() => setStep(1)} data-testid="onb-welcome-continue">Continue <ArrowRight className="h-4 w-4" /></button>
            </div>
          </motion.div>
        )}

        {/* Step 1 — Age detection + class -> straight to thinking */}
        {step === 1 && (
          <motion.div key="class" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} className="space-y-5">
            <Bubble>Nice to meet you, {firstName} 👋{age ? <> It looks like you're around <b>{age}–{age + 1}</b> years old.</> : ""}<br />Which class are you currently studying in?</Bubble>
            <div className="flex flex-wrap gap-2 pl-12">
              {CLASSES.map((c) => (
                <button key={c} onClick={() => { setKlass(c); setStep(2); }} data-testid={`onb-class-${c.replace(/\s+/g, "-")}`}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${klass === c ? "border-cyan-400 bg-cyan-400/15 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"}`}>{c}</button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2 — Thinking */}
        {step === 2 && (
          <motion.div key="thinking" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="grid flex-1 place-items-center py-20">
            <div className="text-center">
              <div className="relative mx-auto h-24 w-24">
                <div className="absolute inset-0 rounded-full border-2 border-cyan-400/30" />
                <motion.div className="absolute inset-0 rounded-full border-t-2 border-cyan-400" animate={{ rotate: 360 }} transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
                <div className="absolute inset-0 grid place-items-center"><Sparkles className="h-8 w-8 text-cyan-400" /></div>
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={thinkIdx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                  className="mt-8 text-lg font-semibold text-white" data-testid="thinking-text">{THINKING[thinkIdx]}</motion.p>
              </AnimatePresence>
              <p className="mt-2 text-sm text-slate-500">MyMentor is preparing your career path</p>
            </div>
          </motion.div>
        )}

        {/* Step 3 — Result (Career Path main screen) */}
        {step === 3 && result && (
          <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Result result={result} onContinue={onContinueDashboard} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
