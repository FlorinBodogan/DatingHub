import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ListsComponent } from './components/lists/lists.component';
import { MessagesComponent } from './components/messages/messages.component';
import { authGuard } from './services/guards/auth.guard';
import { MemberListComponent } from './components/members/member-list/member-list.component';
import { MemberDetailsComponent } from './components/members/member-details/member-details.component';
import { MemberEditComponent } from './components/members/member-edit/member-edit.component';
import { preventUnsavedChangesGuard } from './services/guards/prevent-unsaved-changes.guard';
import { AdminPanelComponent } from './components/admin/admin-panel/admin-panel.component';
import { adminGuard } from './services/guards/admin.guard';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { nonAuthGuard } from './services/guards/non-auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [authGuard],
    children: [
      { path: 'members', component: MemberListComponent },
      { path: 'members/:username', component: MemberDetailsComponent },
      { path: 'member/edit', component: MemberEditComponent, canDeactivate: [preventUnsavedChangesGuard] },
      { path: 'lists', component: ListsComponent },
      { path: 'messages', component: MessagesComponent },
      { path: 'admin', component: AdminPanelComponent, canActivate: [adminGuard] },
    ]
  },
  { path: 'register', component: RegisterComponent, canActivate: [nonAuthGuard] },
  { path: 'login', component: LoginComponent, canActivate: [nonAuthGuard] },
  { path: '**', component: HomeComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
