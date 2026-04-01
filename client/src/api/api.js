import axios from "axios";

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  baseURL:
    import.meta.env.VITE_API_URL || "https://56hgb32x-3000.asse.devtunnels.ms/",
});

export default api;
