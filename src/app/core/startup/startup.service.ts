import { Injectable, Injector, Inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { MenuService, SettingsService, TitleService, ALAIN_I18N_TOKEN, _HttpClient } from '@delon/theme';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { ACLService } from '@delon/acl';
import { TranslateService } from '@ngx-translate/core';
import { I18NService } from '../i18n/i18n.service';

import { NzIconService } from 'ng-zorro-antd/icon';
import { ICONS } from '../../../style-icons';
import { ICONS_AUTO } from '../../../style-icons-auto';

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
    private injector: Injector,
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

  private viaHttp(resolve: any, reject: any) {
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
          this.settingService.setUser(res);

          let menu;
          if (userInfo.role == 'teacher') {
            menu = [
              {
                text: 'Main',
                group: true,
                children: [
                  {
                    text: 'Courses',
                    link: '/teacher/courses',
                    icon: { type: 'icon', value: 'appstore' },
                  },
                  {
                    text: 'Chapters',
                    link: '/teacher/chapters',
                    icon: { type: 'icon', value: 'rocket' },
                    shortcutRoot: true,
                  },
                  {
                    text: 'Questions',
                    link: '/teacher/questions',
                    icon: { type: 'icon', value: 'rocket' },
                    shortcutRoot: true,
                  },
                ],
              },
            ];
          } else if (userInfo.role == 'student') {
            menu = [
              {
                text: 'Main',
                group: true,
                children: [
                  {
                    text: 'Teachers',
                    link: '/teachers',
                    icon: { type: 'icon', value: 'appstore' },
                  },
                  {
                    text: 'Courses',
                    link: '/courses',
                    icon: { type: 'icon', value: 'appstore' },
                  },
                  {
                    text: 'Chapters',
                    link: '/chapters',
                    icon: { type: 'icon', value: 'rocket' },
                    shortcutRoot: true,
                  },
                  {
                    text: 'Questions',
                    link: '/questions',
                    icon: { type: 'icon', value: 'rocket' },
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
