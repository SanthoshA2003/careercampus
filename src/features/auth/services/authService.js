import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL;

const client = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
});

// Google Login
export const googleLogin = () => {
  if (!API_BASE_URL) {
    console.error("REACT_APP_BACKEND_URL is not configured");
    return;
  }

  window.location.href = `${API_BASE_URL}/api/auth/google`;
};

// Get logged-in user
export const getCurrentUser = async () => {
  const response = await client.get("/auth/me");
  return response.data;
};

export default client;