// src/controllers/resourceController.js
import { cloudinary } from '../config/cloudinary.js';
import Resource from '../models/Resource.js';
import fs from 'fs';

// Upload Resource (with multiple files)
export const uploadResource = async (req, res) => {
  try {
    const { college, course, year, subject, type, isProject } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No files uploaded' });
    }

    const folderName = isProject === 'true' ? `project_${Date.now()}` : undefined;

    const uploadedFiles = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
        resource_type: 'auto',
      });

      uploadedFiles.push({
        url: result.secure_url,
        public_id: result.public_id,
        originalname: file.originalname,
      });

      fs.unlinkSync(file.path); // Delete local file after upload
    }

    const newResource = new Resource({
      uploader: req.user._id,
      college,
      course,
      year,
      subject,
      type,
      isProject: isProject === 'true',
      projectFolder: folderName || null,
      files: uploadedFiles,
      status: 'draft',
    });

    await newResource.save();

    res.status(201).json({
      message: 'Resource uploaded and pending admin approval',
      resourceId: newResource._id,
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ New: Get current user's uploads
export const getResourcesByUser = async (req, res) => {
  try {
    const resources = await Resource.find({ uploader: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    console.error('Fetch User Resources Error:', error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// ✅ New: Get all approved resources
export const getAllApprovedResources = async (req, res) => {
  try {
    const {
      search = '',
      college,
      course,
      year,
      subject,
      type,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {
      status: 'approved',
    };

    // Text Search
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } },
      ];
    }

    // Filters
    if (college) query.college = college;
    if (course) query.course = course;
    if (year) query.year = year;
    if (subject) query.subject = subject;
    if (type) query.type = type;

    const skip = (page - 1) * limit;

    const [resources, total] = await Promise.all([
      Resource.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Resource.countDocuments(query),
    ]);

    res.json({
      success: true,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      totalResults: total,
      results: resources,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
