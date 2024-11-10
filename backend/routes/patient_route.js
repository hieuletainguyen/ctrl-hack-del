import { Router } from "express";
import * as patient from "../controllers/patients.js";

const router = Router();

router.post("/add-patient", patient.addPatient);
router.post("/submit-report", patient.submitReport);
router.get("/get-patient/:patientName", patient.getPatientByName);
router.put("/update-patient/:patientId", patient.updatePatient);
router.delete("/delete-patient/:patientId", patient.deletePatient);
router.post("/recent-patient", patient.recentPatient);

export default router;