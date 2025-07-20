import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  filename: { type: String, required: true },
  path: { type: String, required: true },
  college: { type: String, required: true },
  course: { type: String, required: true },
  year: { type: String, required: true },
  subject: { type: String, required: true },
  type: {
    type: String,
    enum: ['assignment', 'notes', 'old_question_paper', 'important_questions', 'others'],
    required: true,
  },
  isStructured: { type: Boolean, default: false }, // NEW
  allowFolderUpload: { type: Boolean, default: false }, // NEW
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'draft'],
    default: 'pending',
  },
  uploadedAt: { type: Date, default: Date.now },
});

export default mongoose.model('Resource', resourceSchema);
