/// <reference path="../typings/tsd.d.ts" />

import {aop, AOPBase} from 'lib/aopBase';

export interface IErrorMsg {
  title?: string | number;
  reason?: string;
  details?: string;
}

export class LoginRequiredHelper extends AOPBase {
  private static DEFAULT_ERROR: IErrorMsg = { title: 401 };

  private errorMsg: IErrorMsg;

  constructor(errorMsg: IErrorMsg) {
    super();
    this.errorMsg = Object.assign({}, LoginRequiredHelper.DEFAULT_ERROR, errorMsg);
  }

  protected getBeforeMethod(): Function {
    return () => {
      if (!Meteor.userId()) {
        throw new Meteor.Error(this.errorMsg.title, this.errorMsg.reason, this.errorMsg.details);
      }
    };
  }
}

abstract class AuthorizationRequiredHelper extends AOPBase {
  private static DEFAULT_ERROR: IErrorMsg = { title: 403 };

  private errorMsg: IErrorMsg;

  constructor(errorMsg?: IErrorMsg) {
    super();
    this.errorMsg = Object.assign({}, AuthorizationRequiredHelper.DEFAULT_ERROR, errorMsg);
  }

  protected getBeforeMethod(): Function {
    return (...args: any[]) => {
      if (!this.isUserAuthorized(args)) {
        this.throwError(this.errorMsg, args);
      }
    };
  }

  public isUserAuthorized(args: any[]): boolean {
    throw new Meteor.Error(500,
      'AuthorizationRequiredHelper.isUserAuthorizedCheck is not implemented.');
  }

  protected throwError(error: IErrorMsg, args: any[]) {
    throw new Meteor.Error(
      error.title, error.reason || this.getDefaultErrorReason(args), error.details);
  }

  protected getDefaultErrorReason(args: any[]): string { return ''; }
}

export class RoleRequiredHelper extends AuthorizationRequiredHelper {
  constructor(
    private roles: string | string[],
    private group?: string | number, private groupNamePrefix?: string,
    errorMsg?: IErrorMsg) {
    super(errorMsg);
  }

  public isUserAuthorized(args: any[]): boolean {
    return Roles.userIsInRole(Meteor.userId(), this.roles, this.getGroupName(args));
  }

  protected getDefaultErrorReason(args: any[]): string {
    return 'You don\'t have the necessary permissions, ' +
      `${this.roles} in the group ${this.getGroupName(args)}`;
  }

  private getGroupName(args: any[]): string {
    const group = this.group;

    if (typeof group === 'string') {
      return group;
    } else {
      return (this.groupNamePrefix || '') + args[group];
    }
  }
}

export enum PermissionsCheckFunction { All, Any }

export class PermissionsRequiredHelper extends AuthorizationRequiredHelper {
  constructor(private anyOfAllPermissions: string[][], errorMsg?: IErrorMsg) {
    super(errorMsg);
  }

  public isUserAuthorized(): boolean {
    for (let allPermissionsRequired of this.anyOfAllPermissions) {
      if (PermissionsRequiredHelper.userHasAllPermissions(allPermissionsRequired)) {
        return true;
      }
    } // else
    return false;
  }

  protected getDefaultErrorReason(): string {
    const strPermissions =
      this.anyOfAllPermissions.map(allRequired => allRequired.join(' and ')).join('; or: ');

    return `You don't have any of these possible and required permissions: [${strPermissions}]`;
  }

  public static userHasAllPermissions(permissions: string[]): boolean {
    const usersPermissions = PermissionsRequiredHelper.getUsersPermissions();

    for (let perm of permissions) {
      if (!_.contains(usersPermissions, perm)) {
        return false;
      }
    } // else
    return true;
  }

  public static getUsersPermissions(): string[] {
    const user = Meteor.user();

    if (user && user.services && user.services.sandstorm) {
      return user.services.sandstorm.permissions;
    } else {
      return undefined;
    }
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

export function PermissionRequired(permission: string, errorMsg?: IErrorMsg): MethodDecorator {
  return AnyPermissionsRequired([permission], errorMsg);
}

export function AnyPermissionsRequired(
  permissions: string[], errorMsg?: IErrorMsg): MethodDecorator {
  const anyOfAllPermissions = permissions.map(p => [p]);
  return PermissionsRequired(anyOfAllPermissions);
}

export function AllPermissionsRequired(
  permissions: string[], errorMsg?: IErrorMsg): MethodDecorator {
  return PermissionsRequired([permissions], errorMsg);
}

export function PermissionsRequired(
  anyOfAllPermissions: string[][], errorMsg?: IErrorMsg): MethodDecorator {
  return aop(() => new PermissionsRequiredHelper(anyOfAllPermissions, errorMsg));
}

export function ServerOnly(): MethodDecorator {
  return (
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<Function>) => {
    const metadataKey = 'security:serverOnly';
    const metadataValue = true;
    const targetKey = propertyKey;

    Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
  };
}
