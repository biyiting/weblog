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

window.onscroll = () => {
    let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    setMenuStyle(scrollTop);
    setToolBoxStyle(scrollTop);
};