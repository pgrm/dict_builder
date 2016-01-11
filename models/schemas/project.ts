/// <reference path="../../typings/tsd.d.ts" />

export interface IProjectLanguage {
  short: string;
  long?: string;
}

export interface IProject {
  _id?: string;
  name: string;
  description?: string;
  members: string[];
  defaultLanguageIndex: number;
  languages: IProjectLanguage[];
  languagesOrder: string[];
  deletedLanguages: string[];

  canSeeSetting?: boolean;

  delete?();
  create?();
}

export const ProjectPermissions = {
  canEdit: 'edit',
  canEditProject: 'editProject',
  isOwner: 'owner'
};

const languageRegEx = /^[a-z]{2}(_[A-Z]{2})?$/;

const ProjectLanguageSchema = new SimpleSchema({
  short: {
    type: String,
    regEx: languageRegEx
  },
  long: {
    type: String,
    optional: true
  }
});

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
  },
  defaultLanguageIndex: {
    type: Number,
    label: 'Default Language Index',
    min: 0
  },
  languages: {
    type: [ProjectLanguageSchema],
    label: 'Languages'
  },
  languagesOrder: {
    type: [String],
    label: 'Language Order'
  },
  'languagesOrder.$': {
    type: String,
    label: 'Ordered Language',
    regEx: languageRegEx,
    denyUpdate: true
  },
  deletedLanguages: {
    type: [String],
    label: 'List of Deleted Languages'
  },
  'deletedLanguages.$': {
    type: String,
    label: 'Deleted Language',
    regEx: languageRegEx,
    denyUpdate: true
  }
});
