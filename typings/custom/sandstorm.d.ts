declare module Meteor {
  interface UserServices {
    sandstorm?: {
      id: string;
      name: string;
      permissions: string[];
      picture: string;
      preferredHandle: string;
      pronouns: string;
    };
  }
}
