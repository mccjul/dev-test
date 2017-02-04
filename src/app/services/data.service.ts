import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Auth } from './auth.service';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  private headers = new Headers({ 'Content-Type': null });
  private options = new RequestOptions({ headers: this.headers });

  constructor(private http: Http, private authHttp: AuthHttp) { }

  getFiles(): Observable<any> {
    return this.authHttp.get('/pdfs').map(res => res.json());
  }

  uploadFile(files) {
    return new Promise((resolve, reject) => {
            const formData: any = new FormData();
            const xhr = new XMLHttpRequest();
            formData.append('upload', files[0], files[0].name);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                      resolve(JSON.parse(xhr.response));
                    } else {
                      reject(xhr.response);
                    }
                }
            };
            xhr.open('POST', '/pdf/upload', true);
            xhr.send(formData);
        });
  }

  downloadFile(id): Observable<any> {
    return this.authHttp.get('/pdf/download/' + id);
  }
}
