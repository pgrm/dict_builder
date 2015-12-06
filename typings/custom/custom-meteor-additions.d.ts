declare module Meteor {
  interface User {
    demoProjectCreated?: boolean;
    roles: {
      [grop: string]: string[]
    };
  }
}
