import * as nurse from "../controllers/nurses.js";
import { Router } from "express";

const router = Router();

router.post("/add-nurse", nurse.addNurse);
router.get("/get-nurse", nurse.getNurse);
router.put("/update-nurse", nurse.updateNurse);
router.delete("/delete-nurse/:id", nurse.deleteNurse);

export default router;