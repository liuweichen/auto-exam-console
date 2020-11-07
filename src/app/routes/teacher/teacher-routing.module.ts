import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TeacherChapterComponent } from './chapter/chapter.component';
import { TeacherCourseComponent } from './course/course.component';
import { TeacherQuestionComponent } from './question/question.component';

const routes: Routes = [
  { path: 'courses', component: TeacherCourseComponent },
  { path: 'chapters', component: TeacherChapterComponent },
  { path: 'questions', component: TeacherQuestionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TeacherRoutingModule {}
