import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Answer } from 'src/app/shared/model/Answer';

@Component({
  selector: 'app-teacher-exam-question-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.less'],
})
export class TeacherExamQuestionPreviewComponent implements OnInit {
  questionId: number;
  type: number;
  content: string;
  explanation: string;
  chapterId: number;
  answerList: Answer[];
  imageUrl: string;
  constructor(private modal: NzModalRef, public msg: NzMessageService, public router: Router) {}
  ngOnInit(): void {}
  cancle(): void {
    this.modal.destroy({ data: 'cancle data' });
  }
}
