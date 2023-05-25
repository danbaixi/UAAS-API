const axios = require("axios")
const iconv = require("iconv-lite")
const { domain } = require("./const")
const { getUserAgent } = require("./util")

const defaultHeaders = {
  Host: domain,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "zh-CN,zh;q=0.9",
}

const createRequest = (axiosOptions, options = {}) => {
  return new Promise((resolve, reject) => {
    const axiosInstance = axios.create({
      baseURL: `https://${domain}`,
      timeout: 20000,
      responseType: "arraybuffer",
    })
    // set default headers
    axiosOptions.headers = { ...axiosOptions.headers, ...defaultHeaders }
    // set UserAgent
    if (!axiosOptions.headers["User-Agent"]) {
      axiosOptions.headers["User-Agent"] = getUserAgent()
    }
    if (axiosOptions.method?.toUpperCase() == "POST") {
      axiosOptions.headers["Content-Type"] = "application/x-www-form-urlencoded"
    }
    console.log("axiosOptions", axiosOptions)
    let returnDataType = "data"
    if (options.returnDataType) {
      returnDataType = options.returnDataType
    }
    // 响应拦截器
    axiosInstance.interceptors.response.use((res) => {
      // 转码
      res.data = iconv.decode(res.data, "gbk")
      // 判断cookie是否已失效
      if (res.data.indexOf("无权访问") > -1) {
        throw new Error("token已失效，请重新登录")
      }
      return res
    })
    axiosInstance
      .request(axiosOptions)
      .then((res) => {
        if (returnDataType == "all") {
          return resolve(res)
        }
        return resolve(res[returnDataType])
      })
      .catch((err) => {
        reject(err)
      })
  })
}

module.exports = createRequest
