import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LogIn,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import mymentorLogo from "@/assets/images/mymentor-logo.png";
import { api } from "@/services/api";

export default function LoginPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // ==================================================
  // HANDLE INPUT
  // ==================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // LOGIN
  // ==================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter your password");
      return;
    }

    try {
      setLoading(true);

      // ==================================================
      // 1. LOGIN API
      // ==================================================

      const response = await api.login(
        formData.email.trim(),
        formData.password
      );

      console.log(
        "LOGIN RESPONSE:",
        response
      );

      // ==================================================
      // 2. GET ACCESS TOKEN
      // ==================================================

      const token = response?.access_token;

      if (!token) {
        throw new Error(
          "Access token was not returned by login API"
        );
      }

      // ==================================================
      // 3. SAVE TOKEN
      // ==================================================

      localStorage.setItem(
        "access_token",
        token
      );

      console.log(
        "ACCESS TOKEN SAVED"
      );

      // ==================================================
      // 4. SUCCESS
      // ==================================================

      toast.success(
        "Login successful!"
      );

      // ==================================================
      // 5. GO TO PROFILE
      // ==================================================

      navigate("/profile");

    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      console.error(
        "STATUS:",
        error?.response?.status
      );

      console.error(
        "RESPONSE:",
        error?.response?.data
      );

      const message =
        error?.response?.data?.detail ||
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        (
          typeof error?.response?.data === "string"
            ? error.response.data
            : null
        ) ||
        "Invalid email or password.";

      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">

      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_70px_rgba(15,23,42,0.10)]">

        {/* ==================================================
            LEFT SIDE
        ================================================== */}

        <div className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 lg:block">

          <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full border-[50px] border-white/10" />

          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full border-[70px] border-white/10" />

          <div className="absolute right-10 top-32 h-20 w-20 rounded-3xl bg-white/10 backdrop-blur-md" />

          <div className="relative z-10 flex h-full flex-col justify-between p-12">

            {/* Logo */}

            <div>
              <div className="inline-flex rounded-2xl bg-white px-4 py-3 shadow-lg">

                <img
                  src={mymentorLogo}
                  alt="MyMentor"
                  className="h-9 w-auto object-contain"
                />

              </div>
            </div>

            {/* Main Content */}

            <div className="max-w-md">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">

                <span className="h-2 w-2 rounded-full bg-cyan-300" />

                MyMentor

              </div>

              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white">

                Welcome
                <br />

                back to
                <br />

                <span className="text-cyan-200">
                  MyMentor.
                </span>

              </h1>

              <p className="mt-6 max-w-sm text-base leading-7 text-blue-100">

                Continue your career journey,
                connect with mentors, improve your
                skills and discover the right opportunities.

              </p>

              <div className="mt-8 space-y-4">

                <div className="flex items-center gap-3 text-sm text-white">

                  <CheckCircle2 className="h-5 w-5 text-cyan-200" />

                  Personalized career guidance

                </div>

                <div className="flex items-center gap-3 text-sm text-white">

                  <CheckCircle2 className="h-5 w-5 text-cyan-200" />

                  Connect with experienced mentors

                </div>

                <div className="flex items-center gap-3 text-sm text-white">

                  <CheckCircle2 className="h-5 w-5 text-cyan-200" />

                  Track your career progress

                </div>

              </div>

            </div>

            {/* Bottom */}

            <div className="flex items-center gap-3 text-sm text-blue-100">

              <div className="h-px w-10 bg-blue-200/50" />

              Your journey continues here

            </div>

          </div>
        </div>

        {/* ==================================================
            RIGHT SIDE
        ================================================== */}

        <div className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-[55%] lg:px-16">

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.5,
            }}
            className="w-full max-w-[470px]"
          >

            {/* Mobile Logo */}

            <div className="mb-8 flex justify-center lg:hidden">

              <img
                src={mymentorLogo}
                alt="MyMentor"
                className="h-10 w-auto object-contain"
              />

            </div>

            {/* Heading */}

            <div className="mb-8">

              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">

                <LogIn className="h-5 w-5" />

              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Login to continue your MyMentor journey.
              </p>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Email */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email
                </label>

                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  autoComplete="email"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

              </div>

              {/* Password */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <label className="block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    onClick={() =>
                      toast.info(
                        "Forgot password coming soon"
                      )
                    }
                  >
                    Forgot password?
                  </button>

                </div>

                <div className="relative">

                  <input
                    name="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (prev) => !prev
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                  >

                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}

                  </button>

                </div>

              </div>

              {/* Login Button */}

              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Login

                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}

              </button>

            </form>

            {/* Register */}

            <p className="mt-7 text-center text-sm text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create Account
              </Link>

            </p>

            {/* Terms */}

            <p className="mt-5 text-center text-xs leading-5 text-slate-400">

              By logging in, you agree to our{" "}

              <span className="text-slate-500">
                Terms & Privacy Policy
              </span>

              .

            </p>

          </motion.div>

        </div>

      </div>

    </div>
  );
}