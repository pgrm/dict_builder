/// <reference path="../typings/tsd.d.ts" />

import {ServerMethodsBase, getCollectionOptions} from 'lib/domainHelpers';

export interface IProject {
  _id?: string;
  name: string;
  description?: string;
  members?: IProjectMember[];
  
  delete?();
  create?();
}

export interface IProjectMember {
	id: string;
	role: string;
}

export const ProjectMemberRoles = ['admin', 'translator', 'contributor', 'guest'];
export const ProjectMemberRoleExplanations = {
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
}

export const ProjectSchema = new SimpleSchema({
  'name': {
    type: String,
    label: 'Name',
    min: 1,
    max: 50,
  },
  'description': {
    type: String,
    label: 'Description',
    max: 1000,
    optional: true
  },
  'members': {
    type: [Object],
    label: 'Members',
    minCount: 1
  },
  'members.$.id': {
    type: String,
    label: 'Member-Id',
    min: 1,
    max: 50,
    denyUpdate: true
  },
  'members.$.role': {
    type: String,
    label: 'Member-Role',
    allowedValues: ProjectMemberRoles
  }
})

class Project implements IProject {
  _id: string;
  name: string;
  description: string;
  members: IProjectMember[];

  public delete() {
    ProjectLogic.delete(this._id);
  }
}

class ProjectLogicMethods extends ServerMethodsBase {
  public delete(projectId: string) {
    Projects.remove(projectId);
  }
  
  public create(name = 'New Project', description?): string|Promise<string> {
    return Projects.insert({
      name: name,
      description: description
    });
  }
}

export const Projects = new Mongo.Collection<IProject>('projects', getCollectionOptions(Project));
export const ProjectLogic = new ProjectLogicMethods();

Projects.before.insert(function(userId, doc) {
  doc.members = [{id: userId, role: ProjectMemberRoleExplanations.admin.name}];
});
