const request = require("../requests/13558")
const cheerio = require("cheerio")
const { scoreParser } = require("../parsers/qiangzhi")
const { getCookiesFromHeaders, parseWeeks } = require("../util/util")

// 登录初始化
// 获取cookie和formData
const loginInit = async () => {
  const formDataRaw = await request.getLoginFormRequest()
  const cookie = getCookiesFromHeaders(formDataRaw.headers)
  if (cookie == "") {
    throw new Error("获取cookie失败，请检查教务系统是否限制了本机访问")
  }
  const $ = cheerio.load(formDataRaw.data)
  const formData = {}
  $("#fm1 input[type='hidden']").each((inputIndex, input) => {
    const name = $(input).attr("name")
    const value = $(input).val()
    formData[name] = value
  })
  return { cookie, formData }
}

// 登录验证码
const getLoginVerifyCode = async (cookie) => {
  const content = await request.getLoginVerifyCodeRequest(cookie)
  return content
}

// 登录
const login = async (stuId, password, verifyCode, cookie, formData) => {
  const postData = {
    execution: formData.execution,
    _eventId: formData._eventId,
    lm: formData.lm,
    geolocation: "",
    username: stuId,
    password: password,
    captcha: verifyCode,
  }
  // 统一登录，非教务系统登录
  const content = await request.loginRequest(cookie, postData)
  // 重定向到http://njw.xjistedu.cn/?ticket=xxx
  let location = content.response.headers.location
  const ticketContent = await request.getRedirectContent(location, "")

  // 重定向到http://njw.xjistedu.cn/;jsessionid=A35E509D5CAF4BECDBC76162F1B40677
  location = ticketContent.response.headers.location
  // 获取教务系统cookie
  const JWCookie = getCookiesFromHeaders(ticketContent.response.headers)
  const jsessionidContent = await request.getRedirectContent(location, JWCookie)

  // 重定向到http://njw.xjistedu.cn/jsxsd/xk/LoginToXk
  location = jsessionidContent.response.headers.location
  const loginContent = await request.getRedirectContent(location, JWCookie)
  const loginCookie = getCookiesFromHeaders(loginContent.response.headers)

  // 最终cookie
  const finishCookie = `${JWCookie};${loginCookie}`
  return finishCookie
}

// 获取成绩
const getScoreList = async (cookie) => {
  const postData = {
    xkjs01idshid: "",
    kcsxshid: "",
    kksj: "",
    kcxz: "",
    kcmc: "",
    xsfs: "all",
  }
  const content = await request.getScoresRequest(cookie, postData)
  const $ = cheerio.load(content)
  const scores = scoreParser($)
  return scores
}

// 获取课表
const getCourseList = async (cookie) => {
  const formContent = await request.getCoursesFormRequest(cookie)
  const form$ = cheerio.load(formContent)
  // 获取当前选中学期
  const xnxq01id = form$("#xnxq01id option[selected='selected']").val()
  // 获取kbjcmsid
  const kbjcmsid = form$("#kbjcmsid option[selected='selected']").val()
  const postData = {
    cj0701id: "",
    zc: "",
    demo: "",
    sfFD: 1,
    wkbkc: 1,
    xnxq01id,
    kbjcmsid,
  }
  const content = await request.getCoursesRequest(cookie, postData)
  const courses = []
  // font title 索引
  const fontTitleRef = {
    教师: "teacher",
    "周次(节次)": "rawWeeks",
    教室: "address",
  }
  const $ = cheerio.load(content)
  const trs = $("#timetable tbody tr").slice(1)
  $(trs).each((trIndex, tr) => {
    $(tr)
      .find("td")
      .each((tdIndex, td) => {
        // trIndex表示节次，tdIndex表示星期
        // 0:1-2，1:3-4以此类推
        // tdIndex=0周一，=1周二，以此类推
        let course = {
          section: trIndex * 2 + 1,
          sectionCount: 2, // 固定两小节
          week: tdIndex + 1,
        }
        let courseList = [course]
        const kb = $(td).find(".kbcontent")
        const kbClone = $(kb).clone()
        kbClone.find(":nth-child(n)").remove()
        const kbCloneText = $(kbClone).text().trim()
        if (kbCloneText == "") {
          return
        }
        let multiple = false
        // 多个课程的情况
        const tmp = kbCloneText.split("---------------------")
        if (tmp.length > 1) {
          multiple = true
          courseList.push(Object.assign({}, course))
          courseList[0].name = tmp[0]
          courseList[1].name = tmp[1]
        } else {
          courseList[0].name = kbCloneText
        }
        const pattern = /(\S+)\((\S+)\)\[(\S+)\]/
        for (let ref in fontTitleRef) {
          const dom = $(kb).find("font[title='" + ref + "']")
          $(dom).each((fIndex, f) => {
            const txt = $(f).text()
            courseList[fIndex][fontTitleRef[ref]] = txt

            // 解析周次
            if (fontTitleRef[ref] == "rawWeeks") {
              const match = pattern.exec(txt)
              const fullWeek =
                match[2] == "周" ? "" : match[2] == "单周" ? "单" : "双"
              courseList[fIndex]["weeks"] = parseWeeks(match[1], fullWeek)
            }
          })
        }
        courses.push(...courseList)
      })
  })
  return courses
}

// 获取考勤
// 教务系统没有考勤记录
const getAttendanceList = async () => {
  return []
}

module.exports = {
  loginInit,
  getLoginVerifyCode,
  login,
  getScoreList,
  getCourseList,
}
