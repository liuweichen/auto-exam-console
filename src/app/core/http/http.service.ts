import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { _HttpClient } from '@delon/theme';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  private userId: string;
  constructor(private http: _HttpClient) {
    this.http = http;
  }

  setUserId(userId: string): void {
    this.userId = userId;
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

  createQuestion(body: any): Observable<any> {
    return this.http.post(`apiserver/teachers/${this.userId}/questions`, body);
  }

  updateQuestion(id: number, body: any): Observable<any> {
    return this.http.put(`apiserver/teachers/${this.userId}/questions/${id}`, body);
  }

  studentGetTeachers(): Observable<any> {
    return this.http.get(`apiserver/students/${this.userId}/teachers`);
  }

  studentGetCourses(id: number): Observable<any> {
    return this.http.get(`apiserver/students/${this.userId}/courses?teacher_id=${id}`);
  }

  studentGetChapters(id: number): Observable<any> {
    return this.http.get(`apiserver/students/${this.userId}/chapters?course_id=${id}`);
  }
}
