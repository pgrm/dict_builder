/// <reference path="../typings/tsd.d.ts" />

/* tslint:disable:no-use-before-declare */

import {getCollectionOptions} from 'lib/domainHelpers';
import {AutoServerMethods} from 'lib/autoDomainHelpers';
import {AnyPermissionsRequired} from 'lib/securityHelpers';
import * as Schema from 'models/schemas/project';
export * from 'models/schemas/project';

class Project implements Schema.IProject {
  _id: string;
  name: string;
  description: string;
  members: string[];
  languages: Schema.IProjectLanguage[];
  languagesOrder: string[];
  deletedLanguages: string[];

  public get canSeeSettings(): boolean {
    if (Meteor.user()) {
      return _.contains(
        Meteor.user().services.sandstorm.permissions, Schema.ProjectPermissions.canEditProject);
    } else {
      return false;
    }
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

class ProjectMethods extends AutoServerMethods {
  constructor() {
    super('ProjectMethods');
  }

  public create(id: string, name: string, description: string) {
    Projects.insert({ _id: id, name: name, description: description });
  }

  @AnyPermissionsRequired([Schema.ProjectPermissions.canEdit])
  public updateTitleDescription(projectId: string, title: string, description: string) {
    Projects.update({ _id: projectId }, { $set: { name: name, description: description } });
  }
}

export const Projects =
  new Mongo.Collection<Schema.IProject>('projects', getCollectionOptions(Project));
//  new Ground.Collection<Schema.IProject>('projects', getCollectionOptions(Project));
export const ProjectService = new ProjectMethods();

Projects.before.insert(function(userId, doc) {
  doc.members = [userId];
});
