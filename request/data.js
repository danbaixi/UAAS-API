const createRequest = require("../util/request")

// 存放获取数据的接口，如成绩、课表、考勤等
// 这类接口需要登录成功后获取cookie

// 成绩请求
const getScoreApi = (cookie, data) => {
  return createRequest({
    url: "/xscj/Stu_MyScore_rpt.aspx",
    method: "POST",
    headers: {
      Cookie: cookie,
      Referer: "https://jwgl.baiyunu.edu.cn/xscj/Stu_MyScore.aspx",
    },
    data,
  })
}

// 考勤请求
const getAttendanceApi = (cookie, data) => {
  return createRequest({
    url: "/JXKQ/Stu_kqjg_rpt.aspx",
    headers: {
      Cookie: cookie,
      Referer: "https://jwgl.baiyunu.edu.cn/JXKQ/Stu_kqjg.aspx",
    },
    data,
  })
}

// 课表查询表单隐藏input值
const getCourseFormApi = (cookie, data) => {
  return createRequest({
    url: "/znpk/Pri_StuSel.aspx",
    headers: {
      Cookie: cookie,
      Referer: "https://jwgl.baiyunu.edu.cn/SYS/menu.aspx",
    },
    data,
  })
}

// 获取课表
const getCourseApi = (cookie, data, m) => {
  return createRequest({
    url: `/znpk/Pri_StuSel_rpt.aspx?m=${m}`,
    method: "POST",
    headers: {
      Cookie: cookie,
      Referer: "https://jwgl.baiyunu.edu.cn/znpk/Pri_StuSel.aspx",
    },
    data,
  })
}

module.exports = {
  getScoreApi,
  getAttendanceApi,
  getCourseFormApi,
  getCourseApi,
}
