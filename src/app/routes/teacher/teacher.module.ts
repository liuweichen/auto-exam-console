import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherCourseComponent } from './course/course.component';
import { TeacherChapterComponent } from './chapter/chapter.component';
import { TeacherQuestionComponent } from './question/question.component';

const COMPONENTS: Type<void>[] = [TeacherCourseComponent, TeacherChapterComponent, TeacherQuestionComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, TeacherRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class TeacherModule {}
