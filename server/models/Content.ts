import mongoose from 'mongoose';

// -----------------------------------------------------
// 1. Tournament Schema
// -----------------------------------------------------
const TournamentSchema = new mongoose.Schema({
  title: { bn: String, en: String },
  sport: { type: String, enum: ['football', 'cricket', 'badminton', 'carrom', 'other'] },
  bannerUrl: String,
  venue: String,
  startDate: Date,
  endDate: Date,
  status: { type: String, enum: ['upcoming', 'live', 'completed', 'cancelled'], default: 'upcoming' },
  teams: [{ name: String, logoUrl: String, captain: String }],
  fixtures: [{
    round: String, teamA: String, teamB: String, dateTime: Date, 
    venue: String, scoreA: Number, scoreB: Number, status: String 
  }],
  standings: [mongoose.Schema.Types.Mixed],
  champion: String,
  runnerUp: String,
  sponsors: [{ name: String, logoUrl: String, amount: Number, tier: String }],
  budget: {
    plannedIncome: { type: Number, default: 0 },
    plannedExpense: { type: Number, default: 0 },
    actualIncome: { type: Number, default: 0 },
    actualExpense: { type: Number, default: 0 }
  },
  gallery: [String],
  isPublic: { type: Boolean, default: true },
  createdBy: String
}, { timestamps: true });

export const Tournament = mongoose.model('Tournament', TournamentSchema);


// -----------------------------------------------------
// 2. Project Schema
// -----------------------------------------------------
const ProjectSchema = new mongoose.Schema({
  title: { bn: String, en: String },
  category: { type: String, enum: ['anti_drug', 'education', 'health', 'relief', 'environment', 'infrastructure', 'awareness'] },
  summary: String,
  description: String,
  coverUrl: String,
  gallery: [String],
  location: String,
  startDate: Date,
  targetDate: Date,
  progressPercent: { type: Number, default: 0 },
  milestones: [{ title: String, isDone: Boolean, completedAt: Date, note: String }],
  beneficiaryCount: Number,
  budget: { planned: Number, spent: Number },
  volunteers: [String], // Array of User IDs
  status: { type: String, enum: ['planned', 'ongoing', 'completed', 'paused'], default: 'planned' },
  isPublic: { type: Boolean, default: true },
  publishedAt: Date
}, { timestamps: true });

export const Project = mongoose.model('Project', ProjectSchema);


// -----------------------------------------------------
// 3. Notice Schema
// -----------------------------------------------------
const NoticeSchema = new mongoose.Schema({
  title: { bn: String, en: String },
  body: String,
  audience: { type: String, default: 'public' },
  priority: { type: String, enum: ['normal', 'important', 'urgent'], default: 'normal' },
  attachments: [String],
  isPinned: { type: Boolean, default: false },
  publishAt: Date,
  expireAt: Date,
  pushSent: { type: Boolean, default: false },
  readBy: [String],
  createdBy: String,
  approvalId: String
}, { timestamps: true });

export const Notice = mongoose.model('Notice', NoticeSchema);


// -----------------------------------------------------
// 4. Request Schema (Community SOS Inbox)
// -----------------------------------------------------
const RequestSchema = new mongoose.Schema({
  type: { type: String, enum: ['blood', 'help', 'service', 'sports_news', 'complaint', 'suggestion'] },
  title: String,
  details: String,
  bloodGroup: String,
  hospital: String,
  neededBy: Date,
  contactPhone: String,
  area: String,
  urgency: { type: String, enum: ['low', 'normal', 'high', 'critical'], default: 'normal' },
  raisedBy: String,
  status: { type: String, enum: ['new', 'triaged', 'published', 'resolved', 'rejected'], default: 'new' },
  handledBy: String,
  publicVisible: { type: Boolean, default: false },
  resolutionNote: String,
  approvalId: String
}, { timestamps: true });

export const Request = mongoose.model('Request', RequestSchema);


// -----------------------------------------------------
// 5. BloodDonor Schema
// -----------------------------------------------------
const BloodDonorSchema = new mongoose.Schema({
  userId: String,
  name: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  phone: { type: String, required: true },
  area: String,
  lastDonationDate: Date,
  isAvailable: { type: Boolean, default: true },
  verifiedBy: String,
  donationCount: { type: Number, default: 0 }
}, { timestamps: true });

export const BloodDonor = mongoose.model('BloodDonor', BloodDonorSchema);
