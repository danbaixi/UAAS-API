const Router = require("@koa/router")
const router = new Router()

const loginController = require("../controllers/login")
router.get("/", (ctx, next) => {
  ctx.result = "hello BaiyunAPI"
  return next()
})
router.get("/login-init", loginController.loginInit)
router.get("/login-code", loginController.loginVerifyCode)
router.post("/login", loginController.login)
router.post("/login-verify", loginController.loginWithVerify)

module.exports = router
