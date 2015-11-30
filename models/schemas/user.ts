/// <reference path="../../typings/tsd.d.ts" />

import {ValidProjectRoles} from 'models/schemas/project';

const UserCountrySchema = new SimpleSchema({
    name: {
        type: String
    },
    code: {
        type: String,
        regEx: /^[A-Z]{2}$/
    }
});

const UserProfileSchema = new SimpleSchema({
    firstName: {
        type: String,
        optional: true
    },
    lastName: {
        type: String,
        optional: true
    },
    birthday: {
        type: Date,
        optional: true
    },
    gender: {
        type: String,
        allowedValues: ['Male', 'Female'],
        optional: true
    },
    organization : {
        type: String,
        optional: true
    },
    website: {
        type: String,
        regEx: SimpleSchema.RegEx.Url,
        optional: true
    },
    bio: {
        type: String,
        optional: true
    },
    country: {
        type: UserCountrySchema,
        optional: true
    }
});

export const UserSchema = new SimpleSchema<Meteor.User>({
    username: {
        type: String,
        /**
         * For accounts-password, either emails or username is required, but not both.
         * It is OK to make this optional here because the
         * accounts-password package does its own validation.
         * Third-party login packages may not require either.
         * Adjust this schema as necessary for your usage.
         */
        optional: true
    },
    emails: {
        type: Array,
        /**
         * For accounts-password, either emails or username is required, but not both.
         * It is OK to make this optional here because the
         * accounts-password package does its own validation.
         * Third-party login packages may not require either.
         * Adjust this schema as necessary for your usage.
         */
        optional: true
    },
    'emails.$': {
        type: Object
    },
    'emails.$.address': {
        type: String,
        regEx: SimpleSchema.RegEx.Email
    },
    'emails.$.verified': {
        type: Boolean
    },
    createdAt: {
        type: Date
    },
    profile: {
        type: UserProfileSchema,
        optional: true
    },
    /**
     * Make sure this services field is in your schema if you're using any of the accounts packages
     */
    services: {
        type: Object,
        optional: true,
        blackbox: true
    },
    roles: {
        type: Object,
        optional: true,
        blackbox: true
    },
    demoProjectCreated: {
      type: Boolean,
      optional: true,
      defaultValue: false
    }
});

Meteor.users.attachSchema(UserSchema);

export const RoleSchema = new SimpleSchema({
  name: {
    type: String,
    allowedValues: ValidProjectRoles
  }
});

Meteor.roles.attachSchema(RoleSchema);
Ground.Collection(Meteor.users);