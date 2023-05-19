const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
const helmet = require("koa-helmet")
const { loggerMiddleware } = require("./middlewares/logger")
const { responseHandler, errorHandler } = require("./middlewares/response")

const app = new Koa()

app.use(loggerMiddleware)

// Error Handler
app.use(errorHandler)

// routers
const indexRouter = require("./routes/index")
const userRouter = require("./routes/user")

app.use(indexRouter.routes(), indexRouter.allowedMethods())
app.use(userRouter.routes(), userRouter.allowedMethods())

// middlewares
app.use(bodyParser())
app.use(helmet())

// Response
app.use(responseHandler)

module.exports = app
