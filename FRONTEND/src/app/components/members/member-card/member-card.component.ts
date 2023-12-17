import { Component, Input } from '@angular/core';
import { Member } from 'src/app/interfaces/member';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.scss']
})
export class MemberCardComponent {
  @Input() member: Member | undefined;
}
