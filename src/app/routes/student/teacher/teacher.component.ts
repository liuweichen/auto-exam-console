import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';
import { Teacher } from 'src/app/shared/model/Teacher';
import { ColumnSortAndFilter } from 'src/app/shared/utils/ColumnSortAndFilter';

@Component({
  selector: 'app-student-teacher',
  templateUrl: './teacher.component.html',
})
export class StudentTeacherComponent implements OnInit {
  constructor(private http: HttpService) {}
  listOfData: Teacher[] = [];
  teacherIdColumn: ColumnSortAndFilter = {
    name: '老师ID',
    sortOrder: null,
    sortFn: (a: Teacher, b: Teacher) => a.id - b.id,
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: null,
    listOfFilter: null,
    filterFn: null,
  };
  createTimeColumn: ColumnSortAndFilter = {
    name: '创建时间',
    sortOrder: null,
    sortFn: (a: Teacher, b: Teacher) => {
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
    sortFn: (a: Teacher, b: Teacher) => {
      return new Date(a.updatedAt).getSeconds() - new Date(b.updatedAt).getSeconds();
    },
    sortDirections: ['ascend', 'descend', null],
    filterMultiple: null,
    listOfFilter: null,
    filterFn: null,
  };
  ngOnInit(): void {
    this.http.studentGetTeachers().subscribe((res) => {
      this.listOfData = res;
    });
  }
}
