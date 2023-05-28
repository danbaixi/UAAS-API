const getTestData = async (ctx, next) => {
  console.log("ctx", ctx)
  ctx.result = {
    test: "123",
  }
  return ctx.throw()
}

module.exports = {
  getTestData,
}
