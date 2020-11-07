import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
interface Chapter {
  id: number;
  name: string;
  description: string;
  courseId: number;
  createdAt: Date;
  updatedAt: Date;
}

@Component({
  selector: 'app-teacher-chapter',
  templateUrl: './chapter.component.html',
  styleUrls: ['./chapter.component.less'],
})
export class TeacherChapterComponent implements OnInit {
  constructor(private http: _HttpClient, public msg: NzMessageService) {}

  editCache: { [key: string]: { edit: boolean; data: Chapter } } = {};
  listOfData: Chapter[] = [];

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
    this.http.put(`apiserver/teachers/1303/chapters/${id}`, this.editCache[id].data).subscribe(() => {
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
    this.http.get(`apiserver/teachers/1303/chapters?course_id=1151`).subscribe((courses) => {
      this.listOfData = courses;
      this.updateEditCache();
    });
  }

  deleteRow(id: number): void {
    this.http.delete(`apiserver/teachers/1303/chapters/${id}`).subscribe(() => {
      this.listOfData = this.listOfData.filter((item) => item.id !== id);
      delete this.editCache[id];
      this.msg.success('删除成功');
    });
  }

  addRow(): void {}
}
