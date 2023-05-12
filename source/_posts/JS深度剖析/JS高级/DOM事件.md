---
title: DOM事件
categories:
  - JS深度剖析
  - JS高级
tags:
  - JS高级
date: 2022-09-10 19:40:13
---

## 什么是事件、什么是事件绑定
1. 事件：浏览器赋予元素天生默认的一些行为，不论是否绑定相关的方法，只要行为操作进行了，那么一定会触发相关的事件行为；
2. 事件绑定：给元素的某一个事件行为绑定方法，目的是行为触发可以做点自己想做的事情；

## [浏览器自带的事件](https://developer.mozilla.org/zh-CN/docs/Web/Events)
1. 鼠标事件；
2. 键盘事件；
3. 表单元素常用事件；
4. 移动端手指事件；
5. 音视频常用事件；
6. …

## DOM0 VS DOM2
1. 「DOM0」级事件绑定：
    - 事件绑定：元素.onxxx = function(){}；
    - 事件解绑：元素.onxxx = null；
    - 原理：
      >- 给 DOM 元素对象的某一个私有事件属性赋值函数值，当用户触发这个事件行为，JS 引擎会把之前绑定的方法执行；
      >- 不是所有的事件类型都支持这种方式，元素有哪些 onxxx 事件属性，才能给其绑定方法（例如：DOMContentLoaded 事件就不支持这种绑定方案）；
      >- 只能给当前元素的某一个事件行为绑定一个方法（绑定多个也只能识别最后一个）；
2. 「DOM2」级事件绑定：
    - 事件绑定：元素.addEventListener([事件类型],[方法],[传播模式])
    - 事件解绑：元素.removeEventListener([事件类型],[方法],[传播模式])
    - 原理：
      >- 基于原型链查找机制，找到 EventTarget.prototype 上的 addEventListener 方法执行；
      >- 它是基于浏览器事件池机制完成事件绑定的；
    - 示例代码：
      ```JS
      function anonymous() {
        console.log('ok');
      }
      box.addEventListener('click', anonymous, false);
      box.removeEventListener('click', anonymous, false);
      ```

## 事件对象
### 鼠标事件对象 MouseEvent
1. 获取事件对象：
2. 属性：
    - type: 事件类型；
    - target: 事件源；
    - clientX/clientY: 触发点距离窗口左上角坐标；
    - pageX/pageY: 触发点距离 body 左上角坐标；
    - ......
3. 方法: (基于原型链查找，在 Event.prototype 上)
    - ev.preventDefault(): 阻止默认行为，兼容处理: ev.returnValue = false；
    - ev.stopPropagation(): 停止冒泡传播，兼容处理: ev.cancelBubble = true；
    - ...

### 键盘事件对象 KeyboardEvent
1. 获取事件对象：
    ```JS
    // 获取事件对象
    document.onkeydown = function (ev) {
      console.log(ev);
    }
    ```
### 普通事件对象 Event
1. 获取事件对象：
    ```JS
    // 获取事件对象
    window.onload = function (ev) {
      console.log(ev);
    }
    ```
### 手指事件对象 TouchEvent——移动端
1. 获取事件对象：
    ```JS
    // 获取事件对象
    box.ontouchstart = function (ev) {
      console.log(ev);
    }
    ```
2. 属性
    - touches: 只能获取到手指在屏幕上时的信息，手指离开信息就消失；
    - changedTouches: 可获取到手指离开前的信息，结果是一个集合，一般通过 ev.changedTouches[0] 来获取第一个手指信息，里面存储了基本信息；

### 默认行为
1. 默认行为举例：
    - a 标签的页面跳转 / 锚点定位；
    - 文本框输入内容；
    - 部分文本框的输入记忆；
    - 右键弹出右键菜单；
    - …
2. 阻止默认行为：
    ```JS
    // 阻止右键弹出菜单默认行为
    window.oncontextmenu = function (ev) {
      ev.preventDefault();
    }
    
    // 阻止 a 标签的默认行为，方案一：
    <a href="javascript:;" id = "link" > 百度一下</ >
    
    // 阻止 a 标签的默认行为，方案二：
    <a href="www.baidu.com" id="link">百度一下</a>
    // 点击 a 标签时先触发 click 事件再进行页面跳转
    // 该操作会在触发点击事件时阻止默认行为，就不再进行后续的跳转了
    link.onclick = function (ev) {   
      ev.preventDefault();         
    }
    ```

## 事件传播机制
### 事件传播分为三个阶段
1. 捕获阶段：外 -> 里，直到找到当前触发的事件源为止，建立冒泡传播的路线；
2. 目标阶段：当前元素相关事件行为触发，方法执行；
3. 冒泡阶段：不仅当前元素相关事件行为触发，在捕获阶段获取的路线中所有相关事件的行为均被触发，从里向外依次执行相关的方法；
### DOM0 和 DOM2 的传播机制
1. DOM0 级事件绑定的方法均在目标阶段与冒泡阶段执行；
2. DOM2 级事件绑定方法可以控制在捕获阶段执行；
    - 元素.addEventListener('xxx',xxx,false/true)
      - 默认为 false（冒泡阶段执行）；
      - 若设置为 true，则在捕获阶段执行；
    - 图解：
      {% asset_img DOM2.jpg DOM2 %}

## mouseover VS mouseenter
1. mouseover & mouseout：鼠标移入和移出（存在冒泡传播机制）；
    {% asset_img mouseover.jpg mouseover %}
2. mouseenter & mouseleave：鼠标进入和离开（默认阻止了冒泡传播）；
    {% asset_img mouseenter.jpg mouseenter %}

## 事件委托
1. 事件委托：利用事件的冒泡传播机制完成的（当前元素的某个事件行为触发，那么其祖先元素的相关事件行为都会被触发）；
2. 假设：一个大容器中有 n 个子元素，这 n 个子元素在点击的时候都要做点事情，此时我们可以这样处理 
    - 方案一：给 n 个元素的点击行为都绑定方法，点击谁触发谁；
    - 方案二：给容器的点击行为绑定方法，这样不管点击 n 个元素中的哪一个，容器的点击行为也一定会触发，此时容器根据事件源不同，处理不同的事情即可 =>事件委托方案 （性能好）；
2. 示例代码
    ```HTML
    <ul id=ul>
      <li id='li1'>1</li>
      <li id='li2'>2</li>
    </ul>
    <script>
    // 事件委托，给父元素 ul 绑定单击事件
    ul.onclick = function (e) {
      // target属性 返回触发此事件的元素（事件的目标节点）
      // nodeName 属性 返回指定节点的节点名称(返回的标签名是大写)
      if (e.target.nodeName == 'LI') {
          console.log(e.target.innerHTML);
      }
    }
    </script>
    ```

## 拖拽
1. 鼠标焦点丢失的问题：
    - 鼠标移动过快，鼠标会脱离拖拽的盒子，在盒子外面鼠标移动无法触发盒子的 mousemove，盒子不会再跟着计算最新的位置；
    - 在盒子外面松开鼠标，也不会触发盒子的 mouseup，导致 mousemove 事件没有被移除，鼠标重新进入盒子，不管是否按住，盒子都会跟着走；
2. 解决鼠标焦点丢失的问题：
    - IE 和火狐浏览器中的解决方案：setCapture/releaseCapture 可以实现把元素和鼠标绑定在一起（或者移除绑定）的效果，来防止鼠标焦点丢失；
    - 谷歌中的解决方案：孙猴子（鼠标）蹦的在欢快，也逃离不了如来佛祖（document）的五指山，所以在项目中，move 和 up 方法绑定给 document，而不是盒子；
3. 注意：在不确定当前元素的某个事件行为是否可能绑定多个方法的情况下，尽可能使用 DOM2 事件绑定的方式来实现；
4. 图解：
    {% asset_img 拖拽.jpg 拖拽 %}
5. 示例代码：
    ```HTML
    <style>
      .box {
        position: absolute;
        top: 0;
        left: 0;
        width: 100px;
        height: 100px;
        background: lightcoral;
        cursor: move;
      }
    </style>
    <div class="box" id="box"></div>
    <script>
      let box = document.getElementById('box');
  
      box.addEventListener('mousedown', down);
  
      // 鼠标按下做的事情
      function down(ev) {
        // 禁止右键
        if (ev.which === 3 || ev.which === 2) return;

        // 1.记录鼠标和盒子的起始位置，把值都记录在元素的自定义属性上
        this.startX = ev.clientX;
        this.startY = ev.clientY;
        this.startL = this.offsetLeft;
        this.startT = this.offsetTop;

        // move.bind() 会返回一个代理函数，this 指向 盒子本身
        this._MOVE = move.bind(this);
        this._UP = up.bind(this);

        // 「谷歌中的解决方案」
        // this 是点击的事件源，不可以是 document，需要用 bind 改变 this 指向
        document.addEventListener('mousemove', this._MOVE);
        document.addEventListener('mouseup', this._UP);

        // 「IE 和火狐浏览器中的解决方案」
        // this.setCapture();
      }
  
      // 鼠标移动的时候做的事情
      function move(ev) {
        if (ev.which === 3 || ev.which === 2) return;

        let curL = ev.clientX - this.startX + this.startL,
            curT = ev.clientY - this.startY + this.startT;

        // this.style.cssText = `left:${curL}px;top:${curT}px;`;
        this.style.left = curL + 'px';
        this.style.top = curT + 'px';
      }
  
      // 鼠标抬起时候做的事情 
      function up(ev) {
        if (ev.which === 3 || ev.which === 2) return;

        document.removeEventListener('mousemove', this._MOVE);
        document.removeEventListener('mouseup', this._UP);

        // this.releaseCapture();
      }
    </script>
    ```

## 案例：放大镜
1. 图解
    {% asset_img 放大镜图解.jpg 放大镜图解 %}
2. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>放大镜</title>
      <style>
        .magnifier {
          box-sizing: border-box;
          margin: 20px auto;
          width: 500px;
        }
        .magnifier .abbre,
        .magnifier .origin {
          float: left;
        }
        .magnifier .abbre {
          position: relative;
          box-sizing: border-box;
          width: 200px;
          height: 200px;
        }
        .magnifier .abbre img {
          width: 100%;
          height: 100%;
        }
        .magnifier .abbre .mark {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 60px;
          height: 60px;
          background: rgba(255, 0, 0, .3);
          cursor: move;
        }
        .magnifier .origin {
          display: none;
          position: relative;
          box-sizing: border-box;
          width: 300px;
          height: 300px;
          overflow: hidden;
        }
        .magnifier .origin img {
          position: absolute;
          top: 0;
          left: 0;
        }
      </style>
    </head>
    <body>
      <section class="magnifier clearfix">
        <!-- 左侧缩略图 -->
        <div class="abbre">
          <img src="images/1.jpg" alt="">
          <div class="mark"></div>
        </div>
        <!-- 右侧原图(大图) -->
        <div class="origin">
          <img src="images/2.jpg" alt="">
        </div>
      </section>
      <script src="js/jquery.min.js"></script>
    
      <script>
          /* 首先计算大图的大小 */
          let $abbre = $('.abbre'),
            $mark = $abbre.find('.mark'),
            $origin = $('.origin'),
            $originImg = $origin.find('img');
  
          let abbreW = $abbre.outerWidth(),
            abbreH = $abbre.outerHeight(),
            //=>获取当前元素距离body的偏移 =>{top:xxx,left:xxx}
            abbreOffset = $abbre.offset(),
            markW = $mark.outerWidth(),
            markH = $mark.outerHeight(),
            originW = $origin.outerWidth(),
            originH = $origin.outerHeight(),
            originImgW = abbreW / markW * originW,
            originImgH = abbreH / markH * originH;
  
          $originImg.css({ width: originImgW, height: originImgH });
  
          /* 鼠标进入和离开完成的事情 */
          // 计算 MARK 盒子的位置和控制大图的移动
          function computedMark(ev) {
            // MARK 盒子的偏移量
            let markL = ev.clientX - abbreOffset.left - markW / 2,
                markT = ev.clientY - abbreOffset.top - markH / 2;
            // 最小偏移量
            let minL = 0,
              minT = 0,
              // 最大偏移量（不能在照片外移动）
              maxL = abbreW - markW,
              maxT = abbreH - markH;
            markL = markL < minL ? minL : (markL > maxL ? maxL : markL);
            markT = markT < minT ? minT : (markT > maxT ? maxT : markT);
            $mark.css({
              top: markT,
              left: markL
            });
            // 
            $originImg.css({
                top: -markT / abbreH * originImgH,
                left: -markL / abbreW * originImgW
            });
          }
  
          $abbre.on('mouseenter', function (ev) {
            $mark.css('display', 'block');
            $origin.css('display', 'block');
            computedMark(ev);
          }).on('mouseleave', function (ev) {
            $mark.css('display', 'none');
            $origin.css('display', 'none');
          }).on('mousemove', computedMark);
      </script>
    </body>
    </html>
    ```
3. 效果展示
    {% asset_img 放大镜.jpg 放大镜 %}

## 案例：模态框
1. 模态框封装
    ```js
    /*
    * 把写好的方法重载到内置的 window.alert 上
    *   alert('你好世界！');  => 弹出提升框 可以关闭，3S 后自动消失
    *   alert('你好世界！',{  => 支持自定义配置项
    *      title: '系统温馨提示',   控制标题的提示内容
    *      confirm: false,   是否显示确认和取消按钮
    *      handled: null     再点击确认/取消/×按钮的时候，触发的回调函数
    *   });
    */
    window.alert = (function () {
      // DIALOG：模态框类（每一个模态框都是创建这个类的实例）
      class Dialog {
        constructor(content, options) {
          // 把后续在各个方法中用到的内容全部挂载到实例上
          this.content = content;
          this.options = options;
          // 初始化
          this.init();
        }
  
        // 创建元素
        create(type, cssText) {
          let element = document.createElement(type);
          // style属性值
          element.style.cssText = cssText;
          return element;
        }
  
        createElement() {
          this.$DIALOG = this.create('div', `
            position: fixed;
            top: 0;
            left: 0;
            z-index: 9998;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, .8);
            user-select: none;
            opacity: 0;
            transition: opacity .3s;
          `);
          this.$MAIN = this.create('div', `
            position: absolute;
            top: 100px;
            left: 50%;
            margin-left: -200px;
            z-index: 9999;
            width: 400px;
            background: #FFF;
            border-radius: 3px;
            overflow: hidden;
            transform: translateY(-1000px);
            transition: transform .3s;
          `);
          this.$HEADER = this.create('div', `
            position: relative;
            box-sizing: border-box;
            padding: 0 10px;
            height: 40px;
            line-height: 40px;
            background: #2299EE;
            cursor: move;
          `);
          this.$TITLE = this.create('h3', `
            font-size: 18px;
            color: #FFF;
            font-weight: normal;
          `);
          this.$CLOSE = this.create('i', `
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 24px;
            font-style: normal;
            color: #FFF;
            font-family: 'Courier New';
            cursor: pointer;
          `);
          this.$BODY = this.create('div', `
            padding: 30px 10px;
            line-height: 30px;
            font-size: 16px;
          `);
          this.$FOOTER = this.create('div', `
            text-align: right;
            padding: 10px 10px;
            border-top: 1px solid #EEE;
          `);
          this.$CONFIRM = this.create('button', `
            margin: 0 5px;
            padding: 0 15px;
            height: 28px;
            line-height: 28px;
            border: none;
            font-size: 14px;
            cursor: pointer;
            color: #FFF;
            background: #2299EE;
          `);
          this.$CANCEL = this.create('button', `
            margin: 0 5px;
            padding: 0 15px;
            height: 28px;
            line-height: 28px;
            border: none;
            font-size: 14px;
            cursor: pointer;
            color: #000;
            background: #DDD;
          `);
          // 把创建的元素按照层级合成（从里向外合成）
          // ES6中的解构赋值
          let { title, confirm } = this.options;
          this.$TITLE.innerHTML = title;
          this.$CLOSE.innerHTML = 'X';
          this.$HEADER.appendChild(this.$TITLE);
          this.$HEADER.appendChild(this.$CLOSE);
          this.$BODY.innerHTML = this.content;
          this.$MAIN.appendChild(this.$HEADER);
          this.$MAIN.appendChild(this.$BODY);
          if (confirm) {
              // 显示底部确定和取消按钮
              this.$CONFIRM.innerHTML = '确定';
              this.$CANCEL.innerHTML = '取消';
              this.$FOOTER.appendChild(this.$CONFIRM);
              this.$FOOTER.appendChild(this.$CANCEL);
              this.$MAIN.appendChild(this.$FOOTER);
          }
          this.$DIALOG.appendChild(this.$MAIN);
          // 插入到页面中：全部处理完后在插入，只引发一次回流
          document.body.appendChild(this.$DIALOG);
        }
  
        // 显示模态框
        show() {
          // opacity=1 透明度是1
          this.$DIALOG.style.opacity = 1;
          // y轴坐标偏移改外0，隐藏时偏移-1000px
          this.$MAIN.style.transform = 'translateY(0)';
          // 如果没有确定和取消按钮，让其显示3000MS后消失
          if (!confirm) {
            this.$timer = setTimeout(() => {
              this.hide();
              clearTimeout(this.$timer);
            }, 3000);
          }
        }
  
        // 隐藏模态框 lx='CONFIRM/CANCEL'
        // lx默认值是 CANCEL
        hide(lx = 'CANCEL') {
          this.$MAIN.style.transform = 'translateY(-1000px)';
          this.$DIALOG.style.opacity = 0;
          let fn = () => {
            // 触发handled回调函数执行
            if (typeof this.options.handled === "function") {
              this.options.handled.call(this, lx);
            }
            // 移除创建的元素
            document.body.removeChild(this.$DIALOG);
            // 当前方法只绑定一次
            this.$DIALOG.removeEventListener('transitionend', fn);
          };
          // transitionend 事件在 CSS 动画完成后触发
          this.$DIALOG.addEventListener('transitionend', fn);
        }

        // 拖拽实现
        down(ev) {
          this.startX = ev.clientX;
          this.startY = ev.clientY;
          this.startT = this.$MAIN.offsetTop;
          this.startL = this.$MAIN.offsetLeft;
          this._MOVE = this.move.bind(this);
          this._UP = this.up.bind(this);
          document.addEventListener('mousemove', this._MOVE);
          document.addEventListener('mouseup', this._UP);
        }
        move(ev) {
          let curL = ev.clientX - this.startX + this.startL,
              curT = ev.clientY - this.startY + this.startT;
          let minL = 0,
              minT = 0,
              maxL = this.$DIALOG.offsetWidth - this.$MAIN.offsetWidth,
              maxT = this.$DIALOG.offsetHeight - this.$MAIN.offsetHeight;
          curL = curL < minL ? minL : (curL > maxL ? maxL : curL);
          curT = curT < minT ? minT : (curT > maxT ? maxT : curT);
          this.$MAIN.style.left = curL + 'px';
          this.$MAIN.style.top = curT + 'px';
          this.$MAIN.style.marginLeft = 0;
        }
        up(ev) {
          document.removeEventListener('mousemove', this._MOVE);
          document.removeEventListener('mouseup', this._UP);
        }
        // 执行INIT可以创建元素，让其显示，并且实现对应的逻辑操作
        init() {
          this.createElement();
          //=>阻断渲染队列，让上述代码立即先渲染
          // 如果不加此行代码，createElement和show都是写操作都会触发回流，
          // 会加入到渲染队列中，等到全部执行完在显示，则没有动画效果，
          // 加上此行读取代码，阻断渲染队列
          this.$DIALOG.offsetWidth;
          this.show();
          // 基于事件委托实现关闭/确定/取消按钮的点击操作
          this.$DIALOG.addEventListener('click', ev => {
            let target = ev.target;
            // button 或者 i标签匹配 target.tagName
            if (/^(BUTTON|I)$/i.test(target.tagName)) {
              // 取消自动消失
              clearTimeout(this.$timer);
              this.hide(target.innerHTML === '确定' ? 'CONFIRM' : 'CANCEL');
            }
          });
          // 实现拖拽效果
          // 改变 this 指向为当前实例
          this.$HEADER.addEventListener('mousedown', this.down.bind(this));
        }
      }
      // proxy：就是alert执行的函数
      // =>插件封装的时候，如果需要传递多个配置项，我们一般都让其传递一个对象，
      // 而不是单独一项项让其传递，这样处理的好处：
      // 不需要考虑是否必传以及传递信息的顺序了、方便后期的扩展和升级...
      return function proxy(content, options = {}) {
        // 传参验证
        if (typeof content === 'undefined') {
          throw new Error("错误：提示内容必须传递！");
        }
        if (options === null || typeof options !== "object") {
          throw new Error("错误：参数配置项必须是一个对象！");
        }
        // 参数默认值和替换 (Object.assign合并对象)
        options = Object.assign({
          title: '系统温馨提示',
          confirm: false,
          handled: null
        }, options);
        return new Dialog(content, options);
      }
    })();
    ```
2. 使用
    ```HTML
    <button id="btn">点我有惊喜</button>
    <script src="dialog-plugin.js"></script>
    <script>
      btn.onclick = function () {
        alert(`
            用户名：<input type='text' id='AA'/>
            <br>
            密码：<input type='password' id='BB'/>
          `,
          {
            title: '用户登录',
            confirm: true,
            handled: lx => {
              if (lx !== 'CONFIRM') return;
              let AA = document.getElementById('AA');
              let BB = document.getElementById('BB');
              console.log(AA.value, BB.value);
            }
          });
      };
    </script>
    ```


## 面试题

### DOMContentLoaded 和 Load 的区别

### \<a> 标签默认事件禁掉之后做了什么才实现了跳转

### 浏览器事件流向

### 介绍事件代理以及优缺点
