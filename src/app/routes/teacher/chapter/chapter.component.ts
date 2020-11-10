import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpService } from 'src/app/core/http/http.service';
import { Chapter } from 'src/app/shared/model/Chapter';
import { ColumnSortAndFilter } from 'src/app/shared/utils/ColumnSortAndFilter';
import { TeacherCreateChapterComponent } from './create/create.component';

@Component({
  selector: 'app-teacher-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.less'],
})
export class TeacherChapterComponent implements OnInit {
  constructor(private http: HttpService, public msg: NzMessageService, private modal: NzModalService) {}

  editCache: { [key: string]: { edit: boolean; data: Chapter } } = {};
  listOfData: Chapter[] = [];
  chapterIdColumn: ColumnSortAndFilter = {
    name: '章节ID',
    sortOrder: null,
    sortFn: (a: Chapter, b: Chapter) => a.id - b.id,
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: null,
    listOfFilter: null,
    filterFn: null,
  };
  courseIdColumn: ColumnSortAndFilter = {
    name: '课程ID',
    sortOrder: null,
    sortFn: (a: Chapter, b: Chapter) => a.courseId - b.courseId,
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: false,
    listOfFilter: [],
    filterFn: (id: number, item: Chapter) => {
      return item.courseId === id;
    },
  };
  createTimeColumn: ColumnSortAndFilter = {
    name: '创建时间',
    sortOrder: null,
    sortFn: (a: Chapter, b: Chapter) => {
      return new Date(a.createdAt).getSeconds() - new Date(b.createdAt).getSeconds();
    },
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: null,
    listOfFilter: null,
    filterFn: null,
  };
  updateTimeColumn: ColumnSortAndFilter = {
    name: '修改时间',
    sortOrder: null,
    sortFn: (a: Chapter, b: Chapter) => {
      return new Date(a.updatedAt).getSeconds() - new Date(b.updatedAt).getSeconds();
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
    this.http.updateChapter(id, this.editCache[id].data).subscribe(() => {
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
    this.http.deleteChapter(id).subscribe(() => {
      this.listOfData = this.listOfData.filter((item) => item.id !== id);
      delete this.editCache[id];
      this.msg.success('删除成功');
    });
  }

  addRow(): void {
    const modal = this.modal.create({
      nzContent: TeacherCreateChapterComponent,
    });
    modal.afterClose.subscribe(() => {
      this.refresh();
    });
  }

  private refresh(): void {
    this.http.getChapters().subscribe((courses) => {
      this.listOfData = courses;
      this.updateEditCache();
    });
  }
}
