const setStyle = (dom, styleObj) => {
    Object.entries(styleObj).forEach(([key, value]) => {
        dom.style[key] = value;
    });
};

const toTop = () => {
    window.scrollTo({ 
        top: 0, 
        behavior: "smooth" 
    });
};

const toBottom = () => {
    window.scrollTo({ 
        bottom: 1000000, 
        behavior: "smooth" 
    });
};

// 节流
const throttle = (func, delay) => {
    var prev = 0;

    return () => {
        var now = Date.now();

        if (now - prev >= delay) {
            func.apply(this, func, delay);
            prev = Date.now();
        }
    }
}