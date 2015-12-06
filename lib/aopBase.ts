/// <reference path="../typings/tsd.d.ts" />

export function aop<T extends AOPBase>(constructor: () => T): MethodDecorator {
  return function (
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function>) {
    let tmp = constructor();
    tmp.initialize(target, methodName, descriptor);
    return tmp.getDescriptor();
  };
}

export function aopClass<T extends AOPBase>(constructor: new () => T) {
  return aop(() => new constructor());
}

export abstract class AOPBase {
  protected target: Object;
  protected methodName: string;
  protected descriptor: TypedPropertyDescriptor<Function>;
  protected originalFunction: Function;

  public initialize(
    target: Object,
    methodName: string,
    descriptor: TypedPropertyDescriptor<Function> | Function) {

    this.target = target;
    this.methodName = methodName;
    if ((typeof descriptor) === 'function') {
      this.originalFunction = <Function>descriptor;
    } else {
      this.descriptor = descriptor;
    }
  }

  public getDescriptor(): TypedPropertyDescriptor<Function> {
    let newDescriptor = Object.assign({}, this.descriptor,
      { value: this.getInterceptedFunction() });

    return newDescriptor;
  }

  public getInterceptedFunction(originalFunction?: Function): Function {
    let retFunction = originalFunction || this.originalFunction || this.descriptor.value;

    const beforeMethod = this.getBeforeMethod();
    const afterMethod = this.getaAfterMethod();
    const insteadMethod = this.getInsteadMethod();
    const exceptionHandler = this.getExceptionHandler();
    const finallyMethod = this.getFinallyMethod();

    // only modify the function if at least one method/handler has been defined
    if (beforeMethod || afterMethod || insteadMethod || exceptionHandler || finallyMethod) {
      retFunction = AOPBase.getNewDescriptorValue(
        beforeMethod, (insteadMethod || retFunction),
        afterMethod, exceptionHandler, finallyMethod);
    }
    return retFunction;
  }

  protected getBeforeMethod(): Function { return undefined; }
  protected getaAfterMethod(): Function { return undefined; }
  protected getInsteadMethod(): Function { return undefined; }
  protected getExceptionHandler(): Function { return undefined; }
  protected getFinallyMethod(): Function { return undefined; }

  private static getNewDescriptorValue(
    beforeMethod: Function,
    mainMethod: Function,
    afterMethod: Function,
    exceptionHandler: Function,
    finallyMethod: Function
  ): Function {
    return function() {
      const args = _.toArray(arguments);
      if (beforeMethod) { beforeMethod.apply(this, arguments); }

      let ret: any;
      try {
        ret = mainMethod.apply(this, arguments);
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
