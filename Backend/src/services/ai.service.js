import OpenAI from "openai";
import { prisma } from "../config/database.js";
import { env } from "../config/env.js";
import { getLeadById } from "./lead.service.js";

const getOpenAIClient = () => {
  if (!env.OPENAI_API_KEY || env.OPENAI_API_KEY.trim() === "") {
    return null;
  }
  return new OpenAI({ apiKey: env.OPENAI_API_KEY });
};

export const analyzeLeadWithAI = async (leadId, organizationId, userId) => {
  const lead = await getLeadById(leadId, organizationId);

  const openai = getOpenAIClient();

  if (!openai) {
    const defaultAnalysis = {
      score: Math.min(85, Math.max(30, (lead.company ? 30 : 10) + (lead.email ? 20 : 0) + (lead.phone ? 20 : 0) + (lead.jobTitle ? 15 : 0))),
      summary: `Automated rule-based evaluation for ${lead.firstName} ${lead.lastName || ""}`.trim(),
      priority: lead.company ? "HIGH" : "MEDIUM",
      recommendedAction: "Reach out via email to introduce products and schedule initial demo call.",
      reasoning: "OpenAI API key was not configured. Returned standard analytical evaluation baseline."
    };

    await saveAnalysisResult(leadId, defaultAnalysis, userId);
    return defaultAnalysis;
  }

  try {
    const prompt = `
Analyze the following sales lead for a B2B SaaS CRM platform:

Lead Info:
- Name: ${lead.firstName} ${lead.lastName || ""}
- Email: ${lead.email}
- Phone: ${lead.phone || "N/A"}
- Company: ${lead.company || "Unknown"}
- Job Title: ${lead.jobTitle || "Unknown"}
- Status: ${lead.status}
- Source: ${lead.source}
- Notes: ${lead.notes || "None"}

Respond strictly with a JSON object with these exact keys:
{
  "score": (integer from 0 to 100),
  "summary": "(2-3 sentence executive summary)",
  "priority": "LOW" | "MEDIUM" | "HIGH",
  "recommendedAction": "(actionable next step for sales rep)",
  "reasoning": "(brief breakdown of lead quality factors)"
}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert enterprise sales intelligence assistant." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.3
    });

    const parsed = JSON.parse(response.choices[0].message.content);

    const result = {
      score: typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : 50,
      summary: parsed.summary || "No summary provided.",
      priority: ["LOW", "MEDIUM", "HIGH"].includes(parsed.priority) ? parsed.priority : "MEDIUM",
      recommendedAction: parsed.recommendedAction || "Follow up with lead.",
      reasoning: parsed.reasoning || "Standard AI score generation."
    };

    await saveAnalysisResult(leadId, result, userId);
    return result;
  } catch (error) {
    console.error("OpenAI analysis failed:", error.message);

    const fallback = {
      score: 50,
      summary: `Lead ${lead.firstName} evaluated with standard fallback criteria.`,
      priority: "MEDIUM",
      recommendedAction: "Schedule exploratory call to assess requirements.",
      reasoning: `AI service temporary error: ${error.message}`
    };

    await saveAnalysisResult(leadId, fallback, userId);
    return fallback;
  }
};

const saveAnalysisResult = async (leadId, analysis, userId) => {
  await prisma.$transaction(async (tx) => {
    await tx.lead.update({
      where: { id: leadId },
      data: { score: analysis.score }
    });

    await tx.leadActivity.create({
      data: {
        leadId,
        createdById: userId,
        type: "AI_ANALYSIS",
        description: `AI Score: ${analysis.score}/100 [Priority: ${analysis.priority}] - ${analysis.summary}`
      }
    });
  });
};
