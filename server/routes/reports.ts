import { Router, type Response } from "express";
import { SafetyReport } from "../models/SafetyReport";
import { requireAdmin, type AuthRequest } from "../middleware/auth";

const router = Router();

// POST /api/reports
router.post("/", async (req: AuthRequest, res: Response) => {
  try {
    const {
      category,
      description,
      approximateLocation,
      incidentDate,
      isAnonymous,
      contactInformation,
      userId,
    } = req.body;

    if (!category || !description) {
      return res.status(400).json({ error: "Category and description are required" });
    }

    const report = await SafetyReport.create({
      category,
      description,
      approximateLocation: approximateLocation || null,
      incidentDate: incidentDate || null,
      isAnonymous: Boolean(isAnonymous),
      contactInformation: isAnonymous ? null : (contactInformation || null),
      userId: isAnonymous ? null : (userId || (req.user ? req.user.id : null)),
      status: "new",
    });

    return res.status(201).json({ success: true, report: report.toJSON() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to submit report" });
  }
});

// GET /api/reports/admin (admin only)
router.get("/admin", requireAdmin, async (_req: AuthRequest, res: Response) => {
  try {
    const reports = await SafetyReport.find().sort({ createdAt: -1 });
    return res.json(reports.map((r) => r.toJSON()));
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch reports" });
  }
});

// PATCH /api/reports/:id/status (admin only)
router.patch("/:id/status", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { status, adminNotes } = req.body;
    const report = await SafetyReport.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    if (status) report.status = status;
    if (adminNotes !== undefined) report.adminNotes = adminNotes;
    await report.save();

    return res.json(report.toJSON());
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to update report" });
  }
});

export default router;

