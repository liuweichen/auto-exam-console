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

  getChapters(id: number): Observable<any> {
    return this.http.get(`apiserver/teachers/${this.userId}/chapters?course_id=${id}`);
  }

  deleteChapter(id: number): Observable<any> {
    return this.http.delete(`apiserver/teachers/${this.userId}/chapters/${id}`);
  }

  updateChapter(id: number, body: any): Observable<any> {
    return this.http.put(`apiserver/teachers/${this.userId}/chapters/${id}`, body);
  }

  getQuestions(id: number): Observable<any> {
    return this.http.get(`apiserver/teachers/${this.userId}/questions?chapter_id=${id}`);
  }

  deleteQuestion(id: number): Observable<any> {
    return this.http.delete(`apiserver/teachers/${this.userId}/questions/${id}`);
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
