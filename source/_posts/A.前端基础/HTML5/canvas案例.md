---
title: canvas案例
categories:
  - A.前端基础
  - HTML5
tags:
  - HTML5
  - canvas
date: 2022-04-27 14:35:24
---
## 签名
- 示例代码
  ```HTML
	<script type="text/javascript">
	    window.onload = function () {
	        var canvas = document.getElementById("test");
	        if (canvas.getContext) {
	            var ctx = canvas.getContext("2d");
	        }
	
	        canvas.onmousedown = function (ev) {
	             ev = ev || window.event;
	            // 把元素和鼠标绑定在一起（或者移除绑定）的效果，来防止鼠标焦点丢失；
	            if (canvas.setCapture) {
	                canvas.setCapture();
	            }
	
	            ctx.beginPath();
	            ctx.moveTo(ev.clientX - canvas.offsetLeft, ev.clientY - canvas.offsetTop);
	
	            document.onmousemove = function (ev) {
	                ctx.save();
	                ctx.strokeStyle = "pink";
	
	                ev = ev || event;
	                ctx.lineTo(ev.clientX - canvas.offsetLeft, ev.clientY - canvas.offsetTop);
	                ctx.stroke();
	                ctx.restore();
	            }
	
	            document.onmouseup = function () {
	                document.onmousemove = document.onmouseup = null;
	                if (document.releaseCapture) {
	                    document.releaseCapture();
	                }
	            }
	            return false;
	        }
	    }
	</script>
  ```
- 样式栈 和 样式容器
  {% asset_img 样式栈和样式容器.jpg 样式栈和样式容器 %}
- 效果展示
  {% asset_img 签名.jpg 签名 %}
## 缩放
- 示例代码
  ```HTML
	<script type="text/javascript">
	    window.onload = function () {
	        var flag = 0;
	        var scale = 0;
	        var flagScale = 0;
	        var canvas = document.querySelector("#test");
	
	        if (canvas.getContext) {
	            var ctx = canvas.getContext("2d");
	            // 此处保存默认状态到样式栈中
	            ctx.save();
	
	            // -----------此处修改 样式容器 start-----------
	            // 原点位置：（150，150）
	            ctx.translate(150, 150);
	            ctx.beginPath();
	            // 偏移量为自身的一半
	            ctx.fillRect(-50, -50, 100, 100);
	            // -----------此处修改 样式容器 end-----------
	
	            // 此处弹出样式栈中的默认状态，替换当前样式容器的样式
	            ctx.restore();
	
	            setInterval(function () {
	                flag++;
	                ctx.clearRect(0, 0, canvas.width, canvas.height);
	                ctx.save();
	                ctx.translate(150, 150);
	                // 每次旋转 1 度
	                ctx.rotate(flag * Math.PI / 180);
	
	                if (scale == 100) {
	                    flagScale = -1;
	                } else if (scale == 0) {
	                    flagScale = 1;
	                }
	                scale += flagScale;
	                // 缩放
	                ctx.scale(scale / 50, scale / 50);
	
	                ctx.beginPath();
	                ctx.fillRect(-50, -50, 100, 100);
	                ctx.restore();
	            }, 10)
	        }
	    }
	</script>
  ```
- 效果展示
  {% asset_img 缩放.jpg 缩放 %}
## 表盘
- 示例代码
  ```HTML
	<!DOCTYPE html>
	<html>
	<head>
	    <meta charset="UTF-8">
	    <title></title>
	    <style type="text/css">
	        * {
	            margin: 0;
	            padding: 0;
	        }
	        #clock {
	            position: absolute;
	            left: 50%;
	            top: 50%;
	            transform: translate3d(-50%, -50%, 0);
	        }
	    </style>
	</head>
	<body>
	    <canvas id="clock" width="400" height="400"></canvas>
	</body>
	<script type="text/javascript">
	    window.onload = function () {
	        var clock = document.querySelector("#clock");
	        if (clock.getContext) {
	            var ctx = clock.getContext("2d");
	
	            setInterval(function () {
	                ctx.clearRect(0, 0, clock.width, clock.height);
	                move();
	            }, 1000);
	            move();
	
	            function move() {
	                ctx.save();
	                ctx.lineWidth = 8;
	                ctx.strokeStyle = "black";
	                ctx.lineCap = "round";
	                ctx.translate(200, 200);
	                ctx.rotate(-90 * Math.PI / 180);
	                ctx.beginPath();
	
	                //外层空心圆盘
	                ctx.save();
	                ctx.strokeStyle = "#325FA2";
	                ctx.lineWidth = 14;
	                ctx.beginPath();
	                ctx.arc(0, 0, 140, 0, 360 * Math.PI / 180);
	                ctx.stroke();
	                ctx.restore();
	
	                //时针刻度
	                ctx.save();
	                for (var i = 0; i < 12; i++) {
	                    ctx.rotate(30 * Math.PI / 180);
	                    ctx.beginPath();
	                    ctx.moveTo(100, 0)
	                    ctx.lineTo(120, 0);
	                    ctx.stroke();
	                }
	                ctx.restore();
	
	                //分针刻度
	                ctx.save();
	                ctx.lineWidth = 4;
	                for (var i = 0; i < 60; i++) {
	                    ctx.rotate(6 * Math.PI / 180);
	                    if ((i + 1) % 5 != 0) {
	                        ctx.beginPath();
	                        ctx.moveTo(117, 0)
	                        ctx.lineTo(120, 0);
	                        ctx.stroke();
	                    }
	                }
	                ctx.restore();
	
	                //时针 分针 秒针 表座
	                var date = new Date();
	                var s = date.getSeconds();
	                var m = date.getMinutes() + s / 60;
	                var h = date.getHours() + m / 60;
	                h = h > 12 ? h - 12 : h;
	
	                //时针
	                ctx.save()
	                ctx.lineWidth = 14;
	                ctx.rotate(h * 30 * Math.PI / 180)
	                ctx.beginPath()
	                ctx.moveTo(-20, 0);
	                ctx.lineTo(80, 0);
	                ctx.stroke();
	                ctx.restore()
	
	                //分针
	                ctx.save()
	                ctx.lineWidth = 10;
	                ctx.rotate(m * 6 * Math.PI / 180)
	                ctx.beginPath()
	                ctx.moveTo(-28, 0);
	                ctx.lineTo(112, 0);
	                ctx.stroke();
	                ctx.restore()
	
	                //秒针
	                ctx.save()
	                ctx.lineWidth = 6;
	                ctx.strokeStyle = "#D40000";
	                ctx.fillStyle = "#D40000";
	                ctx.rotate(s * 6 * Math.PI / 180)
	                ctx.beginPath();
	                ctx.moveTo(-30, 0);
	                ctx.lineTo(83, 0);
	                ctx.stroke();
	
	                //表座
	                ctx.beginPath();
	                ctx.arc(0, 0, 10, 0, 360 * Math.PI / 180);
	                ctx.fill();
	
	                //秒头
	                ctx.beginPath();
	                ctx.arc(96, 0, 10, 0, 360 * Math.PI / 180);
	                ctx.stroke();
	                ctx.restore()
	                ctx.restore();
	            }
	        }
	    }
	</script>
	</html>
  ```
- 效果展示
  {% asset_img 表盘.jpg 表盘 %}
## 飞鸟
- 示例代码
  ```HTML
	<script type="text/javascript">
	    window.onload = function () {
	        var canvas = document.querySelector("#test");
	        canvas.width = document.documentElement.clientWidth;
	        canvas.height = document.documentElement.clientHeight;
	
	        if (canvas.getContext) {
	            var ctx = canvas.getContext("2d");
	            var flag = 0;
	            var xValue = 0;
	
	            setInterval(function () {
	                ctx.clearRect(0, 0, canvas.width, canvas.height)
	                xValue += 10;
	                flag++;
	                if (flag == 9) {
	                    flag = 1;
	                }
	                var img = new Image();
	                img.src = "img/q_r" + (flag) + ".jpg";
	                img.onload = function () {
	                    draw(this);
	                }
	            }, 100)
	
	            function draw(img) {
	                ctx.drawImage(img, xValue, 0)
	            }
	        }
	    }
	</script>
  ```
- 效果展示
  {% asset_img 飞鸟.jpg 飞鸟 %}
## 单像素操作
- 示例代码
  ```HTML
	<script type="text/javascript">
	    window.onload = function () {
	        var canvas = document.querySelector("#test");
	        if (canvas.getContext) {
	            var ctx = canvas.getContext("2d");
	            
	            ctx.save();
	            ctx.fillStyle = "pink";
	            ctx.beginPath();
	            ctx.fillRect(50, 50, 100, 100);
	            ctx.restore();
	
	            // 获取画布上所有的像素点
	            var imgdata = ctx.getImageData(0, 0, canvas.width, canvas.height);
	            console.log(getPxInfo(imgdata, 49, 49));
	
	            for (var i = 0; i < imgdata.width; i++) {
	                // 将 x偏移量是 30 的列 设置成 [0, 0, 0, 255]
	                setPxInfo(imgdata, 30, i, [0, 0, 0, 255]);
	            }
	            // 将处理完的像素 放回到 （0，0）
	            ctx.putImageData(imgdata, 0, 0);
	        }
	
	        // 获取单个像素的 rgba
	        function getPxInfo(imgdata, x, y) {
	            var color = [];
	            var data = imgdata.data;
	            var w = imgdata.width;
	            var h = imgdata.height;
	            // (x,y)  x*w+y：w为一行的像素
	            color[0] = data[(y * w + x) * 4];// r
	            color[1] = data[(y * w + x) * 4 + 1];// g
	            color[2] = data[(y * w + x) * 4 + 2];// b
	            color[3] = data[(y * w + x) * 4 + 3];// a
	            return color;
	        }
	
	        // 设置单个像素的 rgba
	        function setPxInfo(imgdata, x, y, color) {
	            var data = imgdata.data;
	            var w = imgdata.width;
	            var h = imgdata.height;
	            // (x,y)  x*w+y   x:多少列  y：多少行
	            data[(y * w + x) * 4] = color[0];// r
	            data[(y * w + x) * 4 + 1] = color[1];// g
	            data[(y * w + x) * 4 + 2] = color[2];// b
	            data[(y * w + x) * 4 + 3] = color[3];// a
	        }
	    }
	</script>
  ```
- 效果展示
  {% asset_img 单像素操作.jpg 单像素操作 %}
## 刮刮卡
- 示例代码
  ```HTML
	<!DOCTYPE html>
	<html>
	<head>
	    <meta charset="UTF-8">
	    <meta name="viewport" content="width=device-width,initial-scale=1.0,user-scalable=no">
	    </meta>
	    <title></title>
	    <style type="text/css">
	        * {
	            margin: 0;
	            padding: 0;
	        }
	        html,
	        body {
	            height: 100%;
	            overflow: hidden;
	        }
	        #wrap,
	        ul,
	        ul>li {
	            height: 100%;
	        }
	        ul>li {
	            background: url(img/b.png);
	            background-size: 100% 100%;
	        }
	        canvas {
	            position: absolute;
	            left: 0;
	            top: 0;
	            transition: 1s;
	        }
	    </style>
	</head>
	<body>
	    <div id="wrap">
	        <canvas></canvas>
	        <ul>
	            <li></li>
	        </ul>
	    </div>
	</body>
	<script type="text/javascript">
	    window.onload = function () {
	        var canvas = document.querySelector("canvas");
	        canvas.width = document.documentElement.clientWidth;
	        canvas.height = document.documentElement.clientHeight;
	
	        if (canvas.getContext) {
	            var ctx = canvas.getContext("2d");
	            var img = new Image();
	            img.src = "img/a.png";
	
	            img.onload = function () {
	                draw();
	            }
	
	            function draw() {
	                var flag = 0;// 记录 被处理成 透明像素的 个数
	                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
	
	                // 开始触碰
	                canvas.addEventListener("touchstart", function (ev) {
	                    ev = ev || event;
	                    var touchC = ev.changedTouches[0];
	                    var x = touchC.clientX - canvas.offsetLeft;
	                    var y = touchC.clientY - canvas.offsetTop;
	                    // 只留下已经绘制的图片超过源的部分，目标在上面,旧的图像层级比较高
	                    ctx.globalCompositeOperation = "destination-out";
	                    ctx.lineWidth = 40;
	                    ctx.lineCap = "round";
	                    ctx.lineJoin = "round";
	                    ctx.save();
	                    ctx.beginPath();
	                    ctx.moveTo(x, y);
	                    ctx.lineTo(x + 1, y + 1);
	                    ctx.stroke();
	                    ctx.restore();
	                })
	
	                // 移动手指
	                canvas.addEventListener("touchmove", function (ev) {
	                    ev = ev || event;
	                    var touchC = ev.changedTouches[0];// 手指数组，获取第一根手指
	                    var x = touchC.clientX - canvas.offsetLeft;
	                    var y = touchC.clientY - canvas.offsetTop;
	                    ctx.save();
	                    ctx.lineTo(x, y)
	                    ctx.stroke();
	                    ctx.restore();
	                })
	
	                // 手指抬起
	                canvas.addEventListener("touchend", function () {
	                    var imgData = ctx.getImageData(0, 0, canvas.width, canvas.height)
	                    var allPx = imgData.width * imgData.height;
	                    for (var i = 0; i < allPx; i++) {
	                        // 判断透明的 像素
	                        if (imgData.data[4 * i + 3] === 0) {
	                            flag++;
	                        }
	                    }
	                    if (flag >= allPx / 2) {
	                        canvas.style.opacity = 0;
	                    }
	                })
	
	                // 过渡事件：移掉 canvas
	                canvas.addEventListener("transitionend", function () {
	                    this.remove();
	                })
	            }
	        }
	    }
	</script>
	</html>
  ```
- 效果展示
  {% asset_img 刮刮卡.jpg 刮刮卡 %}
## 马赛克
- 示例代码
  ```HTML
	<script type="text/javascript">
	    var canvas = document.querySelector("#test");
	    if (canvas.getContext) {
	        var ctx = canvas.getContext("2d");
	
	        var img = new Image();
	        img.src = "tl.png";
	
	        img.onload = function () {
	            // 动态设置画布的大小
	            canvas.width = img.width * 2;
	            canvas.height = img.height;
	
	            draw(img.width, img.height);
	        }
	
	        function draw(width, height) {
	            ctx.drawImage(img, 0, 0, width, height);
	
	            var oldImgdata = ctx.getImageData(0, 0, width, height);// 获取原图
	            var newImgdata = ctx.createImageData(width, height);
	
	            /*  马赛克：
	                 1.选取一个 x*x 的马赛克矩形
	                 2.从马赛克矩形中随机抽出一个像素点的信息(rgba)
	                 3.将整个马赛克矩形中的像素点信息统一调成随机抽出的那个
	            */
	            var size = 5; // 选取一个 5*5马赛克矩形
	            for (var i = 0; i < oldImgdata.width / size; i++) {
	                for (var j = 0; j < oldImgdata.height / size; j++) {
	                    // (i,j)  每一个马赛克矩形的坐标
	                    // 从马赛克矩形中随机抽出一个像素点的信息(rgba)
	                    // Math.random()  [0,1)
	                    // Math.random()*size  [0,5)
	                    // Math.floor(Math.random()*size) [0,4]
	                    var color = getPxInfo(oldImgdata, 
	                                i * size + Math.floor(Math.random() * size), 
	                                j * size + Math.floor(Math.random() * size));
	                    // 将整个马赛克矩形中的像素点信息统一调成随机抽出的那个
	                    for (var a = 0; a < size; a++) {
	                        for (var b = 0; b < size; b++) {
	                            setPxInfo(newImgdata, i * size + a, j * size + b, color)
	                        }
	                    }
	                }
	            }
	            // ctx.clearRect(0, 0, canvas .width, canvas .height);
	            ctx.putImageData(newImgdata, img.width, 0);
	        }
	
	        function getPxInfo(imgdata, x, y) {
	            var color = [];
	            var data = imgdata.data;
	            var w = imgdata.width;
	            var h = imgdata.height;
	            color[0] = data[(y * w + x) * 4];
	            color[1] = data[(y * w + x) * 4 + 1];
	            color[2] = data[(y * w + x) * 4 + 2];
	            color[3] = data[(y * w + x) * 4 + 3];
	            return color;
	        }
	
	        function setPxInfo(imgdata, x, y, color) {
	            var data = imgdata.data;
	            var w = imgdata.width;
	            var h = imgdata.height;
	            data[(y * w + x) * 4] = color[0];
	            data[(y * w + x) * 4 + 1] = color[1];
	            data[(y * w + x) * 4 + 2] = color[2];
	            data[(y * w + x) * 4 + 3] = color[3];
	        }
	    }
	</script>
  ```
- 效果展示
  {% asset_img 马赛克.jpg 马赛克 %}
