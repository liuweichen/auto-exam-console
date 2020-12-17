import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { HttpService } from 'src/app/core/http/http.service';
import { Answer } from 'src/app/shared/model/Answer';

@Component({
  selector: 'app-teacher-add-questions-to-exam',
  templateUrl: './add2exam.component.html',
  styleUrls: ['./add2exam.component.less'],
})
export class TeacherAddQuestionToExamComponent implements OnInit {
  questionIdList;
  selectExam: any;
  examOptions = [];

  constructor(private modal: NzModalRef, private http: HttpService, public msg: NzMessageService, public router: Router) {}
  ngOnInit(): void {
    this.http.getExams().subscribe((res) => {
      this.examOptions = res.map((c) => {
        return {
          text: c.name,
          value: c.id,
        };
      });
    });
  }
  ok(): void {
    this.http.addQuestionsToExam(this.selectExam.value, this.questionIdList).subscribe(() => {
      this.msg.success('添加成功');
    });
    this.modal.destroy({ data: 'ok' });
  }

  cancle(): void {
    this.modal.destroy({ data: 'cancle data' });
  }
}
