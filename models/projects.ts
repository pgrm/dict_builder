/// <reference path="../typings/tsd.d.ts" />

/* tslint:disable:no-use-before-declare */

import {ServerMethodsBase} from 'lib/baseClasses';
import {getCollectionOptions, ServerMethod} from 'lib/domainHelpers';
import {LoginRequired} from 'lib/aop';
import {IProject, ProjectRoles, ValidProjectRoles} from 'models/schemas/project';
export * from 'models/schemas/project';
export * from 'models/schemas/user';

class Project implements IProject {
  _id: string;
  name: string;
  description: string;
  members: string[];

  public delete() {
    ProjectService.delete(this._id);
  }

  public addMember(memberId: string, role?: string) {
    ProjectService.setUserRoleOnProject(memberId, this._id, (role || ProjectRoles.guest.name));
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

class ProjectMethods extends ServerMethodsBase {
  @ServerMethod('ProjectMethods')
  @LoginRequired()
  public delete(projectId: string) {
    if (Roles.userIsInRole(this.userId, ProjectRoles.admin.name, `_${projectId}`)) {
      console.log('removing project');
      Projects.remove(projectId);
    }
  }

  @ServerMethod('ProjectMethods')
  @LoginRequired()
  public create(id: string, name: string, description: string) {
    console.log('Running insert...');
    console.log(Projects.insert({_id: id, name: name, description: description }));
  }

  @ServerMethod('ProjectMethods')
  @LoginRequired()
  public setUserRoleOnProject(userId: string, projectId: string, role: string) {
    if (Roles.userIsInRole(this.userId, ProjectRoles.admin.name, `_${projectId}`)) {
      Projects.update({ _id: projectId }, { $addToSet: { members: userId } });
      Roles.addUsersToRoles(userId, role, `_${projectId}`);
      Roles.removeUsersFromRoles(userId, _.without(ValidProjectRoles, role), `_${projectId}`);
    }
  }

  @ServerMethod('ProjectMethods')
  @LoginRequired()
  public removeUserFromProject(userId: string, projectId: string) {
    if (Roles.userIsInRole(this.userId, ProjectRoles.admin.name, `_${projectId}`)) {
      Projects.update({ _id: projectId }, { $pullAll: { members: userId } });
      Roles.removeUsersFromRoles(userId, ValidProjectRoles, `_${projectId}`);
    }
  }

  @ServerMethod('ProjectMethods')
  @LoginRequired()
  public updateTitleDescription(projectId: string, title: string, description: string) {
    if (Roles.userIsInRole(this.userId, ProjectRoles.admin.name, `_${projectId}`)) {
      Projects.update({ _id: projectId }, { $set: { name: name, description: description } });
    }
  }
}

export const Projects = new Ground.Collection<IProject>('projects', getCollectionOptions(Project));
export const ProjectService = new ProjectMethods();

Projects.before.insert(function(userId, doc) {
  doc.members = [userId];
});

Projects.after.insert(function(userId, doc) {
  Roles.addUsersToRoles(userId, ProjectRoles.admin.name, `_${doc._id}`);
});

Projects.after.remove(function(userId, oldProject) {
  Roles.removeUsersFromRoles(oldProject.members, ValidProjectRoles, `_${oldProject._id}`);
});
