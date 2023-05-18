let result = []

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


const generoateTreeDom = (topNodeList,isRoot=true) => {
    if(isRoot){
        result=[]
    }

    topNodeList.forEach(it => {
        if(it.children.length > 0){
            generoateTreeDom(it.children,false)
        }else{
            result.push(it)
        }
    });
    return result;
};




hexo.extend.helper.register("cg_list", function (site = {}) {
    let topNodeList = site.categories.filter(it => !Reflect.has(it, 'parent'));
    let childNodeList = site.categories.filter(it => Reflect.has(it, 'parent'));

    // 自定义排序
    topNodeList.forEach(topNode => { recursionTreeData(childNodeList, topNode) });
    
let res = generoateTreeDom(topNodeList)
// console.log("数据",res)
    return res;
});
