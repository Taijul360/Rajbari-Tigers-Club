import mongoose from 'mongoose';

// -----------------------------------------------------
// 1. Settings Schema
// -----------------------------------------------------
const SettingsSchema = new mongoose.Schema({
  siteName: { bn: String, en: String },
  shortName: String,
  tagline: { bn: String, en: String },
  logoUrl: String,
  logoDarkUrl: String,
  faviconUrl: String,
  ogImageUrl: String,
  theme: {
    navy: String,
    royal: String,
    orange: String,
    gold: String,
    bone: String,
    ink: String,
    radiusScale: String
  },
  fonts: { displayBn: String, displayEn: String, body: String },
  contact: {
    phone: String,
    email: String,
    address: { bn: String, en: String },
    mapEmbed: String
  },
  socialLinks: [{
    platform: String,
    url: String,
    icon: String,
    order: Number,
    isActive: Boolean
  }],
  defaultLanguage: { type: String, default: 'bn' },
  maintenanceMode: { enabled: Boolean, message: String },
  registrationOpen: { type: Boolean, default: true },
  approvalPolicy: {
    adminApprovalIsFinal: Boolean,
    actionsRequiringApproval: [String],
    transactionThreshold: Number
  },
  memberCodePrefix: { type: String, default: 'RTC' },
  monthlyDueAmount: Number,
  dueDayOfMonth: Number,
  footerText: { bn: String, en: String },
  establishedYear: String,
  updatedBy: String
}, { timestamps: true });

export const Settings = mongoose.model('Settings', SettingsSchema);


// -----------------------------------------------------
// 2. Role Schema
// -----------------------------------------------------
const RoleSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  label: { bn: String, en: String },
  rank: { type: Number, required: true },
  permissions: [{ type: String }],
  responsibilities: { bn: [{ type: String }], en: [{ type: String }] },
  isSystem: { type: Boolean, default: false },
  color: String,
  delegatedBy: String,
  delegationExpiresAt: Date
}, { timestamps: true });

export const Role = mongoose.model('Role', RoleSchema);


// -----------------------------------------------------
// 3. User Schema
// -----------------------------------------------------
const UserSchema = new mongoose.Schema({
  name: { bn: String, en: String },
  phone: { type: String, required: true, unique: true },
  email: String,
  passwordHash: { type: String, required: true },
  avatarUrl: String,
  coverUrl: String,
  roleKey: { type: String, default: 'user' },
  memberCode: { type: String, unique: true, sparse: true },
  memberStatus: { type: String, enum: ['none', 'pending', 'active', 'suspended', 'expired'], default: 'none' },
  bloodGroup: String,
  dateOfBirth: Date,
  occupation: String,
  address: String,
  bio: String,
  emergencyContact: String,
  permissionGrants: [String],
  permissionRevokes: [String],
  isBanned: { type: Boolean, default: false },
  banReason: String,
  twoFactorSecret: String,
  fcmTokens: [String],
  lastSeenAt: Date,
  joinedAt: { type: Date, default: Date.now },
  privacy: { showPhone: Boolean, showEmail: Boolean, showBloodGroup: Boolean }
}, { timestamps: true });

export const User = mongoose.model('User', UserSchema);


// -----------------------------------------------------
// 4. AuditLog Schema
// -----------------------------------------------------
const AuditLogSchema = new mongoose.Schema({
  actorId: String,
  actorRole: String,
  action: { type: String, required: true },
  entityType: String,
  entityId: String,
  before: mongoose.Schema.Types.Mixed,
  after: mongoose.Schema.Types.Mixed,
  ip: String,
  userAgent: String,
}, { timestamps: { createdAt: true, updatedAt: false } }); // Append-only

export const AuditLog = mongoose.model('AuditLog', AuditLogSchema);
