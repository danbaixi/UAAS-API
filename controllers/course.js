const path = require("path")
const SCHOOL_CODE = require("../util/config")("SCHOOL_CODE")
const servicePath = `${path.resolve(__dirname, "../services")}/${SCHOOL_CODE}`
const services = require(servicePath)

const { getRequestToken } = require("../util/util")
const { courses: coursesTestData } = require("../util/testData")

// 获取课表
const getList = async (ctx, next) => {
  // 测试号
  if (ctx.request.headers.isTest) {
    ctx.result = coursesTestData
    return next()
  }
  const cookie = getRequestToken(ctx)
  try {
    const courses = await services.getCourseList(cookie)
    ctx.result = courses
  } catch (err) {
    ctx.errMsg = err.message
  }
  return next()
}

module.exports = {
  getList,
}
