import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../interfaces/user';
import { DeletePhoto, updateUserDetails, updateUserInfo } from 'src/app/interfaces/updateMember';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  baseURL = environment.baseURL;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient) { }

  getUsersWithRoles(): Observable<User[]> {
    return this.http.get<User[]>(this.baseURL + 'admin/users-with-roles', this.httpOptions);
  };

  updateUserRoles(username: string, roles: string[]): Observable<string[]> {
    const rolesAsString = roles.join(',');

    return this.http.post<string[]>(`${this.baseURL}admin/edit-roles/${username}?roles=${rolesAsString}`, this.httpOptions);
  };

  updateUserInfo(username: string, model: updateUserInfo): Observable<any> {
    return this.http.put(this.baseURL + 'admin/edit-member-info/' + username, model, this.httpOptions);
  };

  updateUserDetails(username: string, model: updateUserDetails): Observable<any> {
    return this.http.put(this.baseURL + 'admin/edit-member-details/' + username, model, this.httpOptions);
  };

  lockUser(usernId: number, userName: {}): Observable<any> {
    return this.http.put(this.baseURL + 'admin/lock-member/' + usernId, userName, this.httpOptions);
  };

  unlockUser(usernId: number, userName: {}): Observable<any> {
    return this.http.put(this.baseURL + 'admin/unlock-member/' + usernId, userName, this.httpOptions);
  };

  deleteUser(userId: number, username: {}): Observable<any> {
    const url = `${this.baseURL}admin/delete-member/${userId}`;
    const options = { body: username };
    return this.http.delete(url, options);
  };

  deletePhoto(photoId: number, model: DeletePhoto): Observable<any> {
    const url = `${this.baseURL}admin/delete-photo/${photoId}`;
    const options = { body: model };
    return this.http.delete(url, options);
  };

  getUsers7days(): Observable<any> {
    return this.http.get(this.baseURL + 'admin/allUsers7days', this.httpOptions);
  };
  getUsers30days(): Observable<any> {
    return this.http.get(this.baseURL + 'admin/allUsers30days', this.httpOptions);
  };
  getUsers365days(): Observable<any> {
    return this.http.get(this.baseURL + 'admin/allUsers365days', this.httpOptions);
  };

  getNumberOfMatchesLastWeek(): Observable<any> {
    return this.http.get(this.baseURL + 'admin/matches-last-week', this.httpOptions);
  };

  getNumberOfMatchesLastMonth(): Observable<any> {
    return this.http.get(this.baseURL + 'admin/matches-last-month', this.httpOptions);
  };

  getNumberOfMatchesLastYear(): Observable<any> {
    return this.http.get(this.baseURL + 'admin/matches-last-year', this.httpOptions);
  };

  getNumberOfMessagesLastWeek(): Observable<any> {
    return this.http.get(this.baseURL + 'admin/messages-last-week', this.httpOptions);
  };
  getNumberOfMessagesLastMonth(): Observable<any> {
    return this.http.get(this.baseURL + 'admin/messages-last-month', this.httpOptions);
  };
  getNumberOfMessagesLastYear(): Observable<any> {
    return this.http.get(this.baseURL + 'admin/messages-last-year', this.httpOptions);
  };
};
