// 测试学校服务

const testData = require("../util/testData")
const getConfig = require("../util/config")
// 登录
const login = async (stuId, password) => {
  const TEST_ACCOUNT = getConfig("TEST_ACCOUNT")
  const TEST_PASSWORD = getConfig("TEST_PASSWORD")
  if (stuId != TEST_ACCOUNT) {
    throw new Error(`测试账号为${TEST_ACCOUNT}`)
  }
  if (password != TEST_PASSWORD) {
    throw new Error(`测试账号的密码为${TEST_PASSWORD}`)
  }
  return getConfig("TEST_TOKEN_NAME")
}

// 获取课表
const getCourseList = async () => {
  return testData.courses
}

// 获取有效成绩
const getScoreList = async () => {
  return testData.scores
}

// 获取全部原始成绩
const getRawScoreList = async () => {
  return testData.rawScores
}

// 获取考勤列表
const getAttendanceList = async () => {
  return testData.attendances
}

module.exports = {
  login,
  getCourseList,
  getScoreList,
  getRawScoreList,
  getAttendanceList,
}
