const cheerio = require("cheerio")
const request = require("../request/data")
const {
  getRequestToken,
  randomString,
  splitMainName,
  numberToArabic,
  parseWeeks,
  parseSection,
} = require("../util/util")
const { schoolCode } = require("../util/const")
const { courses: coursesTestData } = require("../util/testData")
const md5 = require("md5")

// 获取课表
const getList = async (ctx, next) => {
  // 测试号
  if (ctx.request.headers.isTest) {
    ctx.result = coursesTestData
    return next()
  }
  const cookie = getRequestToken(ctx)
  const formContent = await request.getCourseFormApi(cookie)
  const form = cheerio.load(formContent)
  // 获取hidyzm
  const hidyzm = form("input[name='hidyzm']").val()
  if (!hidyzm) {
    ctx.errMsg = "无法获取到hidyzm值"
    return next()
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
  const content = await request.getCourseApi(cookie, postData, s)
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
  ctx.result = courses
  return next()
}

module.exports = {
  getList,
}
