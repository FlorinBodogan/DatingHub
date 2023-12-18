import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { GalleryItem, GalleryModule, ImageItem } from 'ng-gallery';
import { Member } from 'src/app/interfaces/member';
import { MemberService } from 'src/app/services/members/member.service';

@Component({
  selector: 'app-member-details',
  standalone: true,
  templateUrl: './member-details.component.html',
  styleUrls: ['./member-details.component.scss'],
  imports: [
    CommonModule,
    RouterLink,
    MatTabsModule,
    GalleryModule
  ]
})
export class MemberDetailsComponent implements OnInit{
  member: Member | undefined;
  images: GalleryItem[] =[];

  constructor(private memberService: MemberService, private route: ActivatedRoute) {}

  ngOnInit(): void {
      this.loadMember();
  };

  loadMember(): void {
    const username = this.route.snapshot.paramMap.get('username')
    if(!username) return;
    this.memberService.getMember(username).subscribe({
      next: member => {
        this.member = member
        this.getImages();
      }
    })
  };

  getImages(): void {
    if(!this.member) return;
    for (const photo of this.member?.photos) {
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}));
      this.images.push(new ImageItem({src: photo.url, thumb: photo.url}));
    }
  };
}
