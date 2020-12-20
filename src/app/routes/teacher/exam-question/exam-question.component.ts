import { Component, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/core/http/http.service';

interface Question {
  id: number;
  type: number;
  content: string;
  explanation: string;
  chapterId: number;
  createdAt: Date;
  updatedAt: Date;
  disabled: boolean;
}

@Component({
  selector: 'app-teacher-exam-question',
  templateUrl: './exam-question.component.html',
  styleUrls: ['./exam-question.component.less'],
})
export class TeacherExamQuestionComponent implements OnInit {
  constructor(private http: HttpService, public msg: NzMessageService, private router: Router, private activatedRoute: ActivatedRoute) {}

  examId: number;
  examName: string;
  listOfData: Question[] = [];
  filterType = [
    { text: '单选', value: 1 },
    { text: '多选', value: 2 },
  ];
  filterChapterId = [];
  checked: boolean = false;
  indeterminate: boolean = false;
  setOfCheckedId = new Set<number>();
  getTypeText(value: number): string {
    return this.filterType.find((t) => t.value === value).text;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      console.log(params);
      this.examId = params.id;
      this.examName = params.name;
      this.refresh();
    });
  }

  deleteRow(id: number): void {
    this.http.removeQuestionsFromExam(this.examId, Array.from([id])).subscribe(() => {
      this.refresh();
      this.msg.success('移除成功');
    });
  }

  cancelDelete(): void {
    this.msg.info('取消操作');
  }

  importRow(): void {}

  deleteAll(): void {
    this.http.removeQuestionsFromExam(this.examId, Array.from(this.setOfCheckedId)).subscribe(() => {
      this.refresh();
      this.msg.success('批量移除成功');
    });
  }
  clearCheck(): void {
    this.setOfCheckedId.clear();
    this.checked = false;
    this.indeterminate = false;
  }
  onAllChecked(checked: boolean): void {
    this.setOfCheckedId.clear();
    this.listOfData.filter(({ disabled }) => !disabled).forEach(({ id }) => this.updateCheckedSet(id, checked));
    this.refreshCheckedStatus();
  }
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }
  private refreshCheckedStatus(): void {
    const listOfEnabledData = this.listOfData.filter(({ disabled }) => !disabled);
    this.checked = listOfEnabledData.every(({ id }) => this.setOfCheckedId.has(id));
    this.indeterminate = listOfEnabledData.some(({ id }) => this.setOfCheckedId.has(id)) && !this.checked;
  }
  private updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }
  private refresh(): void {
    this.http.getExamQuestions(this.examId).subscribe((data) => {
      this.listOfData = data;
    });
    this.http.getChapters().subscribe((res) => {
      this.filterChapterId = res.map((e) => {
        return { text: e.id, value: e.id };
      });
    });
  }
  goExams(): void {
    this.router.navigateByUrl(`/teacher/exams`);
  }
}
