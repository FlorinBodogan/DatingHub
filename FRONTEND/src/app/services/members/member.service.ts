import { HttpClient, HttpHandler, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Member } from 'src/app/interfaces/member';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  baseURL = environment.baseURL;
  members: Member[] = [];

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient) { }

  getMembers(): Observable<Member[]> {
    if(this.members.length > 0) return of(this.members);
    return this.http.get<Member[]>(`${this.baseURL}users`, this.httpOptions).pipe(
      map(members => {
        this.members = members;
        return members;
      })
    )
  };

  getMember(username: string): Observable<Member> {
    const member = this.members.find(x => x.userName === username);
    if (member) return of(member);
    return this.http.get<Member>(`${this.baseURL}users/${username}`, this.httpOptions);
  };

  updateMember(member: Member) {
    return this.http.put(this.baseURL + 'users', member, this.httpOptions).pipe(
      map(() => {
        const index = this.members.indexOf(member);
        this.members[index] = {...this.members[index], ...member};
      })
    )
  }
}