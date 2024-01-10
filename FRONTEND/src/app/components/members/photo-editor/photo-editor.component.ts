import { HttpErrorResponse } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs';
import { Member } from 'src/app/interfaces/member';
import { Photo } from 'src/app/interfaces/photo';
import { DeletePhoto } from 'src/app/interfaces/updateMember';
import { User } from 'src/app/interfaces/user';
import { AccountService } from 'src/app/services/account/account.service';
import { AdminService } from 'src/app/services/admin/admin.service';
import { MemberService } from 'src/app/services/members/member.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrl: './photo-editor.component.scss'
})
export class PhotoEditorComponent implements OnInit {
  @Input() member: Member | undefined;
  @Input() showUploader = true;
  uploader: FileUploader | undefined;
  hasBaseDropZoneOver = false;
  baseURL = environment.baseURL;
  user: User | undefined;

  constructor(
    private accountService: AccountService,
    private memberService: MemberService,
    private adminService: AdminService,
    private toastr: ToastrService) {
    accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) this.user = user;
      }
    })
  }

  ngOnInit(): void {
    this.initializeUploader();
  };

  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  };

  deletePhoto(photoId: number): void {
    this.memberService.deletePhoto(photoId).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(x => x.id !== photoId);
        }
      }
    })
  };

  deletePhotoAdmin(photoId: number): void {
    const model = {
      photoId: photoId,
      username: this.member?.userName
    } as DeletePhoto;

    this.adminService.deletePhoto(photoId, model).subscribe({
      next: () => {
        if (this.member) {
          this.member.photos = this.member.photos.filter(x => x.id !== photoId);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.toastr.error(err.error.message);
      }
    })
  };

  setMainPhoto(photo: Photo) {
    this.memberService.setMainPhoto(photo.id).subscribe({
      next: () => {
        if (this.user && this.member) {
          this.user.photo = photo.url;
          this.accountService.setCurrentUser(this.user);
          this.member.photoUrl = photo.url;
          this.member.photos.forEach(p => {
            if (p.isMain) p.isMain = false;
            if (p.id === photo.id) p.isMain = true;
          })
        }
      }
    })
  };

  initializeUploader(): void {
    this.uploader = new FileUploader({
      url: this.baseURL + 'users/add-photo',
      authToken: 'Bearer ' + this.user?.token,
      isHTML5: true,
      allowedFileType: ['image'],
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.uploader.onAfterAddingFile = (file) => {
      file.withCredentials = false
    }

    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        const photo = JSON.parse(response);
        this.member?.photos.push(photo);
        if (photo.isMain && this.user && this.member) {
          this.user.photo = photo.url;
          this.member.photoUrl = photo.url;
          this.accountService.setCurrentUser(this.user);
        }
      }
    }
  };
}
