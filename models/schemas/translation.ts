/// <reference path="../../typings/tsd.d.ts" />

export interface IAuthorTimestamp {
  authorId: string;
  timeStamp: Date;
}

export interface ITranslation {
  _id?: string;
  texts: string[];
  tags: string[];
  created: IAuthorTimestamp;
  lastModified: IAuthorTimestamp;

  delete?();
  create?();
}

export const TranslationSchema = new SimpleSchema<ITranslation>({
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
