import { asyncHandler } from "../utils/asyncHandler.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { analyzeLeadWithAI } from "../services/ai.service.js";

export const analyzeLead = asyncHandler(async (req, res) => {
  const analysis = await analyzeLeadWithAI(
    req.params.id,
    req.organizationId,
    req.user.id
  );

  return sendSuccess(res, 200, "Lead analyzed successfully", { analysis });
});
