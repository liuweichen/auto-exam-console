import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { SettingsService, User } from '@delon/theme';
import { HttpService } from 'src/app/core/http/http.service';

@Component({
  selector: 'app-teacher-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.less'],
})
export class TeacherSettingsComponent implements OnInit {
  constructor(private http: HttpService, private settings: SettingsService, private msg: NzMessageService) {}
  userLoading = false;
  user!: any;

  ngOnInit(): void {
    this.user = {
      name: this.settings.user.name,
      description: this.settings.user.description,
    };
  }
  save(): void {
    this.http.updateTeacher(this.user).subscribe(() => {
      this.msg.success('更新成功');
      this.user.password = '';
      this.user.newPassword = '';
      this.settings.user.name = this.user.name;
      this.settings.user.description = this.user.description;
    });
  }
}
