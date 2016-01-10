/// <reference path="../../typings/tsd.d.ts" />

import {Component, View, Injectable} from 'angular2/core';
import {NgIf} from 'angular2/common';
import {Title} from 'angular2/platform/browser';

const appName = 'Dict Builder';

@Injectable()
export class MyTitleService {
  private _title: string;
  public showSearch: boolean;

  public get title(): string {
    return this._title;
  }

  public set title(val: string) {
    this._title = val;

    let windowTitle = appName;

    if (val) {
      windowTitle += ` - ${val}`;
    }
    this.titleService.setTitle(windowTitle);
  }

  constructor(private titleService: Title) {}
}

@Component({
  selector: 'myTitle'
})
@View({
  template: '{{title}}',
  directives: [NgIf]
})
export class MyTitle {
  public get title(): string {
    return this.service.title || appName;
  }
  public get showSearch(): boolean {
    return this.service.showSearch;
  }

  constructor(private service: MyTitleService) {}
}
