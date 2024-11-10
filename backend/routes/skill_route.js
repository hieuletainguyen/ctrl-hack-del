import * as skill from "../controllers/skills.js";
import { Router } from "express";

const router = Router();

router.post("/add-skill", skill.addSkill);
router.get("/get-skill", skill.getSkill);

export default router;