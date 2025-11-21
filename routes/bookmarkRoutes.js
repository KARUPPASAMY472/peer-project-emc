import express from "express";
import { addBookmark, removeBookmark, getBookmarksForUser } from "../controllers/bookmarkController.js";
import Bookmark from "../models/Bookmark.js";

const router = express.Router();

// GET all bookmarks (optional)
router.get("/", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find().populate("projectId");
    res.json(bookmarks);
    console.log("bookmarjk ",bookmarks)
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load bookmarks" });
  }
});

router.post("/", addBookmark);
router.delete("/", removeBookmark);
router.get("/:uid", getBookmarksForUser);

export default router;
