import { Component, OnInit } from '@angular/core';
import { _HttpClient } from '@delon/theme';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.less'],
})
export class DashboardComponent implements OnInit {
  constructor(private http: _HttpClient) {}
  array = [
    {
      title: '老师',
      content: '老师可以自定义创建课程，在课程下创建章节，在章节下创建试题，不同老师之间资源彼此隔离',
    },
    {
      title: '学生',
      content: '学生可以查看系统中所有的老师，课程，章节，试卷，并可以做题练习',
    },
    {
      title: '图片',
      content: '支持试题添加图片，并支持预览图片',
    },
    {
      title: '公式',
      content: '支持试题内容和选项中添加公式（MathJax），公式教程参见：https://www.mathjax.org/',
    },
    {
      title: '试卷',
      content: '支持试题组卷，可以将创建的试题导入到试卷中组成试卷',
    },
    {
      title: '试题批量导入导出',
      content: '试题支持批量导出到excel文件中，并支持选择excel文件批量导入试题',
    },
  ];
  ngOnInit(): void {}
}
