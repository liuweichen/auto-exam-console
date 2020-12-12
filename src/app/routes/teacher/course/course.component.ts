import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { HttpService } from 'src/app/core/http/http.service';
import { Course } from 'src/app/shared/model/Course';
import { ColumnSortAndFilter } from 'src/app/shared/utils/ColumnSortAndFilter';
import { TeacherCreateCourseComponent } from './create/create.component';

@Component({
  selector: 'app-teacher-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.less'],
})
export class TeacherCourseComponent implements OnInit {
  constructor(private http: HttpService, public msg: NzMessageService, private modal: NzModalService) {}

  editCache: { [key: string]: { edit: boolean; data: Course } } = {};
  listOfData: Course[] = [];
  courseIdColumn: ColumnSortAndFilter = {
    name: '课程ID',
    sortOrder: null,
    sortFn: (a: Course, b: Course) => a.id - b.id,
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: null,
    listOfFilter: null,
    filterFn: null,
  };
  createTimeColumn: ColumnSortAndFilter = {
    name: '创建时间',
    sortOrder: null,
    sortFn: (a: Course, b: Course) => {
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
    sortFn: (a: Course, b: Course) => {
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
    this.http.updateCourse(id, this.editCache[id].data).subscribe(() => {
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
  }

  ngOnInit(): void {
    this.refresh();
  }

  deleteRow(id: number): void {
    this.http.deleteCourse(id).subscribe(() => {
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
      nzContent: TeacherCreateCourseComponent,
    });
    modal.afterClose.subscribe(() => {
      this.refresh();
    });
  }

  private refresh(): void {
    this.http.getCourses().subscribe((courses) => {
      this.listOfData = courses;
      this.updateEditCache();
    });
  }
}
