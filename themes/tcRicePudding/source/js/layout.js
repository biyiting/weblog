/**
 * 根据滚动条位置变化，改变菜单样式
 * @param {*} scrollTop 
 */
const setMenuStyle = (scrollTop) => {
    let menuDom = document.getElementById('menu-box');

    if (scrollTop > 10) {
        setStyle(menuDom, {
            background: '#fff',
            outline: '1px solid #e3e8f7'
        });
    } else {
        setStyle(menuDom, {
            background: '#f7f9fe',
        });
    }
};


/**
 * 根据滚动条位置变化，改变工具栏样式
 * @param {*} scrollTop 
 */
const setToolBoxStyle = (scrollTop) => {
    let toolboxDom = document.getElementById('tool-box');
    if (scrollTop > 10) {
        setStyle(toolboxDom, {
            right: '10px',
            transition: 'all 0.3s ease-in-out .2s'
        });
    } else {
        setStyle(toolboxDom, {
            right: '-40px',
            transition: 'all 0.3s ease-in-out .2s'
        });
    }
};

// 滚动条百分比
const setSrollPercentage = () => {
    let totalH = document.body.scrollHeight || document.documentElement.scrollHeight;
    // 可视高
    let clientH = window.innerHeight || document.documentElement.clientHeight;
    // 滚动条卷去高度
    let scrollH = document.body.scrollTop || document.documentElement.scrollTop;
    let percentage = (scrollH / (totalH - clientH) * 100).toFixed(2);

    let scrollPercentageDom = document.getElementById('scrollPercentage');
    setTimeout(()=>{
        setStyle(scrollPercentageDom, {
            width: `${percentage}%`
        });
    });
};

window.onscroll = () => {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    setMenuStyle(scrollTop);
    setToolBoxStyle(scrollTop);

    setSrollPercentage();
};