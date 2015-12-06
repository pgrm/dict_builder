/// <reference path="../typings/tsd.d.ts" />

import {aop, AOPBase} from 'lib/aopBase';

export interface IErrorMsg {
  errorMsg?: string | number;
  reason?: string;
  details?: string;
}

export class LoginRequiredHelper extends AOPBase {
  private static DEFAULT_ERROR: IErrorMsg = { errorMsg: 401 };

  private errorMsg: IErrorMsg;

  constructor(errorMsg: IErrorMsg) {
    super();
    this.errorMsg = Object.assign({}, LoginRequiredHelper.DEFAULT_ERROR, errorMsg);
  }

  protected getBeforeMethod(): Function {
    const error = this.errorMsg;

    return function() {
      if (!Meteor.userId()) {
        throw new Meteor.Error(error.errorMsg, error.reason, error.details);
      }
    };
  }
}

export class RoleRequiredHelper extends AOPBase {
  private static DEFAULT_ERROR: IErrorMsg = { errorMsg: 403 };

  private errorMsg: IErrorMsg;

  constructor(
    private roles: string | string[],
    private group?: string | number, private groupNamePrefix?: string,
    errorMsg?: IErrorMsg) {
    super();
    this.errorMsg = Object.assign({}, RoleRequiredHelper.DEFAULT_ERROR, errorMsg);
  }

  protected getBeforeMethod(): Function {
    const error = this.errorMsg;
    const roles = this.roles;
    const group = this.group;
    const groupNamePrefix = this.groupNamePrefix || '';
    let groupName: string;
    let groupIndex: number;

    if (typeof group === 'string') {
      groupName = group;
    } else {
      groupIndex = group;
    }

    return function(...args) {
      if (groupIndex >= 0) {
        groupName = (groupNamePrefix + args[groupIndex]);
      }

      if (!Roles.userIsInRole(Meteor.userId(), roles, groupName)) {
        throw new Meteor.Error(
          error.errorMsg,
          (error.reason ||
            `You don't have the necessary permissions ${roles} on the group ${groupName}`),
          error.details);
      }
    };
  }
}

export function LoginRquired(errorMsg?: IErrorMsg): MethodDecorator {
  return aop(() => new LoginRequiredHelper(errorMsg));
}

export function RoleRequired(
  roles: string | string[],
  group?: string | number,
  groupNamePrefix?: string,
  errorMsg?: IErrorMsg): MethodDecorator {
  return aop(() => new RoleRequiredHelper(roles, group, groupNamePrefix, errorMsg));
}
