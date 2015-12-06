/// <reference path="../../typings/tsd.d.ts" />

import {Component, View, NgFor, NgIf, NgZone} from 'angular2/angular2';
import {Router} from 'angular2/router';

import {IProject, Projects, NewProject} from 'models/projects';

import {RouterLink} from 'client/helpers/router-link';
import {MDL_COMMONS} from 'client/helpers/mdl-directives';
import {LoggedInComponent} from 'client/helpers/baseComponents';
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

  constructor(router: Router, navHeader: NavHeaderService) {
    super(router);

    navHeader.title = 'Projects';

    // this.subscribe('projects').then(() => {
    //   this.projects = Projects.find({}, { sort: { name: 1 } });
    // });

    this.subscribe('projects', () => {
      this.projects = Projects.find({}, { sort: { name: 1 } });
    }, true);
  }

  public create() {
    let project = new NewProject();
    let id = project.save();

    this.router.navigate(['/Project', { projectId: id }]);
  }
}
