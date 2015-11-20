// repository: https://github.com/ongoworks/meteor-security/
// meteor package: ongoworks:security

declare module Mongo {
  interface Collection<T> {
    permit(operations: string | string[]): Security.Rule;
  }
}

declare module Security {
  /**
   * If you want to apply the same rule to multiple collections at once, you can do
   */
  function permit(operations: string | string[]): { collections: (collectionNames: string[]) => Rule }

  /**
   * Call Security.defineMethod to define a method that may be used in the rule chain to restrict the current rule. 
   * Pass a definition argument, which must contain a deny property set to a deny function for that rule. 
   */
  function defineMethod(name: string, definition: IMethodDefinition);

  function can(userId: string): ICanDbOperationsStep1;
  
  class Rule {
    apply(): void;
      
    /** 
     * Prevents the database operations from untrusted code. 
     * Should be the same as not defining any rules, but it never hurts to be extra careful. 
     */
    never(): Rule;
     
    /**
     * Allows the database operations from untrusted code only when there is a logged in user.
     */
    ifLoggedIn(): Rule; 
      
    /**
     * Allows the database operations from untrusted code only for the given user.
     */
    ifHasUserId(userId: string): Rule;
      
    /**
     * Allows the database operations from untrusted code only for users with the given role. 
     * Using this method requires adding the alanning:roles package to your app. 
     * If you use role groups, an alternative syntax is ifHasRole({role: role, group: group})
     */
    ifHasRole(role: string | { role: string, group: string }): Rule;
      
    /**
     * Allows the database operations from untrusted code for the given top-level doc properties only. 
     * props can be a string or an array of strings.
     */
    onlyProps(props: string | string[]): Rule;
      
    /**
     * Allows the database operations from untrusted code for all top-level doc properties except those specified. 
     * props can be a string or an array of strings.
     */
    exceptProps(props: string | string[]): Rule;
  }

  interface IMethodDefinition {
    /**
     * The deny function is the same as the standard Meteor one, 
     * except that it receives a type string as its first argument and 
     * the second argument is whatever the user passes to your method when calling it. 
     * The full function signature for inserts and removes is 
     * (type, arg, userId, doc) and for updates is (type, arg, userId, doc, fields, modifier).
     */
    deny: (type: string, arg: any, userId: string, doc: any, fields?: string[], modifier?: any) => boolean;
    
    /**
     * It's good practice to include fetch: [] in your rule definition, 
     * listing any fields you need for your deny logic. 
     * However, the fetch option is not yet implemented. Currently all fields are fetched.
     */
    fetch?: string[];
    
    /**
     * If a rule is applied to a collection and that collection has a transform function, 
     * the doc received by your rule's deny function will be transformed. 
     * In most cases, you will want to prevent this by adding transform: null to your rule definition. 
     * Alternatively, you can set transform to a function in your rule definition, 
     * and that transformation will be run before calling the deny function.
     */
    transform?: (original: any) => any;
  }

  interface ICanDbOperationsStep1 {
    insert(document: any): ICanDbOperationsStep2;
    update(id: string|number|Mongo.ObjectID, modifiers: any): ICanDbOperationsStep2;
    remove(id: string|number|Mongo.ObjectID): ICanDbOperationsStep2;
  }
  
  interface ICanDbOperationsStep2 {
    for(collection: Mongo.Collection<any>): ICanDbOperationsStep3;
  }
  
  interface ICanDbOperationsStep3 {
    check(): boolean;
    throw(): void;
  }
}