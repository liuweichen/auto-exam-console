import { DownFileModule } from '@delon/abc/down-file';
import { ExceptionModule } from '@delon/abc/exception';
import { GlobalFooterModule } from '@delon/abc/global-footer';
import { NoticeIconModule } from '@delon/abc/notice-icon';
import { PageHeaderModule } from '@delon/abc/page-header';
import { ResultModule } from '@delon/abc/result';
// import { ReuseTabModule } from '@delon/abc/reuse-tab';
import { SEModule } from '@delon/abc/se';
import { SidebarNavModule } from '@delon/abc/sidebar-nav';
import { STModule } from '@delon/abc/st';
import { SVModule } from '@delon/abc/sv';
import { XlsxModule } from '@delon/abc/xlsx';

export const SHARED_DELON_MODULES = [
  DownFileModule,
  PageHeaderModule,
  ResultModule,
  ExceptionModule,
  NoticeIconModule,
  SidebarNavModule,
  GlobalFooterModule,
  STModule,
  SEModule,
  SVModule,
  XlsxModule,
  // ReuseTabModule,
];
