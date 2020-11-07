import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { HttpService } from 'src/app/core/http/http.service';
import { Chapter } from 'src/app/shared/model/Chapter';
import { Course } from 'src/app/shared/model/Course';

@Component({
  selector: 'app-student-chapter',
  templateUrl: './chapter.component.html',
})
export class StudentChapterComponent implements OnInit {
  constructor(private http: HttpService) {}
  listOfData: Chapter[] = [];

  ngOnInit(): void {
    this.http.studentGetChapters(1151).subscribe((res) => {
      this.listOfData = res;
    });
  }
}
