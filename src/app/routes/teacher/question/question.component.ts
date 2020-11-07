import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { HttpService } from 'src/app/core/http/http.service';

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
  constructor(private http: HttpService, public msg: NzMessageService) {}

  editCache: { [key: string]: { edit: boolean; data: Question } } = {};
  listOfData: Question[] = [];

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
    this.listOfData.forEach((item) => {
      this.editCache[item.id] = {
        edit: false,
        data: { ...item },
      };
    });
  }

  ngOnInit(): void {
    this.http.getQuestions(1153).subscribe((courses) => {
      this.listOfData = courses.content;
      this.updateEditCache();
    });
  }

  deleteRow(id: number): void {
    this.http.deleteQuestion(id).subscribe(() => {
      this.listOfData = this.listOfData.filter((item) => item.id !== id);
      delete this.editCache[id];
      this.msg.success('删除成功');
    });
  }

  addRow(): void {}
}
