import { useEffect, useState } from "react";

// Rotating typing placeholder
export function useTypeRotator(phrases, { typeMs = 55, deleteMs = 30, holdMs = 1400 } = {}) {
  const [text, setText] = useState("");
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    const full = phrases[i % phrases.length];
    let t;
    if (phase === "typing") {
      if (text.length < full.length) t = setTimeout(() => setText(full.slice(0, text.length + 1)), typeMs);
      else t = setTimeout(() => setPhase("deleting"), holdMs);
    } else {
      if (text.length > 0) t = setTimeout(() => setText(full.slice(0, text.length - 1)), deleteMs);
      else { setPhase("typing"); setI((v) => v + 1); }
    }
    return () => clearTimeout(t);
  }, [text, phase, i, phrases, typeMs, deleteMs, holdMs]);

  return text;
}

export default function TypeRotator({ phrases }) {
  const text = useTypeRotator(phrases);
  return <span>{text}<span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-[2px] animate-pulse bg-cyan-400" /></span>;
}
