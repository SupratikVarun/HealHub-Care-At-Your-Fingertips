import express from "express";
import {
  getDoctors,
  getDoctorById,
  addAvailability,
  getDoctorAvailability,
  updateConsultationFee,
} from "../controllers/doctorController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getDoctors);

router.get("/:id", getDoctorById);

// Update consultation fee
router.put("/consultation-fee", protect, updateConsultationFee);

// Doctor availability
router.post("/availability", protect, addAvailability);

router.get("/:id/availability", getDoctorAvailability);

export default router;