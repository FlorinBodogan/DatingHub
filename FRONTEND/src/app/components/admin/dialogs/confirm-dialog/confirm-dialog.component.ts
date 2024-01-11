import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {
  constructor(
    private adminService: AdminService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>
  ) { }

  deleteMember(userId: any, username: string): void {
    const userName = {
      username: username
    } as {};

    this.adminService.deleteUser(userId, userName).subscribe({
      next: () => {
        this.toastr.success("User deleted succesfully!")
        this.dialogRef.close('success')
      }
    })
  };
}
