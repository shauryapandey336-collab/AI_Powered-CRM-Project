import { Router } from "express";
import multer from "multer";
import * as leadController from "../controllers/lead.controller.js";
import { authenticateUser } from "../middleware/auth.middleware.js";
import { validateRequest } from "../middleware/validation.middleware.js";
import { createLeadSchema, updateLeadSchema, createActivitySchema } from "../validators/lead.validator.js";

const upload = multer({
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are permitted"));
    }
  }
});

const router = Router();

router.use(authenticateUser);

router.post("/import", upload.single("file"), leadController.importLeadsCsv);

router.get("/", leadController.getLeads);
router.post("/", validateRequest(createLeadSchema), leadController.createLead);

router.get("/:id", leadController.getLead);
router.patch("/:id", validateRequest(updateLeadSchema), leadController.updateLead);
router.delete("/:id", leadController.deleteLead);

router.post("/:id/activities", validateRequest(createActivitySchema), leadController.addActivity);
router.get("/:id/activities", leadController.getActivities);

export default router;
