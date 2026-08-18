import { forwardRef, useEffect, useRef, useState } from "react";
import { motion, useInView, useMotionValue, useSpring, animate } from "framer-motion";
import { cn } from "@/utils/helpers";
import { Sparkles } from "lucide-react";
import mymentorIcon from "@/assets/images/mymentor-icon.png";

/* ---------- Scroll reveal ---------- */
export const Reveal = ({ children, className, delay = 0, y = 40, once = true }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once, margin: "-80px" }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>
);

/* ---------- Kinetic masked line reveal ---------- */
export const MaskedLine = ({ children, delay = 0, className }) => (
  <span className="block overflow-hidden">
    <motion.span
      className={cn("block", className)}
      initial={{ y: "110%" }}
      animate={{ y: "0%" }}
      transition={{ duration: 1, delay, ease: [0.76, 0, 0.24, 1] }}
    >
      {children}
    </motion.span>
  </span>
);

/* ---------- Section overline tag ---------- */
export const SectionTag = ({ children, dark = false, icon: Icon = Sparkles }) => (
  <div
    className={cn(
      "inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.18em]",
      dark
        ? "bg-white/10 text-cyan-300 border border-white/10"
        : "bg-blue-50 text-blue-600 border border-blue-100"
    )}
  >
    <Icon className="h-3.5 w-3.5" />
    {children}
  </div>
);

/* ---------- Count up ---------- */
export const CountUp = ({ value, suffix = "", prefix = "", decimals = 0, className }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setDisplay(v),
    });
    return () => controls.stop();
  }, [inView, value]);

  const formatted =
    decimals > 0
      ? display.toFixed(decimals)
      : Math.round(display).toLocaleString("en-IN");

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

/* ---------- Magnetic wrapper ---------- */
export const Magnetic = ({ children, className, strength = 0.35 }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 200, damping: 15, mass: 0.4 });

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ x: sx, y: sy }}
      className={cn("inline-block", className)}
    >
      {children}
    </motion.div>
  );
};

/* ---------- Buttons ---------- */
export const PrimaryButton = forwardRef(({ children, className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "group relative inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-[17px] font-semibold text-white",
      "bg-gradient-to-r from-blue-600 to-cyan-500 shadow-medium",
      "transition-[transform,box-shadow,filter] duration-300 hover:-translate-y-0.5 hover:shadow-glow hover:brightness-110",
      "active:translate-y-0",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
PrimaryButton.displayName = "PrimaryButton";

export const SecondaryButton = forwardRef(({ children, className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "group inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-8 py-4 text-[17px] font-semibold text-slate-800",
      "shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:shadow-medium",
      className
    )}
    {...props}
  >
    {children}
  </button>
));
SecondaryButton.displayName = "SecondaryButton";

/* ---------- Marquee ---------- */
export const Marquee = ({ children, duration = 40, className }) => (
  <div className={cn("relative w-full overflow-hidden", className)}>
    <div className="marquee-track" style={{ animationDuration: `${duration}s` }}>
      <div className="flex shrink-0 items-center">{children}</div>
      <div className="flex shrink-0 items-center" aria-hidden>{children}</div>
    </div>
  </div>
);

/* ---------- Logo ---------- */
export const Logo = ({ dark = false, className }) => (
  <a href="#top" className={cn("group inline-flex items-center gap-2.5", className)} aria-label="MyMentor home" data-testid="brand-logo">
    <img
      src={mymentorIcon}
      alt="MyMentor logo"
      className="h-10 w-auto transition-transform duration-300 group-hover:scale-105"
    />
    <span className={cn("text-[20px] font-extrabold tracking-tight", dark ? "text-white" : "text-slate-900")}>
      My<span className="gradient-text">Mentor</span>
    </span>
  </a>
);
