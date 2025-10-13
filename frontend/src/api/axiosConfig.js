import axios from "axios";

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


export default Axios;
