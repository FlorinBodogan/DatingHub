import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseURL = environment.baseURL;

  constructor(private http: HttpClient) { }

  getUsersWithRoles(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + 'admin/users-with-roles');
  };

  updateUserRoles(username: string, roles: string[]): Observable<string[]> {
    const rolesAsString = roles.join(',');

    return this.http.post<string[]>(`${this.baseURL}admin/edit-roles/${username}?roles=${rolesAsString}`, {});
  }
};
