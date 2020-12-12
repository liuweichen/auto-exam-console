import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/core/http/http.service';
import { TeacherCreateQuestionComponent } from './create/create.component';
import { TeacherImportQuestionComponent } from './import/import.component';

interface Question {
  id: number;
  type: number;
  content: string;
  explanation: string;
  chapterId: number;
  createdAt: Date;
  updatedAt: Date;
  answerList: Answer[];
}

interface Answer {
  content: string;
  isSelected: boolean;
}

@Component({
  selector: 'app-teacher-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.less'],
})
export class TeacherQuestionComponent implements OnInit {
  constructor(private http: HttpService, public msg: NzMessageService, private modal: NzModalService) {}

  total = 1;
  listOfData: Question[] = [];
  loading = true;
  pageSize = 10;
  pageIndex = 1;
  filterType = [
    { text: '单选', value: 1 },
    { text: '多选', value: 2 },
  ];
  filterChapterId = [];

  getTypeText(value: number): string {
    console.log(value);
    return this.filterType.find((t) => t.value === value).text;
  }

  loadDataFromServer(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filter: Array<{ key: string; value: string }>,
  ): void {
    this.loading = true;
    this.http.getQuestionPage(pageIndex, pageSize, sortField, sortOrder, filter).subscribe((data) => {
      this.loading = false;
      this.total = data.totalElements;
      this.listOfData = data.content;
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }

  startEdit(id: number): void {
    const question = this.listOfData.find((res) => res.id === id);
    const selectedIndex = question.answerList.findIndex((ans) => ans.isSelected === true);
    const modal = this.modal.create({
      nzContent: TeacherCreateQuestionComponent,
      nzComponentParams: {
        questionId: question.id,
        radioValue: selectedIndex,
        type: question.type,
        content: question.content,
        explanation: question.explanation,
        chapterId: question.chapterId,
        answerList: question.answerList,
      },
    });
    modal.afterClose.subscribe((res) => {
      if (res?.data === 'ok') {
        this.refresh();
      }
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  deleteRow(id: number): void {
    this.http.deleteQuestion(id).subscribe(() => {
      this.refresh();
      this.msg.success('删除成功');
    });
  }

  addRow(): void {
    const modal = this.modal.create({
      nzContent: TeacherCreateQuestionComponent,
    });
    modal.afterClose.subscribe((res) => {
      if (res?.data === 'ok') {
        this.refresh();
      }
    });
  }

  importRow(): void {
    const modal = this.modal.create({
      nzContent: TeacherImportQuestionComponent,
    });
    modal.afterClose.subscribe((res) => {
      if (res?.data === 'ok') {
        this.refresh();
      }
    });
  }

  private refresh(): void {
    this.http.getChapters().subscribe((res) => {
      this.filterChapterId = res.map((e) => {
        return { text: e.id, value: e.id };
      });
    });
  }
}
