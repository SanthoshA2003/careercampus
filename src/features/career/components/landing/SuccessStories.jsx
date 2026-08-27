import { motion } from "framer-motion";
import { ArrowRight, MapPin, ChevronRight, Sparkles } from "lucide-react";
import { Reveal, SectionTag } from "@/features/career/components/landing/primitives";
import { successStories } from "@/features/career/services/landingData";

export default function SuccessStories() {
  return (
   <section
  className="relative overflow-hidden bg-[#F1F5F9] pt-2 pb-24 lg:pt-3 lg:pb-32"
  data-testid="success-stories-section"
>
  <div className="mx-auto max-w-7xl px-5 lg:px-8">
    <Reveal className="mx-auto max-w-3xl text-center">
      <SectionTag icon={Sparkles}>Success Stories</SectionTag>

      <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
        <span className="block leading-[1]">
          Real Journeys.
        </span>

        <span className="mt-2 block leading-[1] gradient-text-career">
          Real Transformations.
        </span>
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-600">
        See how MyMentor helps learners transform dreams into careers.
      </p>
    </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {successStories.map((s, i) => (
            <motion.article
              key={s.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className={`group flex flex-col overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-soft transition-shadow hover:shadow-large ${i === 0 ? "lg:col-span-1" : ""}`}
              data-testid={`success-story-${i}`}
            >
              <div className="relative h-56 overflow-hidden">
                <img src={s.img} alt={s.name} loading="lazy" className="h-full w-full object-cover object-top transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 text-white">
                  <h3 className="text-xl font-bold">{s.name}</h3>
                  <p className="flex items-center gap-1 text-[13px] opacity-90"><MapPin className="h-3.5 w-3.5" /> {s.city}</p>
                </div>
                <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[12px] font-bold text-slate-800 backdrop-blur">{s.role}</span>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex flex-wrap items-center gap-y-2">
                  {s.journey.map((step, j) => (
                    <span key={step} className="flex items-center">
                      <span className="rounded-lg bg-slate-50 px-2.5 py-1 text-[12px] font-semibold text-slate-600">{step}</span>
                      {j < s.journey.length - 1 && <ChevronRight className="mx-0.5 h-3.5 w-3.5 text-cyan-500" />}
                    </span>
                  ))}
                </div>
                <button className="mt-6 inline-flex items-center gap-2 text-[14px] font-semibold text-blue-600 transition-colors hover:text-cyan-600" data-testid={`success-read-${i}`}>
                  Read Full Journey <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
