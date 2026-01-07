/**
 * Role utilities for permission checking and role assignment validation
 */

// All supported roles
export const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
  OWNER: 'owner',
  CONTENT_ADMIN: 'content_admin',
  SUPPORT_ADMIN: 'support_admin',
  FINANCE_ADMIN: 'finance_admin',
};

// Permissions map - defines what each role can do
export const PERMISSIONS = {
  [ROLES.OWNER]: {
    // Full access
    canAssignRoles: true,
    canManageUsers: true,
    canManageSettings: true,
    canManageContent: true,
    canManageSupport: true,
    canViewFinance: true,
    canManageFinance: true,
  },
  [ROLES.SUPER_ADMIN]: {
    canAssignRoles: true, // Except owner
    canManageUsers: true,
    canManageSettings: false,
    canManageContent: true,
    canManageSupport: true,
    canViewFinance: true,
    canManageFinance: false,
  },
  [ROLES.ADMIN]: {
    canAssignRoles: false, // Limited - only student and content/support admins
    canManageUsers: true, // Limited
    canManageSettings: false,
    canManageContent: true,
    canManageSupport: true,
    canViewFinance: false,
    canManageFinance: false,
  },
  [ROLES.CONTENT_ADMIN]: {
    canAssignRoles: false,
    canManageUsers: false,
    canManageSettings: false,
    canManageContent: true, // Courses, lessons, blog, announcements, market analysis
    canManageSupport: false,
    canViewFinance: false,
    canManageFinance: false,
  },
  [ROLES.SUPPORT_ADMIN]: {
    canAssignRoles: false,
    canManageUsers: false,
    canManageSettings: false,
    canManageContent: false,
    canManageSupport: true, // Support tickets, announcements, FAQs
    canViewFinance: false,
    canManageFinance: false,
  },
  [ROLES.FINANCE_ADMIN]: {
    canAssignRoles: false,
    canManageUsers: false, // Read-only user list
    canManageSettings: false,
    canManageContent: false,
    canManageSupport: false,
    canViewFinance: true,
    canManageFinance: false, // View only, cannot modify
  },
  [ROLES.STUDENT]: {
    canAssignRoles: false,
    canManageUsers: false,
    canManageSettings: false,
    canManageContent: false,
    canManageSupport: false,
    canViewFinance: false,
    canManageFinance: false,
  },
};

/**
 * Check if an actor can assign a specific role to a target
 * @param {string} actorRole - The role of the user trying to assign
 * @param {string} targetOldRole - The current role of the target user
 * @param {string} newRole - The role being assigned
 * @returns {boolean} - True if assignment is allowed
 */
export const canAssignRole = (actorRole, targetOldRole, newRole) => {
  // Nobody can assign 'owner' role via endpoint
  if (newRole === ROLES.OWNER) {
    return false;
  }

  // Nobody can change an existing owner's role
  if (targetOldRole === ROLES.OWNER) {
    return false;
  }

  // Owner can assign all roles except owner
  if (actorRole === ROLES.OWNER) {
    return newRole !== ROLES.OWNER;
  }

  // Super admin can assign: student, admin, content_admin, support_admin, finance_admin
  if (actorRole === ROLES.SUPER_ADMIN) {
    return [
      ROLES.STUDENT,
      ROLES.ADMIN,
      ROLES.CONTENT_ADMIN,
      ROLES.SUPPORT_ADMIN,
      ROLES.FINANCE_ADMIN,
    ].includes(newRole);
  }

  // Admin can assign: student, content_admin, support_admin (limited)
  if (actorRole === ROLES.ADMIN) {
    return [
      ROLES.STUDENT,
      ROLES.CONTENT_ADMIN,
      ROLES.SUPPORT_ADMIN,
    ].includes(newRole);
  }

  // Nobody else can assign roles
  return false;
};

/**
 * Get owner emails from environment variable
 * @returns {string[]} - Array of owner email addresses (lowercased)
 */
export const getOwnerEmails = () => {
  const ownerEmailsEnv = process.env.OWNER_EMAILS || '';
  return ownerEmailsEnv
    .split(',')
    .map(email => email.trim().toLowerCase())
    .filter(email => email.length > 0);
};

/**
 * Check if an email is in the owner allowlist
 * @param {string} email - Email to check
 * @returns {boolean} - True if email is in owner allowlist
 */
export const isOwnerEmail = (email) => {
  if (!email) return false;
  const ownerEmails = getOwnerEmails();
  return ownerEmails.includes(email.toLowerCase().trim());
};

