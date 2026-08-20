import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

if (!API_BASE_URL) {
  console.error("REACT_APP_BACKEND_URL is not configured");
}

const API = `${API_BASE_URL}/api`;

// --------------------------------------------------
// Axios Client
// --------------------------------------------------

const client = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Add JWT token automatically if available
client.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("dp_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------------------------
// Authentication
// --------------------------------------------------

export const googleLogin = () => {
  if (!API_BASE_URL) {
    console.error("REACT_APP_BACKEND_URL is not configured");
    return;
  }

  window.location.href = `${API_BASE_URL}/api/auth/google`;
};

export const getCurrentUser = async () => {
  const response = await client.get("/auth/me");
  return response.data;
};

// --------------------------------------------------
// API
// --------------------------------------------------

export const api = {
  base: API,

  // Authentication
  login: (email, password) =>
    client
      .post("/auth/login", {
        email,
        password,
      })
      .then((r) => r.data),

      adminLogin: (email, password) =>
  client
    .post("/auth/admin/login", {
      email,
      password,
    })
    .then((r) => r.data),

  register: (name, email, password) =>
    client
      .post("/auth/register", {
        name,
        email,
        password,
      })
      .then((r) => r.data),

  me: () =>
    client
      .get("/auth/me")
      .then((r) => r.data),

  googleSession: (session_id) =>
    client
      .post("/auth/google/session", {
        session_id,
      })
      .then((r) => r.data),

  otpSend: (phone) =>
    client
      .post("/auth/otp/send", {
        phone,
      })
      .then((r) => r.data),

  otpVerify: (phone, otp) =>
    client
      .post("/auth/otp/verify", {
        phone,
        otp,
      })
      .then((r) => r.data),

  // ------------------------------------------------
  // Profile
  // ------------------------------------------------

  onboarding: (name, dob) =>
    client
      .post("/me/onboarding", {
        name,
        dob,
      })
      .then((r) => r.data),

getProfile: () =>
  client
    .get("/profiles/me")
    .then((r) => r.data),

    createProfile: (body) =>
  client
    .post("/profiles/me", body)
    .then((r) => r.data),

updateProfile: (body) =>
  client
    .put("/profiles/me", body)
    .then((r) => r.data),

getProfileById: (profileId) =>
  client
    .get(`/profiles/${profileId}`)
    .then((r) => r.data),

  // ------------------------------------------------
  // Career
  // ------------------------------------------------

  careerGenerate: (payload) =>
    client
      .post("/career/generate", payload)
      .then((r) => r.data),

  // ------------------------------------------------
  // Mentors
  // ------------------------------------------------

  mentorsList: (industry) =>
    client
      .get("/mentors", {
        params:
          industry && industry !== "All"
            ? { industry }
            : {},
      })
      .then((r) => r.data),

  mentorIndustries: () =>
    client
      .get("/mentors/industries")
      .then((r) => r.data),

  mentorApply: (body) =>
    client
      .post("/mentors/apply", body)
      .then((r) => r.data),

  mentorGet: (id) =>
    client
      .get(`/mentors/${id}`)
      .then((r) => r.data),

  mentorBook: (id, body) =>
    client
      .post(`/mentors/${id}/book`, body)
      .then((r) => r.data),

  myBookings: (mentorId) =>
    client
      .get("/me/bookings", {
        params: mentorId
          ? { mentorId }
          : {},
      })
      .then((r) => r.data),
      

  generateReport: (bookingId) =>
    client
      .post(`/bookings/${bookingId}/report/demo`)
      .then((r) => r.data),

  // ------------------------------------------------
  // Organisations
  // ------------------------------------------------

  companiesList: () =>
    client
      .get("/companies")
      .then((r) => r.data),

  companyJoin: (body) =>
    client
      .post("/companies/join", body)
      .then((r) => r.data),

  // ------------------------------------------------
  // Jobs
  // ------------------------------------------------

  jobsList: (params) =>
    client
      .get("/jobs", { params })
      .then((r) => r.data),

  jobGet: (id) =>
    client
      .get(`/jobs/${id}`)
      .then((r) => r.data),

  jobCreate: (body) =>
    client
      .post("/jobs", body)
      .then((r) => r.data),

  jobApply: (id, body) =>
    client
      .post(`/jobs/${id}/apply`, body)
      .then((r) => r.data),

  // ------------------------------------------------
  // Courses / SkillHub
  // ------------------------------------------------

  courses: () =>
    client
      .get("/courses")
      .then((r) => r.data),

  journey: (courseId) =>
    client
      .get(`/courses/${courseId}/journey`)
      .then((r) => r.data),

  level: (levelId) =>
    client
      .get(`/levels/${levelId}`)
      .then((r) => r.data),

  execute: (language, code, stdin) =>
    client
      .post("/execute", {
        language,
        code,
        stdin,
      })
      .then((r) => r.data),

  submit: (levelId, cpId, language, code) =>
    client
      .post(
        `/levels/${levelId}/checkpoints/${cpId}/submit`,
        {
          language,
          code,
        }
      )
      .then((r) => r.data),

  videoComplete: (levelId) =>
    client
      .post(`/levels/${levelId}/video-complete`)
      .then((r) => r.data),

  myProgress: () =>
    client
      .get("/me/progress")
      .then((r) => r.data),

  profileScore: () =>
    client
      .get("/me/profile-score")
      .then((r) => r.data),

      // ------------------------------------------------
// Student Dashboard / SkillHub
// ------------------------------------------------

studentSkillHubDashboard: () =>
  client
    .get("/dashboard/student/skillhub")
    .then((r) => r.data),

  // ------------------------------------------------
  // Admin
  // ------------------------------------------------

  skillHubDashboard: () =>
  client
    .get("/dashboard/admin/skillhub")
    .then((r) => r.data),

  analytics: () =>
    client
      .get("/admin/analytics")
      .then((r) => r.data),

  students: () =>
    client
      .get("/admin/students")
      .then((r) => r.data),

  createCourse: (body) =>
    client
      .post("/admin/courses", body)
      .then((r) => r.data),

  courseLevels: (courseId) =>
    client
      .get(`/admin/courses/${courseId}/levels`)
      .then((r) => r.data),

  createLevel: (courseId, body) =>
    client
      .post(`/admin/courses/${courseId}/levels`, body)
      .then((r) => r.data),

  updateLevel: (levelId, body) =>
    client
      .put(`/admin/levels/${levelId}`, body)
      .then((r) => r.data),

  addCheckpoint: (levelId, body) =>
    client
      .post(
        `/admin/levels/${levelId}/checkpoints`,
        body
      )
      .then((r) => r.data),

  upload: (file) => {
    const fd = new FormData();

    fd.append("file", file);

    return client
      .post("/admin/upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((r) => r.data);
  },
};
// const token = localStorage.getItem("dp_token");

// if (token) {
//   config.headers.Authorization = `Bearer ${token}`;
// }

// Default axios client
export default client;