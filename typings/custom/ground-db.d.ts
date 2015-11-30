/// <reference path="../meteor/meteor.d.ts" />

// repository: https://github.com/GroundMeteor/db/
// meteor package: ground:db

declare module Ground {
  var Collection: CollectionStatic;

  interface CollectionStatic {
    new <T>(name: string, options?: {
      connection?: Object;
      idGeneration?: string;
      transform?: Function;
      cleanupLocalData?: boolean
    }): Collection<T>;
    new <T>(collection: Mongo.Collection<T>, collectionName?: string): Collection<T>;

    <T>(collection: Mongo.Collection<T>);
  }

  interface Collection<T> extends Mongo.Collection<T> {
    removeLocalOnly(query?: Mongo.Selector | Mongo.ObjectID | string);
    clear();
  }

  function lookup(collectionName: string);
  function methodResume(names: string|string[], connection?: Meteor.Connection);
  function ready(): boolean;
  function now(): Date;

}
