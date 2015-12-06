/// <reference path="../typings/tsd.d.ts" />

/* tslint:disable:forin */

import {ServerMethodsBase} from 'lib/baseClasses';
import {ServerMethodHelper} from 'lib/domainHelpers';
import {LoginRequiredHelper, IErrorMsg} from 'lib/securityHelpers';

export class AutoServerMethods extends ServerMethodsBase {
  private methodsHaveBeenRegistered = false;

  constructor(
    private className: string,
    private loginRequired = true, private loginErrorMsg?: IErrorMsg,
    autoRegister = true) {
    super();
    if (autoRegister) {
      this._registerAllMethods();
    }
  }

  protected _registerAllMethods() {
    if (this.methodsHaveBeenRegistered) {
      throw new Error(`Cannot register the methods of ${this.className} a second time.`);
    }
    this._forAllPublicMethods((methodName) => {
      if (this.loginRequired) {
        this._addLoginChecks(methodName);
      }
      this._registerMethod(methodName);
    });
  }

  protected _addLoginChecks(methodName: string) {
    let helper = new LoginRequiredHelper(this.loginErrorMsg);

    helper.initialize(this, methodName, this[methodName]);
    this[methodName] = helper.getDescriptor().value;
  }

  protected _registerMethod(methodName: string) {
    let helper = new ServerMethodHelper(this, methodName, this[methodName], this.className);

    helper.registerServerMethod();
    this[methodName] = helper.getProxiedDescriptor().value;
  }

  private _forAllPublicMethods(action: (name: string) => void) {
    for (let pName in this) {
      let property = this[pName];

      if ((typeof property) === 'function' && !this._isPrivateMethod(pName)) {
        action(pName);
      }
    }
  }

  protected _isPrivateMethod(methodName: string): boolean {
    if (methodName && methodName.length > 0) {
      if (methodName[0] === '$' || methodName[0] === '_') {
        return true;
      } else {
        return this._shouldIgnoreMethod(methodName);
      }
    } else {
      return true;
    }
  }

  protected _shouldIgnoreMethod(methodName: string): boolean {
    return false;
  }
}
