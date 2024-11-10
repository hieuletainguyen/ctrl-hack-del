import * as skill from "../controllers/skills.js";
import { Router } from "express";

const router = Router();

router.post("/skills/add-skill", skill.addSkill);
router.get("/skills/get-skill", skill.getSkill);

export default router;