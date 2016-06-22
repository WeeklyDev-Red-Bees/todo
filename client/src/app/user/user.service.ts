import { Injectable } from '@angular/core';
import { Http, Response, RequestOptions, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';

export interface Task {
  text: string;
  type: string;
  completed: boolean;
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
    let opts = this.getAuthHeaders(true, false);
    let body = JSON.stringify({ email, pass });
    console.log('opts:', opts);
    console.log('body:', body);
    return this.http.post("/api/user", body, opts).map(this.extractData);
  }
  
  private _login(email: string, pass: string): Observable<TokenRes> {
    let opts = this.getAuthHeaders(true, false);
    let body = JSON.stringify({ email, pass });
    console.log('opts:', opts);
    console.log('body:', body);
    let res = this.http.post("/api/auth", body, opts)
      .map(this.extractData);
      // .map((obj: TokenRes) => {
      //   if (obj.success) {
      //     return obj.data;
      //   }
      //   return null;
      // });
    res.subscribe((obj: TokenRes) => {
      console.log('_login:', obj);
      if (obj.success) {
        this.token = obj.token;
        localStorage.setItem('__jwt_token', this.token);
        this.user = obj.data;
      }
    });
    
    return res;
  }
  
  login(email: string, pass: string): Observable<User> {
    return this._login(email, pass).map((obj: TokenRes) => {
      console.log('login:', obj);
      if (obj.success) {
        return obj.data;
      }
      return null;
    });
  }
  
  private refreshToken(token: string): void {
    let opts = this.getAuthHeaders(true, false);
    let body = JSON.stringify({ token });
    console.log('opts:', opts);
    console.log('body:', body);
    this.http.post("/api/auth/refresh", body, opts)
      .map(this.extractData).subscribe((obj: TokenRes) => {
        if (obj.success) {
          this.token = obj.token;
          localStorage.setItem('__jwt_token', this.token);
          this.user = obj.data;
        }
      });
  }
  
  getUser(): Observable<UserRes> {
    let opts = this.getAuthHeaders(false, true);
    if (!opts) return null;
    return this.http.get('/api/user', opts).map(this.extractData);
  }
  
  newTask(task: Task): Observable<UserRes> {
    let opts = this.getAuthHeaders(true, true);
    if (!opts) return null;
    return this.http
      .post('/api/user/tasks', JSON.stringify(task), opts)
      .map(this.extractData);
  }
  
  private getAuthHeaders(json: boolean = true, token: boolean = false): RequestOptions {
    // if (!this.token) return null;
    // if (!this.checkToken()) return null;
    // return new Headers({ 'X-Access-Token': this.token });
    let headerObj = {};
    if (json) headerObj['Content-Type'] = 'application/json';
    // if (token) headerObj['X-Access-Token'] = this.token;
    if (token) {
      if (!this.token) return null;
      headerObj['X-Access-Token'] = this.token;
    }
    
    let headers = new Headers(headerObj);
    return new RequestOptions({ headers });
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