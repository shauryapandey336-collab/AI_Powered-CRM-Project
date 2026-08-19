import app from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./config/database.js";

const startServer = async () => {
  try {
    await prisma.$connect();

    console.log("✅ Database connected successfully");

    app.listen(env.PORT, () => {
      console.log(
        `🚀 LeadFlow API running on http://localhost:${env.PORT}`
      );

      console.log(
        `❤️ Health: http://localhost:${env.PORT}/api/v1/health`
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);

    process.exit(1);
  }
};

startServer();

const shutdown = async () => {
  console.log("Shutting down server...");

  await prisma.$disconnect();

  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);