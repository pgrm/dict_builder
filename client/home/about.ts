/// <reference path="../../typings/tsd.d.ts" />

import {Component, View} from 'angular2/core';

import {RouterLink} from 'client/helpers/router-link';
import {NavHeaderService} from 'client/navigation/nav-header';

@Component({
  selector: 'home'
})
@View({
  templateUrl: '/client/about/about.html',
  directives: [RouterLink]
})
export class AboutComponent {
  constructor(navHeader: NavHeaderService) {
    navHeader.title = 'About';
  }
}
