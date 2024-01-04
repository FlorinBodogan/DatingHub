import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User } from 'src/app/interfaces/user';
import { environment } from 'src/environments/environment';

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

  constructor(private http: HttpClient) { }

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

  register(model: any) {
    return this.http.post<User>(this.baseURL + 'account/register', model, this.httpOptions).pipe(
      map(user => {
        if (user) {
          this.setCurrentUser(user);
        }
      })
    )
  };

  setCurrentUser(user: User): void {
    user.roles = [];
    const roles = this.getDecodedToken(user.token).role;
    Array.isArray(roles) ? user.roles = roles : user.roles.push(roles);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSource.next(user);
  };

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  };

  getDecodedToken(token: string) {
    return JSON.parse(atob(token.split('.')[1]));
  };
}
