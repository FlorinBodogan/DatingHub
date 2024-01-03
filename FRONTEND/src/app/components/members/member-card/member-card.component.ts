import { Component, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Member } from 'src/app/interfaces/member';
import { MemberService } from 'src/app/services/members/member.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent {
  @Input() member: Member | undefined;
  @Input() ellementOffOnLists = false;

  constructor(private memberService: MemberService, private toastr: ToastrService) { }

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => this.toastr.success('You have liked ' + member.knownAs),
    })
  };
}
