// 目录排序规则
const sortReference = [
    // 一级目录
    '前端基础',
    '数据结构与算法',
    '浏览器相关',
    'JS 深度剖析',
    '工程化',
    'VUE 全家桶',
    'Node 全栈开发',
    '高阶技术专题',
    '前端运维',
    '面试指导',
    'blog 相关',

    // 二级目录
    'JS 高级',
    'ECMAScript',
    '正则表达式',
    'TypeScript',

    // 二级目录
    'vue2.x 使用',
    'vue2.x 源码分析',
    'vue3.x 使用',
    '手写 vue3.0 响应式原理',
    'vue-router 使用',
    '手写 vue-router',
    'vuex 使用',
    'axios 源码分析',
    '同构渲染 SSR',

    // 二级目录
    'Node 核心',
    'Koa',
    'Express',
    'Egg.js',
    'MongoDB',
    'Redis',

    // 二级目录
    '微前端解决方案',
    '前端数据可视化专题',
    '前端性能优化专题',
    '前端监控',
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
                <a href="/weblog/${post.path}" id="${post._id}">${post.title}</a> 
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
