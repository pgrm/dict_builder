/// <reference path="../../typings/tsd.d.ts" />

import {Component, View, NgFor, NgIf} from 'angular2/angular2';
import {MeteorComponent} from 'angular2-meteor';

import {RouterLink} from 'client/helpers/router-link'
import {MDL_COMMONS} from 'client/helpers/mdl-directives'
import {IProject, Projects} from 'models/projects';

@Component({
  selector: 'projects-side-list'
})
@View({
  templateUrl: '/client/project-components/projects-side-list.html',
  directives: [NgFor, NgIf, RouterLink, MDL_COMMONS]
})
export class ProjectsSideList extends MeteorComponent { 
  public projects: Mongo.Cursor<IProject>;
  public isLoggedIn: boolean;
  
  constructor() {
    super();
    
    this.subscribe('projects');
    this.projects = Projects.find({}, {sort: {name: 1}});

    this.autorun(() => {
      // because Meteor.userId is reactive, this function is only executed if / when the result changes
      // isLoggedIn could be also implemented as a getter-property but would be called much more often
      this.isLoggedIn = !!Meteor.userId();
    }, true);
  }
}