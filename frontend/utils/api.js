import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true, // Important for cookies
});

// Optional: Interceptor to handle 401s (e.g., redirect to login)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access (e.g., clear local state, redirect)
      console.log("Unauthorized, redirecting to login...");
      // window.location.href = '/login'; // Uncomment to auto-redirect
    }
    return Promise.reject(error);
  },
);

export default api;
