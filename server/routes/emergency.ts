import { Router, type Response } from "express";
import { EmergencyContact } from "../models/EmergencyContact";
import { requireAdmin, type AuthRequest } from "../middleware/auth";

const router = Router();

// GET /api/emergency-contacts
router.get("/", async (_req, res: Response) => {
  try {
    const contacts = await EmergencyContact.find({ isActive: true }).sort({ category: 1 });
    return res.json(contacts.map((c) => c.toJSON()));
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch emergency contacts" });
  }
});

// POST /api/emergency-contacts (admin only)
router.post("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const contact = await EmergencyContact.create(req.body);
    return res.status(201).json(contact.toJSON());
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to create emergency contact" });
  }
});

export default router;

