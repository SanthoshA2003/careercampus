import { motion } from "framer-motion";
import { Check, Sparkles, Crown, Zap } from "lucide-react";
import { Reveal, SectionTag, Magnetic } from "@/features/career/components/landing/primitives";
import { pricingTiers } from "@/features/career/services/landingData";
import { useAuth } from "@/features/auth/components/AuthModal";

const tierIcon = [Zap, Sparkles, Crown];

export default function Pricing() {
  const { openAuth } = useAuth();
  return (
    <section id="pricing" className="relative py-24 lg:py-32" data-testid="pricing-section">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionTag icon={Sparkles}>Pricing</SectionTag>
          <h2 className="mt-6 text-3xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
            Choose Your <span className="gradient-text">Career Journey</span>
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-600">
            Start your journey today and upgrade whenever you're ready.
          </p>
        </Reveal>

        <div className="mt-16 grid items-center gap-6 lg:grid-cols-3">
          {pricingTiers.map((t, i) => {
            const Icon = tierIcon[i];
            const featured = t.highlight;
            return (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-[1.5px] ${featured ? "lg:scale-[1.06]" : ""}`}
                data-testid={`pricing-${t.name.toLowerCase()}`}
              >
                {featured && <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-purple-500 via-blue-600 to-cyan-500" />}
                <div className={`relative flex h-full flex-col rounded-[22px] border p-8 ${featured ? "border-transparent bg-[#0D1B2A] text-white shadow-glow" : "border-slate-100 bg-white shadow-soft"}`}>
                  {t.badge && (
                    <span className={`absolute -top-3 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-[12px] font-bold ${featured ? "bg-gradient-to-r from-purple-500 to-cyan-500 text-white" : "bg-gradient-to-r from-blue-600 to-green-500 text-white"}`}>
                      {t.badge}
                    </span>
                  )}
                  <div className={`grid h-12 w-12 place-items-center rounded-2xl ${featured ? "bg-white/10 text-cyan-300" : "bg-gradient-to-br from-blue-600 to-cyan-500 text-white"}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className={`mt-5 text-xl font-bold ${featured ? "text-white" : "text-slate-900"}`}>{t.name}</h3>
                  <div className="mt-3 flex items-end gap-1">
                    <span className={`text-5xl font-black tracking-tight ${featured ? "text-white" : "text-slate-900"}`}>₹{t.price}</span>
                    <span className={`mb-2 text-[15px] ${featured ? "text-slate-300" : "text-slate-400"}`}>/ month</span>
                  </div>

                  <ul className="mt-7 flex-1 space-y-3">
                    {t.features.map((f) => (
                      <li key={f} className={`flex items-center gap-2.5 text-[14px] ${featured ? "text-slate-200" : "text-slate-600"}`}>
                        <span className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${featured ? "bg-gradient-to-br from-cyan-400 to-green-400 text-slate-900" : "bg-emerald-100 text-emerald-600"}`}><Check className="h-3 w-3" /></span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Magnetic className="mt-8 block" strength={0.2}>
                    <button
                      onClick={openAuth}
                      className={`w-full rounded-full px-6 py-3.5 text-[16px] font-semibold transition-[transform,box-shadow] hover:-translate-y-0.5 ${featured ? "bg-gradient-to-r from-blue-500 to-cyan-400 text-white hover:shadow-glow" : "border border-slate-200 bg-white text-slate-800 shadow-soft hover:shadow-medium"}`}
                      data-testid={`pricing-cta-${t.name.toLowerCase()}`}
                    >
                      {t.cta}
                    </button>
                  </Magnetic>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
