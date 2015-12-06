/// <reference path="../../typings/tsd.d.ts" />

import {Router} from 'angular2/router';
import {MeteorComponent as DefaultMeteorComponent} from 'angular2-meteor';
import {RequireUser} from 'meteor-accounts';

const cachedSubscriptions: {[name: string]: {[hashedArgs: string]: {
  handle?: Meteor.SubscriptionHandle;
  promise?: Promise<{}>;
}}} = {};

declare var Zone;

export class MeteorComponent extends DefaultMeteorComponent {
  // subscribe(name: string, ...args: any[]) {
  //   const hashedArgs = EJSON.stringify(<any>args);
  //   cachedSubscriptions[name] = cachedSubscriptions[name] || {};

  //   if (!cachedSubscriptions[name][hashedArgs]) {
  //     const thisSubscription: {handle?: Meteor.SubscriptionHandle, promise?: Promise<{}>} = {};

  //     thisSubscription.promise = new Promise((resolve, reject) => {
  //       thisSubscription.handle = Meteor.subscribe(name, ...args, resolve);
  //     });
  //     cachedSubscriptions[name][hashedArgs] = thisSubscription;
  //   }
  //   return cachedSubscriptions[name][hashedArgs].promise;
  // }
}

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
