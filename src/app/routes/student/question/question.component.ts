import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/core/http/http.service';
import { Answer } from 'src/app/shared/model/Answer';
import { Question } from 'src/app/shared/model/Question';

@Component({
  selector: 'app-student-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
})
export class StudentQuestionComponent implements OnInit {
  constructor(private http: HttpService, private activatedRoute: ActivatedRoute) {}
  private courseId: number;
  private chapterId: number;
  private currentPage = 1;
  private pageSize = 10;
  private questionIndex: number;
  private questionSize: number;
  question: any = {};
  showRightAnswer = false;
  rightAnster: Answer;
  answerList: Answer[];
  private totalPages: number;
  radioValue: number;
  listOfData: Question[] = [];
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.chapterId = params.chapter_id;
      this.courseId = params.course_id;
      this.refresh();
    });
  }

  selectAnswer(answer: Answer): void {
    setTimeout(() => {
      if (answer.isSelected) {
        this.nextQuestion();
      } else {
        this.showRightAnswer = true;
      }
    }, 500);
  }

  lastQuestion(): void {
    this.questionIndex--;
    this.refreshQuestion();
  }

  nextQuestion(): void {
    this.questionIndex++;
    this.refreshQuestion();
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
