import { motion } from "framer-motion";
import { BadgeCheck, Star, Clock, Languages, Briefcase, ArrowRight } from "lucide-react";
import { Reveal, SectionTag } from "@/features/career/components/landing/primitives";
import { mentors } from "@/features/career/services/landingData";
import { useAuth } from "@/features/auth/components/AuthModal";

export default function MentorBooking() {
  const { openAuth } = useAuth();
  return (
  <section
  id="mentors"
  className="relative overflow-hidden bg-[#F1F5F9] pt-2 pb-24 lg:pt-3 lg:pb-32"
  data-testid="mentor-booking-section"
>
  <div className="aurora-blob right-[0%] top-[10%] h-80 w-80 bg-purple-300/25" />

  <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
    <Reveal className="mx-auto max-w-3xl text-center">
      <SectionTag icon={BadgeCheck}>Book A Mentor</SectionTag>

      <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
        <span className="block leading-[1]">
          Learn From Industry Experts.
        </span>

        <span className="mt-2 block leading-[1] gradient-text-premium">
          Get Personal Guidance.
        </span>
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-600">
        Book one-on-one sessions with experienced professionals who can guide
        your career journey.
      </p>
    </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {mentors.map((m, i) => (
            <motion.div
              key={m.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-large"
              data-testid={`mentor-${i}`}
            >
              <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/20 to-cyan-400/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center gap-4">
                <div className="relative">
                  <img src={m.img} alt={m.name} loading="lazy" className="h-16 w-16 rounded-2xl object-cover" />
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-white bg-emerald-500" title="Online" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h3 className="truncate text-lg font-bold text-slate-900">{m.name}</h3>
                    <BadgeCheck className="h-4 w-4 shrink-0 text-blue-500" />
                  </div>
                  <p className="text-[13px] text-slate-500">{m.role} · {m.company}</p>
                  <div className="mt-1 flex items-center gap-1 text-[12px] font-bold text-amber-500"><Star className="h-3.5 w-3.5 fill-current" /> {m.rating}</div>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-1.5">
                {m.skills.map((s) => (
                  <span key={s} className="rounded-lg bg-slate-50 px-2.5 py-1 text-[12px] font-medium text-slate-600">{s}</span>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-y-2 text-[13px] text-slate-500">
                <span className="flex items-center gap-1.5"><Briefcase className="h-3.5 w-3.5" /> {m.exp} exp</span>
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {m.duration}</span>
                <span className="flex items-center gap-1.5"><Languages className="h-3.5 w-3.5" /> {m.languages.join(", ")}</span>
                <span className="flex items-center gap-1.5 font-semibold text-emerald-600">● {m.availability}</span>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                <div>
                  <span className="text-2xl font-black text-slate-900">₹{m.price}</span>
                  <span className="text-[13px] text-slate-400"> / session</span>
                </div>
                <button
                  onClick={openAuth}
                  className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-[14px] font-semibold text-white shadow-soft transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-glow"
                  data-testid={`mentor-book-${i}`}
                >
                  Book Session <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
