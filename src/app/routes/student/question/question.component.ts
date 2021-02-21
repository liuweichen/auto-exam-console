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
  private questionIndex: number;
  private questionSize: number;
  private totalElements: number;
  currentGlobalIndex = 1;
  question: any = {};
  showRightAnswer = false;
  rightAnster: Answer;
  answerList: Answer[];
  private totalPages: number;
  radioValue: number;
  listOfData: Question[] = [];
  autoNext = true;
  rightCount = 0;
  falseCount = 0;
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.chapterId = params.chapter_id;
      this.courseId = params.course_id;
      this.refresh();
    });
  }

  selectAnswer(answer: Answer): void {
    setTimeout(() => {
      answer.isSelected ? this.rightCount++ : this.falseCount++;
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
      isRight ? this.rightCount++ : this.falseCount++;
      if (isRight && this.autoNext) {
        this.nextQuestion();
      } else {
        this.showRightAnswer = true;
      }
    }, 500);
  }

  lastQuestion(): void {
    this.questionIndex--;
    this.currentGlobalIndex = (this.currentPage - 1) * this.pageSize + 1 + this.questionIndex;
    this.refreshQuestion();
  }

  nextQuestion(): void {
    this.questionIndex++;
    this.currentGlobalIndex = (this.currentPage - 1) * this.pageSize + 1 + this.questionIndex;
    this.refreshQuestion();
  }

  nextQuestionByIndex(index): void {
    let min = (this.currentPage - 1) * this.pageSize + 1;
    let max = this.currentPage + this.pageSize;
    if (index >= min && index <= max) {
      this.questionIndex = (index - 1) % this.pageSize;
      this.setQuestion(this.questionIndex);
    } else {
      this.currentPage = Math.floor((index - 1) / this.pageSize) + 1;
      this.refresh();
    }
    this.currentGlobalIndex = index;
  }

  getAllIndex(): number[] {
    return Array.from({ length: this.totalElements }, (_, i) => i + 1);
  }

  private refreshQuestion(): void {
    if (this.questionIndex >= this.questionSize || this.questionIndex < 0) {
      this.currentPage = ((this.currentPage + 1) % this.totalPages) + 1;
      this.refresh();
    } else {
      this.setQuestion(this.questionIndex);
    }
  }

  private refresh(): void {
    this.http.studentGetQuestions(this.courseId, this.chapterId, this.currentPage, this.pageSize).subscribe((res) => {
      this.totalElements = res.totalElements;
      if (this.totalElements == 0) {
        this.msg.error('没有试题，请选择其他资源');
        this.location.back();
        return;
      }
      this.listOfData = res.content;
      this.totalPages = res.totalPages;
      this.questionIndex = 0;
      this.questionSize = this.listOfData.length;
      this.setQuestion(this.questionIndex);
    });
  }

  private setQuestion(questionIndex: number): void {
    this.question = this.listOfData[questionIndex];
    this.answerList = this.question.answerList;
    this.rightAnster = this.answerList.find((ans) => ans.isSelected);
    delete this.radioValue;
    this.showRightAnswer = false;
  }
}
