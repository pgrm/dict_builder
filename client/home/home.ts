/// <reference path="../../typings/tsd.d.ts" />

import {Component, View} from 'angular2/core';
import {RouterLink} from 'angular2/router';

import {NavHeaderService} from 'client/navigation/nav-header';

@Component({
  selector: 'home'
})
@View({
  templateUrl: '/client/home/home.html',
  directives: [RouterLink]
})
export class HomeComponent {
  constructor(navService: NavHeaderService) {
    navService.title = 'Home';
  }
 }
