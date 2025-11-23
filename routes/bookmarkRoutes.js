import express from "express";
import { addBookmark, removeBookmark, getBookmarksForUser } from "../controllers/bookmarkController.js";
import Bookmark from "../models/Bookmark.js";

const router = express.Router();

// GET all bookmarks
router.get("/", async (req, res) => {
  try {
    const bookmarks = await Bookmark.find().populate("projectId");
    res.json(bookmarks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load bookmarks" });
  }
});

router.delete("/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;
    const { userUid } = req.query;

    await Bookmark.findOneAndDelete({ userUid, projectId });
    res.json({ message: "Removed" });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove" });
  }
});


// 🔥 CHECK bookmark (very important)
router.get("/check", async (req, res) => {
  try {
    const { userUid, projectId } = req.query;

    if (!userUid || !projectId) {
      return res.status(400).json({ bookmarked: false });
    }

    const exists = await Bookmark.findOne({ userUid, projectId });

    res.json({ bookmarked: !!exists });
  } catch (err) {
    console.error("Bookmark check error:", err);
    res.status(500).json({ bookmarked: false });
  }
});

router.post("/", addBookmark);
router.delete("/", removeBookmark);

// Get user bookmarks list
router.get("/:uid", getBookmarksForUser);

export default router;




// import express from "express";
// import { 
//   addBookmark, 
//   removeBookmark, 
//   getBookmarksForUser 
// } from "../controllers/bookmarkController.js";

// const router = express.Router();

// // Check bookmark
// router.get("/check", async (req, res) => {
//   try {
//     const { userUid, projectId } = req.query;

//     if (!userUid || !projectId) {
//       return res.status(400).json({ bookmarked: false });
//     }

//     const exists = await Bookmark.findOne({ userUid, projectId });
//     res.json({ bookmarked: !!exists });

//   } catch (err) {
//     console.error("Bookmark check error:", err);
//     res.status(500).json({ bookmarked: false });
//   }
// });

// // Add bookmark
// router.post("/", addBookmark);

// // Remove bookmark
// router.delete("/", removeBookmark);

// // Get bookmarks for a specific user
// router.get("/:uid", getBookmarksForUser);

// export default router;
