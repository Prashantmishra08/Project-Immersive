import Report from "../models/report.model.js"
import Post from "../models/post.model.js"
import User from "../models/user.models.js"

// Report a Post
export const reportPost = async (req, res) => {
  try {
    const { reason } = req.body;
    const { postId } = req.params;
    const userId = req.user._id;

    const report = new Report({
      reportedBy: userId,
      reportedPost: postId,
      reason,
    });

    await report.save();
    res.status(201).json({ message: "Post reported successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error reporting post" });
  }
};

// Report a User
export const reportUser = async (req, res) => {
  try {
    const { reason } = req.body;
    const { userId } = req.params;
    const reportedBy = req.user._id;

    const report = new Report({
      reportedBy,
      reportedUser: userId,
      reason,
    });

    await report.save();
    res.status(201).json({ message: "User reported successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error reporting user" });
  }
};

// Get All Reports (For Admin)
export const getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate("reportedBy", "userName email")
      .populate("reportedPost", "content")
      .populate("reportedUser", "userName email");
      
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ error: "Error fetching reports" });
  }
};

// Delete a Report (Admin Action)
export const deleteReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    await Report.findByIdAndDelete(reportId);
    res.status(200).json({ message: "Report deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting report" });
  }
};
