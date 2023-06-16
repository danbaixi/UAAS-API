# 高校教务系统 API(非官方)
University Academic Affairs System API(Google说的)， 简称UAAS-API

使用Koa.js构建的部分高校教务系统 API

通过跨站请求伪造(CSRF)，伪造正常请求获取数据，**本项目仅供学习，请勿使用于商业项目。**

> 请注意，如果你的学校没有在支持名单中，可以使用测试号进行测试！
> **测试号为 stuId: test，password: 123456**

## 已支持学校
目前已适配青果系统、强智系统，其他系统待补充。
1. 广东白云学院 10822 青果
2. 江西软件职业技术大学 13776 强智
3. 新疆理工学院 13558 强智
4. 广州番禺职业技术学院 12046 强智 【未完全支持】

## 支持的接口列表
1. 登录
2. 获取课表
3. 获取成绩
4. 获取原始成绩(青果系统)
5. 获取考勤

## 环境要求

NodeJS 16+

## 安装

```shell
git clone https://github.com/danbaixi/UAAS-API.git
cd UAAS-API
npm install
```
## 配置文件
拷贝`env.example`，重命名为`.env`，`SCHOOL_CODE`填学校代号，默认为`test`

## 运行

默认使用`3000`端口，可自行设置`.env`中的`PORT`

```shell
npm start
```

## 如何适配你的学校

### 1.找到你学校教务系统的类型
首先要了解你们学校教务系统使用的是哪个第三方系统，有`青果`、`强智`、`方正`等系统，不同系统的爬虫程序不一样。

### 2.需要掌握一些爬虫和网络请求知识
主要思路：使用`axios`模拟请求教务系统一些接口，通过`cheerio`解析网页数据，处理数据后以`json`格式返回。

### 3.目录说明
`public/school.json` 存放学校列表，需要填写一些教务系统信息

`controllers`和`routes`目录存放控制器和路由，所有学校都一样，不需要更改。

`services`存放爬虫服务，以学校代码为文件名，分别要实现`login`、`getCourseList`、`getScoreList`、`getAttendanceList`等方法。

`requests`存放爬虫请求列表，以学校代码为文件名，使用了`util/request.js`提供的`createRequest`方法去创建爬虫请求，供 `services`使用。

`util/responseInterceptors.js`存放响应拦截，主要用于判断token失效

### 4.观看视频讲解，动手开发
视频正在录制，待补充...

## API 文档说明

接口使用 ApiFox 管理，请访问在线文档阅读 API

[访问 API 在线文档](https://uaas-api.apifox.cn/)

## License

[The MIT License](https://github.com/danbaixi/UAAS-API/blob/main/LICENSE)
