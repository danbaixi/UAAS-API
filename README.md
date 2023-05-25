# 白云学院教务系统 API(非官方)

广东白云学院教务管理系统 Node.js API Service

通过跨站请求伪造(CSRF)，伪造正常请求获取数据，**本项目仅供学习，请勿使用于商业项目。**

## 环境要求

NodeJS 12+

## 安装

```shell
git clone https://github.com/danbaixi/BaiyunAPI.git
cd BaiyunAPI
npm install
```

## 运行

默认使用 3000 端口

```shell
npm start
```

## API 文档说明

[访问在线文档](https://baiyun-api.apifox.cn/)

### POST 登录

POST /login

> Body 请求参数

```yaml
stuId: 0
password: string
```

### 请求参数

| 名称       | 位置 | 类型   | 必选 | 说明 |
| ---------- | ---- | ------ | ---- | ---- |
| body       | body | object | 否   | none |
| » stuId    | body | number | 是   | 学号 |
| » password | body | string | 是   | 密码 |

> 返回示例

> 成功

```json
{
  "code": 0,
  "msg": "请求成功",
  "data": {
    "cookie": "ASP.NET_SessionId=xxxx"
  }
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | 成功 | Inline   |

### 返回数据结构

状态码 **200**

| 名称      | 类型    | 必选 | 约束 | 中文名 | 说明                                |
| --------- | ------- | ---- | ---- | ------ | ----------------------------------- |
| » code    | integer | true | none |        | none                                |
| » msg     | string  | true | none |        | none                                |
| » data    | object  | true | none |        | none                                |
| »» cookie | string  | true | none | cookie | 登录成功返回的 cookie，用于请求数据 |

### GET 获取全部有效成绩

GET /scores

### 请求参数

| 名称  | 位置   | 类型   | 必选 | 说明 |
| ----- | ------ | ------ | ---- | ---- |
| token | header | string | 是   | none |

> 返回示例

> 成功

```json
{
  "code": 0,
  "msg": "请求成功",
  "data": [
    {
      "termName": "2022-2023学年第一学期",
      "scoreList": [
        {
          "name": "[B1011003]军事训练",
          "courseCredit": "2.0",
          "category": "其他",
          "courseCategory": "",
          "method": "考查",
          "property": "初修",
          "score": "86.00",
          "credit": "2.0",
          "GP": "3.6",
          "GPA": "7.20",
          "mark": ""
        }
      ]
    }
  ]
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | 成功 | Inline   |

### 返回数据结构

状态码 **200**

| 名称               | 类型     | 必选 | 约束 | 中文名   | 说明 |
| ------------------ | -------- | ---- | ---- | -------- | ---- |
| » code             | integer  | true | none |          | none |
| » msg              | string   | true | none |          | none |
| » data             | [object] | true | none |          | none |
| »» termName        | string   | true | none | 学期名称 | none |
| »» scoreList       | [object] | true | none | 成绩列表 | none |
| »»» name           | string   | true | none | 课程名称 | none |
| »»» courseCredit   | string   | true | none | 课程学分 | none |
| »»» category       | string   | true | none | 类型     | none |
| »»» courseCategory | string   | true | none | 课程类型 | none |
| »»» method         | string   | true | none | 考核方式 | none |
| »»» property       | string   | true | none | 修读性质 | none |
| »»» score          | string   | true | none | 分数     | none |
| »»» credit         | string   | true | none | 学分     | none |
| »»» GP             | string   | true | none | 绩点     | none |
| »»» GPA            | string   | true | none | 学分绩点 | none |
| »»» mark           | string   | true | none | 备注     | none |

### GET 获取全部原始成绩

GET /raw-scores

### 请求参数

| 名称  | 位置   | 类型   | 必选 | 说明 |
| ----- | ------ | ------ | ---- | ---- |
| token | header | string | 是   | none |

> 返回示例

> 成功

```json
{
  "code": 0,
  "msg": "请求成功",
  "data": [
    {
      "termName": "2022-2023学年第一学期",
      "scoreList": [
        {
          "name": "[B1011003]军事训练",
          "courseCredit": "2.0",
          "category": "其他",
          "courseCategory": "",
          "method": "考查",
          "property": "初修",
          "normalScore": "",
          "midtermScore": "",
          "finalScore": "",
          "skillScore": "",
          "complexScore": "86.00",
          "minorMark": "主修",
          "mark": ""
        }
      ]
    }
  ]
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | 成功 | Inline   |

### 返回数据结构

状态码 **200**

| 名称               | 类型     | 必选 | 约束 | 中文名   | 说明 |
| ------------------ | -------- | ---- | ---- | -------- | ---- |
| » code             | integer  | true | none |          | none |
| » msg              | string   | true | none |          | none |
| » data             | [object] | true | none |          | none |
| »» termName        | string   | true | none | 学期名称 | none |
| »» scoreList       | [object] | true | none | 分数列表 | none |
| »»» name           | string   | true | none | 课程名称 | none |
| »»» courseCredit   | string   | true | none | 课程学分 | none |
| »»» category       | string   | true | none | 类型     | none |
| »»» courseCategory | string   | true | none | 课程类型 | none |
| »»» method         | string   | true | none | 考核方式 | none |
| »»» property       | string   | true | none | 初修性质 | none |
| »»» normalScore    | string   | true | none | 平时分   | none |
| »»» midtermScore   | string   | true | none | 期中分数 | none |
| »»» finalScore     | string   | true | none | 期末分数 | none |
| »»» skillScore     | string   | true | none | 技能分数 | none |
| »»» complexScore   | string   | true | none | 综合分数 | none |
| »»» minorMark      | string   | true | none | 主修标记 | none |
| »»» mark           | string   | true | none | 备注     | none |

### GET 获取全部考勤记录

GET /attendances

### 请求参数

| 名称  | 位置   | 类型   | 必选 | 说明 |
| ----- | ------ | ------ | ---- | ---- |
| token | header | string | 是   | none |

> 返回示例

> 成功

```json
{
  "code": 0,
  "msg": "请求成功",
  "data": [
    {
      "termName": "2020-2021学年第二学期",
      "attendanceList": [
        {
          "teacher": "[200202009]桑立群",
          "classroom": "270777-018",
          "week": "02",
          "section": "三(03节)",
          "date": "2021-03-10",
          "reason": "旷课",
          "mark": ""
        },
        {
          "teacher": "[200202009]桑立群",
          "classroom": "270777-018",
          "week": "02",
          "section": "三(04节)",
          "date": "2021-03-10",
          "reason": "旷课",
          "mark": ""
        }
      ]
    }
  ]
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | 成功 | Inline   |

### 返回数据结构

状态码 **200**

| 名称              | 类型     | 必选 | 约束 | 中文名   | 说明 |
| ----------------- | -------- | ---- | ---- | -------- | ---- |
| » code            | integer  | true | none |          | none |
| » msg             | string   | true | none |          | none |
| » data            | [object] | true | none |          | none |
| »» termName       | string   | true | none | 学期     | none |
| »» attendanceList | [object] | true | none | 考勤记录 | none |
| »»» name          | string   | true | none | 课程名称 | none |
| »»» teacher       | string   | true | none | 老师     | none |
| »»» classroom     | string   | true | none | 教室编号 | none |
| »»» week          | string   | true | none | 周次     | none |
| »»» section       | string   | true | none | 节次     | none |
| »»» date          | string   | true | none | 日期     | none |
| »»» reason        | string   | true | none | 考勤原因 | none |
| »»» mark          | string   | true | none | 备注     | none |

### GET 获取最新学期课表

GET /courses

教务系统目前仅支持获取当前学期的课表，不支持获取以前学期的课表

### 请求参数

| 名称  | 位置   | 类型   | 必选 | 说明 |
| ----- | ------ | ------ | ---- | ---- |
| token | header | string | 是   | none |

> 返回示例

> 成功

```json
{
  "code": 0,
  "msg": "请求成功",
  "data": [
    {
      "name": "[U1300007]思想政治实践课1",
      "credit": "1.0",
      "totalHours": "16.0",
      "lectureHours": "0.0",
      "computeHours": "0.0",
      "category": "公共课/必修课",
      "teachMethod": "讲授",
      "method": "非统考",
      "teacher": "甘正亚",
      "week": "3-18",
      "section": "五[11-12节]单",
      "address": ""
    }
  ]
}
```

### 返回结果

| 状态码 | 状态码含义                                              | 说明 | 数据模型 |
| ------ | ------------------------------------------------------- | ---- | -------- |
| 200    | [OK](https://tools.ietf.org/html/rfc7231#section-6.3.1) | 成功 | Inline   |

### 返回数据结构

状态码 **200**

| 名称            | 类型     | 必选 | 约束 | 中文名   | 说明 |
| --------------- | -------- | ---- | ---- | -------- | ---- |
| » code          | integer  | true | none |          | none |
| » msg           | string   | true | none |          | none |
| » data          | [object] | true | none |          | none |
| »» name         | string   | true | none | 课程名称 | none |
| »» credit       | string   | true | none | 学分     | none |
| »» totalHours   | string   | true | none | 总学时   | none |
| »» lectureHours | string   | true | none | 讲授学时 | none |
| »» computeHours | string   | true | none | 上机学时 | none |
| »» category     | string   | true | none | 类别     | none |
| »» teachMethod  | string   | true | none | 讲授方式 | none |
| »» method       | string   | true | none | 考察方式 | none |
| »» teacher      | string   | true | none | 教室     | none |
| »» week         | string   | true | none | 周数     | none |
| »» section      | string   | true | none | 节次     | none |
| »» address      | string   | true | none | 教室     | none |

## License

[The MIT License](https://github.com/danbaixi/BaiyunAPI/blob/main/LICENSE)
