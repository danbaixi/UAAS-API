const { getRequestToken } = require("../util/util")
const {
  scores: scoresTestData,
  rawScores: rawScoresTestData,
} = require("../util/testData")
const path = require("path")
const servicePath = `${path.resolve(__dirname, "../services")}/${
  process.env.SCHOOL_CODE
}`
const services = require(servicePath)

// 请求参数
// SJ=1 有效成绩，=0 原始成绩
const postData = {
  SJ: 1,
  btn_search: "",
  SelXNXQ: 0,
  zfx_flag: 0,
  shownocomputjd: 1,
  zxf: 0,
  hidparam_xh: "",
}

// 获取全部有效成绩
const getList = async (ctx, next) => {
  const cookie = getRequestToken(ctx)
  try {
    const scores = await services.getScoresList(cookie)
    ctx.result = scores
  } catch (err) {
    ctx.errMsg = err.message
  }
  return next()
}

// 获取全部原始成绩
const getRawList = async (ctx, next) => {
  const cookie = getRequestToken(ctx)
  try {
    const scores = await services.getRawScoreList(cookie)
    ctx.result = scores
  } catch (err) {
    ctx.errMsg = err.message
  }
  return next()
}

module.exports = {
  getList,
  getRawList,
}
