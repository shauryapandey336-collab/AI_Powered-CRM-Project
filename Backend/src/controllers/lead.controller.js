import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";
import * as leadService from "../services/lead.service.js";
import * as csvService from "../services/csv.service.js";

export const getLeads = asyncHandler(async (req, res) => {
  const result = await leadService.getLeads(req.organizationId, req.query);
  return sendSuccess(res, 200, "Leads fetched successfully", result.data, result.pagination);
});

export const getLead = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.id, req.organizationId);
  return sendSuccess(res, 200, "Lead details fetched", { lead });
});

export const createLead = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(req.body, req.organizationId, req.user.id);
  return sendSuccess(res, 201, "Lead created successfully", { lead });
});

export const updateLead = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(req.params.id, req.body, req.organizationId, req.user.id);
  return sendSuccess(res, 200, "Lead updated successfully", { lead });
});

export const deleteLead = asyncHandler(async (req, res) => {
  await leadService.deleteLead(req.params.id, req.organizationId);
  return sendSuccess(res, 200, "Lead deleted successfully");
});

export const addActivity = asyncHandler(async (req, res) => {
  const activity = await leadService.addLeadActivity(
    req.params.id,
    req.organizationId,
    req.user.id,
    req.body
  );
  return sendSuccess(res, 201, "Activity recorded successfully", { activity });
});

export const getActivities = asyncHandler(async (req, res) => {
  const activities = await leadService.getLeadActivities(req.params.id, req.organizationId);
  return sendSuccess(res, 200, "Activities fetched", { activities });
});

export const importLeadsCsv = asyncHandler(async (req, res) => {
  if (!req.file) {
    return sendError(res, 400, "Please upload a CSV file");
  }

  const summary = await csvService.processCsvImport(
    req.file.buffer,
    req.organizationId,
    req.user.id
  );

  return sendSuccess(res, 200, "CSV import processed successfully", { summary });
});
