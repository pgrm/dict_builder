/// <reference path="../../typings/tsd.d.ts" />

import {Directive} from 'angular2/angular2';
import {RouterLink as BaseRouterLink, Router, Location} from 'angular2/router';

@Directive({
  selector: '[router-link]',
  inputs: ['routeParams: routerLink', 'target: target'],
  host: {
    '[attr.href]': 'visibleHref',
    '[class.router-link-active]': 'isRouteActive'
  }
})
class RouterLinkExtension extends BaseRouterLink {
  constructor(router: Router, location: Location) {
    super(router, location);
  }
}

// fixes the issue mentioned below the following commit:
// https://github.com/angular/angular/commit/a69e7fe297d993522167060cad275334ac95768e
export var RouterLink = [RouterLinkExtension];
