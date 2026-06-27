import express from 'express';
import {
  getDoctors,
  getDoctorById,
  addAvailability,
  getDoctorAvailability,
} from '../controllers/doctorController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getDoctors);
router.get("/:id", getDoctorById);

router.post('/availability', protect, addAvailability);
router.get('/:id/availability', getDoctorAvailability);

export default router;