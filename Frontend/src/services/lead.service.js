import { api } from "./api.js";

export const leadService = {
  async getLeads(params = {}) {
    const query = new URLSearchParams();
    if (params.page) query.append("page", params.page);
    if (params.limit) query.append("limit", params.limit);
    if (params.search) query.append("search", params.search);
    if (params.status && params.status !== "ALL") query.append("status", params.status);
    if (params.source && params.source !== "ALL") query.append("source", params.source);
    if (params.sortBy) query.append("sortBy", params.sortBy);
    if (params.sortOrder) query.append("sortOrder", params.sortOrder);

    return api.get(`/leads?${query.toString()}`);
  },

  async getLeadById(id) {
    return api.get(`/leads/${id}`);
  },

  async createLead(data) {
    return api.post("/leads", data);
  },

  async updateLead(id, data) {
    return api.patch(`/leads/${id}`, data);
  },

  async deleteLead(id) {
    return api.delete(`/leads/${id}`);
  },

  async addActivity(leadId, data) {
    return api.post(`/leads/${leadId}/activities`, data);
  },

  async getActivities(leadId) {
    return api.get(`/leads/${leadId}/activities`);
  },

  async importCsv(formData) {
    return api.post("/leads/import", formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    });
  }
};
