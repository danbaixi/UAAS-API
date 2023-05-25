const createRequest = require("../util/request")

// 存放登录所需要的爬虫接口

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

module.exports = {
  getLoginFormData,
  login,
}
