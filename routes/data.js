const Router = require("@koa/router")
const router = new Router()

const scoreController = require("../controllers/score")
const attendanceController = require("../controllers/attendance")
const courseController = require("../controllers/course")

const authHandler = async (ctx, next) => {
  if (!ctx.request.headers.token) {
    ctx.throw(401, "请求头中携带的token不能为空")
  }
  return next()
}

router.use(authHandler)

// 成绩
router.get("/scores", scoreController.getList)
router.get("/raw-scores", scoreController.getRawList)
// 考勤
router.get("/attendances", attendanceController.getList)
// 课表
router.get("/courses", courseController.getList)

module.exports = router
