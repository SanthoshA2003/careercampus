import { useMemo } from "react";
import { motion } from "framer-motion";

export default function Background() {
  const particles = useMemo(() => Array.from({ length: 26 }, () => ({
    left: Math.random() * 100, top: Math.random() * 100,
    size: Math.random() * 3 + 1, dur: Math.random() * 8 + 6, delay: Math.random() * 5,
  })), []);
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden">
      {/* base gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,#0f1b3d_0%,#070b18_55%,#04060f_100%)]" />
      {/* glowing grid */}
      <div className="absolute inset-0 opacity-[0.12]" style={{
        backgroundImage: "linear-gradient(rgba(99,102,241,0.6) 1px,transparent 1px),linear-gradient(90deg,rgba(99,102,241,0.6) 1px,transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
        WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
      }} />
      {/* floating blurred lights */}
      <div className="aurora-blob left-[12%] top-[8%] h-[420px] w-[420px] bg-indigo-600/25" />
      <div className="aurora-blob right-[8%] top-[20%] h-[380px] w-[380px] bg-cyan-500/20" />
      <div className="aurora-blob bottom-[6%] left-[35%] h-[360px] w-[360px] bg-violet-600/20" />
      {/* particles */}
      {particles.map((p, idx) => (
        <motion.span key={idx} className="absolute rounded-full bg-cyan-300/60"
          style={{ left: `${p.left}%`, top: `${p.top}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -30, 0], opacity: [0.1, 0.7, 0.1] }}
          transition={{ duration: p.dur, delay: p.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
    </div>
  );
}
