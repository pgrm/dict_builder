/// <reference path="../typings/tsd.d.ts" />

import {Projects, NewProject} from 'models/projects';
export * from 'models/projects';

Meteor.publish('projects', function() {
  let me = <Subscription>this;
  let projectIds = _.map(Roles.getGroupsForUser(me.userId), (role) => role.substr(1));

  return Projects.find({ _id: { $in: projectIds } });
});

Meteor.publish('project', function(projectId: string) {
  check(projectId, String);
  let me = <Subscription>this;

  if (_.contains(Roles.getGroupsForUser(me.userId), `_${projectId}`)) {
    return Projects.find(projectId);
  } else {
    throw new Meteor.Error(403);
  }
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
    Meteor.users.update({_id: Meteor.userId()}, {$set: {demoProjectCreated: true}});
  }
});
