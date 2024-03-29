import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';
import { PresenceService } from '../presence/presence.service';
import { ConfirmEmail } from 'src/app/interfaces/confirmEmail';
import { ResetPassword } from 'src/app/interfaces/resetPassword';
import { RegisterUser } from 'src/app/interfaces/registerUser';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  baseURL = environment.baseURL;

  private currentUserSource = new BehaviorSubject<User | null>(null);
  currentUser$ = this.currentUserSource.asObservable();

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient, private presenceService: PresenceService) { }

  login(model: any): Observable<any> {
    return this.http.post<User>(`${this.baseURL}account/login`, model, this.httpOptions).pipe(
      map((response: User) => {
        const user = response
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  };

  register(model: RegisterUser): Observable<any> {
    return this.http.post<User>(this.baseURL + 'account/register', model, this.httpOptions);
  };

  setCurrentUser(user: User): void {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
    this.presenceService.createHubConnection(user);
  };

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
    this.presenceService.stopHubConnection();
  };

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  };

  confirmEmail(model: ConfirmEmail) {
    return this.http.put(`${this.baseURL}account/confirm-email`, model);
  };

  resendEmailConfirmationLink(email: string) {
    return this.http.post(`${this.baseURL}account/resend-email-confirmation-link/${email}`, {});
  };

  forgotUsernameOrPassword(email: string) {
    return this.http.post(`${this.baseURL}account/forgot-username-or-password/${email}`, {});
  };

  resetPassword(model: ResetPassword) {
    return this.http.put(`${this.baseURL}account/reset-password`, model);
  };
}
