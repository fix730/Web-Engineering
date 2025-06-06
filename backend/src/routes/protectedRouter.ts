import { Router } from "express";
import { protect } from "../middleware/protect";

const router = Router();

router.get("/protected", protect, (req, res) => {
  res.json({ message: "You are authenticated", user: (req as any).user });
});

export default router;