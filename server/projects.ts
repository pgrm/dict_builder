import {Projects, IProject, IProjectMember} from 'models/projects';
export * from 'models/projects';

Meteor.publish('projects', function() {
  let me = <Subscription>this;
  let condition = { members: { $elemMatch: { id: me.userId } } };

  return Projects.find(condition);
});

export function insertSampleProjects() {
  let numberOfProjects = Projects.find().count();

  console.log(`${numberOfProjects} projects in the database`);

  if (numberOfProjects === 0) {
    let users = Meteor.users.find().fetch();
    let members: IProjectMember[] = [];

    users.forEach(usr => members.push({ id: usr._id, role: 'member' }));

    let projects: IProject[] = [
      { name: 'Project 1', members: members },
      { name: 'Project 2', members: members },
      { name: 'Project 3', members: members },
      { name: 'Project 4', members: [] },
      { name: 'Project 5', members: members }
    ]
    projects.forEach(p => Projects.insert(p));
  }
}
