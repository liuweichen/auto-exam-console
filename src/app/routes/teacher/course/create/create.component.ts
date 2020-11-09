import { Component, Input, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzModalRef } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-teacher-create-course',
  templateUrl: './create.component.html',
})
export class TeacherCreateCourseComponent implements OnInit {
  @Input() title?: string;
  @Input() subtitle?: string;

  constructor(private modal: NzModalRef) {}
  ngOnInit(): void {}

  destroyModal(): void {
    this.modal.destroy({ data: 'this the result data' });
  }
}
