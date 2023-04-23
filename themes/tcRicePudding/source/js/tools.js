const setStyle = (dom, styleObj) => {
    Object.entries(styleObj).forEach(([key, value]) => {
        dom.style[key] = value;
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