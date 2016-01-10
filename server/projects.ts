/// <reference path="../typings/tsd.d.ts" />

import {Projects, NewProject} from 'models/projects';
import {} from 'models/translations';
export * from 'models/projects';

Meteor.publish('projects', function() {
  return Projects.find({});
});

Meteor.publish('project', function(projectId: string) {
  check(projectId, String);

  return Projects.find(projectId);
});

function createDemoProject() {
  let project = new NewProject();

  project.name = 'Sample Project';
  project.description =
  'This is your first sample project, ' +
  'you can use it to translate a product. ' +
  'You can have as many projects as you need, ' +
  'one for each product or per component of a product.';
  project.save();
}

Accounts.onLogin(() => {
  if (!Meteor.user().demoProjectCreated) {
    createDemoProject();
    Meteor.users.update({ _id: Meteor.userId() }, { $set: { demoProjectCreated: true } });
  }
});
