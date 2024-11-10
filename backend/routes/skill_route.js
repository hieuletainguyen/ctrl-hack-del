import * as skill from "../controllers/skills.js";
import { Router } from "express";

const router = Router();

router.post("/add-skill", skill.addSkill);
router.get("/get-skill", skill.getSkill);
router.delete("/delete-skill", skill.deleteSkill);

export default router;