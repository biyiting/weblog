const generatorDomString = (map) => {
  let domStr = [];
  Object.entries(map).reverse().forEach(([year, postList]) => {
    // todo
    domStr.push(`<div>${year}</div>`);
    postList.forEach(post => {
      domStr.push(`<div>${post.title}</div>`);
    })
  });

  return domStr.join('');
};

// tag 主界面
hexo.extend.helper.register("tag_list", function (page = {}) {
  let map = {
    // 2023:[ post{},...],
    // 2022:[],
  };

  page.posts.filter(it => it.formatDate = this.date(it.date, 'YYYY')).forEach(post => {
    let key = post.formatDate;
    Array.isArray(map[key]) ? map[key].push(post) : map[key] = [post];
  });

  return generatorDomString(map);
});
