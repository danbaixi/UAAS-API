function charType(num) {
  if (num >= 48 && num <= 57) {
    return 8
  }
  if (num >= 97 && num <= 122) {
    return 4
  }
  if (num >= 65 && num <= 90) {
    return 2
  }
  return 1
}

// 计算expression
function buildExpression(str) {
  let result = 0
  for (let i = 0; i < str.length; i++) {
    const char = str[i]
    result |= charType(str.charCodeAt(i))
  }
  return result
}

// 随机获取user-agent
function getUserAgent() {
  return "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36"
  // const fakeUa = require("fake-useragent")
  // return fakeUa()
}

// 获取请求头的token
function getRequestToken(ctx) {
  return ctx.request.headers.token
}

// 提取学习名称
function matchTermName(str) {
  const pattern = /[\d]{4}-[\d]{4}学年第[\S]学期/
  const termName = str.match(pattern)[0]
  return termName
}

//生成随机字符串
function randomString(len) {
  len = len || 32
  var ss = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
  var maxPos = ss.length
  var pwd = ""
  for (i = 0; i < len; i++) {
    pwd += ss.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}

// 分离名称和代码
// [U12312]计算机网络
// [2031293]江老师
function splitMainName(str) {
  const reg = /\[(\w+)\](.+)/
  const result = str.match(reg)
  if (!result) {
    return false
  }
  return [result[1], result[2]]
}

module.exports = {
  buildExpression,
  getUserAgent,
  getRequestToken,
  matchTermName,
  randomString,
  splitMainName,
}
