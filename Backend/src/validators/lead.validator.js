import { z } from "zod";

const LeadStatusEnum = z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"]);
const LeadSourceEnum = z.enum(["CSV", "MANUAL", "WEBSITE", "OTHER"]);
const ActivityTypeEnum = z.enum(["NOTE", "CALL", "EMAIL", "STATUS_CHANGE", "AI_ANALYSIS"]);

export const createLeadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  source: LeadSourceEnum.optional().default("MANUAL"),
  status: LeadStatusEnum.optional().default("NEW"),
  assignedToId: z.string().optional().nullable(),
  notes: z.string().optional()
});

export const updateLeadSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().optional().nullable(),
  email: z.string().email().optional(),
  phone: z.string().optional().nullable(),
  company: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  source: LeadSourceEnum.optional(),
  status: LeadStatusEnum.optional(),
  assignedToId: z.string().optional().nullable(),
  score: z.number().min(0).max(100).optional(),
  notes: z.string().optional().nullable()
});

export const createActivitySchema = z.object({
  type: ActivityTypeEnum,
  description: z.string().min(1, "Activity description is required")
});
