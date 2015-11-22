/// <reference path="../typings/tsd.d.ts" />

import {aopClass, AOPBase} from 'lib/aopBase';
import {IServerThisCommon} from 'lib/baseClasses';

class LoginRequiredHelper extends AOPBase {
  private static getUserId = function() {
    let me = <IServerThisCommon>this;

    if ('userId' in me) {
      return me.userId;
    } else {
      return Meteor.userId();
    }
  };

  protected getBeforeMethod() {
    return function() {
      if (!LoginRequiredHelper.getUserId.apply(this)) {
        throw new Meteor.Error(401);
      }
    }
  }
}

export function LoginRequired(): MethodDecorator {
  return aopClass(LoginRequiredHelper);
}

export function HasRoleForProject(
  roles: string| string[],
  projectIdParamIndex: number = 0): MethodDecorator {
  return null;
}

export function IsAdminForProject(projectIdParamIndex: number = 0): MethodDecorator {
  return HasRoleForProject('admin', projectIdParamIndex);
}

export function IsTranslatorForProject(projectIdParamIndex: number = 0): MethodDecorator {
  return HasRoleForProject(['admin', 'translator'], projectIdParamIndex);
}

export function IsContributorForProject(projectIdParamIndex: number = 0): MethodDecorator {
  return HasRoleForProject(['admin', 'translator', 'contributor'], projectIdParamIndex);
}

export function HasAccessToProject(projectIdParamIndex: number = 0): MethodDecorator {
  return HasRoleForProject(['admin', 'translator', 'contributor', 'guest'], projectIdParamIndex);
}
