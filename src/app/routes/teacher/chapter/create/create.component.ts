import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { HttpService } from 'src/app/core/http/http.service';

@Component({
  selector: 'app-teacher-create-chapter',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less'],
})
export class TeacherCreateChapterComponent implements OnInit {
  courseId: number;
  name: string;
  description: string;

  constructor(private modal: NzModalRef, private http: HttpService, public msg: NzMessageService) {}
  ngOnInit(): void {}

  ok(): void {
    this.http
      .createChapter({
        courseId: this.courseId,
        name: this.name,
        description: this.description,
      })
      .subscribe(() => {
        this.msg.success('创建成功');
      });
    this.modal.destroy({ data: 'ok data' });
  }
  cancle(): void {
    this.modal.destroy({ data: 'cancle data' });
  }
}
