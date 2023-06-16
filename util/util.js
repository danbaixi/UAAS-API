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

// 解析周数
// week 周次范围
// fullWeek 是否为全周，空为全周
function parseWeeks(week, fullWeek) {
  const result = []
  const ranges = week.split(",")
  ranges.map((range) => {
    const nums = range.split("-")
    if (nums.length == 1) {
      result.push(parseInt(nums[0]))
    } else {
      for (let i = parseInt(nums[0]); i <= parseInt(nums[1]); i++) {
        if (
          fullWeek == "" ||
          (fullWeek == "单" && i % 2 == 1) ||
          (fullWeek == "双" && i % 2 == 0)
        ) {
          result.push(i)
          continue
        }
      }
    }
  })
  return result
}

// 解析节次
// 返回首节数和节次数量
function parseSection(sections) {
  const nums = sections.split("-")
  const section = parseInt(nums[0])
  const sectionCount = nums[1] - nums[0] + 1
  return {
    section,
    sectionCount,
  }
}

// 大写数字转阿拉伯
function numberToArabic(num) {
  const obj = {
    一: 1,
    二: 2,
    三: 3,
    四: 4,
    五: 5,
  }
  return obj[num] ? obj[num] : ""
}

// encodeInp
function encodeInp(input) {
  const keyStr =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="
  var output = ""
  var chr1,
    chr2,
    chr3 = ""
  var enc1,
    enc2,
    enc3,
    enc4 = ""
  var i = 0
  do {
    chr1 = input.charCodeAt(i++)
    chr2 = input.charCodeAt(i++)
    chr3 = input.charCodeAt(i++)
    enc1 = chr1 >> 2
    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4)
    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6)
    enc4 = chr3 & 63
    if (isNaN(chr2)) {
      enc3 = enc4 = 64
    } else if (isNaN(chr3)) {
      enc4 = 64
    }
    output =
      output +
      keyStr.charAt(enc1) +
      keyStr.charAt(enc2) +
      keyStr.charAt(enc3) +
      keyStr.charAt(enc4)
    chr1 = chr2 = chr3 = ""
    enc1 = enc2 = enc3 = enc4 = ""
  } while (i < input.length)
  return output
}

// 获取响应头的cookies
function getCookiesFromHeaders(headers) {
  const cookies = []
  for (let c of headers["set-cookie"]) {
    cookies.push(c.split(";")[0])
  }
  return cookies.join(";")
}

module.exports = {
  buildExpression,
  getUserAgent,
  getRequestToken,
  matchTermName,
  randomString,
  splitMainName,
  parseWeeks,
  numberToArabic,
  parseSection,
  encodeInp,
  getCookiesFromHeaders,
}
