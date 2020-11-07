import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/core/http/http.service';

interface Course {
  id: number;
  name: string;
  description: string;
  teacherId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-teacher-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.less'],
})
export class TeacherCourseComponent implements OnInit {
  constructor(private http: HttpService, public msg: NzMessageService) {}

  editCache: { [key: string]: { edit: boolean; data: Course } } = {};
  listOfData: Course[] = [];

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
    this.http.getCourses().subscribe((courses) => {
      this.listOfData = courses;
      this.updateEditCache();
    });
  }

  deleteRow(id: number): void {
    this.http.deleteCourse(id).subscribe(() => {
      this.listOfData = this.listOfData.filter((item) => item.id !== id);
      delete this.editCache[id];
      this.msg.success('删除成功');
    });
  }

  addRow(): void {}
}
