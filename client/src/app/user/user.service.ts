import { Injectable } from '@angular/core';
import { Http, Response, RequestOptionsArgs, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export interface Task {
  text: string;
  type: string;
}

export interface User {
  email: string;
  pass: string;
  tasks: Task[];
}

export interface UserRes {
  success: boolean;
  err?: any;
  data?: User;
}

export interface TokenRes extends UserRes {
  token?: string;
}

@Injectable()
export class UserService {
  private http: Http;
  private token: string;
  user: User;
  
  constructor(http: Http) {
    console.log('userService constructor');
    this.http = http;
    let token = localStorage.getItem('__jwt_token');
    if (token) {
      // if (this.checkToken(token)) {
      //   this.token = token;
      //   this.user = <User>jwt.decode(token);
      // } else {
      //   localStorage.removeItem('__jwt_token');
      // }
      this.refreshToken(token);
    }
  }
  
  register(email: string, pass: string): Observable<UserRes> {
    return this.http.post("/api/user", JSON.stringify({ email, pass })).map(this.extractData);
  }
  
  login(email: string, pass: string): Observable<TokenRes> {
    let res = this.http.post("/api/auth", JSON.stringify({ email, pass }))
      .map(this.extractData).map((obj: TokenRes) => {
        if (obj.success) {
          this.token = obj.token;
          localStorage.setItem('__jwt_token', this.token);
          this.user = obj.data;
        }
        return obj;
      });
    return res;
  }
  
  refreshToken(token: string): void {
    // TODO: Implement refresh.
  }
  
  getUser(): Observable<UserRes> {
    let headers = this.getAuthHeaders();
    if (!headers) return null;
    return this.http.get('/api/user', { headers }).map(this.extractData);
  }
  
  newTask(task: Task): Observable<UserRes> {
    let headers = this.getAuthHeaders();
    if (!headers) return null;
    return this.http
      .post('/api/user/tasks', JSON.stringify(task), { headers })
      .map(this.extractData);
  }
  
  private getAuthHeaders(): Headers {
    if (!this.token) return null;
    // if (!this.checkToken()) return null;
    return new Headers({ 'X-Access-Token': this.token });
  }
  
  private extractData(res: Response) {
    let body = res.json();
    return body || {};
  }
  
  get loggedIn(): boolean {
    if (!this.token || !this.user) {
      return false;
    }
    return true;
  }
}