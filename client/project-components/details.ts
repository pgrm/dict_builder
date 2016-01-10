/// <reference path="../../typings/tsd.d.ts" />

import {Component, View} from 'angular2/core';
import {NgFor, NgIf, NgClass} from 'angular2/common';
import {
  RouteParams,
  RouterLink,
  RouteConfig,
  Router,
  RouterOutlet,
  CanActivate} from 'angular2/router';
import {MeteorComponent} from 'angular2-meteor';

import {IProject, Projects} from 'models/projects';
import {MyTitleService} from 'client/navigation/title';
import {Translations} from 'client/project-components/translations';
import {Settings} from 'client/project-components/settings';

@Component({
  selector: 'projects-details'
})
@View({
  templateUrl: '/client/project-components/details.html',
  directives: [NgFor, NgIf, NgClass, RouterLink, RouterOutlet]
})
@RouteConfig([
  { path: '/', redirectTo: ['./Translations']},
  { path: '/translations', name: 'Translations', component: Translations, useAsDefault: true},
  { path: '/settings', name: 'Settings', component: Settings }
])
@CanActivate(() => !!Meteor.userId())
export class Details extends MeteorComponent {
  private projectId: string;
  public project: IProject;

  constructor(router: Router, routeParams: RouteParams, navHeader: MyTitleService) {
    super();
    this.projectId = routeParams.get('projectId');

    this.subscribe('project', this.projectId);
    this.autorun(() => {
      this.project = Projects.findOne(this.projectId);

      if (this.project) {
        navHeader.title = this.project.name;
      }
    }, true);
  }

  public get canSeeSettings(): boolean {
    if (this.project) {
      return this.project.canSeeSetting;
    } else {
      return false;
    }
  }

  public delete(project: IProject) {
    Projects.remove(project._id);
  }
}
