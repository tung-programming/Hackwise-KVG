import { Router } from "express";
import { authGuard } from "../../middleware/auth.guard";
import { validateRequest } from "../auth/auth.middleware";
import { chatbotController } from "./chatbot.controller";
import { chatbotQuerySchema } from "./chatbot.schema";

const router = Router();

router.use(authGuard);

router.post("/chat", validateRequest(chatbotQuerySchema), chatbotController.chat);
router.get("/knowledge-base/stats", chatbotController.stats);

export default router;

