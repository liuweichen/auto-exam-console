import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '@delon/abc/loading';
import { XlsxService } from '@delon/abc/xlsx';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { concat, forkJoin } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { HttpService } from 'src/app/core/http/http.service';

@Component({
  selector: 'app-teacher-import-question',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.less'],
})
export class TeacherImportQuestionComponent implements OnInit {
  private file: any;
  constructor(
    private modal: NzModalRef,
    private xlsx: XlsxService,
    private loadingSrv: LoadingService,
    private http: HttpService,
    public msg: NzMessageService,
    public router: Router,
  ) {}
  ngOnInit(): void {}
  ok(): void {
    this.loadingSrv.open({ type: 'icon' });
    this.xlsx.import(this.file).then((res) => {
      const questions = res.Sheet1;
      const promiseArr = [];
      for (let i = 1; i < questions.length; i++) {
        const question = questions[i];
        if (question[0]) {
          promiseArr.push(this.http.createQuestion(this.getHttpJson(question)));
        }
      }
      let successCount = 0;
      let errorCount = 0;
      forkJoin(
        concat(...promiseArr).pipe(
          map((success) => {
            successCount++;
            return success;
          }),
          catchError((error) => {
            errorCount++;
            return error;
          }),
        ),
      ).subscribe(() => {
        this.msg.success(`成功导入${successCount}条，失败导入${errorCount}条`);
        this.loadingSrv.close();
        this.modal.destroy({ data: 'ok' });
      });
    });
  }
  private getHttpJson(question: any): any {
    return {
      type: question[0],
      content: question[1],
      chapterId: question[2],
      explanation: question[3],
      answerList: this.getAnswerList(question),
    };
  }
  private getAnswerList(answers: any[]): any[] {
    const res: any[] = [];
    for (let i = 4; i < answers.length - 1; i = i + 2) {
      res.push({
        content: answers[i],
        isSelected: answers[i + 1],
      });
    }
    return res;
  }
  cancle(): void {
    this.modal.destroy({ data: 'cancle data' });
  }
  change(e: Event): void {
    this.file = (e.target as HTMLInputElement).files![0];
  }
}
