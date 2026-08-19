import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// env.js is:
// Backend/src/config/env.js
//
// .env is:
// Backend/.env
//
// Therefore go:
// config -> src -> Backend -> .env

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

  PORT: z.coerce
    .number()
    .default(5000),

  DATABASE_URL: z
    .string()
    .min(1, "DATABASE_URL is required"),

  JWT_SECRET: z
    .string()
    .min(32, "JWT_SECRET must be at least 32 characters"),

  FRONTEND_URL: z
    .string()
    .url(),

  COOKIE_NAME: z
    .string()
    .default("leadflow_token"),

  OPENAI_API_KEY: z
    .string()
    .optional()
    .or(z.literal("")),
});

export const env = envSchema.parse(process.env);