import Resource from "../models/Resource.js";
import { Log } from "../models/Log.js";
import User from "../models/userModel.js"; // To fetch uploader's email
import sendEmail from "../utils/sendEmails.js";
import asyncHandler from 'express-async-handler';

// Get all pending resources
export const getPendingResources = async (req, res) => {
  try {
    const pending = await Resource.find({ status: "pending" });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Approve or reject resource
export const updateResourceStatus = async (req, res) => {
  const { resourceId } = req.params;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status))
    return res.status(400).json({ msg: "Invalid status" });

  try {
    const resource = await Resource.findById(resourceId);
    if (!resource) return res.status(404).json({ msg: "Resource not found" });

    // Update status
    resource.status = status;
    await resource.save();

    // Get uploader
    const uploader = await User.findById(resource.uploadedBy);
    if (uploader) {
      // Send email notification
      const subject =
        status === "approved"
          ? "Your resource has been approved!"
          : "Your resource has been rejected";
      const text =
        status === "approved"
          ? `Hi ${uploader.name}, your resource "${resource.title}" has been approved and published.`
          : `Hi ${uploader.name}, your resource "${resource.title}" has been rejected. Please review and re-upload if necessary.`;

      const html =
        status === "approved"
          ? `<p>Hi <strong>${uploader.name}</strong>,</p><p>Your resource "<strong>${resource.title}</strong>" has been <span style="color:green;"><strong>approved</strong></span> and is now live on the portal.</p><br><p>Thanks,<br/>Student Resource Portal</p>`
          : `<p>Hi <strong>${uploader.name}</strong>,</p><p>Unfortunately, your resource "<strong>${resource.title}</strong>" was <span style="color:red;"><strong>rejected</strong></span>. Please review the content and try re-uploading.</p><br><p>Thanks,<br/>Student Resource Portal</p>`;

      await sendEmail(uploader.email, subject, text, html);
    }

    res.json({ msg: `Resource ${status}` });
  } catch (err) {
    console.error("Error updating resource status:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// Delete a resource
export const deleteResource = async (req, res) => {
  try {
    const deleted = await Resource.findByIdAndDelete(req.params.resourceId);
    if (!deleted) return res.status(404).json({ msg: "Resource not found" });

    res.json({ msg: "Resource deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// Get logs
export const getLogs = async (req, res) => {
  try {
    const logs = await Log.find().sort({ createdAt: -1 }).limit(100);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

export const approveResource = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { allowFolderUpload } = req.body;

  const resource = await Resource.findById(id);

  if (!resource) {
    return res.status(404).json({ message: 'Resource not found.' });
  }

  resource.status = 'approved';

  // If the resource was marked as structured, allow admin to permit folder uploads
  if (resource.isStructured) {
    resource.allowFolderUpload = allowFolderUpload === 'true';
  }

  await resource.save();

  res.json({ message: 'Resource approved successfully.', resource });
});

