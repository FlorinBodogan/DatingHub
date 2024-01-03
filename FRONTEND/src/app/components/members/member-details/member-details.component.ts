import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { Member } from 'src/app/interfaces/member';
import { MemberService } from 'src/app/services/members/member.service';
import { MemberMessagesComponent } from '../member-messages/member-messages.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-member-details',
  standalone: true,
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    MatTabsModule,
    GalleryModule,
    MemberMessagesComponent
  ]
})
export class MemberDetailsComponent implements OnInit {
  member: Member | undefined;
  images: GalleryItem[] = [];
  selectedTab = '';
  selectedTabIndex = 0;

  constructor(private memberService: MemberService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadMember();
    this.queryParams();
    this.selectedMessageTab();
  };

  queryParams(): void {
    this.route.queryParams.subscribe({
      next: params => {
        this.selectedTab = params['tab']
      }
    })
  };

  loadMember(): void {
    const username = this.route.snapshot.paramMap.get('username')
    if (!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member
        this.getImages();
      }
    })
  };

  getImages(): void {
    if (!this.member) return;
    for (const photo of this.member?.photos) {
      this.images.push(new ImageItem({ src: photo.url, thumb: photo.url }));
    }
  };

  addLike(member: Member) {
    this.memberService.addLike(member.userName).subscribe({
      next: () => this.toastr.success('You have liked ' + member.knownAs),
    })
  };

  selectedMessageTab(): void {
    if (this.selectedTab === 'Messages') {
      this.selectedTabIndex = 3;
    }
  };

  switchToMessageTab(): void {
    this.selectedTabIndex = 3;
  }
}
