/// <reference path="../../typings/tsd.d.ts" />

import {Component, View, NgFor, NgIf, NgZone} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {IProject, Projects, ProjectService} from 'models/projects';

import {RouterLink} from 'client/helpers/router-link';
import {MDL_COMMONS} from 'client/helpers/mdl-directives';
import {LoggedInComponent} from 'client/helpers/logged-in-component';
import {NavHeaderService} from 'client/navigation/nav-header';

@Component({
  selector: 'projects-list'
})
@View({
  templateUrl: '/client/project-components/projects-list.html',
  directives: [NgFor, NgIf, RouterLink, MDL_COMMONS]
})
export class ProjectsList extends LoggedInComponent {
  public projects: Mongo.Cursor<IProject>;

  constructor(private zone: NgZone, router: Router, navHeader: NavHeaderService) {
    super(router);

    navHeader.title = 'Projects';

    this.subscribe('projects');
    this.projects = Projects.find({}, { sort: { name: 1 } });
  }

  public create() {
    (<Promise<string>>ProjectService.createEmpty()).then((id) => {
      this.router.navigate(['/Project', { projectId: id }]);
      // this.zone.run(() => this.router.navigate(['/Project', { projectId: id }]));
    });
  }
}
