import { Linkedin, Instagram, Youtube, Github, Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/features/career/components/landing/primitives";
import { footerColumns } from "@/features/career/services/landingData";

const socials = [Linkedin, Instagram, Youtube, Github];

export default function Footer() {
  return (
    <footer className="relative bg-[#020617] pt-20 pb-10 text-slate-400" data-testid="footer">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr_1.2fr]">
          {/* Brand */}
          <div>
            <Logo dark />
            <p className="mt-5 max-w-xs text-[15px] leading-relaxed text-slate-400">
              India's first Career Operating System — helping you move from confusion to career success.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((Icon, i) => (
                <a key={i} href="#top" className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition-colors hover:bg-gradient-to-br hover:from-blue-600 hover:to-cyan-500 hover:text-white" aria-label="social">
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <h4 className="text-[13px] font-bold uppercase tracking-widest text-white">{col.title}</h4>
              <ul className="mt-5 space-y-3">
                {col.links.map((l) => (
                  <li key={l}>
                    <a href="#top" className="text-[15px] text-slate-400 transition-colors hover:text-cyan-400">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Support */}
          <div>
            <h4 className="text-[13px] font-bold uppercase tracking-widest text-white">Support</h4>
            <ul className="mt-5 space-y-3 text-[15px]">
              <li className="flex items-center gap-2.5"><Mail className="h-4 w-4 text-cyan-400" /> hello@mymentor.in</li>
              <li className="flex items-center gap-2.5"><Phone className="h-4 w-4 text-cyan-400" /> +91 98765 43210</li>
              <li className="flex items-start gap-2.5"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" /> Chennai, Tamil Nadu, India</li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-[14px] text-slate-500">© 2026 MyMentor</p>
          <p className="text-[14px] font-semibold">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Building Careers. Not Just Qualifications.</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
