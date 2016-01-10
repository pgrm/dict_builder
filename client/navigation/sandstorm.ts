/// <reference path="../../typings/tsd.d.ts" />

import {Component, View} from 'angular2/core';
import {Router} from 'angular2/router';
import {MeteorComponent} from 'angular2-meteor';

import {Projects} from 'models/projects';

@Component({
  selector: 'sandstorm-forwarder'
})
@View({
  template:
  '<h1 [hidden]="projectsLoaded">Loading ...</h1>' +
  '<div [hidden]="!projectsLoaded">' +
  '<h1>No Project Found!</h1>' +
  '<h2>Maybe the database is corrupted, please reinstall or restore old version.</h2>' +
  '</div>'
})
export class SandstormNavigation extends MeteorComponent {
  public projectsLoaded = false;

  constructor(router: Router) {
    super();
    this.subscribe('projects', () => {
      this.projectsLoaded = true;

      const project = Projects.findOne();

      if (project) {
        router.navigate(['/Project', {projectId: project._id}]);
      }
    });
  }
}
