import Feedback from "../models/Feedback.js";

export const addFeedback = async (req, res) => {
  try {
    const { userUid, userEmail, message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    const fb = new Feedback({ userUid, userEmail, message });
    await fb.save();

    res.json({ message: "Feedback saved successfully" });

  } catch (err) {
    console.error("Feedback error:", err);
    res.status(500).json({ message: "Failed to save feedback" });
  }
};
