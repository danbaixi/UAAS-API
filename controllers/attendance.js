const { attendances: testAttendanceData } = require("../util/testData")
const { getRequestToken } = require("../util/util")
const path = require("path")
const servicePath = `${path.resolve(__dirname, "../services")}/${
  process.env.SCHOOL_CODE
}`
const services = require(servicePath)

// 获取考勤列表
const getList = async (ctx, next) => {
  const cookie = getRequestToken(ctx)
  try {
    const attendances = await services.getAttendanceList(cookie)
    ctx.result = attendances
  } catch (err) {
    ctx.errMsg = err.message
  }
  return next()
}

module.exports = {
  getList,
}
