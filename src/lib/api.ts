import axios from "axios";

const api = axios.create({
  // baseURL: "http://localhost:3333",
  baseURL: "https://api-ajuda-mais.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
