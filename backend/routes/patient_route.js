import { Router } from "express";
import * as patient from "../controllers/patients.js";

const router = Router();

router.post("/patients/add-patient", patient.addPatient);
router.post("/patients/submit-report", patient.submitReport);
router.get("/patients/get-patient/:patientId", patient.getPatientById);
router.get("/patients/search-patient/:patientName", patient.getPatientByName);
router.put("/patients/update-patient/:patientId", patient.updatePatient);
router.delete("/patients/delete-patient/:patientId", patient.deletePatient);
router.post("/patients/recent-patient", patient.recentPatient);

export default router;