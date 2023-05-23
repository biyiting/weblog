let UglifyJS = require("uglify-js");

hexo.extend.filter.register("after_render:js", function (str, data) {
  let result = UglifyJS.minify(str);
  return result.code;
});
