/// <reference path="../../typings/tsd.d.ts" />

import {Component, View, NgFor, NgIf} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {RouterLink} from 'client/helpers/router-link';
import {MDL_COMMONS} from 'client/helpers/mdl-directives';
import {LoggedInComponent} from 'client/helpers/logged-in-component';
import {IProject, Projects} from 'models/projects';

@Component({
  selector: 'projects-list'
})
@View({
  templateUrl: '/client/project-components/projects-list.html',
  directives: [NgFor, NgIf, RouterLink, MDL_COMMONS]
})
export class ProjectDetails extends LoggedInComponent { 
  public projects: Mongo.Cursor<IProject>;
  
  constructor(router: Router) {
    super(router);
    
    this.subscribe('projects');
    this.projects = Projects.find({}, {sort: {name: 1}});
  }
  
  public delete(project: IProject) {
    Projects.remove(project._id);
  }
}