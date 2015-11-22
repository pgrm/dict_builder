/// <reference path="../typings/tsd.d.ts" />

import {pollyfillEverything} from 'lib/pollyfills'; pollyfillEverything();
import {insertSampleProjects} from 'server/projects';

Meteor.startup(() => {
  insertSampleProjects();
});
