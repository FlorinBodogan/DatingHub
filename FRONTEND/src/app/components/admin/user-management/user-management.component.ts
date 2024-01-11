import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/interfaces/user';
import { AdminService } from 'src/app/services/admin/admin.service';
import { EditRolesDialogComponent } from '../dialogs/edit-roles-dialog/edit-roles-dialog.component';
import { EditUserComponent } from '../dialogs/edit-user/edit-user.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../dialogs/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  //tables
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['name', 'knownAs', 'email', 'roles', 'actions'];
  backgroundColorHeader = '#3333339c';
  backgroundColorRow = '#222';

  constructor(private adminService: AdminService, public dialog: MatDialog, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getUsersWithRoles();
  };

  getUsersWithRoles(): void {
    this.adminService.getUsersWithRoles().subscribe({
      next: users => {
        this.dataSource.data = users
      }
    })
  };

  lockMember(userId: number, username: string): void {
    const userName = {
      username: username
    } as {};

    this.adminService.lockUser(userId, userName).subscribe({
      next: () => {
        this.toastr.success("User banned succesfully!")
        this.getUsersWithRoles();
      },
      error: (error) => {
        this.toastr.error(error.error);
      }
    })
  };

  unlockMember(userId: number, username: string): void {
    const userName = {
      username: username
    } as {};

    this.adminService.unlockUser(userId, userName).subscribe({
      next: () => {
        this.toastr.success("User unbanned succesfully!")
        this.getUsersWithRoles();
      },
      error: (error) => {
        this.toastr.error(error.error)
      }
    })
  };



  openDialogRoles(user: any) {
    const dialogRef = this.dialog.open(EditRolesDialogComponent, {
      data: {
        member: {
          userName: user.userName,
          roles: user.roles
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.getUsersWithRoles();
      }
    });
  };

  openDialogUsers(user: any) {
    const dialogRef = this.dialog.open(EditUserComponent, {
      data: {
        member: {
          userName: user.userName,
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.getUsersWithRoles();
      }
    });
  };

  openConfirmDialog(userId: number, username: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        member: {
          userName: username,
          userId: userId
        }
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.getUsersWithRoles();
      }
    });
  };
}
