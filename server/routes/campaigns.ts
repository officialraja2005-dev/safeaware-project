import { Router, type Response } from "express";
import { Campaign } from "../models/Campaign";
import { requireAdmin, type AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/campaigns
router.get("/", async (req: AuthRequest, res: Response) => {
  try {
    const { all } = req.query;
    const filter = all === "true" ? {} : { status: "published" };
    const campaigns = await Campaign.find(filter).sort({ startDate: 1 });
    return res.json(campaigns.map((c) => c.toJSON()));
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch campaigns" });
  }
});

// GET /api/campaigns/:slug
router.get("/:slug", async (req, res: Response) => {
  try {
    const campaign = await Campaign.findOne({ slug: req.params.slug });
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }
    return res.json(campaign.toJSON());
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch campaign" });
  }
});

// POST /api/campaigns (admin only)
router.post("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const campaign = await Campaign.create(req.body);
    return res.status(201).json(campaign.toJSON());
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create campaign" });
  }
});

export default router;

