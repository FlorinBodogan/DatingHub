import { Component } from '@angular/core';
import { Member } from 'src/app/interfaces/member';
import { MemberService } from 'src/app/services/members/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent {
  members: Member[] = [];

  ceva = 'claudia'

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
      this.loadMembers();
  };

  loadMembers() {
    this.memberService.getMembers().subscribe({
      next: members => this.members = members
    })
  };
}
