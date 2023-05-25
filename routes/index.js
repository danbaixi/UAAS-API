const Router = require("@koa/router")
const router = new Router()

const loginController = require("../controllers/login")
router.get("/", (ctx, next) => {
  ctx.result = "hello BaiyunAPI"
  return next()
})
router.post("/login", loginController.login)

module.exports = router
