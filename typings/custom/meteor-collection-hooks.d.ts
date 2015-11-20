/// <reference path="../meteor/meteor.d.ts" />

// repository: https://github.com/matb33/meteor-collection-hooks
// meteor package: matb33:collection-hooks

declare module Mongo {
  interface Collection<T> {
    before: CollectionHooks.IBeforeHooks<T>;
    after: CollectionHooks.IAfterHooks<T>;
    direct: Collection<T>;
  }
}

declare module CollectionHooks {
  interface IBaseHooks<T, R> {
    insert(hook: IInsertRemoveHook<T, R>);    
    remove(hook: IInsertRemoveHook<T, R>);
  }
  
  interface IBeforeHooks<T> extends IBaseHooks<T, boolean|void> {
    update(hook: IUpdateHook<T, boolean|void>);
    upsert(hook: IUpsertHook<T, boolean|void>);
    find(hook: (userId: string, selector: Mongo.Selector, options: Object) => boolean|void);
    findOne(hook: (userId: string, selector: Mongo.Selector, options: Object) => boolean|void);
  }
  
  interface IAfterHooks<T> extends IBaseHooks<T, void> {
    update(hook: IUpdateHook<T, void>, options?: { fetchPrevious: boolean })
    find(hook: (userId: string, selector: Mongo.Selector, options: Object, cursor: Mongo.Cursor<T>) => boolean);
    findOne(hook: (userId: string, selector: Mongo.Selector, options: Object, doc: T) => boolean);
  }
  
  interface IInsertRemoveHook<T, R> {
    (userId: string, doc: T): R;
  }
  
  interface IUpdateHook<T, R> {
    (userId: string, doc: T, fieldNames?: string[], 
     modifier?: Mongo.Modifier, options?: { multi?: boolean; upsert?: boolean; }): R;
  }
  
  interface IUpsertHook<T, R> {
    (userId: string, selector: Mongo.Selector | Mongo.ObjectID | string, 
     modifier?: Mongo.Modifier, options?: { multi?: boolean; }): R;
  }
}