const cheerio = require("cheerio")
const request = require("../request/data")
const { getRequestToken, matchTermName } = require("../util/util")
const {
  scores: scoresTestData,
  rawScores: rawScoresTestData,
} = require("../util/testData")
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
  // 测试号
  if (ctx.request.headers.isTest) {
    ctx.result = scoresTestData
    return next()
  }
  const content = await request.getScoreApi(cookie, postData)
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
        }
      })
    scoreItem.scoreList.push(score)
    if (trIndex == trs.length - 1) {
      scores.push(scoreItem)
    }
  })
  ctx.result = scores
  return next()
}

// 获取全部原始成绩
const getRawList = async (ctx, next) => {
  const cookie = getRequestToken(ctx)
  // 测试号
  if (ctx.request.headers.isTest) {
    ctx.result = rawScoresTestData
    return next()
  }
  postData.SJ = 0
  const content = await request.getScoreApi(cookie, postData)
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
        score[indexRef[tdIndex]] = $(td).text()
      })
      scoreItem.scoreList.push(score)
    })
    if (tableIndex == tables.length - 1) {
      scores.push(scoreItem)
    }
  })
  ctx.result = scores
  return next()
}

module.exports = {
  getList,
  getRawList,
}
