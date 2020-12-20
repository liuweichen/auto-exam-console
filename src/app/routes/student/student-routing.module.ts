import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentChapterComponent } from './chapter/chapter.component';
import { StudentCourseComponent } from './course/course.component';
import { StudentExamQuestionsComponent } from './exam-questions/exam-questions.component';
import { StudentExamComponent } from './exam/exam.component';
import { StudentQuestionComponent } from './question/question.component';
import { StudentTeacherComponent } from './teacher/teacher.component';

const routes: Routes = [
  { path: 'teachers', component: StudentTeacherComponent },
  { path: 'courses', component: StudentCourseComponent },
  { path: 'chapters', component: StudentChapterComponent },
  { path: 'questions', component: StudentQuestionComponent },
  { path: 'exams', component: StudentExamComponent },
  { path: 'exam-questions', component: StudentExamQuestionsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
