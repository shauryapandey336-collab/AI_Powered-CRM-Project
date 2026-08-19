import { api } from "./api.js";

export const aiService = {
  async analyzeLead(leadId) {
    return api.post(`/leads/${leadId}/analyze`);
  }
};
