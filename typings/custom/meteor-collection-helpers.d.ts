/// <reference path="../meteor/meteor.d.ts" />

// repository: https://github.com/dburles/meteor-collection-helpers
// repository: https://github.com/mquandalle/meteor-collection-mutations
// meteor packages: dburles:collection-helpers mquandalle:collection-mutations

declare module Mongo {
  interface IReadOnlyDomainCollection<T, H> extends Collection<T & H>{
    helpers(helperMethods: H);
    _transform(T): T & H;
  }
  
  interface IDomainCollection<T, H, M> extends Collection<T & H & M>{
    helpers(helperMethods: H);
    mutations(mutationMethods: M);
    _transform(T): T & H & M;
  }

	interface CollectionStatic {
    /**
     * First generic param (T) is the simple object interface
     * Second param (H) is the interface of read-only helper methods.
     * These helper methods don't modify the object.
     */
		new<T, H>(name: string, options?: {
			connection?: Object;
			idGeneration?: string;
		}): IReadOnlyDomainCollection<T, H>;
    
    /**
     * First generic param (T) is the simple object interface
     * Second param (H) is the interface of read-only helper methods.
     * These helper methods don't modify the object.
     * Third param (M) is the interface for mutation helper methods.
     * These methods can perform different insert/update/remove operations on the server
     */
		new<T, H, M>(name: string, options?: {
			connection?: Object;
			idGeneration?: string;
		}): IDomainCollection<T, H, M>;
	}
}