import { Component } from '@angular/core';
import { Member } from 'src/app/interfaces/member';
import { Pagination } from 'src/app/interfaces/pagination';
import { User } from 'src/app/interfaces/user';
import { UserParams } from 'src/app/interfaces/userParams';
import { MemberService } from 'src/app/services/members/member.service';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.scss']
})
export class MemberListComponent {
  members: Member[] = [];
  pagination: Pagination | undefined;
  userParams: UserParams | undefined;
  user: User | undefined;
  genderList = [{value: 'male', display: 'Males'}, {value:'female', display: 'Females'}];

  constructor(private memberService: MemberService) {
    this.userParams = this.memberService.getUserParams();
  }

  ngOnInit(): void {
    this.loadMembers();
  };

  loadMembers() {
    if (this.userParams) {
      this.memberService.setUserParams(this.userParams);
      this.memberService.getMembers(this.userParams).subscribe({
        next: (response) => {
          if (response.result && response.pagination) {
            this.members = response.result;
            this.pagination = response.pagination;
          }
        }
      })
    }
  };

  onPageChange(event: any) {
    if (!this.userParams) return;
    this.userParams.pageNumber = event.pageIndex + 1;
    this.userParams.pageSize = event.pageSize;
    this.loadMembers();
  };

  applyFilters(): void {
    if (this.userParams) {
      this.pagination = undefined; 
      this.userParams.pageNumber = 1;
      this.loadMembers();
    }
  };

  resetFilters(): void {
    this.userParams = this.memberService.resetUserParams();
    this.loadMembers();
  };
}
