/// <reference path="../typings/tsd.d.ts" />

import {Component, View} from 'angular2/angular2';
import {bootstrap} from 'angular2-meteor';
import {AccountsUI} from 'meteor-accounts-ui'
import {GravatarDirective} from 'client/helpers/gravatar-directive';

@Component({
  selector: 'app'
})
@View({
  templateUrl: '/client/app.html',
  directives: [AccountsUI, GravatarDirective]
})
class DictBuilder { }

// use HashLocationStrategy until all the issues mentioned here have been resolved: https://github.com/Urigo/Meteor-Angular2/issues/26
//bootstrap(DictBuilder, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);
//bootstrap(DictBuilder, [ROUTER_PROVIDERS, provide(LocationStrategy, {useClass: HashLocationStrategy})]);
bootstrap(DictBuilder);

