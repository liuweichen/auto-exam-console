import { Component, Inject, OnDestroy, Optional } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StartupService } from '@core';
import { ReuseTabService } from '@delon/abc/reuse-tab';
import { DA_SERVICE_TOKEN, ITokenService, SocialService } from '@delon/auth';
import { _HttpClient } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'passport-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.less'],
  providers: [SocialService],
})
export class UserLoginComponent implements OnDestroy {
  constructor(
    fb: FormBuilder,
    private router: Router,
    @Optional()
    @Inject(ReuseTabService)
    private reuseTabService: ReuseTabService,
    @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService,
    private startupSrv: StartupService,
    public http: _HttpClient,
    public msg: NzMessageService,
  ) {
    this.form = fb.group({
      studentName: [null, [Validators.required, Validators.pattern('^.{3,128}$')]],
      studentPassword: [null, [Validators.required, Validators.pattern('^.{3,128}$')]],
      teacherName: [null, [Validators.required, Validators.pattern('^.{3,128}$')]],
      teacherPassword: [null, [Validators.required, Validators.pattern('^.{3,128}$')]],
      remember: [true],
    });
  }

  // #region fields

  get studentName(): AbstractControl {
    return this.form.controls.studentName;
  }
  get studentPassword(): AbstractControl {
    return this.form.controls.studentPassword;
  }
  get teacherName(): AbstractControl {
    return this.form.controls.teacherName;
  }
  get teacherPassword(): AbstractControl {
    return this.form.controls.teacherPassword;
  }
  form: FormGroup;
  error = '';
  type = 0;
  count = 0;
  interval$: any;

  switch({ index }: { index: number }): void {
    this.type = index;
  }

  submit(): void {
    this.error = '';
    let url: string;
    let name: string;
    let password: string;
    let role: string = '';
    if (this.type === 0) {
      this.studentName.markAsDirty();
      this.studentName.updateValueAndValidity();
      this.studentPassword.markAsDirty();
      this.studentPassword.updateValueAndValidity();
      if (this.studentName.invalid || this.studentPassword.invalid) {
        return;
      }
      url = 'apiserver/login/student';
      name = this.studentName.value;
      password = this.studentPassword.value;
      role = 'student';
    } else {
      this.teacherName.markAsDirty();
      this.teacherName.updateValueAndValidity();
      this.teacherPassword.markAsDirty();
      this.teacherPassword.updateValueAndValidity();
      if (this.teacherName.invalid || this.teacherPassword.invalid) {
        return;
      }
      url = 'apiserver/login/teacher';
      name = this.teacherName.value;
      password = this.teacherPassword.value;
      role = 'teacher';
    }

    // 默认配置中对所有HTTP请求都会强制 [校验](https://ng-alain.com/auth/getting-started) 用户 Token
    // 然一般来说登录请求不需要校验，因此可以在请求URL加上：`/login?_allow_anonymous=true` 表示不触发用户 Token 校验
    this.http
      .post(url, {
        name,
        password,
      })
      .subscribe((res) => {
        // 清空路由复用信息
        this.reuseTabService.clear();
        // 设置用户Token信息
        this.tokenService.set(res);
        // 重新获取 StartupService 内容，我们始终认为应用信息一般都会受当前用户授权范围而影响
        this.startupSrv.load().then(() => {
          const dashboardUrl = '/' + role;
          let url = this.tokenService.referrer!.url || dashboardUrl;
          if (url.includes('/login')) {
            url = dashboardUrl;
          }
          this.router.navigateByUrl(url);
        });
      });
  }

  ngOnDestroy(): void {
    if (this.interval$) {
      clearInterval(this.interval$);
    }
  }
}
