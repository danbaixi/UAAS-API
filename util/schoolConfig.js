const schools = require("../public/schools.json")
const getSchoolConfig = (key = "") => {
  const school = process.env.SCHOOL_CODE
  if (!school) {
    console.error("请先在.env配置学校代码")
    return undefined
  }
  return key === "" ? schools[school] : schools[school][key]
}

module.exports = getSchoolConfig
