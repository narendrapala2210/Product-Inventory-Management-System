import axios from "axios";

const BASE = import.meta.env.VITE_BASE_URL;

export const API = axios.create({
  baseURL: `${BASE}`,
});
