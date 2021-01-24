import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SettingsService } from '@delon/theme';
import { HttpService } from 'src/app/core/http/http.service';

@Component({
  selector: 'app-student-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class StudentSettingsComponent implements OnInit {
  constructor(private http: HttpService, private settings: SettingsService, private msg: NzMessageService) {}
  userLoading = false;
  user!: any;

  ngOnInit(): void {
    this.user = {
      name: this.settings.user.name,
      description: this.settings.user.description,
    };
  }
  save(): void {}
}
