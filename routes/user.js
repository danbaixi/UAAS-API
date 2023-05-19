const Router = require("@koa/router")

const router = new Router({
  prefix: "/user",
})

router.get("/", async (ctx) => {
  ctx.body = "user router"
})

module.exports = router
