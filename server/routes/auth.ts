import { Router, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";
import { requireAuth, type AuthRequest } from "../middleware/auth";

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || "safeaware_default_jwt_secret_change_in_production";

function createToken(user: { id: string; email: string; role: "user" | "admin" }): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// POST /api/auth/register
router.post("/register", async (req, res: Response) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password) {
      return res.status(400).json({ error: "Full name, email, and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(409).json({ error: "An account with this email already exists" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    // Any email starting with admin@ is granted admin role for convenience
    const role = normalizedEmail.startsWith("admin@") ? "admin" : "user";

    const user = await User.create({
      fullName,
      email: normalizedEmail,
      passwordHash,
      role,
    });

    const token = createToken({ id: user.id, email: user.email, role: user.role });
    return res.status(201).json({ profile: user.toJSON(), token });
  } catch (err: any) {
    console.error("Registration error:", err);
    return res.status(500).json({ error: err.message || "Failed to register account" });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const matches = await bcrypt.compare(password, user.passwordHash);
    if (!matches) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = createToken({ id: user.id, email: user.email, role: user.role });
    return res.json({ profile: user.toJSON(), token });
  } catch (err: any) {
    console.error("Login error:", err);
    return res.status(500).json({ error: err.message || "Failed to log in" });
  }
});

// GET /api/auth/me
router.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user!.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({ profile: user.toJSON() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to fetch profile" });
  }
});

export default router;

