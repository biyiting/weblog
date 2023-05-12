---
title: Ajax
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
date: 2022-09-11 16:41:13
---

## 什么是 AJAX？
1. AJAX：async javascript and xml 异步的 JS 和 XML；
2. XML（最早的时候，基于 AJAX 从服务器获取的数据一般都是 XML 格式数据，只不过现在基本上都是应用更小巧、更方便操作的 JSON 格式处理）；
    - HTML 超文本标记语言；
    - XHTML 严谨的 HTML；
    - XML 可扩展的标记语言（基于标签结构存储数据）；
3. 异步的 JS（基于 AJAX 实现局部刷新）；

## 发送 AJAX 请求有四步操作
1. 第一步：创建一个 XHR 对象：不兼容 XMLHttpRequest 的浏览器（IE6）使用 ActiveXObject 创建；
2. 第二步：打开请求连接（配置请求信息）：
    - xhr.open(method, url, async, user-name, user-pass)；
    - 参数解析：
      - method请求方式：
        - get 系列：从服务器获取；
        - post 系列：向服务器发送信息；
      - async 是否为异步请求，默认是 true，也就是异步，设置为 false 代表当前请求任务为同步（项目中基本上都采用异步请求）；
      - user-name, user-pass 向服务器发送请求所携带的用户名密码，只有在服务器设置了安全来宾账号的情况下需要（一般不用）；
3. 第三步：监听请求状态，在不同状态中做不同的事情；
4. 第四步：发送 AJAX 请求（AJAX 任务开始，直到响应主体信息返回 「AJAX 状态为 4」 代表当前任务结束）；
## HTTP 请求方式
1. GET 系列：
    - GET：客户端都可以把信息传递给服务器，服务器也可以把信息返回给客户端，只不过 GET 偏向于拿；
    - DELETE：删除，一般代指删除服务器上指定的文件；
    - HEAD：只获取响应头的信息，不获取响应主体内容；
    - OPTIONS：试探性请求，在 CROS 跨域请求中，所以正常请求发送前，先发送一个试探请求，验证是否可以和服务器正常的建立连接；
2. POST 系列：
    - POST：客户端都可以把信息传递给服务器，服务器也可以把信息返回给客户端，POST 偏向于给；
    - PUT：新增，一般代指向服务器中新增文件；
3. 传递给服务器的数据格式：
    - application/x-www-form-urlencoded（最常用的方式「字符串」）；
    - multipart/form-data（也很常用，例如：表单提交或者文件上传「对象」）；
    - raw（可以上传 text、json、xml、html 等格式的文本，富文本编辑器中的内容可以基于这种格式传递）；
    - binary（上传二进制数据或者编码格式的数据）；
    - ......
4. GET 和 POST 系列的区别：
    - 基于 GET 向服务器发送请求，基于请求头传递给服务器，请求 URL 地址后面的问号传参：
      ```JS
      let xhr = new XMLHttpRequest;
      xhr.open('get', './data.json?age=12&name=张三');
      xhr.send();
      ```
    - 基于 POST 向服务器发送请求，基于请求主体把信息传递给服务器：
      ```JS
      xhr = new XMLHttpRequest;
      xhr.open('post', './data.json');
      xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xhr.send('age=12&name=张三');
      ```
      ```JS
      let formData = new FormData();
      formData.append('age', 2);
      formData.append('name', '张三');
      formData.append('obj', { name: '哈哈' });

      xhr = new XMLHttpRequest;
      xhr.open('post', './data.json');
      xhr.setRequestHeader('Content-Type', 'multipart/form-data');
      xhr.send(formData);
      ```
    - GET 请求传递给服务器的信息有大小的限制（因为它是基于地址问号传参方式传递信息，而 URL 有长度的限制：IE 浏览器只有 2KB 大小）；而 POST 请求理论上是没有大小限制的（实际操作中也都会给予限制）；
    - GET 请求相对 POST 请求来说不太安全，也是因为传参是基于地址栏问号传参，会被别人基于 URL 劫持的方式把信息获取到，所以真实项目中，涉及到安全的信息都是基于 POST 方式传递的；
    - GET 请求容易产生缓存，原因还是因为 GET 是基于问号传参传递信息的，浏览器在每一次获取数据后，一般会缓存一下数据，下一次如果请求的地址和参数和上一次一样，浏览器直接获取缓存中的数据，所以基于 GET发送请求，一般都会在地址栏中添加一个随机数清除缓存；
      ```JS
      xhr.open('get', './data.json?age=12&name=张三&_=' + Math.random())
      ```

## AJAX 的状态值（xhr.readyState 的值）
|类型|状态值|描述|
|----|----|----|
|UNSENT 	|0  	|创建完XHR默认就是 0|
|OPENED 	|1  	|已经完成OPEN操作|
|HEADERS_RECEIVED 	|2 	|服务器已经把响应头信息返回了|
|LOADING 	|3  	|响应主体正在返回中|
|DONE 	|4 	|响应主体已经返回|

## HTTP 网络状态码 xhr.status
1. xhr.status 代表了服务器返回信息的状态：
    - 2 开头的基本都是代表成功；
    - 3 开头的一般也是成功了，只不过中间做了一些额外处理：
      - 301：永久性转移/重定向，一般应用于网站域名更换，访问老域名，永久都跳转到新的域名上；
      - 302：临时转移；
      - 307：临时重定向，一般应用于服务器的负载均衡；
      - 304：读取的是缓存中的数据，这个是客户端和服务器端共建的协商缓存（把不经常更新，请求过的资源文件做缓存，后期在访问这些资源直接走缓存数据，除非服务器端更新了此资源，或者客户端强制清缓存刷新等）；
    - 4 开头的都是失败：一般都是客户端的问题：
      - 400：请求参数错误；
      - 401：无权限访问；
      - 404：地址错误；
      - 405：当前请求的方式服务器不支持；
    - 5 开头的都是失败：一般都是服务器问题：
      - 500：未知服务器错误；
      - 503：服务器超负荷；
2. 真实项目中，后台开发者可能不是按照这个规则来进行处理的，不管传参或者权限是否正确等，只要服务器接收到请求最后都给返回 200，再返回的 JSON 数据中，基于某一个字段（例如：code）来表示错误信息；
    {% asset_img 错误信息.jpg 错误信息 %}

## 汇总 XHR 的属性和方法及事件
1. 汇总：
    |属性和方法|描述|
    |----|----|
    |xhr.response|响应体数据，类型取决于 responseType 的指定|
    |xhr.responseText||
    |xhr.responseXML||
    |xhr.status 	|响应状态码值，比如 200、404  ----标识着请求成功或者失败|
    |xhr.statusText	|响应状态文本|
    |xhr.timeout	|指定请求超时时间，默认为 0 代表没有限制|
    |xhr.withCredentials	|值为 true：跨域资源共享中，允许携带资源凭证|
    |xhr.abort()	|强制中断请求|
    |xhr.getAllResponseHeaders()|	|
    |xhr.getResponseHeader([key])	| |
    |xhr.open()	|初始化一个请求，参数为（method，url[，async]）|
    |xhr.overrideMimeType()	| |
    |xhr.send()	|发送请求 |
    |xhr.setRequestHeader()	|设置请求头（属性值不能是中文和特殊字符）|
2. 示例代码：
    ```JS
    let xhr = new XMLHttpRequest;
    xhr.open('get', './data.json');
    xhr.setRequestHeader('name', encodeURIComponent("张三")); // 请求头不能是中文，将中文转码
    
    xhr.onreadystatechange = function () {
      let status = xhr.status, state = xhr.readyState, result = null;
  
      // 网络状态码不是 2 和 3 开头的都是失败
      if (!/^(2|3)\d{2}$/.test(status)) {
        // 错误处理
        return;
      }
  
      // AJAX 状态值为 2 的时候，响应头信息回来了
      if (state === 2) {
        // 获取响应头信息
        console.log(xhr.getAllResponseHeaders());

        //=>获取的服务器日期是格林威治时间 GMT（比北京时间晚了八个小时 北京时间：GMT+0800）
        // console.log(xhr.getResponseHeader('date')); 

        //=>转换为北京时间
        console.log(new Date(xhr.getResponseHeader('date')));
        return;
      }
  
      if (state === 4) {
        // 获取响应主体信息  responseText/responseType/responseXML
        result = xhr.response;
      }
    };
    
    xhr.send(); // send 后：首先响应头信息回来，最后响应主体信息再回来
    ```
## 基于 promise 封装自己的 AJAX 库
``` js
let _ajax = (function anonymous() {
  class MyAjax {
    constructor(options) {
      // options => 最终处理好的配置项
      this.options = options;
      return this.init();
    }

    init() {
      // 解构出需要的参数配置
      let {
        url,
        baseURL,
        method,
        headers,
        cache,
        params,
        data,
        timeout,
        withCredentials,
        responseType,
        transformRequest,
        transformResponse,
      } = this.options;

      let GET_REG = /^(GET|DELETE|HEAD|OPTIONS)$/i;

      // 请求的 API 地址的特殊处理
      // 1.拼接完成地址
      url = baseURL + url;

      // 2.GET 系列请求下，要把 params 或者 cache 指定的随机数，以问号参数的方式拼接到 URL 的末尾
      if (GET_REG.test(method)) {
        if (params !== null) {
          url += `${_ajax.ask(url)}${_ajax.paramsSerializer(params)}`;
        }
        if (!cache) {
          // 随机数的属性名一般用 _，因为项目中后台发现传递的是_，一般就不对这个传递值的处理
          url += `${_ajax.ask(url)}_=${Math.random()}`;
        }
      }

      // 请求主体传递参数的处理（POST系列）
      if (!GET_REG.test(method)) {
        if (typeof transformRequest === "function") {
          data = transformRequest(data);
        }
      }

      // 基于 PROMISE 管理 AJAX 的发送
      return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);

        // 额外的配置设置（例如：请求头信息）
        xhr.timeout = timeout;
        xhr.withCredentials = withCredentials;
        if (headers !== null && typeof headers === "object") {
          for (let key in headers) {
            if (!headers.hasOwnProperty(key)) break;
            xhr.setRequestHeader(key, headers[key]);
          }
        }

        xhr.onreadystatechange = () => {
          let status = xhr.status,
            statusText = xhr.statusText,
            state = xhr.readyState,
            result = null;

          // 请求成功
          if (/^2\d{2}$/.test(status)) {
            if (state === 4) {
              result = xhr.response;
              responseType === "json" ? (result = JSON.parse(result)) : null;

              // 处理响应头
              let responseHeaders = {},
                responseHeadersText = xhr.getAllResponseHeaders();
              // 根据 \n 换行来剪切
              responseHeadersText = responseHeadersText.split(/\n+/g);
              responseHeadersText.forEach((item) => {
                let [key, value] = item.split(": ");
                if (key.length === 0) return;
                responseHeaders[key] = value;
              });

              // 返回结果
              resolve({
                config: this.options,
                request: xhr,
                status,
                statusText,
                data: result,
                headers: responseHeaders,
              });
            }
            return;
          }

          // 请求失败
          reject({
            config: this.options,
            request: xhr,
            status,
            statusText,
          });
        };
        xhr.send(data);
      }).then((result) => {
        if (typeof transformResponse === "function") {
          result = transformResponse(result);
        }
        return result;
      });
    }
  }

  // 定义 _AJAX 对象和默认参数配置
  let _ajax = {};
  _ajax.defaults = {
    url: "",
    baseURL: "", // 统一前缀
    method: "get",
    headers: {},
    // cache：axios 中没有但是 JQ 中存在的配置：
    //  清除 GET 请求中的缓存
    //  若置为 false，则在所有 GET 请求的末尾追加一个随机数，保证每次请求地址不同，从而清除缓存
    cache: true,
    params: null,
    data: null,
    timeout: 10000,
    withCredentials: false, // 是否允许携带资源凭证
    responseType: "json",
    // POST 请求先走这个函数，在函数中可以把基于请求主体传递的内容做特殊处理
    transformRequest: null,
    // 接收到服务器成功返回的结果后，把返回的结果进行处理，在执行 then
    transformResponse: null,
  };

  // 用客户传递的配置项，替换默认的配置项
  let init = function (options = {}) {
    // 处理 HEADERS 这种二级结构合并替换的（Object.assign类似浅克隆,只能替换 obj 一层的对象）
    _ajax.defaults.headers = Object.assign(
      _ajax.defaults.headers,
      options.headers
    );
    delete options.headers;
    return Object.assign(_ajax.defaults, options);
  };

  // 并发多个 AJAX 请求，待所有请求都成功后做一些事情
  _ajax.all = function (requestArr) {
    return Promise.all(requestArr);
  };

  // GET 系列请求
  ["get", "delete", "head", "options"].forEach((item) => {
    _ajax[item] = function (url, options = {}) {
      options.url = url;
      options.method = item;
      return new MyAjax(init(options));
    };
  });

  // POST 系列请求
  ["post", "put"].forEach((item) => {
    // data为请求主体
    _ajax[item] = function (url, data = {}, options = {}) {
      options.url = url;
      options.data = data;
      options.method = item;
      return new MyAjax(init(options));
    };
  });

  // 提供一些对内和对外都有用的公共方法
  _ajax.paramsSerializer = function (obj) {
    // 把对象变为x-www-form-urlencode格式
    let str = ``;
    for (let key in obj) {
      if (!obj.hasOwnProperty(key)) break;
      str += `&${key}=${obj[key]}`;
    }
    str = str.substring(1);
    return str;
  };

  // get 请求拼接参数
  _ajax.ask = function (url) {
    // 验证地址中是否存在问号，来决定分隔符用谁
    return url.indexOf("?") < 0 ? "?" : "&";
  };

  return _ajax;
})();
```
## 面试题
### 第 1 题：倒计时抢购
1. 如何从服务器获取时间，以及存在的问题：
    - 可以基于 ajax 向服务器发送请求，服务器返回的信息中，响应头中包含了服务器时间（GMT 格林威治时间  转换为北京时间  new Date([转换的时间])）；
    - 由于网络传送存在时差，导致客户端接收到的服务器时间和真实时间存在偏差，当响应头信息返回（AJAX 状态为 2 的时候），获取时间即可（偏差），HTTP 传输中的 HEAD 请求方式，就是只获取响应头的信息；
    - 获取当前客户端本地的时间（但是这个时间客户可以修改自己本地的时间）：真实项目中只能做一些参考的工作，不能做严谨的校验，严格校验的情况下，需要的时间是从服务器获取的；
2. 示例代码：
    ```JS
    async function init() {
    let serverTime = await queryServerTime(), // 获取服务器时间
        targetTime = new Date('2020/02/25 20:49:30'), // 目标时间
        autoTimer = null; // 定时器

    // 计算时间差
    function computed() {
      let spanTime = targetTime - serverTime;
      if (spanTime <= 0) {
        // 已经到抢购时间了
        spanBox.innerHTML = `00:00:00`;
        clearInterval(autoTimer);
        return;
      }
        let hours = Math.floor(spanTime / (60 * 60 * 1000));
        spanTime = spanTime - hours * 60 * 60 * 1000;

        let minutes = Math.floor(spanTime / (60 * 1000));
        spanTime = spanTime - minutes * 60 * 1000;

        let seconds = Math.floor(spanTime / 1000);
        hours = hours < 10 ? '0' + hours : hours;

        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;

        spanBox.innerHTML = `${hours}:${minutes}:${seconds}`;
      }
      computed();

      // 间隔 1S 后重新计算一次
      autoTimer = setInterval(async _ => {
        // 应该重新从服务器获取时间（但是这样有很大延迟和服务器的压力太大了）
        // serverTime = await queryServerTime();

        // 可以基于第一次获取的时间，在原来的基础上，让其自动累加 1000MS 即可
        serverTime = new Date(serverTime.getTime() + 1000);
        computed();
      }, 1000);
    }

    init();
    ```
### 第 2 题：readyState 变化几次
1. 示例一
    ```JS
    let xhr = new XMLHttpRequest;
    xhr.open('get', './js/fastclick.js', true); // open 执行完：readyState 为 1

    // 监听到 readyState 改变后才会触发的事件
    xhr.onreadystatechange = function () {
      // readyState 变化几次，此事件调用几次
      console.log(xhr.readyState); //=>2,3,4
    };

    xhr.send();
    ```
2. 示例二
    ```JS
    let xhr = new XMLHttpRequest;
    xhr.open('get', './js/fastclick.js', true); // open 执行完：readyState 为 1

    // 异步：在 SEND 后，会把这个请求的任务放在 EventQueue 中（宏任务）
    xhr.send();

    // 同步代码，绑定之前 readyState 为 1
    xhr.onreadystatechange = function () {
      console.log(xhr.readyState); //=>2.3.4
    };
    ```
3. 示例三
    ```JS
    let xhr = new XMLHttpRequest;
    xhr.open('get', './js/fastclick.js', false); // open 执行完：readyState 为 1

    xhr.send();

    // 同步代码 send 执行完，readyState 为 4
    xhr.onreadystatechange = function () {
      // readyState 绑定之后是 4,一直没有变化,不触发事件
      console.log(xhr.readyState);
    };
    ```
4. 示例四
    ```JS
    let xhr = new XMLHttpRequest;
    xhr.open('get', './js/fastclick.js', false); // open 执行完：readyState 为 1

    // 同步:此时绑定 readyState 为 1
    xhr.onreadystatechange = function () {
        // 绑定时 readyState 为 1,send 执行完 readyState 为 4，readyState 有变化 触发事件
        console.log(xhr.readyState); //=>4
    };

    // 同步 send 执行完，readyState 为 4
    xhr.send();
    ```