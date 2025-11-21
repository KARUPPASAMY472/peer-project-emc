import express from "express";
import { addComment, getComments } from "../controllers/commentController.js";
const router = express.Router();

router.post("/:id/comments", addComment);   // POST /projects/:id/comments
router.get("/:id/comments", getComments);

export default router;
