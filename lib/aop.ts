/// <reference path="../typings/tsd.d.ts" />

import {AOPSimple} from 'lib/aopBase';
import {IServerThisCommon} from 'lib/baseClasses';

class LoginRequiredHelper extends AOPSimple {
  private static getUserId = function() {
    let me = <IServerThisCommon>this;

    if ('userId' in me) {
      return me.userId;
    } else {
      return Meteor.userId();
    }
  };

  constructor() {
    super();
    this.beforeMethod = LoginRequiredHelper.loginRequired;
  }

  private static loginRequired() {
    if (!LoginRequiredHelper.getUserId.apply(this)) {
      throw new Meteor.Error(401);
    }
  }
}

export function LoginRequired(): MethodDecorator {
  return new LoginRequiredHelper().getMethodDecorator();
}

export function UserIsInRole(): MethodDecorator {
  return null;
}
