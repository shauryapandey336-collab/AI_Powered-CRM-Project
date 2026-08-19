import { api } from "./api.js";

export const authService = {
  async register(data) {
    return api.post("/auth/register", data);
  },

  async login(data) {
    return api.post("/auth/login", data);
  },

  async logout() {
    return api.post("/auth/logout");
  },

  async getCurrentUser() {
    return api.get("/auth/me");
  }
};
