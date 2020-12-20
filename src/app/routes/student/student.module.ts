import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { StudentChapterComponent } from './chapter/chapter.component';
import { StudentCourseComponent } from './course/course.component';
import { StudentExamQuestionsComponent } from './exam-questions/exam-questions.component';
import { StudentExamComponent } from './exam/exam.component';
import { StudentQuestionComponent } from './question/question.component';
import { StudentRoutingModule } from './student-routing.module';
import { StudentTeacherComponent } from './teacher/teacher.component';

const COMPONENTS: Type<void>[] = [
  StudentTeacherComponent,
  StudentCourseComponent,
  StudentChapterComponent,
  StudentQuestionComponent,
  StudentExamComponent,
  StudentExamQuestionsComponent,
];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, StudentRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class StudentModule {}
