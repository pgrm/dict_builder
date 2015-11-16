declare module Gravatar {
  interface IOptions {
    size?: number;
    default?: string;
    rating?: string;
    secure?: boolean;	
  }
  
	function cleanString(email: string): string;
  function isHash(hash: string): string;
  function hash(email: string): string;
  function imageUrl(emailOrHash: string, options?: IOptions): string; 
}
