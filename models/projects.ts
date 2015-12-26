/// <reference path="../typings/tsd.d.ts" />

/* tslint:disable:no-use-before-declare */

import {getCollectionOptions} from 'lib/domainHelpers';
import {AutoServerMethods} from 'lib/autoDomainHelpers';
import {RoleRequired, ServerOnly} from 'lib/securityHelpers';
import * as Schema from 'models/schemas/project';
export * from 'models/schemas/project';
export * from 'models/schemas/user';

class Project implements Schema.IProject {
  _id: string;
  name: string;
  description: string;
  members: string[];
  languages: Schema.IProjectLanguage[];
  languagesOrder: string[];
  deletedLanguages: string[];

  public delete() {
    ProjectService.delete(this._id);
  }

  public addMember(memberId: string, role: string) {
    ProjectService.setUserRoleOnProject(
      memberId, this._id, role);
  }

  public addMemberByEmail(email: string, role: string) {
    ProjectService.addUserByEmailToProject(email, this._id, role);
  }

  public removeMember(memberId: string) {
    ProjectService.removeUserFromProject(memberId, this._id);
  }

  public changeRoleForMember(memberId: string, newRole: string) {
    ProjectService.setUserRoleOnProject(memberId, this._id, newRole);
  }

  public save() {
    ProjectService.updateTitleDescription(this._id, this.name, this.description);
  }

  public canUserSeeSettings(userId: string) {
    const roles = Roles.getRolesForUser(userId, `_${this._id}`);
    return _.intersection(roles, Schema.ProjectTranslatorRoles).length > 0;
  }
}

export class NewProject extends Project {
  constructor() {
    super();
    this._id = Random.id();
    this.name = 'New Project';
    this.description = 'Start translating your product Now!';
  }

  public save() {
    ProjectService.create(this._id, this.name, this.description);
    return this._id;
  }
}

class ProjectMethods extends AutoServerMethods {
  constructor() {
    super('ProjectMethods');
  }

  @RoleRequired(Schema.ProjectRoles.admin.name, 0, '_')
  public delete(projectId: string) {
    Projects.remove(projectId);
  }

  public create(id: string, name: string, description: string) {
    Projects.insert({ _id: id, name: name, description: description });
  }

  @RoleRequired(Schema.ProjectRoles.admin.name, 1, '_')
  public setUserRoleOnProject(userId: string, projectId: string, role: string) {
    Projects.update({ _id: projectId }, { $addToSet: { members: userId } });
    Roles.addUsersToRoles(userId, role, `_${projectId}`);
    Roles.removeUsersFromRoles(userId, _.without(Schema.ValidProjectRoles, role), `_${projectId}`);
  }

  @ServerOnly()
  @RoleRequired(Schema.ProjectRoles.admin.name, 1, '_')
  public addUserByEmailToProject(email: string, projectId: string, role: string) {
    console.log('should be seen only on server');
  }

  @RoleRequired(Schema.ProjectRoles.admin.name, 1, '_')
  public removeUserFromProject(userId: string, projectId: string) {
    Projects.update({ _id: projectId }, { $pullAll: { members: userId } });
    // Remove group form user
    Meteor.users.update(userId, ProjectService._getDeleteGroupModifier(`_${projectId}`));
  }

  @RoleRequired(Schema.ProjectRoles.admin.name, 0, '_')
  public updateTitleDescription(projectId: string, title: string, description: string) {
    Projects.update({ _id: projectId }, { $set: { name: name, description: description } });
  }

  public _getDeleteGroupModifier(groupName: string) {
    let unsetObject = {};

    unsetObject[`roles.${groupName}`] = '';
    return { $unset: unsetObject };
  }
}

export const Projects =
  new Ground.Collection<Schema.IProject>('projects', getCollectionOptions(Project));
export const ProjectService = new ProjectMethods();

Projects.before.insert(function(userId, doc) {
  doc.members = [userId];
});

Projects.after.insert(function(userId, doc) {
  Roles.addUsersToRoles(userId, Schema.ProjectRoles.admin.name, `_${doc._id}`);
});

Projects.after.remove(function(userId, oldProject) {
  // Remove project group from users
  Meteor.users.update(
    {_id: {$in: oldProject.members}},
    ProjectService._getDeleteGroupModifier(`_${oldProject._id}`));
});
