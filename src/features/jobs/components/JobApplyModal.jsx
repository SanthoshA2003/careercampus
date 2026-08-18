import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, CheckCircle2, ArrowRight, Send } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

const field = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
const Label = ({ children, req }) => <label className="mb-1.5 block text-sm font-semibold text-slate-700">{children}{req && <span className="text-blue-600"> *</span>}</label>;

export default function JobApplyModal({ open, onClose, job }) {
  const [f, setF] = useState({ name: "", email: "", phone: "", experience: "", coverNote: "", resumeLink: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name || !f.email) return toast.error("Name and email are required");
    setLoading(true);
    try { await api.jobApply(job.id, f); setDone(true); }
    catch (err) { toast.error(err.response?.data?.detail || "Submission failed"); }
    finally { setLoading(false); }
  };

  const close = () => { setDone(false); setF({ name: "", email: "", phone: "", experience: "", coverNote: "", resumeLink: "" }); onClose(); };
  if (!job) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[120] grid place-items-center overflow-y-auto p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-testid="job-apply-modal">
          <motion.div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={close} />
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }} className="relative z-10 my-8 w-full max-w-lg rounded-3xl bg-white p-8 shadow-large">
            <button onClick={close} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100" data-testid="job-apply-close"><X className="h-5 w-5" /></button>

            {done ? (
              <div className="py-8 text-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-glow"><CheckCircle2 className="h-9 w-9" /></motion.span>
                <h3 className="mt-5 text-2xl font-bold text-slate-900">Application submitted!</h3>
                <p className="mx-auto mt-2 max-w-md text-slate-600">Your application for <strong>{job.title}</strong> at {job.company} has been sent. A confirmation email is on its way to your inbox.</p>
                <button onClick={close} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-medium" data-testid="job-apply-done">Done</button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-bold text-slate-900">Apply for this role</h3>
                <p className="mt-1 text-sm text-slate-500"><strong>{job.title}</strong> · {job.company}</p>
                <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div><Label req>Full Name</Label><input className={field} value={f.name} onChange={set("name")} data-testid="apply-job-name" /></div>
                  <div><Label req>Email</Label><input className={field} type="email" value={f.email} onChange={set("email")} data-testid="apply-job-email" /></div>
                  <div><Label>Phone</Label><input className={field} value={f.phone} onChange={set("phone")} data-testid="apply-job-phone" /></div>
                  <div><Label>Experience</Label><input className={field} value={f.experience} onChange={set("experience")} placeholder="e.g. 2 years" data-testid="apply-job-exp" /></div>
                  <div className="sm:col-span-2"><Label>Resume Link</Label><input className={field} value={f.resumeLink} onChange={set("resumeLink")} placeholder="https://drive/linkedin..." data-testid="apply-job-resume" /></div>
                  <div className="sm:col-span-2"><Label>Cover Note</Label><textarea className={field} rows={3} value={f.coverNote} onChange={set("coverNote")} placeholder="Why are you a great fit?" data-testid="apply-job-cover" /></div>
                  <div className="sm:col-span-2 mt-1">
                    <button type="submit" disabled={loading} data-testid="apply-job-submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-[16px] font-semibold text-white shadow-medium transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60">
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Submit Application <Send className="h-4 w-4" /></>}
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
