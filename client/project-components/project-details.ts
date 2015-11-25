/// <reference path="../../typings/tsd.d.ts" />

import {Component, View, NgFor, NgIf} from 'angular2/angular2';
import {Router, RouteParams} from 'angular2/router';

import {IProject, Projects} from 'models/projects';

import {RouterLink} from 'client/helpers/router-link';
import {MDL_COMMONS} from 'client/helpers/mdl-directives';
import {LoggedInComponent} from 'client/helpers/logged-in-component';
import {NavHeaderService} from 'client/navigation/nav-header';

@Component({
  selector: 'projects-details'
})
@View({
  templateUrl: '/client/project-components/project-details.html',
  directives: [NgFor, NgIf, RouterLink, MDL_COMMONS]
})
export class ProjectDetails extends LoggedInComponent {
  private projectId: string;
  public project: IProject;

  constructor(router: Router, routeParams: RouteParams, navHeader: NavHeaderService) {
    super(router);
    this.projectId = routeParams.get('projectId');

    this.subscribe('project', this.projectId);

    this.autorun(() => {
      this.project = Projects.findOne(this.projectId);

      if (this.project) {
        navHeader.title = this.project.name;
      }
    }, true);
  }

  public delete(project: IProject) {
    Projects.remove(project._id);
  }
}