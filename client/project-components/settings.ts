/// <reference path="../../typings/tsd.d.ts" />

import {Component, View} from 'angular2/core';
import {CanActivate} from 'angular2/router';
import {MeteorComponent} from 'angular2-meteor';

import {PermissionsRequiredHelper} from 'lib/securityHelpers';

@Component({
  selector: 'projects-settings'
})
@View({
  template: '<h1>Settings</h1>'
})
@CanActivate(() => new PermissionsRequiredHelper([['owner'], ['editProject']]).isUserAuthorized())
export class Settings extends MeteorComponent {

}
