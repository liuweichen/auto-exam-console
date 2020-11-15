import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { TeacherChapterComponent } from './chapter/chapter.component';
import { TeacherCreateChapterComponent } from './chapter/create/create.component';
import { TeacherCourseComponent } from './course/course.component';
import { TeacherCreateCourseComponent } from './course/create/create.component';
import { TeacherCreateQuestionComponent } from './question/create/create.component';
import { TeacherQuestionComponent } from './question/question.component';
import { TeacherRoutingModule } from './teacher-routing.module';

const COMPONENTS: Type<void>[] = [
  TeacherCourseComponent,
  TeacherChapterComponent,
  TeacherQuestionComponent,
  TeacherCreateCourseComponent,
  TeacherCreateChapterComponent,
  TeacherCreateQuestionComponent,
];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, TeacherRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class TeacherModule {}
