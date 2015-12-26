/// <reference path="../../typings/tsd.d.ts" />

import {Component, View} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';
import {RouterLink} from 'angular2/router';
import {MeteorComponent} from 'angular2-meteor';

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

    this.subscribe('projects');
    this.projects = Projects.find({}, { sort: { name: 1 } });

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
