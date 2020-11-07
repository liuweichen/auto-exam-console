import { Component, OnInit } from '@angular/core';
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
