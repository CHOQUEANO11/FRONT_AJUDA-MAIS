import axios from "axios";

const api = axios.create({
  baseURL: "https://api-ajuda-mais.onrender.com", // Substitua pela sua URL base
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
