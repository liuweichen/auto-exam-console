import { HttpClient, HttpParams, HttpRequest, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { NzUploadFile } from 'ng-zorro-antd/upload';
import { Observable } from 'rxjs';
import { filter, mergeMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private userId: string;
  private hostName: string;
  constructor(private http: _HttpClient, private httpClient: HttpClient) {
    this.http = http;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  setHostName(hostName: string): void {
    this.hostName = hostName;
  }

  getHostName(): string {
    return this.hostName;
  }

  getOverview(): Observable<any> {
    return this.http.get(`apiserver/teachers/${this.userId}/overview`);
  }

  updateTeacher(body: any): Observable<any> {
    return this.http.put(`apiserver/teachers/${this.userId}`, body);
  }

  getCourses(): Observable<any> {
    return this.http.get(`apiserver/teachers/${this.userId}/courses`);
  }

  deleteCourse(id: number): Observable<any> {
    return this.http.delete(`apiserver/teachers/${this.userId}/courses/${id}`);
  }

  updateCourse(id: number, body: any): Observable<any> {
    return this.http.put(`apiserver/teachers/${this.userId}/courses/${id}`, body);
  }

  createCourse(body: any): Observable<any> {
    return this.http.post(`apiserver/teachers/${this.userId}/courses`, body);
  }

  getChapters(): Observable<any> {
    return this.http.get(`apiserver/teachers/${this.userId}/chapters`);
  }

  deleteChapter(id: number): Observable<any> {
    return this.http.delete(`apiserver/teachers/${this.userId}/chapters/${id}`);
  }

  updateChapter(id: number, body: any): Observable<any> {
    return this.http.put(`apiserver/teachers/${this.userId}/chapters/${id}`, body);
  }

  createChapter(body: any): Observable<any> {
    return this.http.post(`apiserver/teachers/${this.userId}/chapters`, body);
  }

  getExams(): Observable<any> {
    return this.http.get(`apiserver/teachers/${this.userId}/exams`);
  }

  deleteExam(id: number): Observable<any> {
    return this.http.delete(`apiserver/teachers/${this.userId}/exams/${id}`);
  }

  updateExam(id: number, body: any): Observable<any> {
    return this.http.put(`apiserver/teachers/${this.userId}/exams/${id}`, body);
  }

  createExam(body: any): Observable<any> {
    return this.http.post(`apiserver/teachers/${this.userId}/exams`, body);
  }

  getExamQuestions(examId: any): Observable<any> {
    return this.http.get(`apiserver/teachers/${this.userId}/exams/${examId}/get`);
  }

  addQuestionsToExam(examId: number, body: any): Observable<any> {
    return this.http.post(`apiserver/teachers/${this.userId}/exams/${examId}/add`, body);
  }

  removeQuestionsFromExam(examId: number, body: any): Observable<any> {
    return this.http.post(`apiserver/teachers/${this.userId}/exams/${examId}/remove`, body);
  }

  getQuestions(id: number): Observable<any> {
    return this.http.get(`apiserver/teachers/${this.userId}/questions?chapter_id=${id}`);
  }

  getQuestionPage(
    pageIndex: number,
    pageSize: number,
    sortField: string | null,
    sortOrder: string | null,
    filters: Array<{ key: string; value: string }>,
  ): Observable<any> {
    let params = new HttpParams()
      .append('current_page', `${pageIndex}`)
      .append('page_size', `${pageSize}`)
      .append('sort_field', `${sortField === null ? 'createdAt' : sortField}`)
      .append('sort_order', `${sortOrder === 'ascend' ? 'asc' : 'desc'}`);
    filters.forEach((filter) => {
      if (filter.value !== null) {
        params = params.append(filter.key, filter.value);
      }
    });
    return this.http.get(`apiserver/teachers/${this.userId}/questions`, params);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`apiserver/teachers/${this.userId}/questions/${id}`);
  }

  deleteQuestionList(body: any): Observable<any> {
    return this.http.post(`apiserver/teachers/${this.userId}/questions/delete`, body);
  }

  createQuestion(body: any): Observable<any> {
    return this.http.post(`apiserver/teachers/${this.userId}/questions`, body);
  }

  updateQuestion(id: number, body: any): Observable<any> {
    return this.http.put(`apiserver/teachers/${this.userId}/questions/${id}`, body);
  }

  private getUploadToken(): Observable<any> {
    return this.http.get(`apiserver/teachers/${this.userId}/token`);
  }

  uploadImage(formData: FormData): Observable<any> {
    return this.getUploadToken().pipe(
      mergeMap((token) => {
        return this.uploadImageWithToken(formData, token.token);
      }),
    );
  }

  private uploadImageWithToken(formData: FormData, token: string): Observable<any> {
    formData.append('token', token);
    const req = new HttpRequest('POST', 'https://upload-z2.qiniup.com', formData, {
      reportProgress: true,
    });
    return this.httpClient.request(req).pipe(filter((e) => e instanceof HttpResponse));
  }

  studentGetOverview(): Observable<any> {
    return this.http.get(`apiserver/students/${this.userId}/overview`);
  }

  studentGetTeachers(): Observable<any> {
    return this.http.get(`apiserver/students/${this.userId}/teachers`);
  }

  studentGetCourses(): Observable<any> {
    return this.http.get(`apiserver/students/${this.userId}/courses`);
  }

  studentGetChapters(): Observable<any> {
    return this.http.get(`apiserver/students/${this.userId}/chapters`);
  }

  studentGetExams(): Observable<any> {
    return this.http.get(`apiserver/students/${this.userId}/exams`);
  }

  studentGetExamQuestions(examId: number): Observable<any> {
    return this.http.get(`apiserver/students/${this.userId}/exams/${examId}/questions`);
  }

  studentGetQuestions(courseId: number, chapterId: number, current_page: number, page_size: number): Observable<any> {
    let params = new HttpParams().append('current_page', current_page.toString()).append('page_size', page_size.toString());
    if (courseId) {
      params = params.append('course_id', courseId.toString());
    }
    if (chapterId) {
      params = params.append('chapter_id', chapterId.toString());
    }
    return this.http.get(`apiserver/students/${this.userId}/questions`, params);
  }
}
