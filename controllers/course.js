const cheerio = require("cheerio")
const request = require("../request/data")
const { getRequestToken, randomString } = require("../util/util")
const { schoolCode } = require("../util/const")
const md5 = require("md5")

// 获取课表
const getList = async (ctx, next) => {
  const cookie = getRequestToken(ctx)
  const formContent = await request.getCourseFormApi(cookie)
  const form = cheerio.load(formContent)
  // 获取hidyzm
  const hidyzm = form("input[name='hidyzm']").val()
  if (!hidyzm) {
    ctx.result = ""
    ctx.msg = "无法获取到hidyzm值"
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
    "week",
    "section",
    "address",
  ]
  const courses = []
  const tables = $("table")
  const courseTable = tables.eq(tables.length - 1)
  const trs = courseTable.find("tbody tr")
  trs.slice(2, trs.length - 1).each((trIndex, tr) => {
    const course = {}
    $(tr)
      .find("td")
      .slice(1)
      .each((tdIndex, td) => {
        course[indexRef[tdIndex]] = $(td).text()
      })
    courses.push(course)
  })
  ctx.result = courses
  return next()
}

module.exports = {
  getList,
}
