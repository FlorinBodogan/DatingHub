import { Component, OnInit, ViewChild } from '@angular/core';
import { MatMenuTrigger } from '@angular/material/menu';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/interfaces/member';
import { User } from 'src/app/interfaces/user';
import { AccountService } from 'src/app/services/account/account.service';
import { MemberService } from 'src/app/services/members/member.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit{
  model: any = {}
  member: Member | undefined;
  user: User | null = null;

  constructor(
    public accountService: AccountService,
    private router: Router,
    private toastr: ToastrService,
    private memberService: MemberService
  ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.loadMember();
  };

  login(): void {
    this.accountService.login(this.model).subscribe({
      next: () => this.router.navigateByUrl('/users'),
      error: error => this.toastr.error(error.error)
    })
  };

  logout(): void {
    this.accountService.logout();
    this.router.navigateByUrl('/')
  };

  loadMember(): void {
    console.log(this.user?.username)
    if(!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: member => {
        this.member = member
        console.log("lalala + " + member)
      }
    })
  };
}
