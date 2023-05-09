function setRem() {
  let htmlWidth = document.documentElement.clientWidth || document.body.clientWidth;
  let htmlHeight = document.documentElement.clientHeight || document.body.clientHeight;
  const scale = Math.min(htmlWidth / 1920, htmlHeight / 1010);
  let htmlDom = document.getElementsByTagName('html')[0];
  htmlDom.style.fontSize = scale * 20 + 'px';
}
setRem();
window.onresize = function() {
  setRem();
};
