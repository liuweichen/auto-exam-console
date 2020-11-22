import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentChapterComponent } from './chapter/chapter.component';
import { StudentCourseComponent } from './course/course.component';
import { StudentQuestionComponent } from './question/question.component';
import { StudentTeacherComponent } from './teacher/teacher.component';

const routes: Routes = [
  { path: 'teachers', component: StudentTeacherComponent },
  { path: 'courses', component: StudentCourseComponent },
  { path: 'chapters', component: StudentChapterComponent },
  { path: 'questions', component: StudentQuestionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
