import { useState } from "react";
import { useNavigate, Navigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Terminal, ArrowRight, Loader2, GraduationCap, ShieldCheck, ArrowLeft } from "lucide-react";
import { useAcademyAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Login() {
  const { user, ready, login } = useAcademyAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  if (ready && user) return <Navigate to="/skillhub" replace />;

  const submit = async (e) => {
    e?.preventDefault();
    setLoading(true);
    try {
      const u = await login(email.trim(), password);
      toast.success(`Welcome back, ${u.name.split(" ")[0]}!`);
      nav(u.role === "admin" ? "/skillhub/admin" : "/skillhub");
    } catch (err) {
      toast.error(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const quick = (role) => {
    if (role === "admin") { setEmail("admin@digipin.academy"); setPassword("admin123"); }
    else { setEmail("student@digipin.academy"); setPassword("student123"); }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
      <div className="aurora-blob left-[10%] top-[10%] h-96 w-96 bg-violet-600/30" />
      <div className="aurora-blob right-[10%] bottom-[10%] h-96 w-96 bg-cyan-500/25" />
      <div className="grid-pattern absolute inset-0 opacity-[0.06]" />

      <Link to="/" className="absolute left-6 top-6 flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white" data-testid="back-to-site">
        <ArrowLeft className="h-4 w-4" /> Back to MyMentor
      </Link>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-glow">
            <Terminal className="h-7 w-7 text-white" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white">Digipin Academy</h1>
          <p className="mt-2 text-sm text-slate-400">Sign in with your Digipin Academy credentials.</p>
        </div>

        <form onSubmit={submit} className="glass-dark rounded-3xl p-8 shadow-large">
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@digipin.academy" data-testid="login-email"
            className="mb-4 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400" />
          <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="••••••••" data-testid="login-password"
            className="mb-6 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition-colors placeholder:text-slate-500 focus:border-cyan-400" />
          <button type="submit" disabled={loading} data-testid="login-submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-500 px-6 py-3.5 font-semibold text-white shadow-medium transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-glow disabled:opacity-60">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <>Sign In <ArrowRight className="h-4 w-4" /></>}
          </button>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <button type="button" onClick={() => quick("student")} data-testid="quick-student"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10">
              <GraduationCap className="h-4 w-4 text-cyan-400" /> Demo Student
            </button>
            <button type="button" onClick={() => quick("admin")} data-testid="quick-admin"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-300 transition-colors hover:bg-white/10">
              <ShieldCheck className="h-4 w-4 text-violet-400" /> Demo Admin
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
