// src/models/Resource.js
import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    college: String,
    course: String,
    year: String,
    subject: String,
    type: String,

    // Cloudinary uploaded files
    files: [
      {
        url: String,
        public_id: String,
        originalname: String,
      },
    ],

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },

    isProject: {
      type: Boolean,
      default: false,
    },

    projectFolder: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;
