import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/core/http/http.service';

@Component({
  selector: 'app-sutdent-overview',
  templateUrl: './overview.component.html',
})
export class StudentOverviewComponent implements OnInit {
  constructor(private http: HttpService, public msg: NzMessageService, private router: Router) {}
  overview: any = {};

  ngOnInit(): void {
    this.http.studentGetOverview().subscribe((res) => {
      this.overview = res;
    });
  }

  goTo(url): void {
    this.router.navigateByUrl(url);
  }
}
