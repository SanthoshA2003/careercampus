import { motion } from "framer-motion";
import { Quote, ArrowUpRight, Star } from "lucide-react";
import { Reveal, SectionTag } from "@/features/career/components/landing/primitives";
import { inspirations } from "@/features/career/services/landingData";

function initials(name) {
  return name.replace(/^Dr\.\s*/, "").split(" ").filter(Boolean).slice(0, 2).map((w) => w[0]).join("");
}

export default function CareerInspirations() {
  return (
  <section
  className="relative pt-2 pb-24 lg:pt-3 lg:pb-32"
  data-testid="inspirations-section"
>
  <div className="mx-auto max-w-7xl px-5 lg:px-8">
    <Reveal className="mx-auto max-w-3xl text-center">
      <SectionTag icon={Star}>Career Inspirations</SectionTag>

      <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
        <span className="block leading-[1.15]">
          Learn From People Who
        </span>

        <span className="mt-1 block leading-[1.15] gradient-text-premium">
          Changed The World.
        </span>
      </h2>

      <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-600">
        Every great career begins with inspiration. Meet pioneers who transformed
        industries.
      </p>
    </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {inspirations.map((p, i) => (
            <motion.article
              key={p.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ delay: (i % 3) * 0.08 }}
              whileHover={{ y: -6 }}
              className="group relative overflow-hidden rounded-3xl border border-slate-100 bg-white p-7 shadow-soft transition-shadow hover:shadow-large"
              data-testid={`inspiration-${i}`}
            >
              <div className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${p.gradient} opacity-10 blur-2xl transition-opacity group-hover:opacity-25`} />
              <div className="flex items-center gap-4">
                <div className={`relative grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br ${p.gradient} text-white shadow-medium`}>
                  <span className="text-xl font-black">{initials(p.name)}</span>
                  <span className="absolute -bottom-1.5 -right-1.5 grid h-7 w-7 place-items-center rounded-full border-2 border-white bg-white shadow-soft">
                    <p.icon className="h-3.5 w-3.5 text-slate-700" />
                  </span>
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">{p.field}</span>
                  <h3 className="text-lg font-bold text-slate-900">{p.name}</h3>
                  <p className="text-[13px] text-slate-500">{p.role}</p>
                </div>
              </div>
              <div className="mt-5 rounded-2xl bg-slate-50 p-4">
                <Quote className="h-4 w-4 text-slate-300" />
                <p className="mt-1.5 text-[15px] italic leading-relaxed text-slate-600">{p.quote}</p>
              </div>
              <button className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-blue-600 transition-colors hover:text-cyan-600" data-testid={`inspiration-read-${i}`}>
                Read Story <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </button>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
