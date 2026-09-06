import axios from "axios";

const api = axios.create({
    baseURL: "https://launchflow-backend.onrender.com",
    withCredentials: true
});

export default api;