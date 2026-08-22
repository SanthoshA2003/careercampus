import { useEffect, useState } from "react";
import { Loader2, Award } from "lucide-react";
import Shell from "@/features/skillhub/components/Shell";
import { api } from "@/services/api";

export function AdminStudents() {
  const [students, setStudents] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const data = await api.students();

        console.log("Students:", data);

        setStudents(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error(
          "Failed to fetch students:",
          error.response?.data || error
        );

        setStudents([]);
      }
    };

    fetchStudents();
  }, []);

  if (students === null) {
    return (
      <Shell>
        <div className="grid h-[60vh] place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-6xl px-6 py-8">
        <h1 className="text-3xl font-black tracking-tight text-white">
          Students
        </h1>

        <p className="mt-2 text-slate-400">
          Manage and track every enrolled student.
        </p>

        {students.length === 0 ? (
          <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-10 text-center text-slate-500">
            No students found.
          </div>
        ) : (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {students.map((student) => (
              <div
                key={student.id}
                className="rounded-2xl border border-slate-700/60 bg-slate-900/60 p-6 transition hover:border-slate-600"
              >
                {/* Student Details */}
                <div className="flex items-center gap-4">
                  <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 text-lg font-bold text-white">
                    {student.name?.charAt(0)?.toUpperCase() || "S"}
                  </div>

                  <div className="min-w-0">
                    <h3 className="truncate text-lg font-bold text-white">
                      {student.name || "Student"}
                    </h3>

                    <p className="truncate text-sm text-slate-400">
                      {student.email || "-"}
                    </p>
                  </div>
                </div>

                {/* Statistics */}
                <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                  <div>
                    <p className="font-bold text-cyan-400">
                      {student.xp ?? 0} XP
                    </p>
                  </div>

                  <div className="text-center">
                    <p className="font-bold text-amber-400">
                      {student.streak ?? 0} 🔥
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-emerald-400">
                      {student.levels ?? 0} levels
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Shell>
  );
}

export function Certificates() {
  const [data, setData] = useState(null);

useEffect(() => {
  const fetchCertificates = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockData = {
        certificates: [],
      };

      setData(mockData);

    } catch (error) {
      console.error("Failed to fetch certificates:", error);

      setData({
        certificates: [],
      });
    }
  };

  fetchCertificates();
}, []);

  if (!data) {
    return (
      <Shell>
        <div className="grid h-[60vh] place-items-center">
          <Loader2 className="h-8 w-8 animate-spin text-cyan-400" />
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-4xl px-6 py-8">

        <h1 className="text-3xl font-black tracking-tight text-white">
          Certificates
        </h1>

        <p className="mt-2 text-slate-400">
          Earn a certificate by completing every level in a stage.
        </p>

        {data.certificates.length === 0 ? (

          <div className="mt-8 rounded-2xl border border-dashed border-white/10 p-12 text-center text-slate-500">

            <Award className="mx-auto h-10 w-10 text-slate-600" />

            <p className="mt-3">
              No certificates yet. Complete a full stage to unlock one.
            </p>

          </div>

        ) : (

          <div className="mt-8 grid gap-6 sm:grid-cols-2">

            {data.certificates.map((c) => (

              <div
                key={c.id}
                className="relative overflow-hidden rounded-3xl border border-violet-400/30 bg-gradient-to-br from-violet-500/15 via-slate-900 to-cyan-500/15 p-8 text-center"
              >

                <Award className="mx-auto h-12 w-12 text-violet-300" />

                <p className="mt-4 text-xs uppercase tracking-widest text-slate-400">
                  Certificate of Completion
                </p>

                <p className="mt-2 text-2xl font-black text-white">
                  {c.stage} Stage
                </p>

                <p className="text-slate-300">
                  {c.course}
                </p>

                <p className="mt-4 text-xs text-slate-500">
                  Digipin Academy · 2026
                </p>

              </div>

            ))}

          </div>

        )}

      </div>
    </Shell>
  );
}
