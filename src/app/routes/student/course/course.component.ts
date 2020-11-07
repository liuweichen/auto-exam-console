import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/core/http/http.service';
import { Course } from 'src/app/shared/model/Course';

@Component({
  selector: 'app-student-course',
  templateUrl: './course.component.html',
})
export class StudentCourseComponent implements OnInit {
  constructor(private http: HttpService) {}
  listOfData: Course[] = [];

  ngOnInit(): void {
    this.http.studentGetCourses(1303).subscribe((courses) => {
      this.listOfData = courses;
    });
  }
}
