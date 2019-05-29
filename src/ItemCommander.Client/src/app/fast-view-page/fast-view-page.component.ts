import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { SciLogoutService } from '@speak/ng-sc/logout';
import { ItemCommanderService } from '../item-commander.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fast-view-page',
  templateUrl: './fast-view-page.component.html',
  styleUrls: ['./fast-view-page.component.scss']
})
export class FastViewPageComponent implements OnInit {

  constructor(private cdRef:ChangeDetectorRef, private route: ActivatedRoute, public logoutService: SciLogoutService, private itemCommanderService: ItemCommanderService) {
     this.standardFields =  ["Statistics", "Lifetime", "Security","Help", "Appearance","Insert Options", "Workflow", "Publishing", "Tasks","Validation Rules"];
  this.itemId = this.route.snapshot.queryParamMap.get('itemid');
  this.selectedDatabase = this.route.snapshot.queryParamMap.get('database');

  this.languages = ["en"];
}
  itemId:string;
  objectKeys = Object.keys;
  responseData: any;
  showStandardFields:boolean;
  standardFields:Array<string>;
  languages:any;
  
  isNavigationShown: boolean;
  //TODO: SELECTED DATABASE
  selectedDatabase:any;
  ngOnInit() {
    
    this.itemCommanderService.fastView(this.itemId, this.selectedDatabase).subscribe({
      next: response =>{
          this.responseData = response;
          this.cdRef.detectChanges();
      }
    })  ;
  }

  ngAfterViewChecked()
{
}
  GetSection(language:string){
    console.log('getsection1');
    var data = Object.keys(this.responseData.Data[language]);
    if(!this.showStandardFields){
      this.standardFields.forEach(element => {
        var i = data.indexOf(element);
        if(i>-1){
          data.splice(i,1);
        }
      });
    }
    return data;
  }

  ShowSection(section: string){
    if(!this.showStandardFields){
    return !this.standardFields.includes(section);
    }
    return true;
  }

  GetFields(language:string, section:string)
  {
    return this.responseData.Data[language][section].map(function (it) { return it })
  }
}
