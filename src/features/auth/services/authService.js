import axios from "axios";

const API_BASE_URL = `${process.env.REACT_APP_BACKEND_URL}/api`;

const authClient = axios.create({
  baseURL: API_BASE_URL,
});

export const googleStudentLogin = async (credential) => {
  const response = await authClient.post("/auth/student/google", {
    credential,
  });

  return response.data;
};