/// <reference path="../typings/tsd.d.ts" />

import {SampleCollection} from 'collections/sampleCollection';

Meteor.publish('sampleCollection', () => { SampleCollection.find(); });

