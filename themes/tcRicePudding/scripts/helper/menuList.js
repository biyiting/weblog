// 目录排序规则
const sortReference = [
    // 一级目录
    '前端基础',
    '数据结构与算法',
    '浏览器相关',
    'JS深度剖析',
    '工程化',
    'VUE全家桶',
    'Node全栈开发',
    '高阶技术专题',
    '前端运维',
    '面试指导',
    'hexo',

    // 二级目录
    'JS高级',
    'ECMAScript',
    '正则表达式',
    'TypeScript',
];

const recursionTreeData = (categories, topNode) => {
    if (!Array.isArray(topNode.children)) {
        topNode.children = [];
    }

    categories.forEach(el => {
        if (el.parent === topNode._id && !topNode.children.includes(el)) {
            topNode.children.push(el);
            recursionTreeData(categories, el);
        }
    });
};

const generoatePostsDom = (posts) => {
    let res = [`<ul class="cus-category-list-posts">`];

    // 根据生成文章时间升序排列
    Array.from(posts.data).sort((a, b) => a.date - b.date).forEach(post => {
        res.push(`
            <li class="cus-category-list-posts-item" data-post-name="${post.title}">
                <a href="/weblog/${post.path}" id="${post.title.replaceAll(' ', '-')}">${post.title}</a> 
            </li>
        `);
    });

    res.push('</ul>');
    return res.join('');
};

const generoateTreeDom = (topNodeList, isRoot = true) => {
    topNodeList.sort((a, b) => sortReference.indexOf(a.name) - sortReference.indexOf(b.name));

    let res = [`<ul class="${isRoot ? 'cus-category-list' : 'cus-category-list-child'}">`];

    topNodeList.forEach(it => {
        res.push(`
            <li class="cus-category-list-item">
                <span class="cus-category-list-link">${it.name}</span>
                <span class="cus-category-list-count">${it.posts.length}</span>
            </li>
            ${it.children.length > 0 ? generoateTreeDom(it.children, false) : generoatePostsDom(it.posts)}
        `);
    });

    res.push('</ul>');
    return res.join('');
};

hexo.extend.helper.register("menu_list", function (site = {}) {
    let topNodeList = site.categories.filter(it => !Reflect.has(it, 'parent'));
    let childNodeList = site.categories.filter(it => Reflect.has(it, 'parent'));

    // 自定义排序
    topNodeList = topNodeList.data.sort((a, b) => sortReference.indexOf(a.name) - sortReference.indexOf(b.name));
    topNodeList.forEach(topNode => { recursionTreeData(childNodeList, topNode) });

    return generoateTreeDom(topNodeList);
});
