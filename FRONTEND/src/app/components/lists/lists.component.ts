import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/interfaces/member';
import { MemberService } from 'src/app/services/members/member.service';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit{
  members: Member[] | undefined;
  private currentTabIndex = 0;

  constructor(private memberService: MemberService) {}

  ngOnInit(): void {
    this.loadLikes("liked");
  };

  loadLikes(value: string) {
    this.memberService.getLikes(value).subscribe({
      next: response => {
        this.members = response
      }
    })
  };

  public onSelectedIndexChange(tabIndex: number): void {
    this.currentTabIndex = tabIndex;
    if(this.currentTabIndex === 0) {
      this.loadLikes("liked");
    } else if (this.currentTabIndex === 1) {
      this.loadLikes("likedBy");
    }
  };
}
