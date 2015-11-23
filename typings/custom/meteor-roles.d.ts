/// <reference path="../meteor/meteor.d.ts" />


// repository: https://github.com/alanning/meteor-roles
// meteor package: alanning:roles

declare module Roles {
  var GLOBAL_GROUP: string;
  var subscription: Subscription;

  /**
   * Add users to roles. Will create roles as needed.
   *
   * NOTE: Mixing grouped and non-grouped roles
   * for the same user is not supported and will throw an error.
   *
   * Makes 2 calls to database:
   * 1. retrieve list of all existing roles
   * 2. update users' roles
   */
  function addUsersToRoles(
    /** User id(s) or object(s) with an _id field */
    users: string | Meteor.User | string[] | Meteor.User[],
    /** Name(s) of roles/permissions to add users to */
    roles: string | string[],
    /**
     * Optional group name. If supplied, roles will be specific to that group.
     * Group names can not start with '$' or numbers.
     * Periods in names '.' are automatically converted to underscores.
     * The special group Roles.GLOBAL_GROUP provides a convenient way
     * to assign blanket roles/permissions across all groups.
     * The roles/permissions in the Roles.GLOBAL_GROUP group
     * will be automatically included in checks for any group.
     */
    group?: string);

  /**
   * Create a new role. Whitespace will be trimmed.
   *
   * @returns: id of new role
   */
  function createRole(role: string): string;

  /**
   * Delete an existing role.
   * Will throw "Role in use" error if any users are currently assigned to the target role.
   */
  function deleteRole(role: string);

  /**
   * Retrieve set of all existing roles
   */
  function getAllRoles(): Mongo.Cursor<{ _id: string, name: string }>;

  /**
   * Retrieve users groups, if any
   */
  function getGroupsForUser(user: string | Meteor.User, role?: string): string[];

  /**
   * Retrieve users roles
   */
  function getRolesForUser(user: string | Meteor.User, group?: string): string[];

  /**
   * Retrieve all users who are in target role.
   *
   * NOTE: This is an expensive query;
   * it performs a full collection scan on the users collection
   * since there is no index set on the 'roles' field.
   * This is by design as most queries will specify an _id so the _id index is used automatically.
   */
  function getUsersInRole(role: string, group?: string, options?: {
    sort?: Mongo.SortSpecifier;
    skip?: number;
    limit?: number;
    fields?: Mongo.FieldSpecifier;
    reactive?: boolean;
    transform?: Function;
  }): Mongo.Cursor<Meteor.User>;

  /**
   * Remove users from roles
   */
  function removeUsersFromRoles(
    users: string | Meteor.User | string[] | Meteor.User[],
    roles: string | string[],
    group?: string);

  /**
   * Set a users roles/permissions.
   */
  function setUserRoles(
    users: string | Meteor.User | string[] | Meteor.User[],
    roles: string | string[],
    group?: string);

  /**
   * Check if user has specified permissions/roles.
   */
  function userIsInRole(
    users: string | Meteor.User,
    /**
     * Name of role/permission or Array of roles/permissions to check against.
     * If array, will return true if user is in any role.
     */
    roles: string | string[],
    group?: string
  ): boolean;
}
