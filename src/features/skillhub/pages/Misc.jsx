import { useEffect, useState } from "react";
import { Loader2, Award } from "lucide-react";
import Shell from "@/features/skillhub/components/Shell";
import { api } from "@/services/api";

export function AdminStudents() {
  const [students, setStudents] = useState(null);
  useEffect(() => { api.students().then(setStudents).catch(() => setStudents([])); }, []);
  if (!students) return <Shell><div className="grid h-[60vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div></Shell>;
  return (
    <Shell>
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-black tracking-tight text-white">Students</h1>
        <p className="mt-2 text-slate-400">Manage and track every enrolled student.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {students.map((s) => (
            <div key={s.id} className="rounded-2xl border border-white/5 bg-white/[0.03] p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 font-black text-white">{s.name[0]}</span>
                <div><p className="font-semibold text-white">{s.name}</p><p className="text-xs text-slate-400">{s.email}</p></div>
              </div>
              <div className="mt-4 flex justify-between text-sm">
                <span className="text-cyan-400 font-bold">{s.xp} XP</span>
                <span className="text-amber-400">{s.streak}🔥</span>
                <span className="text-emerald-400">{s.completedLevels} levels</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Shell>
  );
}

export function Certificates() {
  const [data, setData] = useState(null);
  useEffect(() => { api.myProgress().then(setData).catch(() => {}); }, []);
  if (!data) return <Shell><div className="grid h-[60vh] place-items-center"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div></Shell>;
  return (
    <Shell>
      <div className="mx-auto max-w-4xl">
        <h1 className="text-3xl font-black tracking-tight text-white">Certificates</h1>
        <p className="mt-2 text-slate-400">Earn a certificate by completing every level in a stage.</p>
        {data.certificates.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-12 text-center text-slate-500">
            <Award className="mx-auto h-10 w-10 text-slate-600" />
            <p className="mt-3">No certificates yet. Complete a full stage to unlock one.</p>
          </div>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {data.certificates.map((c, i) => (
              <div key={i} className="relative overflow-hidden rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 via-slate-900 to-cyan-500/15 p-8 text-center">
                <Award className="mx-auto h-12 w-12 text-violet-300" />
                <p className="mt-4 text-xs uppercase tracking-widest text-slate-400">Certificate of Completion</p>
                <p className="mt-2 text-2xl font-black text-white">{c.stage} Stage</p>
                <p className="text-slate-300">{c.course}</p>
                <p className="mt-4 text-xs text-slate-500">Digipin Academy · 2026</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}
