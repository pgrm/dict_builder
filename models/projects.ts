/// <reference path="../typings/tsd.d.ts" />

/* tslint:disable:no-use-before-declare */

import {ServerMethodsBase} from 'lib/baseClasses';
import {getCollectionOptions, ServerMethod} from 'lib/domainHelpers';
import {LoginRequired} from 'lib/aop';

export interface IProject {
  _id?: string;
  name: string;
  description?: string;
  members?: string[];

  delete?();
  create?();
}

export const ProjectRoles = {
  admin: {
    name: 'admin',
    title: 'Administrator',
    description: 'Has all the permissions for this project.'
  },
  translator: {
    name: 'translator',
    title: 'Translator',
    description: 'Additionally to a contributor, can confirm translations.'
  },
  contributor: {
    name: 'contributor',
    title: 'Contributor',
    description: 'Can add new strings for translation and suggest new translations.'
  },
  guest: {
    name: 'guest',
    title: 'Guest',
    description: 'Only has read-only permissions.'
  }
};

export const ProjectContributorRoles = [
  ProjectRoles.admin.name, ProjectRoles.translator.name, ProjectRoles.contributor.name
];

export const ProjectTranslatorRoles = [ProjectRoles.admin.name, ProjectRoles.translator.name];

export const ValidProjectRoles = [
  ProjectRoles.admin.name,
  ProjectRoles.translator.name,
  ProjectRoles.contributor.name,
  ProjectRoles.guest.name
];

export const ProjectSchema = new SimpleSchema({
  'name': {
    type: String,
    label: 'Name',
    min: 1,
    max: 50
  },
  'description': {
    type: String,
    label: 'Description',
    max: 1000,
    optional: true
  },
  'members': {
    type: [String],
    label: 'Members',
    minCount: 1
  },
  'members.$': {
    type: String,
    label: 'Member-Id',
    min: 1,
    max: 50,
    denyUpdate: true
  }
});

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

class ProjectLogicMethods extends ServerMethodsBase {
  @ServerMethod()
  @LoginRequired()
  public delete(projectId: string) {
    if (Roles.userIsInRole(this.userId, ProjectRoles.admin.name, `_${projectId}`)) {
      Projects.remove(projectId);
    }
  }

  @ServerMethod()
  @LoginRequired()
  public createEmpty(): string | Promise<string> {
    return ProjectService.create('New Project', 'Start translating your product Now!');
  }

  @ServerMethod()
  @LoginRequired()
  public create(name: string, description: string): string | Promise<string> {
    return Projects.insert({ name: name, description: description });
  }

  @ServerMethod()
  @LoginRequired()
  public setUserRoleOnProject(userId: string, projectId: string, role: string) {
    if (Roles.userIsInRole(this.userId, ProjectRoles.admin.name, `_${projectId}`)) {
      Projects.update({ _id: projectId }, { $addToSet: { members: userId } });
      Roles.addUsersToRoles(userId, role, `_${projectId}`);
      Roles.removeUsersFromRoles(userId, _.without(ValidProjectRoles, role), `_${projectId}`);
    }
  }

  @ServerMethod()
  @LoginRequired()
  public removeUserFromProject(userId: string, projectId: string) {
    if (Roles.userIsInRole(this.userId, ProjectRoles.admin.name, `_${projectId}`)) {
      Projects.update({ _id: projectId }, { $pullAll: { members: userId } });
      Roles.removeUsersFromRoles(userId, ValidProjectRoles, `_${projectId}`);
    }
  }

  @ServerMethod()
  @LoginRequired()
  public updateTitleDescription(projectId: string, title: string, description: string) {
    if (Roles.userIsInRole(this.userId, ProjectRoles.admin.name, `_${projectId}`)) {
      Projects.update({ _id: projectId }, { $set: { name: name, description: description } });
    }
  }
}

export const Projects = new Mongo.Collection<IProject>('projects', getCollectionOptions(Project));
export const ProjectService = new ProjectLogicMethods();

Projects.before.insert(function(userId, doc) {
  doc.members = [userId];
});

Projects.after.insert(function(userId, doc) {
  Roles.addUsersToRoles(userId, ProjectRoles.admin.name, `_${doc._id}`);
});
