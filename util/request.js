const axios = require("axios")
const iconv = require("iconv-lite")
const { getUserAgent } = require("./util")
const getSchoolConfig = require("../util/schoolConfig")
const schoolConfig = getSchoolConfig()
const responseInterceptors = require("./responseInterceptors")

const defaultHeaders = {
  Host: schoolConfig.host,
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
  "Accept-Encoding": "gzip, deflate, br",
  "Accept-Language": "zh-CN,zh;q=0.9",
}

// responseType
// 处理那些使用gbk,gb2312等非uft-8编码的教务系统
const responseType =
  schoolConfig.chatset === undefined || schoolConfig.chatset === "utf8"
    ? "json"
    : "arraybuffer"

const createRequest = (axiosOptions, options = {}) => {
  return new Promise((resolve, reject) => {
    const axiosInstance = axios.create({
      baseURL: `${schoolConfig.ssl === false ? "http" : "https"}://${
        schoolConfig.domain
      }`,
      timeout: 20000,
      responseType,
      maxRedirects: 0, // 不重定向
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
    axiosInstance.interceptors.response.use(
      (res) => {
        // 状态码为2xx时，拦截
        // 接收arraybuffer需要decode
        if (responseType === "arraybuffer") {
          res.data = iconv.decode(res.data, schoolConfig.chatset || "utf-8")
        }
        const diyInterceptor = responseInterceptors[process.env.SCHOOL_CODE]
        if (diyInterceptor && options.notInterceptor !== true) {
          return diyInterceptor(res)
        }
        return res
      },
      (err) => {
        // 状态码大于2xx时，拦截
        // 处理302的情况
        if (options.redirect === true) {
          return Promise.resolve(err)
        }
        return Promise.reject(err)
      }
    )
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
