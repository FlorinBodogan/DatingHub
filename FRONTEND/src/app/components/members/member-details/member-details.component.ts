import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/interfaces/member';
import { MemberService } from 'src/app/services/members/member.service';

@Component({
  selector: 'app-member-details',
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
})
export class MemberDetailsComponent implements OnInit{
  member: Member | undefined;

  constructor(private memberService: MemberService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      this.loadMember();
  };

  loadMember(): void {
    const username = this.route.snapshot.paramMap.get('username')
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => this.member = member
    })
  };
}
