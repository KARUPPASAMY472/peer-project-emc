import Comment from "../models/Comment.js";
import Project from "../models/Project.js";

export const addComment = async (req, res) => {
  try {
    const { text, userUid, userName } = req.body;
    if (!text || !userUid) return res.status(400).json({ message: "Missing" });

    const comment = new Comment({
      projectId: req.params.id,
      text,
      userUid,
      userName
    });
    await comment.save();
    // optional: return updated list
    const comments = await Comment.find({ projectId: req.params.id }).sort({ createdAt: -1 });
    res.status(201).json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed add comment" });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ projectId: req.params.id }).sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed get comments" });
  }
};
