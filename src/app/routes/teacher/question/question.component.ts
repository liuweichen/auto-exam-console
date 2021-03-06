import { Component, OnInit } from '@angular/core';
import { XlsxService } from '@delon/abc/xlsx';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzTableQueryParams } from 'ng-zorro-antd/table';
import { HttpService } from 'src/app/core/http/http.service';
import { TeacherAddQuestionToExamComponent } from './add2exam/add2exam.component';
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
  disabled: boolean;
  imageUrl: string;
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
  constructor(private http: HttpService, public msg: NzMessageService, private modal: NzModalService, private xlsx: XlsxService) {}

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
  checked: boolean = false;
  indeterminate: boolean = false;
  setOfCheckedId = new Set<number>();
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
    this.clearCheck();
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
        answerList: JSON.parse(JSON.stringify(question.answerList)),
        imageUrl: question.imageUrl,
      },
    });
    console.log(question.answerList);
    modal.afterClose.subscribe((res) => {
      if (res?.data === 'ok') {
        this.refresh();
      }
    });
  }

  exportQuestionsToExcel(): void {
    const data = [
      [
        '试题类型',
        '试题题目',
        '图片地址',
        '所属章节编号',
        '试题解析',
        '选项01',
        '选项01是否选择',
        '选项02',
        '选项02是否选择',
        '选项03',
        '选项03是否选择',
        '选项04',
        '选项04是否选择',
      ],
    ];
    this.listOfData
      .filter((q) => this.setOfCheckedId.has(q.id))
      .forEach((q) => {
        data.push([
          q.type == 1 ? '单选' : q.type == 2 ? '多选' : '未知',
          q.content,
          q.imageUrl,
          q.chapterId.toString(),
          q.explanation,
          ...q.answerList
            .map((a) => {
              return [a.content, a.isSelected + ''];
            })
            .reduce((a, b) => {
              return a.concat(b);
            }),
        ]);
      });
    this.xlsx.export({
      sheets: [
        {
          data,
          name: 'Sheet1',
        },
      ],
      filename: `export-questions-${new Date().toString()}-file.xlsx`,
    });
  }

  addQuestionsToExam(): void {
    const modal = this.modal.create({
      nzContent: TeacherAddQuestionToExamComponent,
      nzComponentParams: {
        questionIdList: Array.from(this.setOfCheckedId),
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

  cancelDelete(): void {
    this.msg.info('取消操作');
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

  deleteAll(): void {
    this.http.deleteQuestionList(Array.from(this.setOfCheckedId)).subscribe(() => {
      this.refresh();
      this.msg.success('批量删除成功');
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
    this.http.getChapters().subscribe((res) => {
      this.filterChapterId = res.map((e) => {
        return { text: e.id, value: e.id };
      });
    });
  }
}
