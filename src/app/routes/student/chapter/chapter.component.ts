import { Component, OnInit } from '@angular/core';
import { HttpService } from 'src/app/core/http/http.service';
import { Chapter } from 'src/app/shared/model/Chapter';
import { ColumnSortAndFilter } from 'src/app/shared/utils/ColumnSortAndFilter';

@Component({
  selector: 'app-student-chapter',
  templateUrl: './chapter.component.html',
})
export class StudentChapterComponent implements OnInit {
  constructor(private http: HttpService) {}
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
  ngOnInit(): void {
    this.http.studentGetChapters().subscribe((res) => {
      this.listOfData = res;
      this.courseIdColumn.listOfFilter = [];
      Array.from(new Set(this.listOfData.map((d) => d.courseId))).forEach((courseId) => {
        this.courseIdColumn.listOfFilter.push({ text: courseId.toString(), value: courseId });
      });
    });
  }
}
