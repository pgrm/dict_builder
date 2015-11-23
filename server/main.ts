/// <reference path="../typings/tsd.d.ts" />

import {pollyfillEverything} from 'lib/pollyfills'; pollyfillEverything();
export * from 'server/projects';

Meteor.startup(() => {
  Accounts.config({
    sendVerificationEmail: true
  });
});
