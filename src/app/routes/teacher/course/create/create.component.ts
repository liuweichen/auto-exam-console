import { Component, Input, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { HttpService } from 'src/app/core/http/http.service';

@Component({
  selector: 'app-teacher-create-course',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less'],
})
export class TeacherCreateCourseComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(private modal: NzModalRef, private http: HttpService, public msg: NzMessageService, private fb: FormBuilder) {}
  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required, Validators.pattern('^.{3,128}$')]],
      description: [null, [Validators.pattern('^.{0,512}$')]],
    });
  }

  ok(): void {
    for (const i in this.validateForm.controls) {
      this.validateForm.controls[i].markAsDirty();
      this.validateForm.controls[i].updateValueAndValidity();
      if (this.validateForm.controls[i].invalid) {
        return;
      }
    }
    this.http
      .createCourse({
        name: this.validateForm.controls.name.value,
        description: this.validateForm.controls.description.value,
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
