import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { updateUserDetails, updateUserInfo } from 'src/app/interfaces/updateMember';
import { AccountService } from 'src/app/services/account/account.service';
import { AdminService } from 'src/app/services/admin/admin.service';
import { MemberService } from 'src/app/services/members/member.service';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.scss'
})
export class EditUserComponent implements OnInit {
  username: any;
  member: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<EditUserComponent>,
    private memberService: MemberService,
    private adminService: AdminService,
    private toastr: ToastrService
  ) {
    this.username = data.member.userName;
  }

  ngOnInit(): void {
    this.loadMember();
  };

  loadMember(): void {
    if (!this.username) return;
    this.memberService.getMember(this.username).subscribe({
      next: member => this.member = member
    })
  };

  updateUserInfo(): void {
    if (!this.username) return;

    const model = {
      username: this.member.userName,
      email: this.member.email,
      knownAs: this.member.knownAs
    } as updateUserInfo;

    this.adminService.updateUserInfo(this.username, model).subscribe({
      next: response => {
        this.toastr.success(response.message),
          this.dialogRef.close('success')
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.error.message, 'Error');
      }
    });
  };

  updateUserDetails(): void {
    if (!this.username) return;

    const model = {
      introduction: this.member.introduction,
      lookingFor: this.member.lookingFor,
      interests: this.member.interests,
      country: this.member.country,
      city: this.member.city
    } as updateUserDetails;

    this.adminService.updateUserDetails(this.username, model).subscribe({
      next: response => {
        this.toastr.success(response.message),
          this.dialogRef.close('success')
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.error.message);
      }
    });
  };
}
