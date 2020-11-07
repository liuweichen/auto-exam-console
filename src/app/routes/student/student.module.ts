import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { StudentChapterComponent } from './chapter/chapter.component';
import { StudentCourseComponent } from './course/course.component';
import { StudentRoutingModule } from './student-routing.module';
import { StudentTeacherComponent } from './teacher/teacher.component';

const COMPONENTS: Type<void>[] = [StudentTeacherComponent, StudentCourseComponent, StudentChapterComponent];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, StudentRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class StudentModule {}
