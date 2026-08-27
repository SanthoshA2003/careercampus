import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { Reveal, SectionTag } from "@/features/career/components/landing/primitives";
import { personas } from "@/features/career/services/landingData";
import { useAuth } from "@/features/auth/components/AuthModal";

export default function CareerPersonas() {
  const { openAuth } = useAuth();
  return (
<section
  className="relative pt-12 pb-24 lg:pt-16 lg:pb-32"
  data-testid="personas-section"
>
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal className="mx-auto max-w-3xl text-center">
          <SectionTag icon={Users}>Career Personas</SectionTag>
         <h2 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-[52px]">
  <span className="block leading-[1]">
    Every Career Begins With A
  </span>

  <span className="mt-2 block leading-[1] gradient-text">
    Different Mindset.
  </span>
</h2>
          <p className="mx-auto mt-6 max-w-2xl text-[18px] leading-relaxed text-slate-600">
            No matter where you are today, MyMentor adapts to your journey.
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: (i % 3) * 0.08, duration: 0.6 }}
              whileHover={{ y: -8 }}
              className="group relative overflow-hidden rounded-3xl p-[1.5px]"
              data-testid={`persona-${p.name.toLowerCase()}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-0 transition-opacity duration-500 group-hover:opacity-100`} />
              <div className="relative h-full rounded-[22px] border border-slate-100 bg-white p-8 shadow-soft transition-shadow group-hover:shadow-large">
                <div className={`grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br ${p.gradient} text-white shadow-medium`}>
                  <p.icon className="h-7 w-7" />
                </div>
                <h3 className="mt-6 text-2xl font-bold text-slate-900">{p.name}</h3>
                <p className="mt-3 text-[16px] italic leading-relaxed text-slate-600">"{p.quote}"</p>
                <button
                  onClick={openAuth}
                  className="mt-6 inline-flex items-center gap-2 text-[15px] font-semibold text-blue-600 transition-colors hover:text-cyan-600"
                  data-testid={`persona-cta-${p.name.toLowerCase()}`}
                >
                  {p.cta} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
