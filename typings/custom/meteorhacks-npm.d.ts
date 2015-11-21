// repository: https://github.com/aldeed/meteor-simple-schema/

declare module Meteor {
  /**
   * This method loads NPM modules you've specified in the packages.json file.
   */
  function npmRequire(packageName: string): any;
}

declare module Async {
  /**
   * Async.runSync() pause the execution until you invoke done() callback as shown below.
   */
  function runSync<T>(done: (err: any, result: T) => void): T;
  
  /**
   * Wrap an asynchronous function and allow it to be run inside Meteor without callbacks.
   */
  function wrap(asyncFunction: Function): Function;
  
  /**
   * Very similar to Async.wrap(function), 
   * but this API can be used to wrap an instance method of an object.
   */
  function wrap(object: any, functionName: string): Function;
  
  /**
   * Very similar to Async.wrap(object, functionName), 
   * but this API can be used to wrap multiple instance methods of an object.
   */
  function wrap(object: any, functionNames: string[]): {[functionName: string]: Function};
}