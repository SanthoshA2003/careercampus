import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Briefcase, Clock, Wallet, Building2, Users, Send } from "lucide-react";

export default function JobDetailModal({ open, onClose, job, onApply }) {
  if (!job) return null;
  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-testid="job-detail-modal">
          <motion.div className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm" onClick={onClose} />
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }} className="relative z-10 my-8 w-full max-w-2xl rounded-3xl bg-white shadow-large">
            <button onClick={onClose} className="absolute right-5 top-5 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-slate-500 backdrop-blur hover:bg-slate-100" data-testid="job-detail-close"><X className="h-5 w-5" /></button>

            <div className="rounded-t-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 p-8 text-white">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur"><Building2 className="h-3.5 w-3.5" /> {job.company}</span>
              <h2 className="mt-4 text-3xl font-black leading-tight">{job.title}</h2>
              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-white/90">
                {job.location && <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {job.location}</span>}
                <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4" /> {job.type}</span>
                {job.experience && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {job.experience}</span>}
                {job.salary && <span className="flex items-center gap-1.5"><Wallet className="h-4 w-4" /> {job.salary}</span>}
              </div>
            </div>

            <div className="max-h-[45vh] overflow-y-auto p-8">
              {(job.skills || []).length > 0 && (
                <div className="mb-6 flex flex-wrap gap-2">
                  {job.skills.map((s) => <span key={s} className="rounded-lg bg-blue-50 px-3 py-1.5 text-[13px] font-semibold text-blue-600">{s}</span>)}
                </div>
              )}
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-400">Job Description</h3>
              <p className="mt-3 whitespace-pre-line text-[15px] leading-relaxed text-slate-700" data-testid="job-detail-description">{job.description}</p>
              <p className="mt-6 flex items-center gap-1.5 text-sm text-slate-400"><Users className="h-4 w-4" /> {job.applicants || 0} applicants so far</p>
            </div>

            <div className="flex items-center justify-between gap-4 rounded-b-3xl border-t border-slate-100 bg-slate-50 p-6">
              <span className="text-sm text-slate-500">Ready to make your move?</span>
              <button onClick={() => onApply(job)} data-testid="job-detail-apply" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-7 py-3 font-semibold text-white shadow-medium transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-glow">
                Apply Now <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
