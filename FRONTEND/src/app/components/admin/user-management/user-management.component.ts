import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { User } from 'src/app/interfaces/user';
import { AdminService } from 'src/app/services/admin/admin.service';
import { EditRolesDialogComponent } from '../edit-roles-dialog/edit-roles-dialog.component';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.scss'
})
export class UserManagementComponent implements OnInit {
  //tables
  dataSource = new MatTableDataSource<User>([]);
  displayedColumns: string[] = ['name', 'roles', 'actions'];
  backgroundColorHeader = '#3333339c';
  backgroundColorRow = '#222';

  constructor(private adminService: AdminService, public dialog: MatDialog) { }

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

  openDialog(user: any) {
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
}
