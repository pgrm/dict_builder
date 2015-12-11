/// <reference path="../typings/tsd.d.ts" />

import {pollyfillEverything} from 'lib/pollyfills'; pollyfillEverything();
import {Component, View, provide} from 'angular2/core';
import {Title} from 'angular2/platform/browser';
import {
  ROUTER_PROVIDERS,
  RouterOutlet,
  RouteConfig,
  // APP_BASE_HREF,
  LocationStrategy,
  HashLocationStrategy
} from 'angular2/router';
import {bootstrap} from 'angular2-meteor';
import {AccountsUI} from 'meteor-accounts-ui';

import {HomeComponent} from 'client/home/home';
import {AboutComponent} from 'client/home/about';

import {GravatarDirective} from 'client/helpers/gravatar-directive';
import {RouterLink} from 'client/helpers/router-link';

import {SideList} from 'client/navigation/side-list';
import {NavHeader, NavHeaderService} from 'client/navigation/nav-header';

import {ProjectsList} from 'client/project-components/projects-list';
import {ProjectDetails} from 'client/project-components/project-details';

@Component({
  selector: 'app'
})
@View({
  templateUrl: '/client/app.html',
  directives: [RouterOutlet, RouterLink, AccountsUI, GravatarDirective, SideList, NavHeader]
})
@RouteConfig([
  { path: '/', as: 'Home', component: HomeComponent },
  { path: '/about', as: 'About', component: AboutComponent },
  { path: '/projects', as: 'ProjectList', component: ProjectsList },
  { path: '/projects/:projectId', as: 'Project', component: ProjectDetails }
])
class DictBuilder { }

// use HashLocationStrategy until all the issues mentioned here have been resolved: https://github.com/Urigo/Meteor-Angular2/issues/26
// bootstrap(DictBuilder, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);
bootstrap(DictBuilder, [
  ROUTER_PROVIDERS,
  provide(LocationStrategy, { useClass: HashLocationStrategy }),
  NavHeaderService, Title
]);
