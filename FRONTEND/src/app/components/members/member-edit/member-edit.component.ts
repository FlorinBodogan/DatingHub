import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/interfaces/member';
import { User } from 'src/app/interfaces/user';
import { AccountService } from 'src/app/services/account/account.service';
import { MemberService } from 'src/app/services/members/member.service';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.scss']
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm: NgForm | undefined;
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if(this.editForm?.dirty) {
      $event.returnValue = true;
    }
  };

  member: Member | undefined;
  user: User | null = null;
  
  constructor(
    private accountService: AccountService,
    private memberService: MemberService,
    private toastr: ToastrService
    ) {
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => this.user = user
    })
  }

  ngOnInit(): void {
    this.loadMember();
  };

  loadMember(): void {
    if(!this.user) return;
    this.memberService.getMember(this.user.username).subscribe({
      next: member => this.member = member
    })
  };

  updateMember(): void {
    this.memberService.updateMember(this.editForm?.value).subscribe({
      next: () => {
        this.toastr.success('Profile updated')
        this.editForm?.reset(this.member);
      }
    });
  };
}
