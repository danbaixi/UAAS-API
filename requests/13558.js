const createRequest = require("../util/request")

// 获取登录需要的params
const getLoginFormRequest = () => {
  return createRequest(
    {
      url: "http://datajq.xjistedu.cn/cas/login?service=http%3A%2F%2Fnjw.xjistedu.cn%2F",
      headers: {
        Host: "datajq.xjistedu.cn",
        Referer: "http://njw.xjistedu.cn",
      },
    },
    {
      returnDataType: "all",
    }
  )
}

// 获取登录验证码
const getLoginVerifyCodeRequest = (cookie) => {
  const timestamp = new Date().getTime()
  return createRequest(
    {
      url: `http://datajq.xjistedu.cn/cas/captcha?timestamp=${timestamp}`,
      responseType: "arraybuffer",
      headers: {
        Cookie: cookie,
        Host: "datajq.xjistedu.cn",
        "Content-Type": "image/jpeg;charset=UTF-8",
      },
    },
    {
      returnDataType: "all",
      notDecode: true,
    }
  )
}

// 登录
const loginRequest = (cookie, data) => {
  return createRequest(
    {
      url: "http://datajq.xjistedu.cn/cas/login?service=http%3A%2F%2Fnjw.xjistedu.cn%2F",
      method: "POST",
      headers: {
        Cookie: cookie,
        Origin: "http://datajq.xjistedu.cn",
        Referer:
          "http://datajq.xjistedu.cn/cas/login?service=http%3A%2F%2Fnjw.xjistedu.cn%2F",
        Host: "datajq.xjistedu.cn",
      },
      data,
    },
    {
      returnDataType: "all",
      redirect: true, // 302重定向问题
    }
  )
}

// 获取重定向内容
const getRedirectContent = (url, cookie) => {
  return createRequest(
    {
      url,
      headers: {
        Cookie: cookie,
        Host: "njw.xjistedu.cn",
        Referer: "http://datajq.xjistedu.cn",
      },
    },
    {
      returnDataType: "all",
      redirect: true, // 解决302的问题
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
      Referer: "http://njw.xjistedu.cn/jsxsd/kscj/cjcx_query",
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
  getLoginVerifyCodeRequest,
  loginRequest,
  getScoresRequest,
  getCoursesFormRequest,
  getCoursesRequest,
  getRedirectContent,
}
