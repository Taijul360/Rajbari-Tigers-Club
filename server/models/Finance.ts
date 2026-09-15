import mongoose from 'mongoose';

// -----------------------------------------------------
// 1. Transaction Schema
// -----------------------------------------------------
const TransactionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['deposit', 'expense', 'withdrawal', 'donation', 'sponsorship', 'due_payment', 'opening_balance'],
    required: true
  },
  amount: { type: Number, required: true },
  currency: { type: String, default: 'BDT' },
  category: String,
  method: { type: String, enum: ['cash', 'bkash', 'nagad', 'rocket', 'bank'] },
  referenceNo: String,
  memberId: String,
  tournamentId: String,
  projectId: String,
  description: { bn: String, en: String },
  attachments: [String],
  transactionDate: { type: Date, required: true },
  recordedBy: String,
  approvalId: String,
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  runningBalanceSnapshot: Number
}, { timestamps: true });

// Explicit Indexes as requested
TransactionSchema.index({ transactionDate: -1 });
TransactionSchema.index({ memberId: 1, transactionDate: -1 });
TransactionSchema.index({ tournamentId: 1 });
TransactionSchema.index({ type: 1, status: 1 });

export const Transaction = mongoose.model('Transaction', TransactionSchema);


// -----------------------------------------------------
// 2. MemberAccount Schema
// -----------------------------------------------------
const MemberAccountSchema = new mongoose.Schema({
  memberId: { type: String, required: true, unique: true },
  savingsBalance: { type: Number, default: 0 },
  totalDeposited: { type: Number, default: 0 },
  totalWithdrawn: { type: Number, default: 0 },
  totalDue: { type: Number, default: 0 },
  lastPaymentAt: Date
}, { timestamps: true });

export const MemberAccount = mongoose.model('MemberAccount', MemberAccountSchema);


// -----------------------------------------------------
// 3. Due Schema
// -----------------------------------------------------
const DueSchema = new mongoose.Schema({
  memberId: { type: String, required: true },
  period: { type: String, required: true }, // Format: 'YYYY-MM'
  amount: { type: Number, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['unpaid', 'partial', 'paid', 'waived'], default: 'unpaid' },
  paidAmount: { type: Number, default: 0 },
  paidTransactionIds: [String],
  reminderSentAt: Date
}, { timestamps: true });

export const Due = mongoose.model('Due', DueSchema);


// -----------------------------------------------------
// 4. Approval Schema
// -----------------------------------------------------
const ApprovalSchema = new mongoose.Schema({
  entityType: { type: String, required: true },
  entityId: String,
  action: { type: String, enum: ['create', 'update', 'delete', 'publish'], required: true },
  payloadSnapshot: mongoose.Schema.Types.Mixed,
  requestedBy: { type: String, required: true },
  stageOne: {
    by: String,
    at: Date,
    decision: { type: String, enum: ['approved', 'rejected'] },
    note: String
  },
  stageTwo: {
    by: String,
    at: Date,
    decision: { type: String, enum: ['approved', 'rejected'] },
    note: String
  },
  finalStatus: {
    type: String,
    enum: ['pending_stage_one', 'pending_final', 'approved', 'rejected'],
    default: 'pending_stage_one'
  },
  policyUsed: String
}, { timestamps: true });

export const Approval = mongoose.model('Approval', ApprovalSchema);
