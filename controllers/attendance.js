const { getRequestToken } = require("../util/util")
const path = require("path")
const SCHOOL_CODE = require("../util/config")("SCHOOL_CODE")
const servicePath = `${path.resolve(__dirname, "../services")}/${SCHOOL_CODE}`
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
