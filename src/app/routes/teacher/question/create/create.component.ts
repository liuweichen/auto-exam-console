import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { HttpService } from 'src/app/core/http/http.service';
import { Answer } from 'src/app/shared/model/Answer';
import { Observable } from 'rxjs';
import { Observer } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-teacher-create-question',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.less'],
})
export class TeacherCreateQuestionComponent implements OnInit {
  questionId: number;
  radioValue = null;
  type: number;
  content: string;
  explanation: string;
  chapterId: number;
  answerList: any[] = [{}, {}, {}, {}];
  selectChapter;
  chapterOptions = [];
  imageUrl;
  imageLocalUrl;
  typeOptions = [
    {
      text: '单选',
      value: 1,
    },
    {
      text: '多选',
      value: 2,
    },
  ];
  selectType = this.typeOptions[0];
  previewOn: Boolean;
  uploading = false;
  imagesList: NzUploadFile[] = [];
  private imageTypeList = ['image/png', 'image/jpeg', 'image/gif'];
  private updateImage = false;
  constructor(
    private modal: NzModalRef,
    private http: HttpService,
    private sanitizer: DomSanitizer,
    public msg: NzMessageService,
    public router: Router,
  ) {}
  ngOnInit(): void {
    this.http.getChapters().subscribe((res) => {
      this.chapterOptions = res.map((c) => {
        if (this.chapterId === c.id) {
          this.selectChapter = {
            text: c.name,
            value: c.id,
          };
          return this.selectChapter;
        } else {
          return {
            text: c.name,
            value: c.id,
          };
        }
      });
    });
    this.typeOptions.forEach((t) => {
      if (t.value === this.type) {
        this.selectType = t;
      }
    });
    if (this.imageUrl) {
      this.imagesList = [
        {
          uid: '-1',
          name: this.getFileName(this.imageUrl),
          status: 'done',
          url: this.http.getImageUrl(this.imageUrl),
        },
      ];
    }
  }

  private getFileName(name: string) {
    const list = name.split('|');
    return list[list.length - 1];
  }
  ok(): void {
    this.answerList = this.answerList.map((val, idx) => {
      if (this.selectType.value === 1) {
        return {
          content: val.content,
          isSelected: idx === this.radioValue,
        };
      } else if (this.selectType.value === 2) {
        return {
          content: val.content,
          isSelected: val.isSelected === true,
        };
      } else {
        return val;
      }
    });
    if (this.questionId) {
      this.http.updateQuestion(this.questionId, this.getHttpJson(this.questionId)).subscribe(() => {
        if (this.updateImage && this.imagesList.length > 0) {
          this.handleUpload(this.questionId).subscribe(
            () => {
              this.uploading = false;
              this.imagesList = [];
              this.msg.success('修改成功');
              this.modal.destroy({ data: 'ok' });
            },
            () => {
              this.uploading = false;
              this.msg.error('上传图片失败.');
              this.modal.destroy({ data: 'failed' });
            },
          );
        } else {
          this.uploading = false;
          this.msg.success('修改成功');
          this.modal.destroy({ data: 'ok' });
        }
      });
    } else {
      this.uploading = true;
      const timestamp = new Date().getTime();
      this.http.createQuestion(this.getHttpJson(timestamp)).subscribe((res) => {
        if (this.updateImage && this.imagesList.length > 0) {
          this.handleUpload(timestamp).subscribe(
            () => {
              this.uploading = false;
              this.imagesList = [];
              this.msg.success('创建成功');
              this.modal.destroy({ data: 'ok' });
            },
            () => {
              this.uploading = false;
              this.msg.error('上传图片失败.');
              this.modal.destroy({ data: 'failed' });
            },
          );
        } else {
          this.uploading = false;
          this.msg.success('创建成功');
          this.modal.destroy({ data: 'ok' });
        }
      });
    }
  }
  private getHttpJson(questionIdOrTimestamp): any {
    return {
      type: this.selectType.value,
      content: this.content,
      explanation: this.explanation,
      chapterId: this.selectChapter.value,
      answerList: this.answerList,
      imageUrl: this.imagesList.length > 0 ? this.getCloudFilePath(questionIdOrTimestamp, this.imagesList[0].name) : '',
    };
  }
  cancle(): void {
    this.modal.destroy({ data: 'cancle data' });
  }
  preview(on: Boolean): void {
    this.previewOn = on;
  }
  removeInput(item: Answer): void {
    const i = this.answerList.indexOf(item);
    this.answerList.splice(i, 1);
  }
  removeLastInput(): void {
    const i = this.answerList.length - 1;
    this.answerList.splice(i, 1);
  }
  addInput(): void {
    this.answerList.push({});
  }
  removeImage = (file: NzUploadFile) => {
    delete this.imageLocalUrl;
    return true;
  };
  beforeUpload = (file: NzUploadFile, _fileList: NzUploadFile[]) => {
    this.imageLocalUrl = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(file));
    return new Observable((observer: Observer<boolean>) => {
      const isJpgOrPng = this.imageTypeList.includes(file.type);
      if (!isJpgOrPng) {
        this.msg.error('仅支持 JPG, PNG, JIF 图片!');
        observer.complete();
        return;
      }
      const isLt2M = file.size! / 1024 / 1024 < 2;
      if (!isLt2M) {
        this.msg.error('图片大小不能超过 2MB!');
        observer.complete();
        return;
      }
      this.updateImage = true;
      this.imagesList = this.imagesList.concat(file);
      observer.next(false);
      observer.complete();
    });
  };
  private handleUpload(questionId: number): Observable<any> {
    const formData = new FormData();
    this.imagesList.forEach((file: any) => {
      formData.append('file', file);
      formData.append('key', this.getCloudFilePath(questionId, file.name));
    });
    return this.http.uploadImage(formData);
  }
  private getCloudFilePath(questionId, name): string {
    return 'question|' + questionId + '|' + name;
  }
}
