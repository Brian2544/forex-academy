/**
 * Unified permissions system
 * Defines what each role can do
 * Used by both backend (authorize middleware) and frontend (route guards, sidebar)
 */

import { ROLES } from './roleUtils.js';

/**
 * Permission definitions
 * Each permission is a string identifier
 */
export const PERMISSIONS = {
  // Student permissions
  VIEW_COURSES: 'view_courses',
  VIEW_SIGNALS: 'view_signals',
  VIEW_LIVE_CLASSES: 'view_live_classes',
  VIEW_PROFILE: 'view_profile',
  UPDATE_PROFILE: 'update_profile',
  
  // Admin permissions (includes all student permissions)
  MANAGE_USERS: 'manage_users',
  MANAGE_COURSES: 'manage_courses',
  MANAGE_CONTENT: 'manage_content',
  MANAGE_LESSONS: 'manage_lessons',
  MANAGE_LIVE_TRAININGS: 'manage_live_trainings',
  MANAGE_SIGNALS: 'manage_signals',
  MANAGE_GROUPS: 'manage_groups',
  MANAGE_CHAT: 'manage_chat',
  VIEW_ANALYTICS: 'view_analytics',
  MANAGE_RESOURCES: 'manage_resources',
  
  // Owner-only permissions (includes all admin permissions)
  BILLING_ADMIN: 'billing_admin',
  ROLE_ADMIN: 'role_admin',
  SYSTEM_SETTINGS: 'system_settings',
  VIEW_FINANCE: 'view_finance',
  MANAGE_FINANCE: 'manage_finance',
  ALL_ADMIN: 'all_admin',
};

/**
 * Base permissions for each role (to avoid circular references)
 */
const STUDENT_PERMISSIONS = [
  PERMISSIONS.VIEW_COURSES,
  PERMISSIONS.VIEW_SIGNALS,
  PERMISSIONS.VIEW_LIVE_CLASSES,
  PERMISSIONS.VIEW_PROFILE,
  PERMISSIONS.UPDATE_PROFILE,
];

const ADMIN_PERMISSIONS = [
  ...STUDENT_PERMISSIONS,
  PERMISSIONS.MANAGE_USERS,
  PERMISSIONS.MANAGE_COURSES,
  PERMISSIONS.MANAGE_CONTENT,
  PERMISSIONS.MANAGE_LESSONS,
  PERMISSIONS.MANAGE_LIVE_TRAININGS,
  PERMISSIONS.MANAGE_SIGNALS,
  PERMISSIONS.MANAGE_GROUPS,
  PERMISSIONS.MANAGE_CHAT,
  PERMISSIONS.VIEW_ANALYTICS,
  PERMISSIONS.MANAGE_RESOURCES,
];

/**
 * Role to permissions mapping
 * Owner has all permissions, admin has admin + student, student has only student
 */
export const ROLE_PERMISSIONS = {
  [ROLES.STUDENT]: STUDENT_PERMISSIONS,
  
  [ROLES.ADMIN]: ADMIN_PERMISSIONS,
  
  [ROLES.SUPER_ADMIN]: [
    ...ADMIN_PERMISSIONS,
    PERMISSIONS.ROLE_ADMIN,
    PERMISSIONS.VIEW_FINANCE,
  ],
  
  [ROLES.CONTENT_ADMIN]: [
    ...STUDENT_PERMISSIONS,
    PERMISSIONS.MANAGE_COURSES,
    PERMISSIONS.MANAGE_CONTENT,
    PERMISSIONS.MANAGE_LESSONS,
    PERMISSIONS.MANAGE_RESOURCES,
  ],
  
  [ROLES.SUPPORT_ADMIN]: [
    ...STUDENT_PERMISSIONS,
    PERMISSIONS.MANAGE_CHAT,
    PERMISSIONS.MANAGE_GROUPS,
  ],
  
  [ROLES.FINANCE_ADMIN]: [
    ...STUDENT_PERMISSIONS,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.VIEW_ANALYTICS,
  ],
  
  [ROLES.OWNER]: [
    // All permissions - owner has access to everything
    ...Object.values(PERMISSIONS),
  ],
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  const permissions = ROLE_PERMISSIONS[role] || [];
  return permissions.includes(permission);
};

/**
 * Check if a role has any of the specified permissions
 * @param {string} role - User role
 * @param {string[]} permissions - Permissions to check
 * @returns {boolean}
 */
export const hasAnyPermission = (role, permissions) => {
  if (!role || !permissions || permissions.length === 0) return false;
  return permissions.some(perm => hasPermission(role, perm));
};

/**
 * Check if a role has all of the specified permissions
 * @param {string} role - User role
 * @param {string[]} permissions - Permissions to check
 * @returns {boolean}
 */
export const hasAllPermissions = (role, permissions) => {
  if (!role || !permissions || permissions.length === 0) return false;
  return permissions.every(perm => hasPermission(role, perm));
};

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {string[]}
 */
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

