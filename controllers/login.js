const path = require("path")
const SCHOOL_CODE = require("../util/config")("SCHOOL_CODE")
const servicePath = `${path.resolve(__dirname, "../services")}/${SCHOOL_CODE}`
const services = require(servicePath)

// 获取登录前需要的cookie
// 如果需要输入验证码，先获取cookie，使用cookie来获取验证码
const loginInit = async (ctx, next) => {
  const { cookie, formData } = await services.loginInit()
  ctx.result = {
    cookie,
    formData,
  }
  return next()
}

// 登录验证码
const loginVerifyCode = async (ctx, next) => {
  const { cookie } = ctx.request.query
  if (!cookie) {
    ctx.errMsg = "cookie不能为空"
    return next()
  }
  const res = await services.getLoginVerifyCode(cookie)
  ctx.set("content-type", "image/jpeg")
  ctx.body = res.data
  return next()
}

// 登录（不需要验证码的情况）
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

// 登录（需要验证码的情况）
const loginWithVerify = async (ctx, next) => {
  let { stuId, password, cookie, verifyCode, formData } = ctx.request.body
  if (!cookie) {
    ctx.errMsg = "登录的cookie不能为空"
    return next()
  }
  if (!verifyCode) {
    ctx.errMsg = "验证码不能为空"
    return next()
  }
  if (!stuId || !password) {
    ctx.errMsg = "学号和密码不能为空"
    return next()
  }
  formData = JSON.parse(formData)
  try {
    const loginResult = await services.login(
      stuId,
      password,
      verifyCode,
      cookie,
      formData
    )
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
  loginInit,
  loginVerifyCode,
  login,
  loginWithVerify,
}
