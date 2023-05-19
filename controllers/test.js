const test = {}

test.demo = async (ctx, next) => {
  ctx.result = {
    bar: "foo",
  }
  return next()
}

module.exports = test
