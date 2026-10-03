import { Router, type Response } from "express";
import { Resource } from "../models/Resource";
import { requireAdmin, type AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/resources
router.get("/", async (_req, res: Response) => {
  try {
    const resources = await Resource.find({ published: true }).sort({ createdAt: -1 });
    return res.json(resources.map((r) => r.toJSON()));
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch resources" });
  }
});

// POST /api/resources (admin only)
router.post("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const resource = await Resource.create(req.body);
    return res.status(201).json(resource.toJSON());
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create resource" });
  }
});

export default router;

