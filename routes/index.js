const Router = require("@koa/router")
const router = new Router()

const testController = require("../controllers/test")

router.get("/", testController.demo)

module.exports = router
