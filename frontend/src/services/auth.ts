import axios from "axios";
import { axiosClient } from "src/config/client";
import { handleError } from "src/utils/handleError";

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    username: string;
    id: string;
  };
}

export interface RegisterResponse {
  message: string;
  result: boolean;
}

export const loginService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    try {
      const response = await axiosClient.post("/auth/login", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },

  async register(username: string, password: string) {
    try {
      const response = await axiosClient.post("/auth/register", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      return handleError(error);
    }
  },
};
