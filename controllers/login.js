const path = require("path")
const servicePath = `${path.resolve(__dirname, "../services")}/${
  process.env.SCHOOL_CODE
}`
const services = require(servicePath)
const getConfig = require("../util/config")

const login = async (ctx, next) => {
  const { stuId, password } = ctx.request.body
  if (!stuId || !password) {
    ctx.errMsg = "学号和密码不能为空"
    return next()
  }
  try {
    const loginResult = await services.login(stuId, password)
    ctx.result = {
      cookie: loginResult,
    }
    return next()
  } catch (err) {
    ctx.errMsg = err.message
    return next()
  }
}

module.exports = {
  login,
}
