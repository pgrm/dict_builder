/// <reference path="../typings/tsd.d.ts" />

export interface IServerThisCommon {
  userId: string;
  connection: Meteor.Connection;
}

/**
 * Helper class for ServerMethod classes.
 * By extending this class, <this> will have all correct properties defined.
 */
export abstract class ServerMethodsBase {
  /**
   * The id of the user that made this method call, or null if no user was logged in.
   */
  public userId: string;
  /**
   * Access inside a method invocation. Boolean value, true if this invocation is a stub.
   */
  public isSimulation: boolean;
  /**
   * Access inside a method invocation. The connection that this method was received on.
   * null if the method is not associated with a connection, eg. a server initiated method call.
   */
  public connection: Meteor.Connection;

  /**
   * Set the logged in user.
   */
  public setUserId: (userId: string) => void;
  /**
   * Call inside a method invocation.
   * Allow subsequent method from this client to begin running in a new fiber.
   */
  public unblock: () => void;
}

/**
 * Helper class for Publication classes.
 * By extending this class, <this> will have all correct properties defined.
 */
export abstract class PublicationBase implements Subscription {
  /**
   * Access inside the publish function. The incoming connection for this subscription.
   */
  public connection: Meteor.Connection;
  /**
   * Access inside the publish function.
   * The id of the logged-in user, or null if no user is logged in.
   */
  public userId: string;

  /**
   * Call inside the publish function.
   * Informs the subscriber that a document has been added to the record set.
   */
  public added: (collection: string, id: string, fields: Object) => void;
  /**
   * Call inside the publish function.
   * Informs the subscriber that a document in the record set has been modified.
   */
  public changed: (collection: string, id: string, fields: Object) => void;
  /**
   * Call inside the publish function.
   * Stops this client's subscription,
   * triggering a call on the client to the onStop callback passed to Meteor.subscribe, if any.
   * If error is not a Meteor.Error, it will be sanitized.
   */
  public error: (error: Error) => void;
  /**
   * Call inside the publish function.
   * Registers a callback function to run when the subscription is stopped.
   */
  public onStop: (func: Function) => void;
  /**
   * Call inside the publish function.
   * Informs the subscriber that an initial,
   * complete snapshot of the record set has been sent.
   * This will trigger a call on the client to the
   * onReady callback passed to  Meteor.subscribe, if any.
   */
  public ready: () => void;
  /**
   * Call inside the publish function.
   * Informs the subscriber that a document has been removed from the record set.
   */
  public removed: (collection: string, id: string) => void;
  /**
   * Call inside the publish function.
   * Stops this client's subscription and invokes the client's onStop callback with no error.
   */
  public stop: () => void;
}
