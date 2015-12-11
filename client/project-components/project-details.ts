/// <reference path="../../typings/tsd.d.ts" />

import {Component, View} from 'angular2/core';
import {NgFor, NgIf} from 'angular2/common';
import {Router, RouteParams, RouterLink} from 'angular2/router';

import {IProject, Projects} from 'models/projects';

import {MDL_COMMONS} from 'client/helpers/mdl-directives';
import {LoggedInComponent} from 'client/helpers/baseComponents';
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

    // this.subscribe('project', this.projectId).then(() => {
    //   this.project = Projects.findOne(this.projectId);
    //   navHeader.title = this.project.name;
    // });

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