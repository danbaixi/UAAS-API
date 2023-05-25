const cheerio = require("cheerio")
const request = require("../request")
const { schoolCode } = require("../util/const")
const { buildExpression, getUserAgent } = require("../util/util")
const md5 = require("md5")

// 获取登录前的sessionId
async function getLoginData() {
  const formDataRaw = await request.getLoginFormData()
  let cookie = ""
  for (let c of formDataRaw.headers["set-cookie"]) {
    if (c.indexOf("ASP.NET_SessionId") > -1) {
      cookie = c.split("; ")[0]
      break
    }
  }
  if (cookie == "") {
    throw new Error("获取cookie失败，请检查教务系统是否限制了本机访问")
  }
  const $ = cheerio.load(formDataRaw.data)
  const formData = {}
  formData["__VIEWSTATE"] = $("input[name='__VIEWSTATE']").val()
  formData["__VIEWSTATEGENERATOR"] = $(
    "input[name='__VIEWSTATEGENERATOR']"
  ).val()
  formData["__EVENTVALIDATION"] = $("input[name='__EVENTVALIDATION']").val()

  // 是否需要输入验证码
  formData["validcodestate"] = $("input[name='validcodestate']").val()

  return { cookie, formData }
}

// 登录教务系统
const login = async (ctx, next) => {
  const { stuId, password } = ctx.request.body
  if (!stuId || !password) {
    ctx.result = ""
    ctx.msg = "学号和密码不能为空"
    return next()
  }
  // 获取cookie和formData
  const { cookie, formData } = await getLoginData()
  // 处理登录表单参数
  const tmpA = md5(password).substring(0, 30).toLocaleUpperCase()
  let dsdsdsdsdxcxdfgfg = md5(stuId + tmpA + schoolCode)
    .substring(0, 30)
    .toLocaleUpperCase()
  let fgfggfdgtyuuyyuuckjg = ""
  // 如果要填写验证码，这个字段必填
  if (formData["validcodestate"] == 1) {
    fgfggfdgtyuuyyuuckjg = md5(
      md5(password.toUpperCase()).substring(0, 30) + schoolCode
    )
      .substring(0, 30)
      .toUpperCase()
  }

  const pcInfo = getUserAgent()
  const postData = {
    ...formData,
    pcInfo: pcInfo,
    txt_mm_userzh: 0,
    txt_mm_length: password.length,
    txt_mm_expression: buildExpression(password),
    dsdsdsdsdxcxdfgfg: dsdsdsdsdxcxdfgfg,
    fgfggfdgtyuuyyuuckjg: fgfggfdgtyuuyyuuckjg,
    txt_asmcdefsddsd: stuId,
    txt_pewerwedsdfsdff: "",
    Sel_Type: "STU",
    txt_psasas: "",
    typeName: "",
  }
  //console.log("postData", postData)

  const res = await request.login(cookie, postData, pcInfo)
  const $ = cheerio.load(res)
  const tips = $("#divLogNote").html()
  if (tips.indexOf("正在加载") == -1) {
    // 登录失败
    throw new Error(tips)
  }
  ctx.result = {
    cookie: cookie,
  }
  return next()
}

module.exports = {
  login,
}
