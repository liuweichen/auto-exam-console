import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/core/http/http.service';
import { TeacherCreateQuestionComponent } from './create/create.component';

interface Question {
  id: number;
  type: number;
  content: string;
  explanation: string;
  chapterId: number;
  createdAt: Date;
  updatedAt: Date;
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
    { text: '1', value: 1 },
    { text: '2', value: 2 },
  ];
  filterChapterId = [];

  editCache: { [key: string]: { edit: boolean; data: Question } } = {};

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
      this.updateEditCache();
    });
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    const { pageSize, pageIndex, sort, filter } = params;
    const currentSort = sort.find((item) => item.value !== null);
    const sortField = (currentSort && currentSort.key) || null;
    const sortOrder = (currentSort && currentSort.value) || null;
    this.loadDataFromServer(pageIndex, pageSize, sortField, sortOrder, filter);
  }

  startEdit(id: string): void {
    this.editCache[id].edit = true;
  }

  cancelEdit(id: number): void {
    const index = this.listOfData.findIndex((item) => item.id === id);
    this.editCache[id] = {
      data: { ...this.listOfData[index] },
      edit: false,
    };
  }

  saveEdit(id: number): void {}

  updateEditCache(): void {
    this.editCache = {};
    this.listOfData.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  deleteRow(id: number): void {
    this.http.deleteQuestion(id).subscribe(() => {
      this.listOfData = this.listOfData.filter((item) => item.id !== id);
      delete this.editCache[id];
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

  private refresh(): void {
    this.http.getChapters().subscribe((res) => {
      this.filterChapterId = res.map((e) => {
        return { text: e.id, value: e.id };
      });
    });
  }
}
