import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AdminService } from 'src/app/services/admin/admin.service';

@Component({
  selector: 'app-edit-roles-dialog',
  templateUrl: './edit-roles-dialog.component.html',
  styleUrl: './edit-roles-dialog.component.scss'
})
export class EditRolesDialogComponent implements OnInit {
  rolesForm!: FormGroup;

  username = '';
  availableRoles: string[] = ['Admin', 'Moderator', 'Member'];
  selectedRoles: string[] = [];
  roles = new FormControl('');

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private adminService: AdminService,
    private dialogRef: MatDialogRef<EditRolesDialogComponent>
  ) { }

  ngOnInit(): void {
    this.createForm();
  };

  createForm(): void {
    const initialValues = {
      roles: this.data.member.roles || [],
    };

    this.rolesForm = this.fb.group({
      roles: [initialValues.roles, Validators.required],
    });
  }

  onSubmit(): void {
    if (this.rolesForm.valid) {
      this.adminService.updateUserRoles(this.data.member.userName, this.rolesForm.value.roles).subscribe({
        next: () => this.dialogRef.close('success')
      })
    }
  };
}
