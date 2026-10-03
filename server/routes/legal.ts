import { Router, type Response } from "express";
import { LegalResource } from "../models/LegalResource";
import { requireAdmin, type AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/legal-resources
router.get("/", async (_req, res: Response) => {
  try {
    const resources = await LegalResource.find({ published: true }).sort({ topic: 1 });
    return res.json(resources.map((r) => r.toJSON()));
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch legal resources" });
  }
});

// POST /api/legal-resources (admin only)
router.post("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const resource = await LegalResource.create(req.body);
    return res.status(201).json(resource.toJSON());
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create legal resource" });
  }
});

export default router;

