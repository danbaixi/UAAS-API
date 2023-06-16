// 响应拦截
// 以 schoolCode为key
const responseInterceptors = {
  10822: (res) => {
    return new Promise((resolve, reject) => {
      // 判断cookie是否已失效
      if (res.data.indexOf("无权访问") > -1) {
        return reject({
          code: 403,
          message: "token已失效，请重新登录",
        })
      }
      return resolve(res)
    })
  },
  13776: (res) => {
    return new Promise((resolve, reject) => {
      // 判断cookie是否已失效
      if (res.data.indexOf("请先登录系统") > -1) {
        return reject({
          code: 403,
          message: "token已失效，请重新登录",
        })
      }
      return resolve(res)
    })
  },
  13558: (res) => {
    return new Promise((resolve, reject) => {
      // 判断cookie是否已失效
      if (
        res.data.indexOf(
          `<script languge='javascript'>window.location.href='http://datajq.xjistedu.cn/cas/login`
        ) > -1
      ) {
        return reject({
          code: 403,
          message: "token已失效，请重新登录",
        })
      }
      return resolve(res)
    })
  },
}

module.exports = responseInterceptors
