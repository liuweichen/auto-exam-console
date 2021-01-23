import { NgModule, Type } from '@angular/core';
import { SharedModule } from '@shared';
import { TeacherChapterComponent } from './chapter/chapter.component';
import { TeacherCreateChapterComponent } from './chapter/create/create.component';
import { TeacherExamComponent } from './exam/exam.component';
import { TeacherCreateExamComponent } from './exam/create/create.component';
import { TeacherCourseComponent } from './course/course.component';
import { TeacherCreateCourseComponent } from './course/create/create.component';
import { TeacherCreateQuestionComponent } from './question/create/create.component';
import { TeacherImportQuestionComponent } from './question/import/import.component';
import { TeacherQuestionComponent } from './question/question.component';
import { TeacherRoutingModule } from './teacher-routing.module';
import { TeacherAddQuestionToExamComponent } from './question/add2exam/add2exam.component';
import { TeacherExamQuestionComponent } from './exam-question/exam-question.component';
import { TeacherExamQuestionPreviewComponent } from './exam-question/preview/preview.component';
import { TeacherOverviewComponent } from './overview/overview.component';

const COMPONENTS: Type<void>[] = [
  TeacherOverviewComponent,
  TeacherCourseComponent,
  TeacherChapterComponent,
  TeacherQuestionComponent,
  TeacherExamComponent,
  TeacherCreateCourseComponent,
  TeacherCreateChapterComponent,
  TeacherCreateQuestionComponent,
  TeacherImportQuestionComponent,
  TeacherCreateExamComponent,
  TeacherAddQuestionToExamComponent,
  TeacherExamQuestionComponent,
  TeacherExamQuestionPreviewComponent,
];
const COMPONENTS_NOROUNT: Type<void>[] = [];

@NgModule({
  imports: [SharedModule, TeacherRoutingModule],
  declarations: [...COMPONENTS, ...COMPONENTS_NOROUNT],
})
export class TeacherModule {}
