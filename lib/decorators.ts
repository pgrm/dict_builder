/// <reference path="../typings/tsd.d.ts" />

export const SampleClassDecorator: ClassDecorator = function(target) {
  // console.log(`SampleClassDecorator for ${typeof target}:`);
  // console.log(target);
  // console.log();
  return target;
};

export function TestDecorator(message: string): MethodDecorator {
  return (target: Object, methodName: string, descriptor: TypedPropertyDescriptor<Function>) => {
    let origMethod = descriptor.value;

    descriptor.value = function() {
      console.log(message);
      return origMethod.apply(this, arguments);
    };
    return descriptor;
  };
}
