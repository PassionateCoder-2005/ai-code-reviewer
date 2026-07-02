import { Router } from "express";
import { aiRes } from "../controller/ai.controller.js";
const aiRouter=Router();
aiRouter.post("/ai-reviewer",aiRes)
export default aiRouter;