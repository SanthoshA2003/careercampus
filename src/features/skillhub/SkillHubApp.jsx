import { Routes, Route, Navigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { AcademyAuthProvider, useAcademyAuth } from "@/context/AuthContext";
import Login from "@/features/skillhub/pages/Login";
import Dashboard from "@/features/skillhub/pages/Dashboard";
import Journey from "@/features/skillhub/pages/Journey";
import Workspace from "@/features/skillhub/pages/Workspace";
import AdminDashboard from "@/features/skillhub/pages/AdminDashboard";
import AdminBuilder from "@/features/skillhub/pages/AdminBuilder";
import { AdminStudents, Certificates } from "@/features/skillhub/pages/Misc";

function Guard({ children, admin = false }) {
  const { user, ready } = useAcademyAuth();
  if (!ready) return <div className="grid h-screen place-items-center bg-slate-950"><Loader2 className="h-8 w-8 animate-spin text-cyan-400" /></div>;
if (!user) return <Navigate to="/" replace />;
  if (admin && user.role !== "admin") return <Navigate to="/skillhub" replace />;
  return children;
}

function Home() {
  const { user } = useAcademyAuth();
  if (user?.role === "admin") return <Navigate to="/skillhub/admin" replace />;
  return <Dashboard />;
}

export default function SkillHubApp() {
  return (
    <AcademyAuthProvider>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="" element={<Guard><Home /></Guard>} />
        <Route path="journey" element={<Guard><Journey /></Guard>} />
        <Route path="journey/:courseId" element={<Guard><Journey /></Guard>} />
        <Route path="level/:levelId" element={<Guard><Workspace /></Guard>} />
        <Route path="certificates" element={<Guard><Certificates /></Guard>} />
        <Route path="admin" element={<Guard admin><AdminDashboard /></Guard>} />
        <Route path="admin/builder" element={<Guard admin><AdminBuilder /></Guard>} />
        <Route path="admin/students" element={<Guard admin><AdminStudents /></Guard>} />
        <Route path="*" element={<Navigate to="/skillhub" replace />} />
      </Routes>
    </AcademyAuthProvider>
  );
}
