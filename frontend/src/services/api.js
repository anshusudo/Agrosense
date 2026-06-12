import axios from "axios";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach JWT automatically for protected APIs
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const cropCopilotApi = {
  analyzeCropImage: (formData) =>
    apiClient.post("/api/crop-copilot/analyze", formData),
};

export { API_BASE_URL, apiClient, cropCopilotApi };