
const generatorTagDomString = (path, name) => `<a class="tag" href=${path}>#${name}<a/>`;

const generatorDomString = (map, helperFn = {}) => {
  let domStr = [];

  Object.entries(map).reverse().forEach(([year, postList]) => {
    domStr.push(`<div class="tag-year-title">${year}</div>`);
    postList.forEach((post, inx) => {
      domStr.push(
        `<div class="tag-item">
            <div class="tag-item-img"></div>
            <div class="tag-item-content">
              <div class="tag-item-content-title">${post.title}</div>
              <div class="tag-item-content-list">${post.tags.map(tag => generatorTagDomString(helperFn.url_for(tag.path), tag.name)).join('')}</div>
              <time class="tag-item-content-date" datetime=${post.date}>
                <i class="iconfont icon-riqi2 iconfont-size"></i>
                <span>${post.formatDate}</span>
              </time>
              <div class="tag-item-content-index">${inx + 1}</div>
            </div>
         </div>`);
    })
  });

  return `<div class="tag-list-helper">${domStr.join('')}</div>`;
};

// tag 主界面
hexo.extend.helper.register("tag_list", function (page = {}) {
  let map = {
    // 2023:[ post{},...],
    // 2022:[],
  };

  page.posts.filter(it => {
    it.formatYear = this.date(it.date, 'YYYY');
    it.formatDate = this.date(it.date, 'YYYY-MM-DD');
    it.formatDate = this.date(it.date, 'YYYY-MM-DD');
    return it;
  }).forEach(post => {
    let key = post.formatYear;
    Array.isArray(map[key]) ? map[key].push(post) : map[key] = [post];
  });

  return generatorDomString(map, this);
});
