module.exports = {
  "/api/v1": {
    // target: 'http://192.168.8.165:8849/',
    target: "http://localhost:8849/",
    changeOrigin: true,
  },
  "/das/api": {
    // target: 'http://192.168.8.165:8812/',
    target: "http://localhost:8812/",
    changeOrigin: true,
  },
  "/niemp/system": {
    // target: 'http://192.168.8.165:8893/',
    target: "http://localhost:8893/",
    changeOrigin: true,
  },
  "/umonitor": {
    // target: 'http://192.168.8.165:8893/',
    target: "http://localhost:8893/",
    changeOrigin: true,
  },
};