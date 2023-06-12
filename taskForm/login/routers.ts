import { Router } from "express";
import { login, logout, register } from "./users";

const router = Router();

router.post("/login", login);
router.post("/logout", logout);
router.post("/reg", register);

export default router;
