/// <reference path="../../typings/tsd.d.ts" />

import {Directive} from 'angular2/core';
import {MeteorComponent} from 'angular2-meteor';

@Directive({
  selector: 'img [gravatar]',
  host: {
    '[attr.src]': 'imageSrc'
  }
})
export class GravatarDirective extends MeteorComponent {
  private static defaultImageSrc = '/images/unknown_gravatar_user.png';
  public imageSrc: string;

  constructor() {
    super();
    this.autorun(() => {
      let user = Meteor.user();

      if (user && user.emails && user.emails.length > 0) {
        let cleanEmail = Gravatar.cleanString(user.emails[0].address);

        this.imageSrc = Gravatar.imageUrl(cleanEmail, {secure: true});
      } else {
        this.imageSrc = GravatarDirective.defaultImageSrc;
      }
    }, true);
  }
}
