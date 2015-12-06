/// <reference path="../../typings/tsd.d.ts" />

import {Component, View, NgFor, NgIf} from 'angular2/angular2';
import {MeteorComponent} from 'client/helpers/baseComponents';

import {RouterLink} from 'client/helpers/router-link';
import {MDL_COMMONS} from 'client/helpers/mdl-directives';
import {IProject, Projects} from 'models/projects';

@Component({
  selector: 'side-list'
})
@View({
  templateUrl: '/client/navigation/side-list.html',
  directives: [NgFor, NgIf, RouterLink, MDL_COMMONS]
})
export class SideList extends MeteorComponent {
  public projects: Mongo.Cursor<IProject>;
  public isLoggedIn: boolean;
  public isRoot: boolean = false;

  constructor() {
    super();
    // this.subscribe('projects').then(() => {
    //   this.projects = Projects.find({}, { sort: { name: 1 } });
    // });
    this.subscribe('projects', () => {
      this.projects = Projects.find({}, { sort: { name: 1 } });
    }, true);

    this.autorun(() => {
      // because Meteor.userId is reactive,
      // this function is only executed if / when the result changes
      // isLoggedIn could be also implemented as a getter-property,
      // but would be called much more often
      this.isLoggedIn = !!Meteor.userId();
      if (this.isLoggedIn) {
        this.isRoot = Roles.userIsInRole(Meteor.userId(), 'root');
      } else {
        this.isRoot = false;
      }
    }, true);
  }

  public get ProjectsCount() {
    if (this.projects) {
      return this.projects.count();
    } else {
      return 0;
    }
  }
}
