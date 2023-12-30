import { HttpClient, HttpHandler, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of, take } from 'rxjs';
import { Member } from 'src/app/interfaces/member';
import { PaginatedResult } from 'src/app/interfaces/pagination';
import { UserParams } from 'src/app/interfaces/userParams';
import { environment } from 'src/environments/environment';
import { AccountService } from '../account/account.service';
import { User } from 'src/app/interfaces/user';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseURL = environment.baseURL;
  members: Member[] = [];
  memberCache = new Map();
  user: User | undefined;
  userParams: UserParams | undefined;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient, private accountService: AccountService) { 
    this.accountService.currentUser$.pipe(take(1)).subscribe({
      next: user => {
        if (user) {
          this.userParams = new UserParams(user);
          this.user = user;
        }
      }
    })
  }

  getUserParams() {
    return this.userParams;
  };

  setUserParams(params: UserParams) {
    return this.userParams = params;
  };

  resetUserParams() {
    if (this.user) {
      this.userParams = new UserParams(this.user)
      return this.userParams;
    }
    
    return;
  };

  getMembers(userParams: UserParams) {
    const response = this.memberCache.get(Object.values(userParams).join('-'));

    if (response) return of(response);

    let params = this.getPaginationHeaders(userParams.pageNumber, userParams.pageSize);

    params = params.append('minAge', userParams.minAge);
    params = params.append('maxAge', userParams.maxAge);
    params = params.append('gender', userParams.gender);
    params = params.append('orderBy', userParams.orderBy);

    return this.getPaginatedResult<Member[]>(`${this.baseURL}users`, params).pipe(
      map(response => {
        this.memberCache.set(Object.values(userParams).join('-'), response);
        return response;
      })
    )
  };

  private getPaginatedResult<T>(url: string, params: HttpParams) {
    const paginatedResult: PaginatedResult<T> = new PaginatedResult<T>;
    return this.http.get<T>(url, { observe: 'response', params }).pipe(
      map(response => {
        if (response.body) {
          paginatedResult.result = response.body;
        }

        const pagination = response.headers.get('Pagination');
        if (pagination) {
          paginatedResult.pagination = JSON.parse(pagination);
        }

        return paginatedResult;
      })
    );
  };

  getPaginationHeaders(pageNumber: number, pageSize: number) {
    let params = new HttpParams();

    params = params.append('pageNumber', pageNumber);
    params = params.append('pageSize', pageSize);
    
    return params;
  };

  getMember(username: string): Observable<Member> {
    const member = [...this.memberCache.values()]
    .reduce((arr, elem) => arr.concat(elem.result), [])
    .find((member: Member) => member.userName === username);

    if (member) return of(member);

    return this.http.get<Member>(`${this.baseURL}users/${username}`, this.httpOptions);
  };

  updateMember(member: Member): Observable<any> {
    return this.http.put(this.baseURL + 'users', member, this.httpOptions).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member};
      })
    )
  };

  setMainPhoto(photoId: number): Observable<any> {
    return this.http.put(this.baseURL + 'users/set-main-photo/' + photoId, {});
  };

  deletePhoto(photoId: number): Observable<any> {
    return this.http.delete(this.baseURL + 'users/delete-photo/' + photoId);
  };
}