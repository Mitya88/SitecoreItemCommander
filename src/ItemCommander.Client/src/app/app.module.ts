import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ScAccountInformationModule } from '@speak/ng-bcl/account-information';
import { ScActionBarModule } from '@speak/ng-bcl/action-bar';
import { ScApplicationHeaderModule } from '@speak/ng-bcl/application-header';
import { ScButtonModule } from '@speak/ng-bcl/button';
import { ScGlobalHeaderModule } from '@speak/ng-bcl/global-header';
import { ScGlobalLogoModule } from '@speak/ng-bcl/global-logo';
import { ScIconModule } from '@speak/ng-bcl/icon';
import { ScPageModule } from '@speak/ng-bcl/page';
import { ScTabsModule } from '@speak/ng-bcl/tabs';
import { ScDropdownModule } from '@speak/ng-bcl/dropdown';
import { ScTableModule } from '@speak/ng-bcl/table';
import { ScMenuModule } from '@speak/ng-bcl/menu';
import { CONTEXT, DICTIONARY } from '@speak/ng-bcl';
import { ScActionControlModule } from '@speak/ng-bcl/action-control';
import { NgScModule } from '@speak/ng-sc';
import { SciAntiCSRFModule } from '@speak/ng-sc/anti-csrf';
import { ScDialogModule } from '@speak/ng-bcl/dialog';
import { ScProgressIndicatorPanelModule } from '@speak/ng-bcl/progress-indicator-panel';

import { SciLogoutService } from '@speak/ng-sc/logout';
import { AppComponent } from './app.component';
import { StartPageComponent } from './start-page/start-page.component';
import { ItemCommanderService } from './item-commander.service';
import { FastViewPageComponent } from './fast-view-page/fast-view-page.component';
import { ImageViewComponent } from './fast-view/image-view/image-view.component';
import { TextComponent } from './fast-view/text/text.component';
import { StorageServiceModule } from 'angular-webstorage-service';
import { FilterChildren } from './filter';
import { MultilistComponent } from './fast-view/multilist/multilist.component';
import { FastViewService } from './fast-view/fastview.service';
import { ItemService } from './services/item.service';
import { BookmarkService } from './services/bookmark.service';

@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,
    FastViewPageComponent,
    ImageViewComponent,
    TextComponent,
    FilterChildren,
    MultilistComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    StorageServiceModule,
    HttpModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', component: StartPageComponent, pathMatch: 'full' },
      { path: 'fastview', component: FastViewPageComponent }
    ]),
    ScAccountInformationModule,
    ScActionBarModule,
    ScApplicationHeaderModule,
    ScProgressIndicatorPanelModule,
    ScButtonModule,
    ScGlobalHeaderModule,
    ScGlobalLogoModule,
    ScIconModule,
    ScPageModule,
    ScMenuModule,
    ScTabsModule,
    ScTableModule,
    ScDropdownModule,
    ScDialogModule,
    ScActionControlModule,
    SciAntiCSRFModule,
    NgScModule.forRoot({
      authItemId: '1023A91F-E7C0-410C-BE84-472204C71FD7',
      contextToken: CONTEXT,
      dictionaryToken: DICTIONARY
    })
  ],
  providers: [
    ItemCommanderService, SciLogoutService, FastViewService, ItemService, BookmarkService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
