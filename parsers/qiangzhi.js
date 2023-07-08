// 强智教务系统 DOM解析器
// 每个学校的结构大同小异，可根据模板去自行修改

// 成绩解析器
const scoreParser = ($) => {
  // 表格列索引与成绩字段的映射
  const indexRef = [
    "term",
    "num",
    "name",
    "score", // 分数
    "mark", // 备注
    "credit", // 学分
    "courseHour", // 学时
    "GP", // 绩点
    "makeUpTerm", // 补重学期
    "method", // 考核方式
    "property", // 考试性质
    "courseAttribute", // 课程属性
    "courseCategory", // 课程类型
  ]
  const scoreRawArray = []
  const trs = $("#dataList tbody tr").slice(1)
  trs.each((trIndex, tr) => {
    const tds = $(tr).find("td").slice(1)
    let scoreRaw = {}
    tds.each((tdIndex, td) => {
      if (tdIndex >= indexRef.length) {
        return
      }
      const txt = $(td).text().trim()
      scoreRaw[indexRef[tdIndex]] = txt
    })
    scoreRawArray.push(scoreRaw)
  })
  const scores = []
  let term = ""
  let scoreItem = Object.assign({})
  scoreRawArray.forEach((scoreRaw, index) => {
    if (scoreRaw.term != term) {
      if (term != "") {
        scores.push(scoreItem)
      }
      term = scoreRaw.term
      scoreItem = Object.assign({
        termName: scoreRaw.term,
        scoreList: [],
      })
    }
    scoreItem.scoreList.push(scoreRaw)
    if (index == scoreRawArray.length - 1) {
      scores.push(scoreItem)
    }
  })
  return scores
}

// 课表解析器
const courseParser = ($) => {
  // font title 索引
  const fontTitleRef = {
    教师: "teacher",
    "周次(节次)": "rawWeeks",
    教室: "address",
  }
  const courses = []
  const trs = $("#timetable tbody tr").slice(1)
  $(trs).each((trIndex, tr) => {
    $(tr)
      .find("td")
      .each((tdIndex, td) => {
        const fonts = $(td).find(".kbcontent font")
        if (fonts.length > 0) {
          // trIndex表示节次，tdIndex表示星期
          // 0:1-2，1:3-4以此类推
          // tdIndex=0周一，=1周二，以此类推
          let course = {
            section: trIndex * 2 + 1,
            sectionCount: 2, // 固定两小节
            week: tdIndex + 1,
          }
          fonts.each((fIndex, f) => {
            // font 元素
            const fontTitle = $(f).attr("title")
            const fontText = $(f).text()
            // 课程名称
            if (fIndex == 0) {
              course.name = fontText
            } else if (fontTitle != undefined && fontTitleRef[fontTitle]) {
              course[fontTitleRef[fontTitle]] = fontText
            }
          })
          // 解析周次
          const pattern = /(\S+)\((\S+)\)\[(\S+)\]/
          const match = pattern.exec(course.rawWeeks)
          console.log(match, course)
          const fullWeek =
            match[2] == "周" ? "" : match[2] == "单周" ? "单" : "双"
          course["weeks"] = parseWeeks(match[1], fullWeek)
          courses.push(course)
        }
      })
  })
  return courses
}

module.exports = {
  scoreParser,
  courseParser,
}
