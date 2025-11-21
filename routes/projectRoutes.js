import express from "express";
import {
  createProject, getProjects, getProjectById,
  updateProject, deleteProject, toggleLike, rateProject
} from "../controllers/projectController.js";

const router = express.Router();

// CRUD
router.post("/", createProject);
router.get("/", getProjects);
router.get("/:id", getProjectById);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

// interaction
router.post("/:id/like", toggleLike);
router.post("/:id/rate", rateProject);

export default router;
