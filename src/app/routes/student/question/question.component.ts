import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/core/http/http.service';
import { Question } from 'src/app/shared/model/Question';

interface Answer {
  id: number;
  content: string;
  isSelected: boolean;
  questionId: number;
  userSelected: boolean;
}

@Component({
  selector: 'app-student-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
})
export class StudentQuestionComponent implements OnInit {
  constructor(
    public http: HttpService,
    private activatedRoute: ActivatedRoute,
    private msg: NzMessageService,
    private location: Location,
  ) {}
  private courseId: number;
  private chapterId: number;
  private currentPage = 1;
  private pageSize = 10;
  questionIndex: number;
  totalElements: number;
  question: any = {};
  showRightAnswer = false;
  answerList: Answer[];
  radioValue: number;
  listOfData: Question[] = [];
  autoNext = true;
  rightCount = 0;
  falseCount = 0;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.chapterId = params.chapter_id;
      this.courseId = params.course_id;
      this.refresh(0);
    });
  }

  selectAnswer(answer: Answer): void {
    if (this.showRightAnswer) {
      return;
    }
    setTimeout(() => {
      if (answer.isSelected) {
        this.rightCount++;
      } else {
        this.falseCount++;
        this.msg.error('答案错误');
      }
      if (answer.isSelected && this.autoNext) {
        this.nextQuestion();
      } else {
        this.showRightAnswer = true;
      }
    }, 500);
  }

  selectMutilAnswer(): void {
    setTimeout(() => {
      const isRight = this.answerList.filter((a) => (a.userSelected || a.isSelected) && a.isSelected !== a.userSelected).length === 0;
      if (isRight) {
        this.rightCount++;
      } else {
        this.falseCount++;
        this.msg.error('答案错误');
      }
      if (isRight && this.autoNext) {
        this.nextQuestion();
      } else {
        this.showRightAnswer = true;
      }
    }, 500);
  }

  lastQuestion(): void {
    if (this.questionIndex == 0) {
      this.msg.error('已经是第一题');
      return;
    }
    this.questionIndex--;
    this.refreshQuestion();
  }

  nextQuestion(): void {
    if (this.questionIndex + 1 == this.totalElements) {
      this.msg.error('已经是最后一题');
      return;
    }
    this.questionIndex++;
    this.refreshQuestion();
  }

  nextQuestionByIndex(index): void {
    this.questionIndex = index - 1;
    this.refreshQuestion();
  }

  getAllIndex(): number[] {
    return Array.from({ length: this.totalElements }, (_, i) => i + 1);
  }

  private refreshQuestion(): void {
    let min = (this.currentPage - 1) * this.pageSize;
    let max = min + this.listOfData.length - 1;
    if (this.questionIndex > max || this.questionIndex < min) {
      this.refresh(this.questionIndex);
    } else {
      this.setQuestion(this.questionIndex);
    }
  }

  private refresh(questionIndex: number): void {
    this.currentPage = Math.floor(questionIndex / this.pageSize) + 1;
    this.http.studentGetQuestions(this.courseId, this.chapterId, this.currentPage, this.pageSize).subscribe((res) => {
      this.totalElements = res.totalElements;
      if (this.totalElements == 0) {
        this.msg.error('没有试题，请选择其他资源');
        this.location.back();
        return;
      }
      this.listOfData = res.content;
      this.listOfData.forEach((q) =>
        q.answerList.forEach((a, index) => {
          a.content = String.fromCharCode(index + 65) + ': ' + a.content;
        }),
      );
      this.questionIndex = questionIndex;
      this.setQuestion(this.questionIndex);
    });
  }

  private setQuestion(questionIndex: number): void {
    let index = questionIndex % this.pageSize;
    this.question = this.listOfData[index];
    this.answerList = JSON.parse(JSON.stringify(this.question.answerList));
    delete this.radioValue;
    this.showRightAnswer = false;
  }
}
