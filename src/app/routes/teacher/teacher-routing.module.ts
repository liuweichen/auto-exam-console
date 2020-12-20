import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherChapterComponent } from './chapter/chapter.component';
import { TeacherCourseComponent } from './course/course.component';
import { TeacherQuestionComponent } from './question/question.component';
import { TeacherExamComponent } from './exam/exam.component';
import { TeacherExamQuestionComponent } from './exam-question/exam-question.component';

const routes: Routes = [
  { path: 'courses', component: TeacherCourseComponent },
  { path: 'chapters', component: TeacherChapterComponent },
  { path: 'questions', component: TeacherQuestionComponent },
  { path: 'exams', component: TeacherExamComponent },
  { path: 'exam-questions', component: TeacherExamQuestionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
