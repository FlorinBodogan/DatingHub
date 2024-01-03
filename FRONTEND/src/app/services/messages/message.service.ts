import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { getPaginatedResult, getPaginationHeaders } from '../helpers/paginationHelper';
import { Message } from 'src/app/interfaces/message';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseURL = environment.baseURL;

  httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({ "Content-Type": "application/json" }),
  };

  constructor(private http: HttpClient) { }

  getMessages(pageNumber: number, pageSize: number, container: string): Observable<any> {
    let params = getPaginationHeaders(pageNumber, pageSize);
    params = params.append('Container', container);
    return getPaginatedResult<Message[]>(this.baseURL + 'messages', params, this.http);
  };

  getMessageThread(username: string): Observable<any> {
    return this.http.get<Message[]>(this.baseURL + 'messages/thread/' + username, this.httpOptions);
  };

  sendMessage(username: string, content: string): Observable<Message> {
    return this.http.post<Message>(this.baseURL + 'messages', { recipientUsername: username, content });
  };

  deleteMessage(id: number): Observable<any> {
    return this.http.delete(this.baseURL + 'messages/' + id);
  };
}
