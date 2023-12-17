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
        if(user) {
          localStorage.setItem('user', JSON.stringify(user));
          this.currentUserSource.next(user);
        }
      })
    )
  };

  setCurrentUser(user: User): void {
    this.currentUserSource.next(user);
  };

  logout(): void {
    localStorage.removeItem('user');
    this.currentUserSource.next(null);
  };
}
