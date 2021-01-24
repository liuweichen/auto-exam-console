import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentChapterComponent } from './chapter/chapter.component';
import { StudentCourseComponent } from './course/course.component';
import { StudentExamQuestionsComponent } from './exam-questions/exam-questions.component';
import { StudentExamComponent } from './exam/exam.component';
import { StudentOverviewComponent } from './overview/overview.component';
import { StudentQuestionComponent } from './question/question.component';
import { StudentSettingsComponent } from './setting/settings.component';
import { StudentTeacherComponent } from './teacher/teacher.component';

const routes: Routes = [
  { path: '', redirectTo: 'overview', pathMatch: 'full' },
  { path: 'overview', component: StudentOverviewComponent },
  { path: 'teachers', component: StudentTeacherComponent },
  { path: 'courses', component: StudentCourseComponent },
  { path: 'chapters', component: StudentChapterComponent },
  { path: 'questions', component: StudentQuestionComponent },
  { path: 'exams', component: StudentExamComponent },
  { path: 'exam-questions', component: StudentExamQuestionsComponent },
  { path: 'settings', component: StudentSettingsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
