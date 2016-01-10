/// <reference path="../typings/tsd.d.ts" />

declare var process: any;

import {pollyfillEverything} from 'lib/pollyfills'; pollyfillEverything();
export * from 'server/projects';
export * from 'server/translations';

Meteor.publish('allUserData', function() {
  return Meteor.users.find({}, {fields: { 'services.sandstorm': 1 }});
});
