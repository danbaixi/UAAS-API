const createRequest = require("../util/request")

// 获取登录需要的params
const getLoginFormRequest = () => {
  return createRequest(
    {
      url: "/",
    },
    {
      returnDataType: "all",
    }
  )
}

// 登录
const loginRequest = (cookie, data) => {
  return createRequest(
    {
      url: "/xk/LoginToXk",
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: "http://eam.jxuspt.com:8588",
        Referer: "http://eam.jxuspt.com:8588/jsxsd/",
      },
      data,
    },
    {
      returnDataType: "all",
      redirect: true, // 302重定向问题
    }
  )
}

// 成绩请求
const getScoresRequest = (cookie, data) => {
  return createRequest({
    url: "/kscj/cjcx_list",
    method: "POST",
    headers: {
      Cookie: cookie,
    },
    data,
  })
}

// 课表查询表单隐藏input值
const getCoursesFormRequest = (cookie, data) => {
  return createRequest({
    url: "/xskb/xskb_list.do",
    headers: {
      Cookie: cookie,
      Referer: "http://eam.jxuspt.com:8588/jsxsd/framework/xsMainV.htmlx",
    },
  })
}

// 获取课表
const getCoursesRequest = (cookie, data) => {
  return createRequest({
    url: "/xskb/xskb_list.do",
    method: "POST",
    headers: {
      Cookie: cookie,
      Referer: "http://eam.jxuspt.com:8588/jsxsd/framework/xsMainV.htmlx",
    },
    data,
  })
}

module.exports = {
  getLoginFormRequest,
  loginRequest,
  getScoresRequest,
  getCoursesFormRequest,
  getCoursesRequest,
}
