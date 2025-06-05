import express from "express";
import { signup, login } from "../controllers/user";
import ValidLogs from "../middleware/logValidator";

const router = express.Router();
router.post("/signup", ValidLogs, signup);
router.post("/login", login);
export default router;
