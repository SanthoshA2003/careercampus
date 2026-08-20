import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Eye,
  EyeOff,
  UserRound,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import mymentorLogo from "@/assets/images/mymentor-logo.png";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    emailOrMobile: "",
    password: "",
    grade: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.emailOrMobile.trim()) {
      toast.error("Please enter your email or mobile number");
      return;
    }

    if (!formData.password) {
      toast.error("Please enter a password");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (!formData.grade) {
      toast.error("Please select your grade/class");
      return;
    }

    try {
      setLoading(true);

      // API integration will be added here
      console.log("Registration data:", formData);

      toast.success("Registration successful");

      navigate("/profile");
    } catch (error) {
      console.error(error);

      toast.error(
        error?.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl overflow-hidden rounded-[32px] bg-white shadow-[0_20px_70px_rgba(15,23,42,0.10)]">

        {/* ================= LEFT SIDE ================= */}
        <div className="relative hidden w-[45%] overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-cyan-500 lg:block">

          {/* Background shapes */}
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

            {/* Main content */}
            <div className="max-w-md">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-cyan-300" />
                MyMentor
              </div>

              <h1 className="text-5xl font-bold leading-[1.08] tracking-tight text-white">
                Build your
                <br />
                career with
                <br />
                <span className="text-cyan-200">
                  the right direction.
                </span>
              </h1>

              <p className="mt-6 max-w-sm text-base leading-7 text-blue-100">
                Create your account and discover personalized
                career paths, skills, projects and mentors designed
                around your goals.
              </p>

              {/* Benefits */}
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
              Start your journey today
            </div>

          </div>
        </div>

        {/* ================= RIGHT SIDE ================= */}
        <div className="flex w-full items-center justify-center px-6 py-10 sm:px-10 lg:w-[55%] lg:px-16">

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-[470px]"
          >

            {/* Mobile logo */}
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
                <UserRound className="h-5 w-5" />
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Just a few details and you're ready to begin.
              </p>

            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Name */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Full Name
                </label>

                <input
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Email / Mobile */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Email or Mobile
                </label>

                <input
                  name="emailOrMobile"
                  type="text"
                  value={formData.emailOrMobile}
                  onChange={handleChange}
                  placeholder="Enter email or mobile number"
                  autoComplete="username"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>

              {/* Password */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <div className="relative">

                  <input
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 pr-12 text-sm text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((prev) => !prev)
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

                <p className="mt-1.5 text-xs text-slate-400">
                  Minimum 6 characters
                </p>
              </div>

              {/* Grade */}
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Grade / Class
                </label>

                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-700 outline-none transition-all focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                >
                  <option value="">
                    Select your grade / class
                  </option>

                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                  <option value="college">
                    College Student
                  </option>
                  <option value="graduate">
                    Graduate
                  </option>
                  <option value="professional">
                    Working Professional
                  </option>
                </select>
              </div>

              {/* Button */}
              <button
                type="submit"
                disabled={loading}
                className="group mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-500 text-sm font-semibold text-white shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Creating account..."
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </button>

            </form>

            {/* Login */}
            <p className="mt-7 text-center text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/profile"
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Login
              </Link>
            </p>

            {/* Terms */}
            <p className="mt-5 text-center text-xs leading-5 text-slate-400">
              By creating an account, you agree to our{" "}
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