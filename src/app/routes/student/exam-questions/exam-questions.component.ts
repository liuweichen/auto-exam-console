import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/core/http/http.service';

@Component({
  selector: 'app-student-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.less'],
})
export class StudentExamQuestionsComponent implements OnInit {
  constructor(
    public http: HttpService,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private location: Location,
  ) {}
  private examId: number;
  submitFlag = false;
  listOfData: any[] = [];
  question: any;
  questionIndex: number;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.examId = params.exam_id;
      this.refresh();
    });
  }
  lastQuestion(): void {
    if (this.questionIndex > 0) {
      this.questionIndex--;
      this.question = this.listOfData[this.questionIndex];
    } else {
      this.msg.error('已经是第一题');
    }
  }
  nextQuestion(): void {
    if (this.questionIndex < this.listOfData.length - 1) {
      this.questionIndex++;
      this.question = this.listOfData[this.questionIndex];
    } else {
      this.msg.error('已经是最后一题');
    }
  }
  getAllIndex(): number[] {
    return Array.from({ length: this.listOfData.length }, (_, i) => i + 1);
  }
  nextQuestionByIndex(index): void {
    this.questionIndex = index - 1;
    this.question = this.listOfData[this.questionIndex];
  }
  private refresh(): void {
    this.http.studentGetExamQuestions(this.examId).subscribe((res) => {
      res.forEach((q) => {
        q.rightAnster = q.answerList[q.answerList.findIndex((item) => item.isSelected)];
      });
      this.listOfData = res;
      if (this.listOfData.length == 0) {
        this.msg.error('空试卷，请选择其他试卷');
        this.location.back();
      }
      this.questionIndex = 0;
      this.question = this.listOfData[0];
    });
  }

  submit(): void {
    this.submitFlag = true;
  }
}
