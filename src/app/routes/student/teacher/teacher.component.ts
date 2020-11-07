import { Component, OnInit, ViewChild } from '@angular/core';
import { STColumn, STComponent } from '@delon/abc/st';
import { SFSchema } from '@delon/form';
import { ModalHelper, _HttpClient } from '@delon/theme';
import { HttpService } from 'src/app/core/http/http.service';
import { Teacher } from 'src/app/shared/model/Teacher';

@Component({
  selector: 'app-student-teacher',
  templateUrl: './teacher.component.html',
})
export class StudentTeacherComponent implements OnInit {
  constructor(private http: HttpService) {}
  listOfData: Teacher[] = [];

  ngOnInit(): void {
    this.http.studentGetTeachers().subscribe((res) => {
      this.listOfData = res;
    });
  }
}
