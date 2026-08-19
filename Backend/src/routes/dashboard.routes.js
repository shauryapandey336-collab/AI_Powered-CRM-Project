import { Router } from "express";
import * as dashboardController from "../controllers/dashboard.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.get("/summary", dashboardController.getDashboardSummary);

export default router;
