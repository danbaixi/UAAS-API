const request = require("../requests/10822")
const md5 = require("md5")
const cheerio = require("cheerio")
const getSchoolConfig = require("../util/schoolConfig")
const {
  buildExpression,
  getUserAgent,
  matchTermName,
  splitMainName,
  randomString,
  numberToArabic,
  parseWeeks,
  parseSection,
} = require("../util/util")

// 成绩请求参数
// SJ=1 有效成绩，=0 原始成绩
const scorePostData = {
  SJ: 1,
  btn_search: "",
  SelXNXQ: 0,
  zfx_flag: 0,
  shownocomputjd: 1,
  zxf: 0,
  hidparam_xh: "",
}

// 登录初始化
const loginInit = async () => {
  const formDataRaw = await request.getLoginFormRequest()
  let cookie = ""
  for (let c of formDataRaw.headers["set-cookie"]) {
    if (c.indexOf("ASP.NET_SessionId") > -1) {
      cookie = c.split("; ")[0]
      break
    }
  }
  if (cookie == "") {
    throw new Error("获取cookie失败，请检查教务系统是否限制了本机访问")
  }
  const $ = cheerio.load(formDataRaw.data)
  const formData = {}
  formData["__VIEWSTATE"] = $("input[name='__VIEWSTATE']").val()
  formData["__VIEWSTATEGENERATOR"] = $(
    "input[name='__VIEWSTATEGENERATOR']"
  ).val()
  formData["__EVENTVALIDATION"] = $("input[name='__EVENTVALIDATION']").val()

  // 是否需要输入验证码
  formData["validcodestate"] = $("input[name='validcodestate']").val()

  return { cookie, formData }
}

// 登录
const login = async (stuId, password) => {
  const schoolCode = getSchoolConfig("code")
  // 获取cookie和formData
  const { cookie, formData } = await loginInit()
  // 处理登录表单参数
  const tmpA = md5(password).substring(0, 30).toLocaleUpperCase()
  let dsdsdsdsdxcxdfgfg = md5(stuId + tmpA + schoolCode)
    .substring(0, 30)
    .toLocaleUpperCase()
  let fgfggfdgtyuuyyuuckjg = ""
  // 如果要填写验证码，这个字段必填
  if (formData["validcodestate"] == 1) {
    fgfggfdgtyuuyyuuckjg = md5(
      md5(password.toUpperCase()).substring(0, 30) + schoolCode
    )
      .substring(0, 30)
      .toUpperCase()
  }

  const pcInfo = getUserAgent()
  const postData = {
    ...formData,
    pcInfo: pcInfo,
    txt_mm_userzh: 0,
    txt_mm_length: password.length,
    txt_mm_expression: buildExpression(password),
    dsdsdsdsdxcxdfgfg: dsdsdsdsdxcxdfgfg,
    fgfggfdgtyuuyyuuckjg: fgfggfdgtyuuyyuuckjg,
    txt_asmcdefsddsd: stuId,
    txt_pewerwedsdfsdff: "",
    Sel_Type: "STU",
    txt_psasas: "",
    typeName: "",
  }
  //console.log("postData", postData)

  const res = await request.loginRequest(cookie, postData, pcInfo)
  const $ = cheerio.load(res)
  const tips = $("#divLogNote").html()
  if (tips.indexOf("正在加载") == -1) {
    // 登录失败
    throw new Error(tips)
  }
  return cookie
}

// 获取课表
const getCourseList = async (cookie) => {
  const schoolCode = getSchoolConfig("code")
  const formContent = await request.getCoursesFormRequest(cookie)
  const form = cheerio.load(formContent)
  // 获取hidyzm
  const hidyzm = form("input[name='hidyzm']").val()
  if (!hidyzm) {
    throw new Error("无法获取到hidyzm值")
  }
  // 获取学期
  let term = form("select[name='Sel_XNXQ']").find("option").eq(0).val()
  if (!term) {
    term = "20221"
  }
  const s = randomString(15)
  const hidsjyzm = md5(schoolCode + term + s).toUpperCase()
  const postData = {
    Sel_XNXQ: term,
    rad: 1,
    px: 0,
    txt_yzm: "",
    hidyzm,
    hidsjyzm,
  }
  // 获取课表
  const content = await request.getCoursesRequest(cookie, postData, s)
  const $ = cheerio.load(content)
  // 索引映射
  const indexRef = [
    "name",
    "credit",
    "totalHours",
    "lectureHours",
    "computeHours",
    "category",
    "teachMethod",
    "method",
    "teacher",
    "weeks",
    "section",
    "address",
  ]
  const courses = []
  const tables = $("table")
  const courseTable = tables.eq(tables.length - 1)
  const trs = courseTable.find("tbody tr")
  let prevCourseInfo = null
  trs.slice(2, trs.length - 1).each((trIndex, tr) => {
    let course = {}
    let isSameCourse = false
    const tds = $(tr).find("td").slice(1)
    if (tds.eq(0).text() == "") {
      // 相同课程
      isSameCourse = true
    }
    tds.slice().each((tdIndex, td) => {
      const txt = $(td).text()
      if (isSameCourse && txt == "" && tdIndex < 9) {
        course[indexRef[tdIndex]] = prevCourseInfo[indexRef[tdIndex]]
        return
      }
      course[indexRef[tdIndex]] = txt
      if (tdIndex == 0 && txt != "") {
        const [num, name] = splitMainName(txt)
        course["num"] = num
        course["name"] = name
      }
    })
    // 备份解析前的数据
    course["rawWeeks"] = course["weeks"]
    course["rawSection"] = course["section"]
    // 解析周次，星期，节次
    const pattern = /^(\S+)\[(\S+)节\](\S?)$/
    const match = pattern.exec(course.section)
    const { section, sectionCount } = parseSection(match[2])
    const fullWeek = match[3]
    course["week"] = numberToArabic(match[1])
    course["section"] = section
    course["sectionCount"] = sectionCount
    course["weeks"] = parseWeeks(course["weeks"], fullWeek)
    prevCourseInfo = course
    courses.push(course)
  })
  return courses
}

// 获取有效成绩
const getScoreList = async (cookie) => {
  scorePostData.SJ = 1
  const content = await request.getScoresRequest(cookie, scorePostData)
  const $ = cheerio.load(content)
  // 解析成绩表格
  const scores = []
  let scoreItem = Object.assign({})
  // 表格列索引与成绩字段的映射
  const indexRef = [
    "name",
    "courseCredit",
    "category",
    "courseCategory",
    "method",
    "property",
    "score",
    "credit",
    "GP",
    "GPA",
    "mark",
  ]
  const trs = $("#ID_Table tbody tr")
  trs.each((trIndex, tr) => {
    const score = {}
    $(tr)
      .find("td")
      .each((tdIndex, td) => {
        $(td).find("br").remove() // 除去br
        const txt = $(td).text()
        if (tdIndex == 0 && txt != "") {
          if (trIndex > 0) {
            scores.push(scoreItem)
          }
          scoreItem = Object.assign({
            termName: txt,
            scoreList: [],
          })
        } else if (tdIndex > 0) {
          score[indexRef[tdIndex - 1]] = txt
          // 分离名称和代码
          if (tdIndex == 1) {
            const [num, name] = splitMainName(txt)
            score["num"] = num
            score["name"] = name
          }
        }
      })
    scoreItem.scoreList.push(score)
    if (trIndex == trs.length - 1) {
      scores.push(scoreItem)
    }
  })
  return scores
}

// 获取全部原始成绩
const getRawScoreList = async (cookie) => {
  scorePostData.SJ = 0
  const content = await request.getScoresRequest(cookie, scorePostData)
  const $ = cheerio.load(content)
  // 解析成绩表格
  const scores = []
  let scoreItem = Object.assign({})
  // 表格列索引与成绩字段的映射
  const indexRef = [
    "name",
    "courseCredit",
    "category",
    "courseCategory",
    "method",
    "property",
    "normalScore",
    "midtermScore",
    "finalScore",
    "skillScore",
    "complexScore",
    "minorMark",
    "mark",
  ]
  const tables = $("table[name='theExportData']").slice(1)
  tables.each((tableIndex, table) => {
    const trDom = $(table).find("tbody tr")
    // 跳过 tr length = 2的表格
    if (trDom.length == 2) {
      return
    }
    trDom.each((trIndex, tr) => {
      const score = {}
      const tdDom = $(tr).find("td")
      if (tdDom.length == 1) {
        if (tableIndex > 0) {
          scores.push(scoreItem)
        }
        const txt = $(tdDom[0]).text()
        scoreItem = Object.assign({
          termName: matchTermName(txt),
          scoreList: [],
        })
        return
      }
      tdDom.slice(1).each((tdIndex, td) => {
        const txt = $(td).text()
        score[indexRef[tdIndex]] = txt
        // 分离名称和代码
        if (tdIndex == 0) {
          const [num, name] = splitMainName(txt)
          score["num"] = num
          score["name"] = name
        }
      })
      scoreItem.scoreList.push(score)
    })
    if (tableIndex == tables.length - 1) {
      scores.push(scoreItem)
    }
  })
  return scores
}

// 获取考勤列表
const getAttendanceList = async (cookie) => {
  const content = await request.getAttendancesRequest(cookie)
  const $ = cheerio.load(content)
  const attendances = []
  let attendanceItem = Object.assign({})
  const indexRef = [
    "course",
    "teacher",
    "classroom",
    "week",
    "section",
    "date",
    "reason",
    "mark",
  ]
  const tables = $("table")
  tables.each((tableIndex, table) => {
    const trDom = $(table).find("tbody tr")
    if (trDom.length == 1) {
      if (tableIndex > 0) {
        attendances.push(attendanceItem)
      }
      const txt = $(trDom[0]).children("td").slice(0).text()
      attendanceItem = Object.assign({
        termName: matchTermName(txt),
        attendanceList: [],
      })
      return
    }
    let attendance = {}
    trDom.slice(1).each((trIndex, tr) => {
      const tds = $(tr).find("td")
      tds.each((tdIndex, td) => {
        const txt = $(td).text()
        attendance[indexRef[tdIndex]] = txt
        if (tdIndex == 0) {
          const [num, name] = splitMainName(txt)
          attendance["courseNum"] = num
          attendance["course"] = name
        }
        if (tdIndex == 1) {
          const [num, name] = splitMainName(txt)
          attendance["teacherNum"] = num
          attendance["teacher"] = name
        }
        if (tdIndex == tds.length - 1) {
          attendanceItem.attendanceList.push(attendance)
          attendance = {}
        }
      })
    })
    if (tableIndex == tables.length - 1) {
      attendances.push(attendanceItem)
    }
  })
  return attendances
}

module.exports = {
  login,
  getCourseList,
  getScoreList,
  getRawScoreList,
  getAttendanceList,
}
