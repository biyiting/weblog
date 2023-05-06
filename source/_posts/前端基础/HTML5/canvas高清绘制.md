---
title: canvas高清绘制
categories:
  - 前端基础
  - HTML5
tags:
  - HTML5
  - canvas
date: 2022-04-27 13:40:24
---

## 使用 canvas 绘制图片或者是文字在 Retina 屏中会非常模糊

{% asset_img vague.jpg vague %}

### 模糊的原因

- 因为 canvas 不像 svg 这样，canvas 不是矢量图，而是像常见图片一样是位图模式的：
  - 高 dpi 显示设备意味着每平方英寸有更多的像素；
  - 也就是说二倍屏，浏览器就会以 2 个像素点的宽度来渲染一个像素，该 canvas 在 Retina 屏幕下相当于占据了 2 倍的空间，相当于图片被放大了一倍，因此绘制出来的图片文字等会变模糊；
- 因此，要做 Retina 屏适配，关键是知道当前屏幕的设备像素比，然后将 canvas 放大到该设备像素比来绘制，然后将 canvas 压缩到一倍来展示（css 中的宽高会将 canvas 中的内容根据比例放大）；

### 示例代码

```HTML
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>canvas 高清绘制</title>
  </head>
  <body>
      <canvas id="canvas" width="400" height="150">您的浏览器当前不支持 canvas</canvas>
  </body>
  <script>
      const canvas = document.getElementById('canvas')
      const ctx = canvas.getContext('2d')

      const getPixelRatio = (context) => {
          return window.devicePixelRatio || 1
      }

      // 1.获取屏幕像素比
      const ratio = getPixelRatio()
      const oldWidth = canvas.width
      const oldHeight = canvas.height

      // 2.将 canvas 放大到该设备像素比来绘制
      canvas.width = canvas.width * ratio
      canvas.height = canvas.height * ratio

      // 3.然后将 canvas 的内容压缩到一倍来展示
      canvas.style.width = oldWidth + 'px'
      canvas.style.height = oldHeight + 'px'

      // 4.设置 canvas图像 x，y 轴的缩放比例
      ctx.scale(ratio, ratio)

      ctx.fillStyle = "grey"
      ctx.font = "40px sans-serif"
      ctx.fillText("像素清晰度对比", 70, 100);
  </script>
  </html>
```

### 效果展示

{% asset_img 像素对比.jpg vague %}

## 案例

### 绘制直角坐标系
- 示例代码
  ```HTML
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制直角坐标系</title>
    <style>
      canvas {
        display: block;
        margin: 10px auto 0;
        border: 1px solid orange;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas" width="600" height="400">您的浏览器不支持 canvas</canvas>
  </body>
  <script>
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')

    const getPixelRatio = (context) => {
      return window.devicePixelRatio || 1
    }

    // 高清绘制
    const ratio = getPixelRatio()
    canvas.style.width = canvas.width + 'px'
    canvas.style.height = canvas.height + 'px'
    canvas.width = canvas.width * ratio
    canvas.height = canvas.height * ratio

    // 提前设置相关属性
    const ht = canvas.clientHeight
    const wd = canvas.clientWidth
    const pad = 20
    const bottomPad = 20
    const step = 100

    const drawAxis = (options) => {
      const { ht, wd, pad, bottomPad, step, ctx } = options

      // 绘制坐标轴
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'lightblue'
      ctx.moveTo(pad, pad)
      ctx.lineTo(pad, ht * ratio - bottomPad)
      ctx.lineTo(wd * ratio - pad, ht * ratio - bottomPad)
      ctx.stroke()
      ctx.closePath()

      // 绘制 X 轴方向刻度
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = '#666'
      for (let i = 1; i < Math.floor(wd * ratio / step); i++) {
        ctx.moveTo(pad + i * step, ht * ratio - bottomPad)
        ctx.lineTo(pad + i * step, ht * ratio - bottomPad - 10)
      }
      ctx.stroke()
      ctx.closePath()

      // 绘制 Y 轴方向刻度
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = '#666'
      for (let i = 1; i < Math.floor(ht * ratio / step); i++) {
        ctx.moveTo(pad, (ht * ratio - bottomPad) - (i * step))
        ctx.lineTo(pad + 10, (ht * ratio - bottomPad) - (i * step))
      }
      ctx.stroke()
      ctx.closePath()
    }

    drawAxis({
      ht: ht,
      wd: wd,
      pad: pad,
      bottomPad: bottomPad,
      step: step,
      ctx: ctx
    })
  </script>
  </html>
  ```
- 效果展示
  {% asset_img 绘制直角坐标系.jpg 绘制直角坐标系 %}

### 绘制直方图
- 示例代码
  ```HTML
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制直方图</title>
    <style>
      canvas {
        display: block;
        margin: 10px auto 0;
        border: 1px solid orange;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas" width="600" height="400">您的浏览器不支持 canvas</canvas>
  </body>
  <script>
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const getPixelRatio = (context) => {
      return window.devicePixelRatio || 1
    }

    // 高清绘制
    const ratio = getPixelRatio()
    canvas.style.width = canvas.width + 'px'
    canvas.style.height = canvas.height + 'px'
    canvas.width = canvas.width * ratio
    canvas.height = canvas.height * ratio

    // 提前设置相关属性
    const ht = canvas.clientHeight
    const wd = canvas.clientWidth
    const pad = 20
    const bottomPad = 20
    const step = 100

    const drawAxis = (options) => {
      const { ht, wd, pad, bottomPad, step, ctx } = options
      // 绘制坐标轴
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'lightblue'
      ctx.moveTo(pad, pad)
      ctx.lineTo(pad, ht * ratio - bottomPad)
      ctx.lineTo(wd * ratio - pad, ht * ratio - bottomPad)
      ctx.stroke()
      ctx.closePath()
      // 绘制 X 轴方向刻度
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = '#666'
      for (let i = 1; i < Math.floor(wd * ratio / step); i++) {
        ctx.moveTo(pad + i * step, ht * ratio - bottomPad)
        ctx.lineTo(pad + i * step, ht * ratio - bottomPad + 10)
      }
      ctx.stroke()
      ctx.closePath()

      // 绘制 Y 轴方向刻度
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = '#666'
      for (let i = 1; i < Math.floor(ht * ratio / step); i++) {
        ctx.moveTo(pad, (ht * ratio - bottomPad) - (i * step))
        ctx.lineTo(pad + 10, (ht * ratio - bottomPad) - (i * step))
      }
      ctx.stroke()
      ctx.closePath()
    }

    drawAxis({
      ht: ht,
      wd: wd,
      pad: pad,
      bottomPad: bottomPad,
      step: step,
      ctx: ctx
    })

    // 绘制矩形：描边+填充
    // ctx.beginPath()
    // ctx.lineWidth = 5
    // ctx.strokeStyle = 'orange'
    // ctx.fillStyle = 'hotpink'
    // ctx.rect(100, 100, 300, 200)
    // ctx.fill()
    // ctx.stroke()
    // ctx.closePath()

    // 绘制矩形：描边
    // ctx.beginPath()
    // ctx.lineWidth = 4
    // ctx.strokeStyle = 'seagreen'
    // ctx.strokeRect(100, 310, 300, 200)
    // ctx.closePath()

    // 绘制矩形：填充
    // ctx.beginPath()
    // ctx.fillStyle = 'skyblue'
    // ctx.fillRect(410, 310, 300, 200)
    // ctx.closePath()
    // 绘制直方图
    ctx.beginPath()
    for (var i = 1; i < Math.floor(wd * ratio / step); i++) {
      // 随机高度 [300,350)
      const height = Math.random() * 300 + 50
      // 随机颜色 [0，255)的16进制
      ctx.fillStyle = '#' + parseInt(Math.random() * 0xFFFFFF).toString(16)
      // x，y，宽度，高度
      ctx.fillRect((i * step), ht * ratio - bottomPad - height, 40, height)
    }
    ctx.closePath()
  </script>
  </html>
  ```
- 效果展示
  {% asset_img 绘制直方图.jpg 绘制直方图 %}

### 绘制圆弧
- 示例代码
  ```HTML
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>绘制矩形</title>
    <style>
      canvas {
        display: block;
        margin: 10px auto 0;
        border: 1px solid orange;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas" width="600" height="400">您的浏览器不支持 canvas</canvas>
  </body>
  <script>
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const getPixelRatio = (context) => {
      return window.devicePixelRatio || 1
    }

    // 高清绘制
    const ratio = getPixelRatio()
    canvas.style.width = canvas.width + 'px'
    canvas.style.height = canvas.height + 'px'
    canvas.width = canvas.width * ratio
    canvas.height = canvas.height * ratio

    // 提前设置相关属性
    const ht = canvas.clientHeight
    const wd = canvas.clientWidth
    const pad = 20
    const bottomPad = 20
    const step = 100

    const drawAxis = (options) => {
      const { ht, wd, pad, bottomPad, step, ctx } = options
      // 绘制坐标轴
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'lightblue'
      ctx.moveTo(pad, pad)
      ctx.lineTo(pad, ht * ratio - bottomPad)
      ctx.lineTo(wd * ratio - pad, ht * ratio - bottomPad)
      ctx.stroke()
      ctx.closePath()
      // 绘制 X 轴方向刻度
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = '#666'
      for (let i = 1; i < Math.floor(wd * ratio / step); i++) {
        ctx.moveTo(pad + i * step, ht * ratio - bottomPad)
        ctx.lineTo(pad + i * step, ht * ratio - bottomPad + 10)
      }
      ctx.stroke()
      ctx.closePath()

      // 绘制 Y 轴方向刻度
      ctx.beginPath()
      ctx.lineWidth = 1
      ctx.strokeStyle = '#666'
      for (let i = 1; i < Math.floor(ht * ratio / step); i++) {
        ctx.moveTo(pad, (ht * ratio - bottomPad) - (i * step))
        ctx.lineTo(pad + 10, (ht * ratio - bottomPad) - (i * step))
      }
      ctx.stroke()
      ctx.closePath()
    }

    drawAxis({
      ht: ht,
      wd: wd,
      pad: pad,
      bottomPad: bottomPad,
      step: step,
      ctx: ctx
    })

    // 绘制圆环
    ctx.beginPath()
    ctx.lineWidth = 2
    ctx.strokeStyle = 'orange'
    // x，y，r，开始角度，结束角度，true为逆时针绘制
    ctx.arc(400, 300, 200, 0, Math.PI / 4, true)
    ctx.stroke()
    ctx.closePath()

    // 绘制圆形
    ctx.beginPath()
    ctx.fillStyle = 'skyblue'
    ctx.moveTo(400, 300)
    // x，y，r，开始角度，结束角度，true为逆时针绘制
    ctx.arc(400, 300, 100, 0, -Math.PI / 2, true)
    ctx.fill()
    ctx.closePath()
  </script>
  </html>
  ```
- 效果展示
  {% asset_img 绘制圆弧.jpg 绘制圆弧 %}

### 绘制饼图
- 示例代码
  ```HTML
  <!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>绘制饼图</title>
	  <style>
	    canvas {
	      display: block;
	      margin: 10px auto 0;
	      border: 1px solid orange;
	    }
	  </style>
	</head>
	<body>
	  <canvas id="canvas" width="600" height="400">您的浏览器不支持 canvas</canvas>
	</body>
	<script>
	  const canvas = document.getElementById('canvas')
	  const ctx = canvas.getContext('2d')
	  const getPixelRatio = (context) => {
	    return window.devicePixelRatio || 1
	  }
	
	  // 高清绘制
	  const ratio = getPixelRatio()
	  canvas.style.width = canvas.width + 'px'
	  canvas.style.height = canvas.height + 'px'
	  canvas.width = canvas.width * ratio
	  canvas.height = canvas.height * ratio
	
	  // 提前设置相关属性
	  const ht = canvas.clientHeight
	  const wd = canvas.clientWidth
	  const pad = 20
	  const bottomPad = 20
	  const step = 100
	
	  const drawAxis = (options) => {
	    const { ht, wd, pad, bottomPad, step, ctx } = options
	    // 绘制坐标轴
	    ctx.beginPath()
	    ctx.lineWidth = 2
	    ctx.strokeStyle = 'lightblue'
	    ctx.moveTo(pad, pad)
	    ctx.lineTo(pad, ht * ratio - bottomPad)
	    ctx.lineTo(wd * ratio - pad, ht * ratio - bottomPad)
	    ctx.stroke()
	    ctx.closePath()
	    // 绘制 X 轴方向刻度
	    ctx.beginPath()
	    ctx.lineWidth = 1
	    ctx.strokeStyle = '#666'
	    for (let i = 1; i < Math.floor(wd * ratio / step); i++) {
	      ctx.moveTo(pad + i * step, ht * ratio - bottomPad)
	      ctx.lineTo(pad + i * step, ht * ratio - bottomPad + 10)
	    }
	    ctx.stroke()
	    ctx.closePath()
	
	    // 绘制 Y 轴方向刻度
	    ctx.beginPath()
	    ctx.lineWidth = 1
	    ctx.strokeStyle = '#666'
	    for (let i = 1; i < Math.floor(ht * ratio / step); i++) {
	      ctx.moveTo(pad, (ht * ratio - bottomPad) - (i * step))
	      ctx.lineTo(pad + 10, (ht * ratio - bottomPad) - (i * step))
	    }
	    ctx.stroke()
	    ctx.closePath()
	  }
	
	  drawAxis({
	    ht: ht,
	    wd: wd,
	    pad: pad,
	    bottomPad: bottomPad,
	    step: step,
	    ctx: ctx
	  })
	
	  ctx.beginPath()
	  ctx.shadowOffsetX = 0
	  ctx.shadowOffsetY = 0
	  ctx.shadowBlur = 4
	  ctx.shadowColor = '#333'
	  ctx.fillStyle = '#5C1918'
	  ctx.moveTo(400, 300)
	  ctx.arc(400, 300, 100, -Math.PI / 2, -Math.PI / 4)
	  ctx.fill()
	  ctx.closePath()
	
	  ctx.beginPath()
	  ctx.shadowOffsetX = 0
	  ctx.shadowOffsetY = 0
	  ctx.shadowBlur = 4
	  ctx.shadowColor = '#5C1918'
	  ctx.fillStyle = '#A32D29'
	  ctx.moveTo(400, 300)
	  ctx.arc(400, 300, 110, -Math.PI / 4, Math.PI / 4)
	  ctx.fill()
	  ctx.closePath()
	
	  ctx.beginPath()
	  ctx.shadowOffsetX = 0
	  ctx.shadowOffsetY = 0
	  ctx.shadowBlur = 4
	  ctx.shadowColor = '#A32D29'
	  ctx.fillStyle = '#B9332E'
	  ctx.moveTo(400, 300)
	  ctx.arc(400, 300, 120, Math.PI / 4, Math.PI * 5 / 8)
	  ctx.fill()
	  ctx.closePath()
	
	  ctx.beginPath()
	  ctx.shadowOffsetX = 0
	  ctx.shadowOffsetY = 0
	  ctx.shadowBlur = 4
	  ctx.shadowColor = '#B9332E'
	  ctx.fillStyle = '#842320'
	  ctx.moveTo(400, 300)
	  ctx.arc(400, 300, 130, Math.PI * 5 / 8, Math.PI)
	  ctx.fill()
	  ctx.closePath()
	
	  ctx.beginPath()
	  ctx.shadowOffsetX = 0
	  ctx.shadowOffsetY = 0
	  ctx.shadowBlur = 4
	  ctx.shadowColor = '#842320'
	  ctx.fillStyle = '#D76662'
	  ctx.moveTo(400, 300)
	  ctx.arc(400, 300, 140, Math.PI, Math.PI * 3 / 2)
	  ctx.fill()
	  ctx.closePath()
	</script>
	</html>
  ```
- 效果展示
  {% asset_img 绘制饼图.jpg 绘制饼图 %}

### 碰撞检测
- 示例代码
  ```HTML
  <!DOCTYPE html>
	<html lang="en">
	<head>
	  <meta charset="UTF-8">
	  <meta http-equiv="X-UA-Compatible" content="IE=edge">
	  <meta name="viewport" content="width=device-width, initial-scale=1.0">
	  <title>碰撞检测</title>
	  <style>
	    canvas {
	      display: block;
	      margin: 40px auto 0;
	      border: 1px solid sienna;
	    }
	  </style>
	</head>
	<body>
	  <canvas id="canvas" width="600" height="400">您的浏览器不支持 canvas</canvas>
	</body>
	<script>
	  const canvas = document.getElementById('canvas')
	  const ctx = canvas.getContext('2d')
	
	  const getPixelRatio = (context) => {
	    return window.devicePixelRatio || 1
	  }
	
	  // 高清绘制
	  const ratio = getPixelRatio()
	  canvas.style.width = canvas.width + 'px'
	  canvas.style.height = canvas.height + 'px'
	  canvas.width = canvas.width * ratio
	  canvas.height = canvas.height * ratio
	
	  // 绘制小球
	  const drawCircle = (x, y, r) => {
	    ctx.beginPath()
	    ctx.fillStyle = 'orange'
	    ctx.arc(x, y, r, 0, Math.PI * 2)
	    ctx.fill()
	    ctx.closePath()
	  }
	
	  // 配置属性
	  const wd = canvas.clientWidth * ratio
	  const ht = canvas.clientHeight * ratio
	  let x = y = 100 // 初始坐标
	  const r = 40
	  let xSpeed = 6
	  let ySpeed = 4
	
	  drawCircle(x, y, r)
	
	  setInterval(() => {
	    ctx.clearRect(0, 0, wd, ht) // 清空画布
	    // 小球超出左右的边界，xSpeed偏移量为取反，向相反方向移动
	    if (x - r <= 0 || x + r >= wd) {
	      xSpeed = -xSpeed
	    }
	    // 小球超出上下的边界，ySpeed偏移量取反，向相反方向移动
	    if (y - r <= 0 || y + r >= ht) {
	      ySpeed = -ySpeed
	    }
	    // 小球向右下运动
	    x += xSpeed
	    y += ySpeed
	    drawCircle(x, y, r)
	  }, 20)
	</script>
	</html>
  ```
- 效果展示
  {% asset_img 碰撞检测.jpg 碰撞检测 %}

### 弹性球
- 示例代码
  ```HTML
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>弹性球</title>
    <style>
      canvas {
        display: block;
        margin: 40px auto 0;
        border: 1px solid sienna;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas" width="600" height="400">您的浏览器不支持 canvas</canvas>
  </body>
  <script>
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const getPixelRatio = (context) => {
      return window.devicePixelRatio || 1
    }

    // 高清绘制
    const ratio = getPixelRatio()
    canvas.style.width = canvas.width + 'px'
    canvas.style.height = canvas.height + 'px'
    canvas.width = canvas.width * ratio
    canvas.height = canvas.height * ratio

    class Ball {
      constructor(canvas) {
        this.canvas = canvas
        this.ctx = this.canvas.getContext('2d')
        this.wd = this.canvas.clientWidth * ratio
        this.ht = this.canvas.clientHeight * ratio
        // 随机数 半径：【40,50)
        this.r = Math.random() * 40 + 10
        // 随机数 x轴：【this.wd - (this.r * 2),this.wd - (this.r * 2)+ this.r)
        this.x = Math.random() * (this.wd - (this.r * 2)) + this.r
        // 随机数 y轴：【this.ht - (this.r * 2),this.ht - (this.r * 2)+ this.r)
        this.y = Math.random() * (this.ht - (this.r * 2)) + this.r
        // 随机数 颜色：【0,235)16进制
        this.color = '#' + parseInt(Math.random() * 0xFFFFFF).toString(16)
        // 随机数 x偏移：【4,10)
        this.xSpeed = Math.random() * 4 + 6
        // 随机数 y偏移：【6,10)
        this.ySpeed = Math.random() * 6 + 4
        this.init()
      }
      init() {
        this.run()
        this.draw()
      }
      draw() {
        this.ctx.beginPath()
        this.ctx.fillStyle = this.color
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        this.ctx.fill()
        this.ctx.closePath()
      }
      run() {
        if (this.x - this.r <= 0 || this.x + this.r >= this.wd) {
          this.xSpeed = -this.xSpeed
        }
        if (this.y - this.r <= 0 || this.y + this.r >= this.ht) {
          this.ySpeed = -this.ySpeed
        }
        this.x += this.xSpeed
        this.y += this.ySpeed
      }
    }

    let ballArr = []
    for (let i = 0; i < 100; i++) {
      let ball = new Ball(canvas)
      ballArr.push(ball)
    }

    // 动画
    setInterval(() => {
      ctx.clearRect(0, 0, canvas.clientWidth * ratio, canvas.clientHeight * ratio)
      for (let i = 0; i < ballArr.length; i++) {
        let ball = ballArr[i]
        ball.init()
      }
    }, 15)
  </script>
  </html>
  ```
- 效果展示
  {% asset_img 弹性球.jpg 弹性球 %}

### 绘制关系图
- 示例代码
  ```HTML
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>关系图</title>
    <style>
      * {
        margin: 0;
        padding: 0;
      }
    </style>
  </head>
  <body>
    <canvas id="canvas">您的浏览器不支持 canvas</canvas>
  </body>
  <script>
    const canvas = document.getElementById('canvas')
    const ctx = canvas.getContext('2d')
    const getPixelRatio = (context) => {
      return window.devicePixelRatio || 1
    }

    // 高清绘制
    const ratio = getPixelRatio()
    canvas.style.width = document.documentElement.clientWidth - 6 + 'px'
    canvas.style.height = document.documentElement.clientHeight - 6 + 'px'
    canvas.width = document.documentElement.clientWidth * ratio
    canvas.height = document.documentElement.clientHeight * ratio

    class Ball {
      constructor(options) {
        this.canvas = options.canvas
        this.text = options.title
        this.ctx = this.canvas.getContext('2d')
        this.wd = this.canvas.clientWidth * ratio
        this.ht = this.canvas.clientHeight * ratio
        this.r = Math.random() * 40 + 10
        this.x = Math.random() * (this.wd - (this.r * 2)) + this.r
        this.y = Math.random() * (this.ht - (this.r * 2)) + this.r
        this.color = '#' + parseInt(Math.random() * 0xFFFFFF).toString(16)
        this.xSpeed = Math.random() * 4 + 6
        this.ySpeed = Math.random() * 6 + 4
        this.init()
      }
      init() {
        this.run()
        this.draw()
      }
      draw() {
        this.drawCircle()
        this.drawText(this.text, this.x, this.y + this.r + 10)
      }
      // 绘制圆形
      drawCircle() {
        this.ctx.beginPath()
        this.ctx.fillStyle = this.color
        this.ctx.arc(this.x, this.y, this.r, 0, 2 * Math.PI)
        this.ctx.fill()
        this.ctx.closePath()
      }
      // 绘制文字
      drawText(text, x, y) {
        this.ctx.font = 'normal 20px 微软雅黑'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.fillText(text, x, y)
      }
      // 绘制线条
      drawLine(startX, startY, endX, endY, color) {
        this.ctx.beginPath()
        this.ctx.lineWidth = 1
        this.ctx.strokeStyle = color || '#666'
        this.ctx.moveTo(startX, startY)
        this.ctx.lineTo(endX, endY)
        this.ctx.stroke()
        this.ctx.closePath()
      }
      run() {
        if (this.x - this.r <= 0 || this.x + this.r >= this.wd) {
          this.xSpeed = -this.xSpeed
        }
        if (this.y - this.r <= 0 || this.y + this.r >= this.ht) {
          this.ySpeed = -this.ySpeed
        }
        this.x += this.xSpeed
        this.y += this.ySpeed
      }
    }

    let ballArr = []
    let titleArr = ['Vue', 'Webpack', 'React', 'Angular', 'Python', 'Nodejs', 'eCharts', 'Next']

    for (let i = 0; i < 8; i++) {
      let ball = new Ball({
        canvas: canvas,
        title: titleArr[i]
      })
      ballArr.push(ball)

      // 连线
      for (let j = 0; j < i; j++) {
        let preBall = ballArr[j]
        ball.drawLine(ball.x, ball.y, preBall.x, preBall.y)
      }
    }

    // 做动画
    setInterval(() => {
      ctx.clearRect(0, 0, canvas.clientWidth * ratio + 10, canvas.clientHeight * ratio + 10)
      // 1.先绘制连线
      for (let i = 0; i < ballArr.length; i++) {
        let ball = ballArr[i]
        // 连线
        for (let j = 0; j < i; j++) {
          let preBall = ballArr[j]
          ball.drawLine(ball.x, ball.y, preBall.x, preBall.y, ball.color)
        }
      }
      // 2.再绘制小球（小球会在线的上面绘制）
      for (let i = 0; i < ballArr.length; i++) {
        let ball = ballArr[i]
        ball.init()
      }
    }, 15)
  </script>
  </html>
  ```
- 效果展示
  {% asset_img 绘制关系图.jpg 绘制关系图 %}

---
