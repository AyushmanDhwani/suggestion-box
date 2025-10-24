import axios from "axios";

// Import the toast function
import { toast } from "react-toastify";

// Import the CSS for the toast notifications
import 'react-toastify/dist/ReactToastify.css';

const Axios = axios.create({
//   baseURL: "/api",
   headers: {
    "Content-Type": "application/json",
  },
});

const userData = localStorage.getItem("user");

let token = null;

if (userData) {
  try {
    const parsed = JSON.parse(userData); // parse the JSON string
    token = parsed.accessToken;          // get the accessToken
  } catch (err) {
    console.error("Failed to parse user data from localStorage:", err);
  }
}

console.log("JWT token:", token);


Axios.interceptors.request.use(
  (config) => {
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        const token = parsed.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

Axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Unauthorized (401) detected — redirecting to /login");

      // Clear user info
      localStorage.removeItem("user");

      // Save toast message for next page
      localStorage.setItem("toastMessage", "Login required to access this resource. Your session may have expired.");

      // Redirect to login
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);



export default Axios;
