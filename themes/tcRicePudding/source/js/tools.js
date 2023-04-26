// 节流
const throttle = (func, delay) => {
    var prev = 0;

    return (...args) => {
        var now = Date.now();

        if (now - prev >= delay) {
            func.apply(this, ...args);
            prev = Date.now();
        }
    }
}

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
        top: 1000000,
        behavior: "smooth"
    });
};

const copyHandler = (content) => {
    const input = document.createElement("input");
    input.id = "copyVal";
    document.body.appendChild(input);

    input.value = content;
    input.select();
    input.setSelectionRange(0, input.value.length);
    document.execCommand("copy");

    input.remove();
};

// 消息提示
const messageHandel = (message, delay = 2000) => {
    let messageDom = document.getElementById("message");
    setStyle(messageDom, {
        height: '50px',
        color: '#fff',
        backgroundPosition: '2000px 0'
    });
    setTimeout(() => {
        messageDom.innerHTML = message;
    }, 100)

    setTimeout(() => {
        setStyle(messageDom, { height: 0, backgroundPosition: '-500px 0' });
        messageDom.innerHTML = '';
    }, delay);
};

// 复制链接
const copyPageUrl = () => {
    copyHandler(window.location.href);
    messageHandel('复制链接成功，快去分享吧');
};