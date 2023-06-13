require("dotenv").config()
const Koa = require("koa")
const bodyParser = require("koa-bodyparser")
const helmet = require("koa-helmet")

const { loggerMiddleware } = require("./middlewares/logger")
const { responseHandler, errorHandler } = require("./middlewares/response")

const app = new Koa()

app.use(loggerMiddleware)

// Error Handler
app.use(errorHandler)

// middlewares
app.use(bodyParser())
app.use(helmet())

// routers
const indexRouter = require("./routes/index")
const dataRouter = require("./routes/data")

app.use(indexRouter.routes(), indexRouter.allowedMethods())
app.use(dataRouter.routes(), dataRouter.allowedMethods())

// Response
app.use(responseHandler)

module.exports = app
