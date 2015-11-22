/// <reference path="../typings/tsd.d.ts" />

export abstract class AOPBase {
  public getMethodDecorator(): MethodDecorator {
    return (
      target: Object,
      methodName: string,
      descriptor: TypedPropertyDescriptor<Function>) => {
      return this.getDescriptor(target, methodName, descriptor);
    };
  }

  public getDescriptor(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>): TypedPropertyDescriptor<Function> {

    const beforeMethod = this.getBeforeMethod(target, methodName, descriptor);
    const afterMethod = this.getaAfterMethod(target, methodName, descriptor);
    const insteadMethod = this.getInsteadMethod(target, methodName, descriptor);
    const exceptionHandler = this.getExceptionHandler(target, methodName, descriptor);
    const finallyMethod = this.getFinallyMethod(target, methodName, descriptor);

    // only modify the descriptor if at least one method/handler has been defined
    if (beforeMethod || afterMethod || insteadMethod || exceptionHandler || finallyMethod) {
      let origFunction = descriptor.value;

      descriptor.value = AOPBase.getNewDescriptorValue(
        beforeMethod, afterMethod, insteadMethod,
        exceptionHandler, finallyMethod, origFunction);
    }
    return descriptor;
  }

  protected getBeforeMethod(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>): Function { return undefined; }
  protected getaAfterMethod(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>): Function { return undefined; }
  protected getInsteadMethod(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>): Function { return undefined; }
  protected getExceptionHandler(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>): Function { return undefined; }
  protected getFinallyMethod(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>): Function { return undefined; }

  private static getNewDescriptorValue(
    beforeMethod: Function,
    afterMethod: Function,
    insteadMethod: Function,
    exceptionHandler: Function,
    finallyMethod: Function,
    origFunction: Function
  ): Function {
    return function() {
      const args = _.toArray(arguments);
      if (beforeMethod) { beforeMethod.apply(this, arguments); }

      let ret: any;
      try {
        ret = (insteadMethod || origFunction).apply(this, arguments);
      } catch (ex) {
        AOPBase.handleException(exceptionHandler, this, args, ex);
      } finally {
        if (finallyMethod) { finallyMethod.apply(this, arguments); }
      }
      AOPBase.catchErrorOnPromise(exceptionHandler, this, args, ret);
      return AOPBase.execAfterMethod(afterMethod, this, args, ret);
    };
  }

  private static handleException(exceptionHandler: Function, me: any, args: any[], ex: any) {
    if (exceptionHandler) {
      args.push(ex);
      exceptionHandler.apply(me, args);
      args.pop();
    } else {
      throw ex;
    }
  }

  private static catchErrorOnPromise(
    exceptionHandler: Function, me: any, args: any[],
    ret: Promise<any>) {
    if (exceptionHandler && (typeof ret.catch === 'function')) {
      ret.catch((err) => {
        args.push(err);
        exceptionHandler.apply(me, args);
        args.pop();
      });
    }
  }

  private static execAfterMethod(afterMethod: Function, me: any, args: any[], origRet: any): any {
    if (afterMethod) {
      args.push(origRet);
      let newRet = afterMethod.apply(me, args);
      args.pop();

      if (newRet !== undefined) {
        return newRet;
      }
    }
    return origRet;
  }
}

export abstract class AOPSimple extends AOPBase {
  protected beforeMethod: Function;
  protected afterMethod: Function;
  protected insteadMethod: Function;
  protected exceptionHandler: Function;
  protected finallyMethod: Function;

  protected getBeforeMethod(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>): Function { return this.beforeMethod; }
  protected getaAfterMethod(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>): Function { return this.afterMethod; }
  protected getInsteadMethod(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>): Function { return this.insteadMethod; }
  protected getExceptionHandler(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>): Function { return this.exceptionHandler; }
  protected getFinallyMethod(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>): Function { return this.finallyMethod; }
}
