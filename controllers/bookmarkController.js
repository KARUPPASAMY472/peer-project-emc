import Bookmark from "../models/Bookmark.js";

export const addBookmark = async (req, res) => {
  try {
    const { userUid, projectId } = req.body;
    if (!userUid || !projectId) return res.status(400).json({ message: "Missing" });

    const bm = new Bookmark({ userUid, projectId });
    await bm.save();
    res.status(201).json({ message: "Bookmarked" });
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Already bookmarked" });
    console.error(err);
    res.status(500).json({ message: "Failed to bookmark" });
  }
};

export const removeBookmark = async (req, res) => {
  try {
    const { userUid, projectId } = req.body;
    await Bookmark.findOneAndDelete({ userUid, projectId });
    res.json({ message: "Removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to remove" });
  }
};

export const getBookmarksForUser = async (req, res) => {
  try {
    const { uid } = req.params;
    const bms = await Bookmark.find({ userUid: uid }).populate("projectId").sort({ createdAt: -1 });
    res.json(bms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed get bookmarks" });
  }
};
