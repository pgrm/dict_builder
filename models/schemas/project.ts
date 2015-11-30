/// <reference path="../../typings/tsd.d.ts" />

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

export const ProjectSchema = new SimpleSchema<IProject>({
  _id: {
    type: String,
    regEx: SimpleSchema.RegEx.Id
  },
  name: {
    type: String,
    label: 'Name',
    min: 1,
    max: 50
  },
  description: {
    type: String,
    label: 'Description',
    max: 1000,
    optional: true
  },
  members: {
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
