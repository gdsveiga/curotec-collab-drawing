import { axiosClient } from "src/config/client";

export interface LoginResponse {
  message: string;
  token: string;
  user: {
    username: string;
    id: string;
  };
}

export const loginService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const response = await axiosClient.post("/auth/login", {
      username,
      password,
    });
    return response.data;
  },
};
