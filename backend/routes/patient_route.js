import { Router } from "express";
import * as patient from "../controllers/patients.js";

const router = Router();

router.post("/add-patient", patient.addPatient);
router.get("/get-patient", patient.getPatient);
router.put("/update-patient", patient.updatePatient);
router.delete("/delete-patient", patient.deletePatient);
router.post("/recent-patient", patient.recentPatient);

export default router;