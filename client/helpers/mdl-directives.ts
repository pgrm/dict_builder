/// <reference path="../../typings/tsd.d.ts" />

import {Directive} from 'angular2/core';

@Directive({
  selector: '[data-badge]',
  inputs: ['badgeValue: data-badge'],
  host: {
    '[attr.data-badge]': 'badgeValue'
  }
})
export class MdlBadge {
}

// fixes the issue mentioned below the following commit:
// https://github.com/angular/angular/commit/a69e7fe297d993522167060cad275334ac95768e
export var MDL_COMMONS = [MdlBadge];
