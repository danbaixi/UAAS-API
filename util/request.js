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

const createRequest = (axiosOptions, options = {}) => {
  return new Promise((resolve, reject) => {
    const axiosInstance = axios.create({
      baseURL: `${schoolConfig.ssl ? "https" : "http"}://${
        schoolConfig.domain
      }`,
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
      res.data = iconv.decode(res.data, schoolConfig.chatset || "utf-8")
      const diyInterceptor = responseInterceptors[process.env.SCHOOL_CODE]
      if (diyInterceptor) {
        return diyInterceptor(res)
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
