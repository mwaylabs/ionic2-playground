import {Injectable, Inject, EventEmitter} from 'angular2/core';
import {Http, Response, Headers, RequestOptions} from 'angular2/http';
import {Config} from 'ionic-angular';
import {LoginUser} from './../user/login-user';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

/*
  Generated class for the Login provider.
  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class LoginProvider {
  private url: string = '/gofer/security/rest/auth/login';
  private http: any = Http;
  private headers: Headers;
  private options: RequestOptions;
  public model: any = LoginUser;
  public userResponse: any = null;
  public afterLogin: any = new EventEmitter();

  constructor( http: Http, config: Config) {
    this.url = (config.get('serverUrl') + this.url);
    this.http = http;
    this.headers = new Headers({ 'Content-Type': 'application/json' });
    this.options = new RequestOptions({ headers: this.headers });
  }

  load(model: LoginUser) {
    this.model = model;
    if (this.userResponse) {
      // already loaded data
      return Promise.resolve(this.userResponse);
    }
    // don't have the data yet
    return new Promise(resolve => {
      this.http.post(this.url, JSON.stringify(this.model), this.options)
        .map(res => res.json())
        .subscribe(
        data => {
          this.userResponse = data;
          this.afterLogin.next([true, this.userResponse]);
          resolve(this.userResponse);
        },
        err => this.handleError
      );
    });
  }

  private handleError (error: Response) {
    // in a real world app, we may send the error to some remote logging infrastructure
    // instead of just logging it to the console
    console.error(error);
    this.afterLogin.next([false, error]);
    return Observable.throw(error.json().error || 'Server error');
  }
}

