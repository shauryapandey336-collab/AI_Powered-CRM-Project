import { api } from "./api.js";

export const dashboardService = {
  async getSummary() {
    return api.get("/dashboard/summary");
  }
};
