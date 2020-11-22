import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';
import { Course } from 'src/app/shared/model/Course';
import { ColumnSortAndFilter } from 'src/app/shared/utils/ColumnSortAndFilter';

@Component({
  selector: 'app-student-course',
  templateUrl: './course.component.html',
})
export class StudentCourseComponent implements OnInit {
  constructor(private http: HttpService) {}
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
  teacherIdColumn: ColumnSortAndFilter = {
    name: '老师ID',
    sortOrder: null,
    sortFn: (a: Course, b: Course) => a.teacherId - b.teacherId,
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: false,
    listOfFilter: [],
    filterFn: (id: number, item: Course) => {
      return item.teacherId === id;
    },
  };
  createTimeColumn: ColumnSortAndFilter = {
    name: '创建时间',
    sortOrder: null,
    sortFn: (a: Course, b: Course) => {
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
    sortFn: (a: Course, b: Course) => {
      return new Date(a.updatedAt).getSeconds() - new Date(b.updatedAt).getSeconds();
    },
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: null,
    listOfFilter: null,
    filterFn: null,
  };
  ngOnInit(): void {
    this.http.studentGetCourses().subscribe((courses) => {
      this.listOfData = courses;
      this.teacherIdColumn.listOfFilter = [];
      Array.from(new Set(this.listOfData.map((d) => d.teacherId))).forEach((teacherId) => {
        this.teacherIdColumn.listOfFilter.push({ text: teacherId.toString(), value: teacherId });
      });
    });
  }
}
