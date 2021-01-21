import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from 'src/app/core/http/http.service';

@Component({
  selector: 'app-student-exam-questions',
  templateUrl: './exam-questions.component.html',
  styleUrls: ['./exam-questions.component.less'],
})
export class StudentExamQuestionsComponent implements OnInit {
  constructor(private http: HttpService, private activatedRoute: ActivatedRoute) {}
  private examId: number;
  submitFlag = false;
  listOfData: any[] = [];
  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.examId = params.exam_id;
      this.refresh();
    });
  }

  private refresh(): void {
    this.http.studentGetExamQuestions(this.examId).subscribe((res) => {
      res.forEach((q) => {
        q.rightAnster = q.answerList[q.answerList.findIndex((item) => item.isSelected)];
      });
      this.listOfData = res;
    });
  }

  submit(): void {
    this.submitFlag = true;
  }
}
