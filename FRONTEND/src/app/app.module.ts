import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { MessagesComponent } from './components/messages/messages.component';
import { ListsComponent } from './components/lists/lists.component';
import { SharedModule } from 'src/shared/modules/shared.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ErrorInterceptor } from './services/interceptors/error.interceptor';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { MemberCardComponent } from './components/members/member-card/member-card.component';
import { JwtInterceptor } from './services/interceptors/jwt.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MemberEditComponent } from './components/members/member-edit/member-edit.component';
import { LoadingInterceptor } from './services/interceptors/loading.interceptor';
import { PhotoEditorComponent } from './components/members/photo-editor/photo-editor.component';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    RegisterComponent,
    MessagesComponent,
    ListsComponent,
    MemberListComponent,
    MemberCardComponent,
    MemberEditComponent,
    PhotoEditorComponent,
  ],
  imports: [
    SharedModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
