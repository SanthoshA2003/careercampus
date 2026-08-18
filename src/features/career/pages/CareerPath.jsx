import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUp, ArrowLeft } from "lucide-react";
import { useAuth } from "@/features/auth/components/AuthModal";
import Background from "@/features/career/components/Background";
import TypeRotator from "@/features/career/components/TypeRotator";
import Onboarding from "@/features/career/pages/Onboarding";

const LOGO = "https://customer-assets-v7afamib.emergentagent.net/job_9aefb62e-7f57-4728-958f-65a239b06a22/artifacts/16k7ho7s_MY%20MENOTR%20LOGO.png";

const ROTATE = [
  "I want to become a Doctor", "I want to become an IAS Officer", "I want to become an AI Engineer",
  "I want to become a Product Manager", "I want to become a Pilot", "I want to become a Chartered Accountant",
  "I want to become a Scientist", "I want to become an Entrepreneur", "I want to study in IIT",
  "I want to work at Google", "I want to become a UI UX Designer",
];
const CHIPS = [
  ["🩺", "Become a Doctor", "I want to become a Doctor"],
  ["🤖", "AI Engineer", "I want to become an AI Engineer"],
  ["⚖️", "Lawyer", "I want to become a Lawyer"],
  ["🎨", "UI UX Designer", "I want to become a UI UX Designer"],
  ["🚀", "Startup Founder", "I want to become a Startup Founder"],
  ["✈️", "Pilot", "I want to become a Pilot"],
  ["📈", "Chartered Accountant", "I want to become a Chartered Accountant"],
  ["🏛", "IAS Officer", "I want to become an IAS Officer"],
];

function CareerInner() {
  const { user, isAuthed, openAuth } = useAuth();
  const nav = useNavigate();
  const [goal, setGoal] = useState("");
  const [phase, setPhase] = useState("landing");

  const send = () => {
    if (!goal.trim()) return;
    if (isAuthed) setPhase("onboarding");
    else openAuth(() => setPhase("onboarding"));
  };

  if (phase === "onboarding") {
    return (
      <div className="relative min-h-screen bg-slate-950 text-slate-200">
        <Background />
        <Onboarding goal={goal} user={user} onContinueDashboard={() => nav("/skillhub")} />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200">
      <Background />
      <Link to="/" className="absolute left-6 top-6 z-20 flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white" data-testid="career-back">
        <ArrowLeft className="h-4 w-4" /> MyMentor
      </Link>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <div className="absolute inset-0 -z-10 rounded-full bg-white/10 blur-2xl" />
          <img src={LOGO} alt="MyMentor" className="mx-auto h-24 w-auto drop-shadow-[0_4px_24px_rgba(56,189,248,0.35)]" data-testid="career-logo" />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="mt-8 text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">
          Your <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">AI Career Intelligence</span> Platform
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mt-4 text-lg text-slate-400">
          One conversation can shape your entire future.
        </motion.p>

        {/* Prompt input */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="group relative mt-10 w-full">
          <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-cyan-500/40 to-violet-500/40 opacity-60 blur transition-opacity group-focus-within:opacity-100" />
          <div className="relative flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-900/80 p-2.5 backdrop-blur-xl">
            <div className="relative flex-1">
              <input
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                className="w-full bg-transparent px-4 py-3 text-[17px] text-white outline-none"
                data-testid="career-prompt-input"
                aria-label="Career goal"
              />
              {!goal && (
                <div className="pointer-events-none absolute inset-0 flex items-center px-4 text-[17px] text-slate-500">
                  <TypeRotator phrases={ROTATE} />
                </div>
              )}
            </div>
            <button onClick={send} data-testid="career-send-btn"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-500 text-white transition-transform hover:scale-105 active:scale-95">
              <ArrowUp className="h-5 w-5" />
            </button>
          </div>
        </motion.div>

        {/* Suggestion chips */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="mt-6 flex flex-wrap justify-center gap-2">
          {CHIPS.map(([emoji, label, value]) => (
            <button key={label} onClick={() => setGoal(value)} data-testid={`career-chip-${label.replace(/\s+/g, "-")}`}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:border-cyan-400/50 hover:bg-white/10 hover:text-white">
              <span className="mr-1.5">{emoji}</span>{label}
            </button>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default function CareerPath() {
  return <CareerInner />;
}
