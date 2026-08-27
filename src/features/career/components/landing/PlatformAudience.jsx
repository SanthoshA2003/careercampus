import { motion } from "framer-motion";
import { Check, Globe2 } from "lucide-react";
import { Reveal, SectionTag } from "@/features/career/components/landing/primitives";
import { audiences } from "@/features/career/services/landingData";

export default function PlatformAudience() {
  return (
  <section
  className="relative overflow-hidden bg-[#F1F5F9] pt-2 pb-24 lg:pt-3 lg:pb-32"
  data-testid="audience-section"
>
  <div className="mx-auto max-w-7xl px-5 lg:px-8">
    <Reveal className="mx-auto max-w-3xl text-center">
      <SectionTag icon={Globe2}>Built For Everyone</SectionTag>

      <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
        <span className="block leading-[1]">
          Built For Everyone In The
        </span>

        <span className="mt-2 block leading-[1] gradient-text">
          Career Ecosystem
        </span>
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-600">
        Whether you're a student, parent, mentor, recruiter or institution,
        MyMentor helps everyone grow together.
      </p>
    </Reveal>

        <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {audiences.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-[1.5px] shadow-soft transition-shadow hover:shadow-large"
              data-testid={`audience-${a.title.toLowerCase()}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${a.gradient} opacity-0 transition-opacity group-hover:opacity-100`} />
              <div className="relative h-full rounded-[22px] bg-white">
                <div className="relative h-36 overflow-hidden rounded-t-[22px]">
                  <img src={a.img} alt={a.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/95 via-white/20 to-transparent" />
                  <span className={`absolute left-5 top-5 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br ${a.gradient} text-white shadow-medium`}>
                    <a.icon className="h-6 w-6" />
                  </span>
                </div>
                <div className="p-6 pt-2">
                  <h3 className="text-xl font-bold text-slate-900">{a.title}</h3>
                  <ul className="mt-4 space-y-2.5">
                    {a.features.map((f) => (
                      <li key={f} className="flex items-center gap-2.5 text-[14px] text-slate-600">
                        <Check className="h-4 w-4 shrink-0 text-emerald-500" /> {f}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
