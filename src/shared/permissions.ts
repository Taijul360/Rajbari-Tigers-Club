export const PERMISSIONS = {
  // Users
  USERS_VIEW: 'users.view',
  USERS_CREATE: 'users.create',
  USERS_EDIT: 'users.edit',
  USERS_SUSPEND: 'users.suspend',
  USERS_DELETE: 'users.delete',
  USERS_ASSIGN_ROLE: 'users.assign_role',
  
  // Members
  MEMBERS_APP_REVIEW: 'members.application.review',
  MEMBERS_CODE_ISSUE: 'members.code.issue',
  MEMBERS_CODE_REVOKE: 'members.code.revoke',
  MEMBERS_DIR_MANAGE: 'members.directory.manage',
  
  // Finance
  FINANCE_SUMMARY_VIEW: 'finance.summary.view',
  FINANCE_LEDGER_VIEW: 'finance.ledger.view',
  FINANCE_DEPOSIT_CREATE: 'finance.deposit.create',
  FINANCE_EXPENSE_CREATE: 'finance.expense.create',
  FINANCE_WITHDRAWAL_CREATE: 'finance.withdrawal.create',
  FINANCE_TRANSACTION_EDIT: 'finance.transaction.edit',
  FINANCE_TRANSACTION_DELETE: 'finance.transaction.delete',
  FINANCE_DUES_MANAGE: 'finance.dues.manage',
  FINANCE_EXPORT: 'finance.export',
  FINANCE_MEMBER_BAL_VIEW_ALL: 'finance.member_balance.view_all',
  
  // Tournaments
  TOURNAMENTS_VIEW_PRIVATE: 'tournaments.view_private',
  TOURNAMENTS_CREATE: 'tournaments.create',
  TOURNAMENTS_EDIT: 'tournaments.edit',
  TOURNAMENTS_DELETE: 'tournaments.delete',
  TOURNAMENTS_BUDGET_MANAGE: 'tournaments.budget.manage',
  TOURNAMENTS_FIXTURES_MANAGE: 'tournaments.fixtures.manage',
  TOURNAMENTS_RESULTS_PUBLISH: 'tournaments.results.publish',
  
  // Projects
  PROJECTS_CREATE: 'projects.create',
  PROJECTS_EDIT: 'projects.edit',
  PROJECTS_DELETE: 'projects.delete',
  PROJECTS_PROGRESS_UPDATE: 'projects.progress.update',
  
  // Notices
  NOTICES_CREATE: 'notices.create',
  NOTICES_PUBLISH: 'notices.publish',
  NOTICES_PUSH: 'notices.push',
  NOTICES_DELETE: 'notices.delete',
  
  // Requests
  REQUESTS_VIEW: 'requests.view',
  REQUESTS_TRIAGE: 'requests.triage',
  REQUESTS_PUBLISH: 'requests.publish',
  
  // Blood
  BLOOD_DONORS_MANAGE: 'blood.donors.manage',
  BLOOD_DONORS_VERIFY: 'blood.donors.verify',
  
  // Chat
  CHAT_GROUP_CREATE: 'chat.group.create',
  CHAT_MODERATE: 'chat.moderate',
  CHAT_MSG_DELETE: 'chat.message.delete',
  CHAT_PRIVATE_READ_ALL: 'chat.private.read_all',
  
  // Content (CMS)
  CONTENT_PAGES_EDIT: 'content.pages.edit',
  CONTENT_BRANDING_EDIT: 'content.branding.edit',
  CONTENT_SOCIAL_LINKS_EDIT: 'content.social_links.edit',
  CONTENT_MENU_EDIT: 'content.menu.edit',
  CONTENT_GALLERY_MANAGE: 'content.gallery.manage',
  CONTENT_COMMITTEE_MANAGE: 'content.committee.manage',
  CONTENT_SPONSORS_MANAGE: 'content.sponsors.manage',
  
  // Roles
  ROLES_CREATE: 'roles.create',
  ROLES_EDIT: 'roles.edit',
  ROLES_PERMISSIONS_ASSIGN: 'roles.permissions.assign',
  
  // Approvals
  APPROVALS_STAGE_ONE: 'approvals.stage_one',
  APPROVALS_FINAL: 'approvals.final',
  
  // Audit
  AUDIT_VIEW: 'audit.view',
  AUDIT_EXPORT: 'audit.export',
  
  // System
  SYSTEM_SETTINGS: 'system.settings',
  SYSTEM_BACKUP: 'system.backup',
  SYSTEM_MAINTENANCE: 'system.maintenance',
  SYSTEM_INTEGRATIONS: 'system.integrations'
} as const;

export type PermissionKey = typeof PERMISSIONS[keyof typeof PERMISSIONS];
