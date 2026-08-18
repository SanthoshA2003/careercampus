import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search, ArrowLeft, Sparkles, Loader2, Briefcase, MapPin, Clock, Wallet, PlusCircle, Building2, Users } from "lucide-react";
import { api } from "@/services/api";
import { Logo } from "@/features/career/components/landing/primitives";
import { useAuth } from "@/features/auth/components/AuthModal";
import JobDetailModal from "@/features/jobs/components/JobDetailModal";
import JobApplyModal from "@/features/jobs/components/JobApplyModal";
import CreateJobModal from "@/features/jobs/components/CreateJobModal";

const TYPES = ["All", "Full-time", "Part-time", "Internship", "Contract", "Remote"];

export default function JobsPage() {
  const [jobs, setJobs] = useState(null);
  const [q, setQ] = useState("");
  const [type, setType] = useState("All");
  const [detailJob, setDetailJob] = useState(null);
  const [applyJob, setApplyJob] = useState(null);
  const [createOpen, setCreateOpen] = useState(false);
  const { isAuthed, openAuth } = useAuth();

  const load = () => { setJobs(null); api.jobsList(type !== "All" ? { type } : {}).then(setJobs).catch(() => setJobs([])); };
  useEffect(load, [type]);

  const filtered = (jobs || []).filter((j) =>
    !q || j.title.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase()) ||
    (j.skills || []).some((s) => s.toLowerCase().includes(q.toLowerCase())));

  const openCreate = () => { isAuthed ? setCreateOpen(true) : openAuth(() => setCreateOpen(true)); };
  const openApply = (job) => { setDetailJob(null); setApplyJob(job); };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="noise-overlay" />
      <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/70 backdrop-blur-xl">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
          <Logo />
          <div className="flex items-center gap-3">
            <Link to="/organizations" className="hidden items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 sm:flex"><Building2 className="h-4 w-4" /> Organisations</Link>
            <Link to="/" className="hidden items-center gap-1.5 text-sm font-medium text-slate-500 hover:text-slate-900 sm:flex"><ArrowLeft className="h-4 w-4" /> Home</Link>
            <button onClick={openCreate} data-testid="create-job-header" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-glow">
              <PlusCircle className="h-4 w-4" /> Create New Job
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden py-16 lg:py-20">
        <div className="aurora-blob left-[5%] top-[0%] h-72 w-72 bg-blue-300/30" />
        <div className="aurora-blob right-[8%] top-[10%] h-72 w-72 bg-cyan-300/25" />
        <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-blue-600"><Sparkles className="h-3.5 w-3.5" /> Job Board</span>
          <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl">Find your next <span className="gradient-text">career move.</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-[18px] text-slate-600">Live roles from MyMentor partner companies. Read the full JD and apply in seconds — or post a job to hire vetted talent.</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="rounded-3xl border border-slate-100 bg-white p-4 shadow-soft">
          <div className="relative lg:max-w-sm">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search roles, companies, skills..." data-testid="job-search"
              className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100" />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {TYPES.map((t) => (
              <button key={t} onClick={() => setType(t)} data-testid={`job-filter-${t}`}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${type === t ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-soft" : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"}`}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 pb-24 pt-8 lg:px-8">
        {jobs === null ? (
          <div className="grid h-64 place-items-center"><Loader2 className="h-8 w-8 animate-spin text-blue-600" /></div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-200 py-20 text-center text-slate-500">No jobs match your filters.</div>
        ) : (
          <div className="grid gap-5 lg:grid-cols-2">
            {filtered.map((j, i) => (
              <motion.div key={j.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (i % 6) * 0.05 }} whileHover={{ y: -4 }}
                onClick={() => setDetailJob(j)} className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-100 bg-white p-6 shadow-soft transition-shadow hover:shadow-large" data-testid={`job-card-${i}`}>
                <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gradient-to-br from-blue-500/15 to-cyan-400/10 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-slate-900">{j.title}</h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-[14px] font-medium text-slate-500"><Building2 className="h-3.5 w-3.5" /> {j.company}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-600">{j.type}</span>
                </div>
                <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-slate-500">
                  {j.location && <span className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> {j.location}</span>}
                  {j.experience && <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {j.experience}</span>}
                  {j.salary && <span className="flex items-center gap-1.5 font-semibold text-slate-700"><Wallet className="h-3.5 w-3.5" /> {j.salary}</span>}
                </div>
                {(j.skills || []).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {j.skills.slice(0, 4).map((s) => <span key={s} className="rounded-lg bg-slate-50 px-2.5 py-1 text-[12px] font-medium text-slate-600">{s}</span>)}
                  </div>
                )}
                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">
                  <span className="flex items-center gap-1.5 text-[13px] text-slate-400"><Users className="h-3.5 w-3.5" /> {j.applicants || 0} applicants</span>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-5 py-2 text-[14px] font-semibold text-white transition-colors group-hover:bg-slate-800" data-testid={`job-view-${i}`}>View JD <Briefcase className="h-3.5 w-3.5" /></span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        <div className="mt-12 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-cyan-500 to-green-500 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-black text-white sm:text-3xl">Hiring? Post a role in minutes.</h2>
          <p className="mx-auto mt-3 max-w-xl text-white/90">Create a job posting and reach thousands of career-ready candidates on MyMentor.</p>
          <button onClick={openCreate} data-testid="create-job-cta" className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 font-semibold text-slate-900 shadow-medium transition-transform hover:scale-105">
            <PlusCircle className="h-4 w-4" /> Create New Job
          </button>
        </div>
      </div>

      <JobDetailModal open={!!detailJob} onClose={() => setDetailJob(null)} job={detailJob} onApply={openApply} />
      <JobApplyModal open={!!applyJob} onClose={() => setApplyJob(null)} job={applyJob} />
      <CreateJobModal open={createOpen} onClose={() => setCreateOpen(false)} onCreated={load} />
    </div>
  );
}
