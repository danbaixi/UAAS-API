const createRequest = require("../util/request")

// 获取登录需要的params
const getLoginFormData = () => {
  return createRequest(
    {
      url: "/_data/login_home.aspx",
    },
    {
      returnDataType: "all",
    }
  )
}

// 登录
const login = (cookie, data, userAgent) => {
  return createRequest({
    url: "/_data/login_home.aspx",
    method: "POST",
    headers: {
      Cookie: cookie,
      Origin: "https://jwgl.baiyunu.edu.cn",
      Referer: "https://jwgl.baiyunu.edu.cn/_data/login_home.aspx",
      "User-Agent": userAgent,
    },
    data,
  })
}

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
  getLoginFormData,
  login,
  getScoreApi,
  getAttendanceApi,
  getCourseFormApi,
  getCourseApi,
}
