/// <reference path="../../typings/tsd.d.ts" />

import {Component, View} from 'angular2/angular2';
import {RouterLink} from 'client/helpers/router-link'

@Component({
  selector: 'home'
})
@View({
  templateUrl: '/client/home/home.html',
  directives: [RouterLink]
})
export class HomeComponent { }