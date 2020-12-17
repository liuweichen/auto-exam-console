import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpService } from 'src/app/core/http/http.service';
import { Exam } from 'src/app/shared/model/Exam';
import { ColumnSortAndFilter } from 'src/app/shared/utils/ColumnSortAndFilter';
import { TeacherCreateExamComponent } from './create/create.component';

@Component({
  selector: 'app-teacher-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.less'],
})
export class TeacherExamComponent implements OnInit {
  constructor(private http: HttpService, public msg: NzMessageService, private modal: NzModalService) {}

  editCache: { [key: string]: { edit: boolean; data: Exam } } = {};
  listOfData: Exam[] = [];
  examIdColumn: ColumnSortAndFilter = {
    name: '试卷ID',
    sortOrder: null,
    sortFn: (a: Exam, b: Exam) => a.id - b.id,
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: null,
    listOfFilter: null,
    filterFn: null,
  };
  courseIdColumn: ColumnSortAndFilter = {
    name: '课程ID',
    sortOrder: null,
    sortFn: (a: Exam, b: Exam) => a.courseId - b.courseId,
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: false,
    listOfFilter: [],
    filterFn: (id: number, item: Exam) => {
      return item.courseId === id;
    },
  };
  createTimeColumn: ColumnSortAndFilter = {
    name: '创建时间',
    sortOrder: null,
    sortFn: (a: Exam, b: Exam) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    },
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: null,
    listOfFilter: null,
    filterFn: null,
  };
  updateTimeColumn: ColumnSortAndFilter = {
    name: '修改时间',
    sortOrder: null,
    sortFn: (a: Exam, b: Exam) => {
      return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime();
    },
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: null,
    listOfFilter: null,
    filterFn: null,
  };

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

  saveEdit(id: number): void {
    this.http.updateExam(id, this.editCache[id].data).subscribe(() => {
      const index = this.listOfData.findIndex((item) => item.id === id);
      this.editCache[id].data.updatedAt = new Date(Date.now());
      Object.assign(this.listOfData[index], this.editCache[id].data);
      this.editCache[id].edit = false;
    });
  }

  updateEditCache(): void {
    this.listOfData.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
    this.courseIdColumn.listOfFilter = [];
    Array.from(new Set(this.listOfData.map((d) => d.courseId))).forEach((courseId) => {
      this.courseIdColumn.listOfFilter.push({ text: courseId.toString(), value: courseId });
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  deleteRow(id: number): void {
    this.http.deleteExam(id).subscribe(() => {
      this.listOfData = this.listOfData.filter((item) => item.id !== id);
      delete this.editCache[id];
      this.msg.success('删除成功');
    });
  }

  cancelDelete(): void {
    this.msg.info('取消操作');
  }

  addRow(): void {
    const modal = this.modal.create({
      nzContent: TeacherCreateExamComponent,
    });
    modal.afterClose.subscribe(() => {
      this.refresh();
    });
  }

  private refresh(): void {
    this.http.getExams().subscribe((exams) => {
      this.listOfData = exams;
      this.updateEditCache();
    });
  }
}
