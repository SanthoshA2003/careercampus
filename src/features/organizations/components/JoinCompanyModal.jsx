import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Loader2, CheckCircle2, ArrowRight, Building2 } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

const INDUSTRIES = ["Technology", "E-commerce", "Finance", "Healthcare", "Consulting", "Manufacturing", "Education", "Media", "Other"];
const SIZES = ["1-10", "11-50", "51-200", "201-1000", "1000-5000", "5000+"];
const field = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-[15px] text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100";
const Label = ({ children, req }) => <label className="mb-1.5 block text-sm font-semibold text-slate-700">{children}{req && <span className="text-blue-600"> *</span>}</label>;

export default function JoinCompanyModal({ open, onClose }) {
  const [f, setF] = useState({ companyName: "", website: "", industry: "", contactName: "", email: "", size: "", location: "", about: "", hiringNeeds: "" });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.companyName || !f.industry || !f.contactName || !f.email) return toast.error("Please fill all required fields");
    setLoading(true);
    try { await api.companyJoin(f); setDone(true); }
    catch (err) { toast.error(err.response?.data?.detail || "Submission failed"); }
    finally { setLoading(false); }
  };

  const close = () => { setDone(false); onClose(); };

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[100] grid place-items-center overflow-y-auto p-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} data-testid="join-company-modal">
          <motion.div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm" onClick={close} />
          <motion.div initial={{ opacity: 0, y: 30, scale: 0.97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 260, damping: 26 }} className="relative z-10 my-8 w-full max-w-2xl rounded-3xl bg-white p-8 shadow-large">
            <button onClick={close} className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full text-slate-500 hover:bg-slate-100" data-testid="join-company-close"><X className="h-5 w-5" /></button>

            {done ? (
              <div className="py-8 text-center">
                <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 220, damping: 14 }} className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-glow"><CheckCircle2 className="h-9 w-9" /></motion.span>
                <h3 className="mt-5 text-2xl font-bold text-slate-900">Request received!</h3>
                <p className="mx-auto mt-2 max-w-md text-slate-600">Thanks for your interest in partnering with MyMentor. Our partnerships team will review and reach out within 3-5 business days. A confirmation email is on its way.</p>
                <button onClick={close} className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3 font-semibold text-white shadow-medium" data-testid="join-company-done">Done</button>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white"><Building2 className="h-5 w-5" /></span>
                  <div><h3 className="text-2xl font-bold text-slate-900">Join as a Company</h3><p className="text-sm text-slate-500">Partner with MyMentor to hire top vetted talent.</p></div>
                </div>
                <form onSubmit={submit} className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div><Label req>Company Name</Label><input className={field} value={f.companyName} onChange={set("companyName")} data-testid="company-name" /></div>
                  <div><Label>Website</Label><input className={field} value={f.website} onChange={set("website")} placeholder="https://" data-testid="company-website" /></div>
                  <div><Label req>Industry</Label><select className={field} value={f.industry} onChange={set("industry")} data-testid="company-industry"><option value="">Select industry</option>{INDUSTRIES.map((i) => <option key={i}>{i}</option>)}</select></div>
                  <div><Label>Company Size</Label><select className={field} value={f.size} onChange={set("size")} data-testid="company-size"><option value="">Select size</option>{SIZES.map((s) => <option key={s}>{s}</option>)}</select></div>
                  <div><Label req>Contact Name</Label><input className={field} value={f.contactName} onChange={set("contactName")} data-testid="company-contact" /></div>
                  <div><Label req>Contact Email</Label><input className={field} type="email" value={f.email} onChange={set("email")} data-testid="company-email" /></div>
                  <div className="sm:col-span-2"><Label>Location(s)</Label><input className={field} value={f.location} onChange={set("location")} placeholder="Bengaluru, Remote" data-testid="company-location" /></div>
                  <div className="sm:col-span-2"><Label>About the Company</Label><textarea className={field} rows={2} value={f.about} onChange={set("about")} data-testid="company-about" /></div>
                  <div className="sm:col-span-2"><Label>Hiring Needs</Label><textarea className={field} rows={2} value={f.hiringNeeds} onChange={set("hiringNeeds")} placeholder="Roles you're looking to fill" data-testid="company-needs" /></div>
                  <div className="sm:col-span-2 mt-2">
                    <button type="submit" disabled={loading} data-testid="company-submit" className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-3.5 text-[16px] font-semibold text-white shadow-medium transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60">
                      {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Submit Request <ArrowRight className="h-4 w-4" /></>}
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
