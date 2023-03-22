import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthService, TOKEN_MANAGER } from './auth/auth.service';
import { LocalStorageTokenManager, SessionStorageTokenManager } from './auth/token-manager.service';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule, SharedModule],
  providers: [AuthService, { provide: TOKEN_MANAGER, useClass: LocalStorageTokenManager}],
  bootstrap: [AppComponent],
})
export class AppModule {}
