import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Member } from 'src/app/interfaces/member';
import { MemberService } from 'src/app/services/members/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent {
  members$: Observable<Member[]> | undefined;

  constructor(private memberService: MemberService) { }

  ngOnInit(): void {
      this.members$ = this.memberService.getMembers();
  };
}
