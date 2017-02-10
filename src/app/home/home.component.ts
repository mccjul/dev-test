import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';

import { ToastComponent } from '../shared/toast/toast.component';

import { DataService } from '../services/data.service';
import { Auth } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoading = true;
  files = [];
  filePresent = false;
  fileToUpload;

  constructor(private http: Http,
              private dataService: DataService,
              public toast: ToastComponent,
              private formBuilder: FormBuilder,
              private auth: Auth) { }

  ngOnInit() {
    this.getFiles();
  }

  getFiles() {
    this.dataService.getFiles().subscribe(
      data => this.files = data,
      error => console.log(error),
      () => this.isLoading = false
    );
  }

  UploadFile() {
    this.dataService.uploadFile(this.fileToUpload).subscribe(
      error => console.log(error),
      () => {
        this.toast.setMessage('item uploaded successfully.', 'success');
        this.getFiles();
      }
    );
  }

  download(id) {
    this.dataService.downloadFile(id);
  }

  onChange(fileInput: any) {
    this.filePresent = true;
    this.fileToUpload = fileInput.target.files;
  }
}
