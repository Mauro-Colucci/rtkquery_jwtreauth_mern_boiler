import { Router } from "express";
import path from "path";
import fileDirName from "../config/fileAndDirName.js";

const { __dirname } = fileDirName(import.meta);

const router = Router();

router.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"));
});

export default router;
