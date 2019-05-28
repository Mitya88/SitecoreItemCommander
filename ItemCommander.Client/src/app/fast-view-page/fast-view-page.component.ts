import { Component, OnInit } from '@angular/core';
import { SciLogoutService } from '@speak/ng-sc/logout';
import { ItemCommanderService } from '../item-commander.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-fast-view-page',
  templateUrl: './fast-view-page.component.html',
  styleUrls: ['./fast-view-page.component.scss']
})
export class FastViewPageComponent implements OnInit {

  constructor(private route: ActivatedRoute, public logoutService: SciLogoutService, private itemCommanderService: ItemCommanderService) { }

  objectKeys = Object.keys;
  responseData: any;
  ngOnInit() {

    var data = this.route.snapshot.queryParamMap.get('itemid');
    this.itemCommanderService.fastView(data).subscribe({
      next: response =>{
          this.responseData = response;
      }
    })
  }

  GetSection(language:string){
    return Object.keys(this.responseData.Data[language]);
  }

  GetFields(language:string, section:string)
  {
    return this.responseData.Data[language][section].map(function (it) { return it })
  }
}
