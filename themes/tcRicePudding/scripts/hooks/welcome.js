// 后台输出
hexo.on("ready", () => {
  const { version } = require("../../package.json");
  hexo.log.info(`
  ================================================ 粽子 =========================================================

  
    ████████╗ ██████╗    ██████╗ ██╗ ██████╗███████╗    ██████╗ ██╗   ██╗██████╗ ██████╗ ██╗███╗   ██╗ ██████╗ 
    ╚══██╔══╝██╔════╝    ██╔══██╗██║██╔════╝██╔════╝    ██╔══██╗██║   ██║██╔══██╗██╔══██╗██║████╗  ██║██╔════╝ 
      ██║   ██║         ██████╔╝██║██║     █████╗      ██████╔╝██║   ██║██║  ██║██║  ██║██║██╔██╗ ██║██║  ███╗
      ██║   ██║         ██╔══██╗██║██║     ██╔══╝      ██╔═══╝ ██║   ██║██║  ██║██║  ██║██║██║╚██╗██║██║   ██║
      ██║   ╚██████╗    ██║  ██║██║╚██████╗███████╗    ██║     ╚██████╔╝██████╔╝██████╔╝██║██║ ╚████║╚██████╔╝
      ╚═╝    ╚═════╝    ╚═╝  ╚═╝╚═╝ ╚═════╝╚══════╝    ╚═╝      ╚═════╝ ╚═════╝ ╚═════╝ ╚═╝╚═╝  ╚═══╝ ╚═════╝ 
                                                                                                                
                                                   ${version}

  ================================================= 粽子 ========================================================`);
});
