/// <reference path="../typings/tsd.d.ts" />

import {AOPBase} from 'lib/aopBase';

if (Meteor.isServer) {
  Meteor.npmRequire('reflect-metadata');
}

export function Check(pattern: any): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    let metadataKey = 'check:validation';
    let metadataValue = pattern;
    let targetKey = `${propertyKey}.${parameterIndex}`;

    Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
  };
}

export function CheckAny(errorMsg: string, ...patterns: any[]): ParameterDecorator {
  return (target, propertyKey, parameterIndex) => {
    let metadataKey = 'check:validation';
    let metadataValue = patterns;
    let targetKey = `${propertyKey}.${parameterIndex}`;

    Reflect.defineMetadata(metadataKey, metadataValue, target, targetKey);
    Reflect.defineMetadata(`${metadataKey}.errorMsg`, errorMsg, target, targetKey);
  };
}

export abstract class TypeChecksHelper extends AOPBase {
  protected getBeforeMethod(): Function {
    const paramChecks = this.getParamChecks();

    return function() {
      for (let i = 0; i < paramChecks.length; i++) {
        if (i >= arguments.length) {
          throw new Match.Error(
            `Found ${arguments.length} arguments, expected at least ${paramChecks.length}`);
        }
        // else
        if (paramChecks[i]) {
          paramChecks[i](arguments[i]);
        }
      }
    };
  }

  private getParamChecks() {
    let paramTypes = this.getParamTypes() || [];
    let ret: Function[] = [];

    for (let i = 0; i < paramTypes.length; i++) {
      ret.push(this.getParamCheck(paramTypes[i], i));
    }
    return ret;
  }

  private getParamCheck(type: any, index: number): Function {
    let paramCheck = this.getCustomValidation(index);

    if (paramCheck) {
      if (paramCheck.checkAny) {
        return function(val) {
          // go through all patterns, the first one which fits can exit the function
          for (let pattern of paramCheck.validation) {
            if (Match.test(val, pattern)) { return true; }
          }
          // if no pattern fits, throw Match.Error
          throw new Match.Error(paramCheck.errorMsg);
        };
      } else {
        return function(val) { check(val, paramCheck.validation); };
      }
    } else {
      return this.getDefaultValidation(type);
    }
  }

  private getCustomValidation(paramIndex: number) {
    let targetKey = `${this.methodName}.${paramIndex}`;
    let customValidation = Reflect.getMetadata('check:validation', this.target, targetKey);

    if (customValidation) {
      return {
        validation: <any | any[]>customValidation,
        checkAny: Match.test(customValidation, [Match.Any]),
        errorMsg: <string>Reflect.getMetadata('check:validation.errorMsg', this.target, targetKey)
      };
    } else {
      return null;
    }
  }

  private getDefaultValidation(type: any): Function {
    if (type === Array) {
      return function(val) { check(val, [Match.Any]); };
    } else if (type === Object) {
      return function(val) { check(val, Match.Any); };
    } else {
      return function(val) { check(val, type); };
    }
  }

  private getParamTypes(): any[] {
    return Reflect.getMetadata('design:paramtypes', this.target, this.methodName);
  }
}
