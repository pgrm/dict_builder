/// <reference path="../../typings/tsd.d.ts" />

import {Router} from 'angular2/router';
import {MeteorComponent} from 'angular2-meteor';
import {RequireUser} from 'meteor-accounts';

@RequireUser()
export class LoggedInComponent extends MeteorComponent {
  public userId: string;
  public user: Meteor.User;

  constructor(protected router: Router, protected defaultRoute?: any[]) {
    super();

    this.defaultRoute = this.defaultRoute || ['/Home'];
    this.autorun(() => {
      this.user = Meteor.user();
      this.userId = Meteor.userId();

      if (!this.userId) {
        this.router.navigate(this.defaultRoute);
      }
    }, true);
  }
}
