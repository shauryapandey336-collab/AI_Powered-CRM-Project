import { Router } from "express";
import * as aiController from "../controllers/ai.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticateUser);

router.post("/:id/analyze", aiController.analyzeLead);

export default router;
