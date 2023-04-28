hexo.extend.helper.register("getLastPostUpdated_helper", function (site = {}) {
    const minTimeStamp = 60000;
    const hourTimeStamp = 3600000;
    const dayTimeStamp = 86400000;
    const monthTimeStamp = 2592000000;
    const yearTimeStamp = 31104000000;
    let res = ``;

    const [lastUpdatePost] = site.posts.sort('date', -1).limit(1).data;
    const lastUpdatePostTime = this.date(lastUpdatePost.updated, 'YYYY-MM-DD HH:mm:ss');
    const timeInterval = new Date().getTime() - new Date(lastUpdatePostTime).getTime();

    if (Math.floor(timeInterval / yearTimeStamp) >= 1) {
        res = `<span class="num">${Math.floor(timeInterval / yearTimeStamp)}</span><span>年前</span>`;
    } else if (Math.floor(timeInterval / monthTimeStamp) >= 1) {
        res = `<span class="num">${Math.floor(timeInterval / monthTimeStamp)}</span><span>个月前</span>`;
    } else if (Math.floor(timeInterval / dayTimeStamp) >= 1) {
        res = `<span class="num">${Math.floor(timeInterval / dayTimeStamp)}</span><span>天前</span>`;
    } else if (Math.floor(timeInterval / hourTimeStamp) >= 1) {
        res = `<span class="num">${Math.floor(timeInterval / hourTimeStamp)}</span><span>小时前</span>`;
    } else {
        res = `<span class="num">${Math.floor(timeInterval / minTimeStamp)}</span><span>分钟前</span>`;
    }

    return res;
});
