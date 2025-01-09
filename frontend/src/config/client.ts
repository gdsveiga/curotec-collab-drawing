import axios from "axios";
import { getLocalStorageItem } from "src/utils/localstorage";

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosClient.interceptors.request.use(function (config) {
  const session = getLocalStorageItem("session");

  if (session) config.headers.Authorization = `Bearer ${session.token}`;

  return config;
});
