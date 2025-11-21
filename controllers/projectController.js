import Project from "../models/Project.js";

/**
 * Create project
 * req.body should contain title, description, tags[], githubLink, demoLink, ownerUid, ownerName
 */
export const createProject = async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to create project", error: err.message });
  }
};

/**
 * Get projects with optional query:
 * ?q=text search, ?tag=React, ?owner=uid, ?page=1&limit=10
 */
export const getProjects = async (req, res) => {
  try {
    const { q, tag, owner, page = 1, limit = 12 } = req.query;
    const filter = {};

    if (q) filter.$or = [
      { title: new RegExp(q, "i") },
      { description: new RegExp(q, "i") }
    ];
    if (tag) filter.tags = tag;
    if (owner) filter.ownerUid = owner;

    const skip = (Math.max(1, parseInt(page)) - 1) * parseInt(limit);
    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({ projects, total, page: Number(page), limit: Number(limit) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
};

export const getProjectById = async (req, res) => {
  try {
    const p = await Project.findById(req.params.id);
    if (!p) return res.status(404).json({ message: "Project not found" });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch project" });
  }
};

export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Project not found" });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "Failed to update project" });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const deleted = await Project.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Deleted", id: req.params.id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project" });
  }
};

/**
 * Like/unlike
 * body: { userUid }
 */
export const toggleLike = async (req, res) => {
  try {
    const { userUid } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    const idx = project.likes.indexOf(userUid);
    if (idx === -1) {
      project.likes.push(userUid);
    } else {
      project.likes.splice(idx, 1);
    }
    await project.save();
    res.json({ likesCount: project.likes.length, liked: idx === -1 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed toggle like" });
  }
};

/**
 * Rate project
 * body: { userUid, value }  value integer 1..5
 * NOTE: This simple implementation does not prevent multiple ratings by same user.
 * For production record per-user rating in separate collection.
 */
export const rateProject = async (req, res) => {
  try {
    const { userUid, value } = req.body;
    if (!value || value < 1 || value > 5)
      return res.status(400).json({ message: "Invalid rating" });

    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: "Not found" });

    // Check if user already rated
    const existing = project.rating.details.find(r => r.userUid === userUid);

    if (existing) {
      // Update previous rating
      existing.value = value;
    } else {
      // New rating by this user
      project.rating.details.push({ userUid, value });
    }

    // Recalculate count & total
    project.rating.count = project.rating.details.length;
    project.rating.total = project.rating.details.reduce((sum, r) => sum + r.value, 0);

    await project.save();

    const avg = project.rating.count
      ? project.rating.total / project.rating.count
      : 0;

    res.json({ avg, count: project.rating.count });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed rate" });
  }
};


