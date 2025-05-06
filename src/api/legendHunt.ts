import axios from "axios";
import { getToken } from "../auth/authUtils";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_DOMAIN,
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getBalance = () =>
  api.get("/api/legend_hunt/usdt-balance/").then((res) => res.data);
export const startGame = (bet_amount: number) =>
  api.post("/api/legend_hunt/start-game/", { bet_amount });
export const flipCard = (gameId: number) =>
  api.post(`/api/legend_hunt/flip-card/${gameId}/`).then((res) => res.data);