import { Inject, Injectable } from '@angular/core';
import { ACLService } from '@delon/acl';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ALAIN_I18N_TOKEN, MenuService, SettingsService, TitleService, _HttpClient } from '@delon/theme';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';
import { HttpService } from '../http/http.service';

/**
 * Used for application startup
 * Generally used to get the basic data of the application, like: Menu Data, User Data, etc.
 */
@Injectable()
export class StartupService {
  constructor(
    iconSrv: NzIconService,
    private menuService: MenuService,
    private translate: TranslateService,
    @Inject(ALAIN_I18N_TOKEN) private i18n: I18NService,
    private settingService: SettingsService,
    private aclService: ACLService,
    private titleService: TitleService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private httpClient: _HttpClient,
    private http: HttpService,
  ) {
    iconSrv.addIcon(...ICONS_AUTO, ...ICONS);
    this.httpClient.get(`assets/tmp/i18n/${this.i18n.defaultLang}.json`).subscribe((langData) => {
      this.translate.setTranslation(this.i18n.defaultLang, langData);
      this.translate.setDefaultLang(this.i18n.defaultLang);
    });
    const app: any = {
      name: `auto-exan`,
      description: `auto exam system`,
    };
    // Application information: including site name, description, year
    this.settingService.setApp(app);
    // ACL: Set the permissions to full, https://ng-alain.com/acl/getting-started
    this.aclService.setFull(true);
    // Can be set page suffix title, https://ng-alain.com/theme/title
    this.titleService.suffix = app.name;
  }

  private viaHttp(resolve: any, reject: any): void {
    this.httpClient
      .post('apiserver/token/refresh')
      .pipe(
        catchError((res) => {
          console.warn(`StartupService.load: Network request failed`, res);
          resolve({});
          return [];
        }),
      )
      .subscribe(
        (appData) => {
          // Application data
          const res: any = appData;
          // 设置用户Token信息
          this.tokenService.set(res);
          const userInfo = JSON.parse(atob(res.token.split('.')[1]));
          // User information: including name, avatar, email address
          res.name = userInfo.userName;
          res.avatar = './assets/tmp/img/avatar.jpg';
          res.email = 'xx@qq.com';
          res.id = userInfo.userId;
          res.role = userInfo.role;
          res.description = userInfo.description;
          this.settingService.setUser(res);
          this.http.setUserId(userInfo.userId);
          this.http.setHostName(userInfo.hostName);

          let menu;
          if (userInfo.role === 'teacher') {
            menu = [
              {
                text: '导航栏',
                group: true,
                children: [
                  {
                    text: '总览',
                    link: '/teacher/overview',
                    icon: { type: 'icon', value: 'dashboard' },
                  },
                  {
                    text: '课程',
                    link: '/teacher/courses',
                    icon: { type: 'icon', value: 'book' },
                  },
                  {
                    text: '章节',
                    link: '/teacher/chapters',
                    icon: { type: 'icon', value: 'container' },
                    shortcutRoot: true,
                  },
                  {
                    text: '试题',
                    link: '/teacher/questions',
                    icon: { type: 'icon', value: 'profile' },
                    shortcutRoot: true,
                  },
                  {
                    text: '试卷',
                    link: '/teacher/exams',
                    icon: { type: 'icon', value: 'table' },
                    shortcutRoot: true,
                  },
                ],
              },
            ];
          } else if (userInfo.role === 'student') {
            menu = [
              {
                text: '导航栏',
                group: true,
                children: [
                  {
                    text: '总览',
                    link: '/student/overview',
                    icon: { type: 'icon', value: 'dashboard' },
                  },
                  {
                    text: '老师',
                    link: '/student/teachers',
                    icon: { type: 'icon', value: 'team' },
                  },
                  {
                    text: '课程',
                    link: '/student/courses',
                    icon: { type: 'icon', value: 'book' },
                  },
                  {
                    text: '章节',
                    link: '/student/chapters',
                    icon: { type: 'icon', value: 'container' },
                    shortcutRoot: true,
                  },
                  {
                    text: '试卷',
                    link: '/student/exams',
                    icon: { type: 'icon', value: 'table' },
                    shortcutRoot: true,
                  },
                ],
              },
            ];
          } else {
            menu = [
              {
                text: 'Main',
                group: true,
                children: [],
              },
            ];
          }
          // Menu data, https://ng-alain.com/theme/menu
          this.menuService.add(menu);
        },
        () => {},
        () => {
          resolve(null);
        },
      );
  }

  load(): Promise<any> {
    // only works with promises
    // https://github.com/angular/angular/issues/15088
    return new Promise((resolve, reject) => {
      // http
      this.viaHttp(resolve, reject);
    });
  }
}
