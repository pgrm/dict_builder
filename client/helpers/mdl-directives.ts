/// <reference path="../../typings/tsd.d.ts" />

import {Directive} from 'angular2/angular2';

@Directive({
  selector: '[data-badge]',
  inputs: ['badgeValue: dataBadge'],
  host: {
    '[attr.dataBadge]': 'badgeValue'
  }
})
export class MdlBadge {
}

// fixes the issue mentioned below the following commit:
// https://github.com/angular/angular/commit/a69e7fe297d993522167060cad275334ac95768e
export var MDL_COMMONS = [MdlBadge];
