import axios from "axios";
import { getToken } from "../auth/authUtils";

const api = axios.create({
  baseURL: "http://localhost:8000/api/legend_hunt/",
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getBalance = () =>
  api.get("/usdt-balance/").then((res) => res.data);
export const startGame = (bet_amount: number) =>
  api.post("/start-game/", { bet_amount });
export const flipCard = (gameId: number) =>
  api.post(`/flip-card/${gameId}/`).then((res) => res.data);
