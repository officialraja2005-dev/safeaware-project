import { Router, type Response } from "express";
import { SurveyQuestion } from "../models/SurveyQuestion";
import { SurveyResponse } from "../models/SurveyResponse";
import { requireAdmin, type AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/survey/questions
router.get("/questions", async (_req, res: Response) => {
  try {
    const questions = await SurveyQuestion.find({ isActive: true }).sort({ orderIndex: 1 });
    return res.json(questions.map((q) => q.toJSON()));
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch survey questions" });
  }
});

// POST /api/survey/submit
router.post("/submit", async (req: AuthRequest, res: Response) => {
  try {
    const { isAnonymous, userId, answers } = req.body;
    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "Answers object is required" });
    }

    const response = await SurveyResponse.create({
      isAnonymous: Boolean(isAnonymous),
      userId: isAnonymous ? null : (userId || (req.user ? req.user.id : null)),
      answers,
    });

    return res.status(201).json({ success: true, response: response.toJSON() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to submit survey" });
  }
});

// GET /api/survey/responses (admin only)
router.get("/responses", requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const responses = await SurveyResponse.find().sort({ createdAt: -1 });
    return res.json(responses.map((r) => r.toJSON()));
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch survey responses" });
  }
});

export default router;

