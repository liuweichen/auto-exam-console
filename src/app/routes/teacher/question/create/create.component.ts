import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { HttpService } from 'src/app/core/http/http.service';
import { Answer } from 'src/app/shared/model/Answer';

@Component({
  selector: 'app-teacher-create-question',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less'],
})
export class TeacherCreateQuestionComponent implements OnInit {
  questionId: number;
  radioValue = null;
  type: number;
  content: string;
  explanation: string;
  chapterId: number;
  answerList: any[] = [{}, {}, {}, {}];

  constructor(private modal: NzModalRef, private http: HttpService, public msg: NzMessageService, public router: Router) {}
  ngOnInit(): void {}
  ok(): void {
    this.answerList = this.answerList.map((val, idx) => {
      return {
        content: val.content,
        isSelected: idx === this.radioValue,
      };
    });
    if (this.questionId) {
      this.http.updateQuestion(this.questionId, this.getHttpJson()).subscribe(() => {
        this.msg.success('修改成功');
      });
    } else {
      this.http.createQuestion(this.getHttpJson()).subscribe(() => {
        this.msg.success('创建成功');
      });
    }
    this.modal.destroy({ data: 'ok' });
  }
  private getHttpJson(): any {
    return {
      type: this.type,
      content: this.content,
      explanation: this.explanation,
      chapterId: this.chapterId,
      answerList: this.answerList,
    };
  }
  cancle(): void {
    this.modal.destroy({ data: 'cancle data' });
  }
  removeInput(item: Answer): void {
    const i = this.answerList.indexOf(item);
    this.answerList.splice(i, 1);
  }
  removeLastInput(): void {
    const i = this.answerList.length - 1;
    this.answerList.splice(i, 1);
  }
  addInput(): void {
    this.answerList.push({});
  }
}
