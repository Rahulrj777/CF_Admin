import axios from "axios";

export const BASE_URL = "https://cf-server-tr24.onrender.com";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});
  