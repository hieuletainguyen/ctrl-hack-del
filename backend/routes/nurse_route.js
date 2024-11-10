import * as nurse from "../controllers/nurses.js";
import { Router } from "express";

const router = Router();

router.post("/nurses/add-nurse", nurse.addNurse);
router.get("/nurses/get-nurse/:id?", nurse.getNurse);
router.put("/nurses/update-nurse/:nurseId", nurse.updateNurse);
router.delete("/nurses/delete-nurse/:nurseId", nurse.deleteNurse);

export default router;
