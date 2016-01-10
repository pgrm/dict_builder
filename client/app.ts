/// <reference path="../typings/tsd.d.ts" />

import {pollyfillEverything} from 'lib/pollyfills'; pollyfillEverything();
import {Component, View, provide} from 'angular2/core';
import {Title} from 'angular2/platform/browser';
import {
  ROUTER_PROVIDERS,
  RouterOutlet,
  RouterLink,
  RouteConfig,
  // APP_BASE_HREF,
  LocationStrategy,
  HashLocationStrategy
} from 'angular2/router';
import {bootstrap} from 'angular2-meteor';

import {MyTitle, MyTitleService} from 'client/navigation/title';
import {SandstormNavigation} from 'client/navigation/sandstorm';
import {Details as ProjectDetails} from 'client/project-components/details';

@Component({
  selector: 'app'
})
@View({
  templateUrl: '/client/app.html',
  directives: [RouterOutlet, RouterLink, MyTitle]
})
@RouteConfig([
  { path: '/', name: 'Home', redirectTo: ['./Sandstorm']},
  { path: '/sandstorm', name: 'Sandstorm', component: SandstormNavigation},
  { path: '/projects/:projectId/...', name: 'Project', component: ProjectDetails }
])
class DictBuilder {
  public user = Meteor.user() || 'test';
}

Meteor.subscribe('allUserData');

// use HashLocationStrategy until all the issues mentioned here have been resolved:
// https://github.com/Urigo/Meteor-Angular2/issues/26
// bootstrap(DictBuilder, [
//   ROUTER_PROVIDERS,
//   provide(APP_BASE_HREF, { useValue: '/' }),
//   MyTitleService, Title
// ]);
bootstrap(DictBuilder, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  MyTitleService, Title
]);
