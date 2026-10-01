import axios from "axios";

const api = axios.create({
    baseURL: "https://launchflow-5p6d.vercel.app/",
    withCredentials: true
});

export default api;
