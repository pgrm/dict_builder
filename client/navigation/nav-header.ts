/// <reference path="../../typings/tsd.d.ts" />

import {Component, View, NgIf, Injectable, Title} from 'angular2/angular2';

@Injectable()
export class NavHeaderService {
  private _title: string;
  public showSearch: boolean;

  public get title(): string {
    return this._title;
  }

  public set title(val: string) {
    this._title = val;
    this.titleService.setTitle(`Dict Builder - ${val}`);
  }

  constructor(private titleService: Title) {}
}

@Component({
  selector: 'nav-header'
})
@View({
  templateUrl: '/client/navigation/nav-header.html',
  directives: [NgIf]
})
export class NavHeader {
  // private service: NavHeaderService = new NavHeaderService();
  public get title(): string {
    return this.service.title || 'Home';
  }
  public get showSearch(): boolean {
    return this.service.showSearch;
  }

  constructor(private service: NavHeaderService) {}
}
