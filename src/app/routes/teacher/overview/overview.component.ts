import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/core/http/http.service';

interface TeacherOverview {
  courseCount: number;
  chapterCount: number;
  questionCount: number;
  examCount: number;
}

@Component({
  selector: 'app-teacher-overview',
  templateUrl: './overview.component.html',
})
export class TeacherOverviewComponent implements OnInit {
  constructor(private http: HttpService, public msg: NzMessageService, private router: Router) {}
  overview: TeacherOverview;

  ngOnInit(): void {
    this.http.getOverview().subscribe((res) => {
      this.overview = res;
    });
  }

  goTo(url): void {
    this.router.navigateByUrl(url);
  }
}
