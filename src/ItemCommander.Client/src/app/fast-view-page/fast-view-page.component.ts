import { Component, OnInit, ChangeDetectorRef, Inject, Input } from '@angular/core';
import { SciLogoutService } from '@speak/ng-sc/logout';
import { ItemCommanderService } from '../item-commander.service';
import { ActivatedRoute } from '@angular/router';
import { LOCAL_STORAGE, WebStorageService } from 'angular-webstorage-service';
import { FastViewService } from '../fast-view/fastview.service';

@Component({
  selector: 'sc-fast-view-page',
  templateUrl: './fast-view-page.component.html',
  styleUrls: ['./fast-view-page.component.scss']
})
export class FastViewPageComponent implements OnInit {

  @Input()  
  selectedDatabase: any;

  constructor(@Inject(LOCAL_STORAGE) private storage: WebStorageService,
    private cdRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    public logoutService: SciLogoutService,
    private itemCommanderService: ItemCommanderService,
    private fastviewService: FastViewService) {
    this.standardFields = ["Statistics", "Lifetime", "Security", "Help", "Appearance", "Insert Options", "Workflow", "Publishing", "Tasks", "Validation Rules"];
    // this.itemId = this.route.snapshot.queryParamMap.get('itemid');
    //this.selectedDatabase = this.route.snapshot.queryParamMap.get('database');

    this.showStandardFields = this.storage.get('standardfields');    
    this.fastviewService.search.subscribe(value => {
      console.log(value);
      this.load(value);
    });
  }
  
  objectKeys = Object.keys;
  responseData: any;
  showStandardFields: boolean;
  standardFields: Array<string>;
  languages: any;

  isNavigationShown: boolean;
  ngOnInit() {

    
  }

  load(itemId){
    this.itemCommanderService.fastView(itemId, this.selectedDatabase).subscribe({
      next: response => {
        this.responseData = response;
        this.cdRef.detectChanges();
      }
    });
  }

  ngAfterViewChecked() {
  }
  GetSection(language: string) {
    console.log('getsection1');
    var data = Object.keys(this.responseData.Data[language]);
    if (!this.showStandardFields) {
      this.standardFields.forEach(element => {
        var i = data.indexOf(element);
        if (i > -1) {
          data.splice(i, 1);
        }
      });
    }
    return data;
  }

  ShowSection(section: string) {
    if (!this.showStandardFields) {
      return !this.standardFields.includes(section);
    }
    return true;
  }

  GetFields(language: string, section: string) {
    return this.responseData.Data[language][section].map(function (it) { return it })
  }

  changeStandardFields(){
    console.log('change');
    this.storage.set('standardfields',this.showStandardFields);
  }
}
