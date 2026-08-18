import { motion } from "framer-motion";
import { ArrowRight, Play, Trophy, Target, TrendingUp, Zap } from "lucide-react";
import { Magnetic } from "@/features/career/components/landing/primitives";
import { useAuth } from "@/features/auth/components/AuthModal";

const badges = [
  { icon: Trophy, label: "Level Up", className: "left-[6%] top-[18%]" },
  { icon: Target, label: "CRI 72", className: "right-[8%] top-[22%]" },
  { icon: TrendingUp, label: "+38% Growth", className: "left-[12%] bottom-[20%]" },
  { icon: Zap, label: "650 XP", className: "right-[10%] bottom-[24%]" },
];

export default function CTA() {
  const { openAuth } = useAuth();
  return (
    <section className="relative overflow-hidden py-24 lg:py-32" data-testid="cta-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 px-6 py-20 text-center shadow-large sm:px-12 lg:py-28">
          {/* soft particles / blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="aurora-blob left-[10%] top-[10%] h-56 w-56 bg-white/30" />
            <div className="aurora-blob right-[12%] bottom-[8%] h-64 w-64 bg-white/20" />
            <div className="grid-pattern absolute inset-0 opacity-20" />
          </div>

          {/* floating badges */}
          {badges.map((b, i) => (
            <motion.div
              key={b.label}
              className={`absolute hidden lg:flex ${b.className}`}
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
            >
              <div className="flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2.5 text-white backdrop-blur-md">
                <b.icon className="h-4 w-4" /> <span className="text-[13px] font-bold">{b.label}</span>
              </div>
            </motion.div>
          ))}

          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="relative mx-auto max-w-3xl">
            <h2 className="text-3xl font-black leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-[56px]">
              Your Future Doesn't Start After Graduation. It Starts Today.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-[18px] leading-relaxed text-white/90">
              Join thousands of learners building meaningful careers with MyMentor.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Magnetic>
                <button onClick={openAuth} className="group inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[17px] font-semibold text-slate-900 shadow-medium transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-large" data-testid="cta-start-journey-button">
                  Start My Journey <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </Magnetic>
              <Magnetic strength={0.2}>
                <button onClick={openAuth} className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-8 py-4 text-[17px] font-semibold text-white backdrop-blur transition-colors hover:bg-white/20" data-testid="cta-watch-demo-button">
                  <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-blue-600"><Play className="h-3 w-3 fill-current" /></span>
                  Watch Demo
                </button>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
