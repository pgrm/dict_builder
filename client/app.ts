/// <reference path="tsd.d.ts" />

import {Component, View} from 'angular2/angular2';
import {bootstrap} from 'angular2-meteor';

@Component({
    selector: 'app'
})
@View({
    templateUrl: '/client/app.html'
})
class DictBuilder { }

// use HashLocationStrategy until all the issues mentioned here have been resolved: https://github.com/Urigo/Meteor-Angular2/issues/26
//bootstrap(DictBuilder, [ROUTER_PROVIDERS, provide(APP_BASE_HREF, { useValue: '/' })]);
//bootstrap(DictBuilder, [ROUTER_PROVIDERS, provide(LocationStrategy, {useClass: HashLocationStrategy})]);
bootstrap(DictBuilder);

