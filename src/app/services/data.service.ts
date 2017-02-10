import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Auth } from './auth.service';
import { AuthHttp } from 'angular2-jwt';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class DataService {

  constructor(private http: Http, private authHttp: AuthHttp) { }

  getFiles(): Observable<any> {
    return this.authHttp.get('/pdfs').map(res => res.json());
  }

  uploadFile(files): Observable<any> {
    return Observable.create((observer) => {
      const formData = new FormData();
      const xhr = new XMLHttpRequest();
      formData.append('upload', files[0], files[0].name);
      xhr.onreadystatechange = function () {
          if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                observer.complete();
              } else {
                observer.error(xhr.response);
              }
          }
      };
      xhr.open('POST', '/pdf/upload', true);
      xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('id_token'));
      xhr.send(formData);
    });
  }

  // downloadFile(id): Observable<any> {
  //   const options = new RequestOptions(new Headers({ responseType: 'arraybuffer' }));
  //   return this.authHttp.get('/pdf/download/' + id, options);
  // }

  downloadFile(id) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/pdf/download/' + id, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + localStorage.getItem('id_token'));
    xhr.responseType = 'arraybuffer';
    xhr.onload = function(e) {
      if (xhr.status === 200) {
          const blob = new Blob([xhr.response], {type: 'application/pdf'});
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = 'Report_' + new Date() + '.pdf';
          link.click();
      }
    };
    xhr.send();
  }
}
