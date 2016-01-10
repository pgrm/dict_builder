/// <reference path="../../typings/tsd.d.ts" />

import {Component, View} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {MeteorComponent} from 'angular2-meteor';

@Component({
  selector: 'projects-translations'
})
@View({
  template: '<h1>Translations</h1>'
})
@CanActivate(() => {
  return true;
})
export class Translations extends MeteorComponent {

}
