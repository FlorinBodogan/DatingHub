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
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { HasRoleDirective } from './directives/has-role.directive';
import { UserManagementComponent } from './components/admin/user-management/user-management.component';
import { EditRolesDialogComponent } from './components/admin/dialogs/edit-roles-dialog/edit-roles-dialog.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './services/helpers/customRouteReuseStrategy';
import { DatePickerComponent } from './forms/date-picker/date-picker.component';
import { LoginComponent } from './components/login/login.component';
import { ConfirmEmailComponent } from './components/confirm-email/confirm-email.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';
import { StatisticsComponent } from './components/admin/statistics/statistics.component';

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
    AdminPanelComponent,
    UserManagementComponent,
    EditRolesDialogComponent,
    DatePickerComponent,
    LoginComponent,
    ConfirmEmailComponent,
    ChangePasswordComponent,
    StatisticsComponent,
  ],
  imports: [
    SharedModule,
    BrowserAnimationsModule,
    HasRoleDirective
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
    { provide: RouteReuseStrategy, useClass: CustomRouteReuseStrategy },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
