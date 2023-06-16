const getConfig = (key) => {
  const defaultConfig = {
    SCHOOL_CODE: "test",
    PORT: 3000,
    TEST_ACCOUNT: "test",
    TEST_PASSWORD: 123456,
    TEST_TOKEN_NAME: "test-token",
  }
  if (process.env[key]) {
    return process.env[key]
  }
  if (defaultConfig[key]) {
    return defaultConfig[key]
  }
  return undefined
}

module.exports = getConfig
