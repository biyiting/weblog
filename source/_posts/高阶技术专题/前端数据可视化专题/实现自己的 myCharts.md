---
title: 实现自己的 myCharts
categories:
  - 高阶技术专题
  - 前端数据可视化专题
tags:
  - 数据可视化
abbrlink: af9fe93c
date: 2022-03-14 15:45:40
---
## 项目目录
<img src="实现自己的myCharts.jpg" width="200px" height="auto" class="lazy-load" title="实现自己的myCharts" />

## 实现代码
### 初始化
1. src/index.js
    ```JS
    import '../css/main.css'
    import MyCharts from './charts'

    new MyCharts({
      select: '#box1',
      ratio: 1.5,
      type: 'cirque'
    })
    ```
2. src/charts.js
    ```JS
    import utils from './utils'

    class MyCharts {
      constructor(defaultParam) {
        this.defaultParam = defaultParam
        // 获取容器
        this._canvasParDom = document.querySelector(this.defaultParam.select)
        // 容器宽高
        this.containerWidth = this._canvasParDom.clientWidth
        this.containerHeight = this._canvasParDom.clientHeight
        // 创建标签
        this._canvas = document.createElement('canvas')
    
        // 设置默认配置
        this.defaultConfig = {
          styles: {
            borderColor: "#6b9bb8",
            lineColor: '#9ec8da',
            pointColor: '#41627c'
          },
          data: [],
          x: 40,
          padding: 20,
          fontSize: '16px',
          wd: this.containerWidth * this.defaultParam.ratio,
          ht: this.containerHeight * this.defaultParam.ratio,
          lineWidth: 2,
          hisColor: ['#7b8c7c', '#5c968a', '#576d93', '#a0d878', '#337d56', '#c1d0ae', '#93b469', '#bda29a']
        }
    
        // 绘制环境 上下文
        this.ctx = this._canvas.getContext('2d')
        // 缩放画布大小（高清处理）
        this._canvas.width = this.containerWidth * this.defaultParam.ratio
        this._canvas.height = this.containerHeight * this.defaultParam.ratio
        // 添加至div 当中
        this._canvasParDom.appendChild(this._canvas)
        // 扩展或者覆盖配置
        this.defaultParam = utils.extendsObj(this.defaultConfig, this.defaultParam)
        // 设置合适的画布宽度
        this.defaultParam.wid = this._canvas.width - 20
        // 设置缩放比 
        this.defaultParam.maxPoint = utils.maxData(this.defaultParam.data) / 0.8
    
        this.init()
      }
      init() {
        switch (this.defaultParam.type) {
          case 'cirque':
            console.log('绘制圆环')
            break
        default:
            console.log('无此功能的绘制')
        }
      }
    }
    export default MyCharts
    ```
### 动画函数
1. src/myAnimation.js
    ```JS
    export default function myAnimation(param) {
      let current = 0
      let looped
      // 获取上下文
      const ctx = this.ctx
      // 获取画布
      const _canvas = this._canvas
      // 渲染函数
      const callback = param.render
      // 成功回调
      const successCb = param.success;
    
      (function looping() {
        looped = requestAnimationFrame(looping)
        if (current < param.percent) {
          // 清空画布
          ctx.clearRect(0, 0, _canvas.width, _canvas.height)
          // 改变current的值，动画时间的变化
          current = current + 4 > param.percent ? param.percent : current + 4
          // 执行渲染函数
          callback(current)
        } else {
          window.cancelAnimationFrame(looping)
          looped = null
          successCb && successCb()
        }
      })()
    }
    ```
### 绘制圆环
1. charts.js
    ```JS
    import utils from './utils'
    import Cirque from './cirque'
    import myAnimation from './myAnimation'
    
    class MyCharts {
      constructor(defaultParam) {
        this.defaultParam = defaultParam
    
        // 获取容器
        this._canvasParDom = document.querySelector(this.defaultParam.select)
        // 容器宽高
        this.containerWidth = this._canvasParDom.clientWidth
        this.containerHeight = this._canvasParDom.clientHeight
        // 创建标签
        this._canvas = document.createElement('canvas')
        // 设置默认配置
        this.defaultConfig = {
          styles: {
            borderColor: "#6b9bb8",
            lineColor: '#9ec8da',
            pointColor: '#41627c'
          },
          data: [],
          x: 40,
          padding: 20,
          fontSize: '16px',
          wd: this.containerWidth * this.defaultParam.ratio,
          ht: this.containerHeight * this.defaultParam.ratio,
          lineWidth: 2,
          hisColor: ['#7b8c7c', '#5c968a', '#576d93', '#a0d878', '#337d56', '#c1d0ae', '#93b469', '#bda29a']
        }
        // 绘制环境 上下文
        this.ctx = this._canvas.getContext('2d')
        // 缩放画布大小（高清处理）
        this._canvas.width = this.containerWidth * this.defaultParam.ratio
        this._canvas.height = this.containerHeight * this.defaultParam.ratio
        // 添加至div 当中
        this._canvasParDom.appendChild(this._canvas)
        // 扩展或者覆盖配置
        this.defaultParam = utils.extendsObj(this.defaultConfig, this.defaultParam)
        // 设置合适的画布宽度
        this.defaultParam.wid = this._canvas.width - 20
        // 设置缩放比 
        this.defaultParam.maxPoint = utils.maxData(this.defaultParam.data) / 0.8
        this.init()
      }
      init() {
        switch (this.defaultParam.type) {
          // 绘制圆环
          case 'cirque':
            let circleConfig = {
              // 设置圆心坐标
              x: this.defaultParam.wd / 2,
              y: this.defaultParam.ht / 2,
              // 设置半径
              radius: 200,
              // 开始角度
              startAngle: 0,
              // 结束角度
              endAngle: 2 * Math.PI,
              // 所有圆环线的宽度
              arcWidth: 30,
              // 进度圆环停止位置
              target: 90
            }
            // 设置圆环默认配置
            this.circleConfig = utils.extendsObj(this.defaultConfig, circleConfig)
            myAnimation.call(this, {
              // 动画时长
              percent: this.circleConfig.target,
              render: (current) => {
                // current 为动画系数比
                Cirque.call(this, current / 100)
              }
            })
            break
          case 'line':
            break;
          case 'histogram':
            break
          default:
            console.log('无此功能的绘制')
        }
      }
    }
    export default MyCharts
    ```
2. src/cirque.js
    ```JS
    let Cirque = function (percent) {
      const ctx = this.ctx
      const circleConfig = this.defaultParam
    
      // 绘制打底圆环
      ctx.beginPath()
      ctx.lineWidth = circleConfig.arcWidth
      // 放射性渐变 第一个圆环的坐标和半径，第二个圆环的坐标和半径
      let grd = ctx.createRadialGradient(circleConfig.x, circleConfig.y, circleConfig.radius - 10, circleConfig.x, circleConfig.y, circleConfig.radius + 10)
      // 渐变颜色
      grd.addColorStop(0, "#e9eae9")
      grd.addColorStop("0.8", "#fefefe")
      grd.addColorStop("1", "#e9eae9")
      // 绘制样式
      ctx.strokeStyle = grd
      // 绘制圆环 圆心坐标、半径、开始角度、结束角度、默认为顺时针
      ctx.arc(circleConfig.x, circleConfig.y, circleConfig.radius, circleConfig.startAngle, circleConfig.endAngle)
      ctx.stroke()
      ctx.closePath()
    
    
      // 绘制进度圆环
      ctx.beginPath()
      ctx.lineWidth = circleConfig.arcWidth
      // 放射性渐变 第一个圆环的坐标和半径，第二个圆环的坐标和半径
      let linear = ctx.createLinearGradient(220, 220, 380, 200)
      linear.addColorStop(0, '#ffc26b')
      linear.addColorStop(0.5, '#ff9a5f')
      linear.addColorStop(1, '#ff8157')
      // 绘制样式
      ctx.strokeStyle = linear
      // 绘制圆环 圆心坐标、半径、开始角度、结束角度、默认为顺时针
      ctx.arc(circleConfig.x, circleConfig.y, circleConfig.radius, circleConfig.startAngle, circleConfig.endAngle * percent)
      ctx.stroke()
      ctx.closePath()
    
    
      // 起点的圆形
      ctx.beginPath()
      ctx.fillStyle = '#ff7854'
      // 绘制圆环 圆心坐标、半径、开始角度、结束角度、默认为顺时针
      ctx.arc(circleConfig.x + circleConfig.radius, circleConfig.y - 1, circleConfig.arcWidth / 2, circleConfig.startAngle, circleConfig.endAngle)
      ctx.fill()
      ctx.closePath()
    
    
      // 终点的圆形
      ctx.beginPath()
      ctx.lineWidth = circleConfig.arcWidth - 10
      ctx.fillStyle = '#fff'
      ctx.strokeStyle = '#ff7854'
      // 转动后的 x 坐标
      let tarX = circleConfig.x + circleConfig.radius * Math.cos(2 * Math.PI * percent)
      // 转动后的 y 坐标
      let tarY = circleConfig.y + circleConfig.radius * Math.sin(2 * Math.PI * percent)
      // 绘制圆环 圆心坐标、半径、开始角度、结束角度、默认为顺时针
      ctx.arc(tarX, tarY, circleConfig.arcWidth - 8, circleConfig.startAngle, circleConfig.endAngle)
      // 圆环填充
      ctx.fill()
      // 圆环描边
      ctx.stroke()
      ctx.closePath()
    }
    export default Cirque
    ```
3. 终点圆环的位置变化 x，y 坐标的计算
    <img src="终点圆环的位置变化.jpg" width="600px" height="auto" class="lazy-load" title="终点圆环的位置变化"/>
4. 效果展示
    <img src="绘制圆环.jpg" width="600px" height="auto" class="lazy-load" title="绘制圆环"/>

### 绘制折线图
1. src/charts.js
    ```JS
    import utils from './utils'
    import Cirque from './cirque'
    import myAnimation from './myAnimation'
    import { drawAxis, drawPoint, drawBrokenLine, drawDashLine } from './broken'
    
    class MyCharts {
      constructor(defaultParam) {
        this.defaultParam = defaultParam
        // 获取容器
        this._canvasParDom = document.querySelector(this.defaultParam.select)
        // 容器宽高
        this.containerWidth = this._canvasParDom.clientWidth
        this.containerHeight = this._canvasParDom.clientHeight
        // 创建标签
        this._canvas = document.createElement('canvas')
        // 设置默认配置
        this.defaultConfig = {
          styles: {
            borderColor: "#6b9bb8",
            lineColor: '#9ec8da',
            pointColor: '#41627c'
          },
          data: [],
          x: 40,
          padding: 20,
          fontSize: '16px',
          wd: this.containerWidth * this.defaultParam.ratio,
          ht: this.containerHeight * this.defaultParam.ratio,
          lineWidth: 2,
          hisColor: ['#7b8c7c', '#5c968a', '#576d93', '#a0d878', '#337d56', '#c1d0ae', '#93b469', '#bda29a']
        }
        // 绘制环境 上下文
        this.ctx = this._canvas.getContext('2d')
        // 缩放画布大小（高清处理）
        this._canvas.width = this.containerWidth * this.defaultParam.ratio
        this._canvas.height = this.containerHeight * this.defaultParam.ratio
        // 添加至div 当中
        this._canvasParDom.appendChild(this._canvas)
        // 扩展或者覆盖配置
        this.defaultParam = utils.extendsObj(this.defaultConfig, this.defaultParam)
        // 设置合适的画布宽度
        this.defaultParam.wid = this._canvas.width - 20
        // 设置缩放比 （折现图数据：数值较小的时候展示不友好）
        this.defaultParam.maxPoint = utils.maxData(this.defaultParam.data) / 0.8
        this.init()
      }
      init() {
        switch (this.defaultParam.type) {
          // 绘制圆环
          case 'cirque':
            let circleConfig = {
              // 设置圆心坐标
              x: this.defaultParam.wd / 2,
              y: this.defaultParam.ht / 2,
              // 设置半径
              radius: 200,
              // 开始角度 0
              startAngle: 0,
              // 结束角度 360
              endAngle: 2 * Math.PI,
              // 所有圆环线的宽度
              arcWidth: 30,
              // 进度圆环停止位置
              target: 90
            }
            // 设置圆环默认配置
            this.circleConfig = utils.extendsObj(this.defaultConfig, circleConfig)
            myAnimation.call(this, {
              // 动画时长
              percent: this.circleConfig.target,
              render: (current) => {
                // current 为动画系数比
                Cirque.call(this, current / 100)
              }
            })
            break
          case 'line':
            myAnimation.call(this, {
              // 动画时长
              percent: 200,
              render: (current) => {
                // 绘制坐标系
                drawAxis.call(this)
                // 绘制数据之间的虚线
                drawBrokenLine.call(this, current / 200)
                // 绘制数据 Y 轴虚线
                drawDashLine.call(this, current / 200)
                // 绘制数据 （数据圆点）
                drawPoint.call(this, current / 200)
              }
            })
            break;
          case 'histogram':
            break
          default:
            console.log('无此功能的绘制')
        }
      }
    }
    export default MyCharts
    ```
2. src/broken.js
    ```JS
    // 绘制坐标系
    export function drawAxis() {
      const defaultParam = this.defaultParam
      const ctx = this.ctx
      const pad = defaultParam.padding
      const bottomPad = 30
      const wd = defaultParam.wd
      const ht = defaultParam.ht
      const data = defaultParam.data
      // 绘制 x、y 轴
      ctx.save()
      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = defaultParam.styles.borderColor
      ctx.moveTo(pad, pad)
      ctx.lineTo(pad, ht - bottomPad)
      ctx.lineTo(wd - pad, ht - bottomPad)
      ctx.stroke()
      ctx.closePath()
    
      // 绘制文字刻度 
      for (let i = 0; i < data.length; i++) {
        ctx.beginPath()
        ctx.fillStyle = '#333'
        ctx.textAlign = 'center'
        ctx.font = defaultParam.fontSize + ' Microsoft YaHei'
        ctx.fillText(data[i].xVal, i * (defaultParam.wid / data.length - 1) + defaultParam.x, ht - 10)
        ctx.closePath()
      }
      ctx.restore()
    }
    
    // 绘制数据
    export function drawPoint(speed) {
      const defaultParam = this.defaultParam
      const ctx = this.ctx
      const data = defaultParam.data
      const len = data.length
      const ht = defaultParam.ht
      // 计算
      ctx.save()
      ctx.lineWidth = 2
      for (let i = 0; i < len; i++) {
        let yVal = parseInt(data[i].yVal * speed)
        let tranY = ht - ht * yVal / defaultParam.maxPoint - 30
        let tranX = i * (defaultParam.wid / len - 1) + defaultParam.x
        // 绘制图形
        ctx.beginPath()
        ctx.shadowOffsetX = 0
        ctx.shadowOffsetY = 0
        ctx.shadowBlur = 5
        ctx.shadowColor = defaultParam.styles.pointColor
        ctx.fillStyle = defaultParam.styles.pointColor
        ctx.strokeStyle = '#fff'
        ctx.arc(tranX, tranY, 15, 0, 2 * Math.PI, false)
        ctx.fill()
        ctx.stroke()
        ctx.closePath()
        // 绘制圆形对应的数值
        ctx.beginPath()
        ctx.shadowBlur = 0
        ctx.fillStyle = '#333'
        ctx.textAlign = 'center'
        ctx.font = defaultParam.fontSize + ' MicroSoft YaHei'
        ctx.fillText(yVal, tranX, tranY - 20)
        ctx.closePath()
      }
      ctx.restore()
    }
    
    // 绘制数据之间的虚线
    export function drawBrokenLine(speed) {
      const defaultParam = this.defaultParam
      const ctx = this.ctx
      const bottomPad = 30
      const data = defaultParam.data
      const ht = defaultParam.ht
      const maxPoint = defaultParam.maxPoint
      const len = data.length - 1
      const stepDots = Math.floor(speed * len)
      // 绘制线条 
      ctx.save()
      ctx.beginPath()
      ctx.setLineDash([4, 4])
      ctx.lineWidth = defaultParam.lineWidth
      ctx.strokeStyle = defaultParam.styles.lineColor
      for (let i = 0; i < len; i++) {
        // 起点 
        const yVal = data[i].yVal
        const axisY = ht - ht * (yVal / maxPoint) - bottomPad
        const averageNum = defaultParam.wid / data.length - 1
        const axisX = i * averageNum + defaultParam.x
        // 终点 
        let axisEndX = (i + 1) * averageNum + defaultParam.x
        let axisEndY = ht - ht * (data[i + 1].yVal) / maxPoint - bottomPad
        // 分段绘制
        if (i <= stepDots) {
          if (i === stepDots) {
            axisEndX = (axisEndX - axisX) * speed + axisX
            axisEndY = (axisEndY - axisY) * speed + axisY
          }
          ctx.moveTo(axisX, axisY)
          ctx.lineTo(axisEndX, axisEndY)
        }
      }
      ctx.stroke()
      ctx.closePath()
      ctx.restore()
    }
    
    // 绘制数据 Y 轴虚线
    export function drawDashLine(speed) {
      const defaultParam = this.defaultParam
      const ctx = this.ctx
      const bottomPad = 30
      const data = defaultParam.data
      const ht = defaultParam.ht
      const maxPoint = defaultParam.maxPoint
      const len = data.length
      ctx.save()
      for (let i = 0; i < len; i++) {
        // 起始点
        const averageNum = defaultParam.wid / data.length - 1
        let axisX = i * averageNum + defaultParam.x
        let axisY = ht - ht * (data[i].yVal) / maxPoint * speed - bottomPad
        // 开始绘制 
        ctx.beginPath()
        ctx.lineWidth = 2
        ctx.setLineDash([4, 4])
        ctx.strokeStyle = '#d6d6d6'
        ctx.moveTo(axisX, ht - bottomPad)
        ctx.lineTo(axisX, axisY)
        ctx.stroke()
        ctx.closePath()
      }
      ctx.restore()
    }
    ```
3. 效果展示

    <img src="绘制折线图.jpg" width="600px" height="auto" class="lazy-load" title="绘制折线图"/>

### 绘制直方图
1. src/charts.js
    ```JS
    import utils from './utils'
    import Cirque from './cirque'
    import myAnimation from './myAnimation'
    import { drawHistogram } from './histogram'
    import { drawAxis, drawPoint, drawBrokenLine, drawDashLine } from './broken'
    
    class MyCharts {
      constructor(defaultParam) {
        this.defaultParam = defaultParam
        // 获取容器
        this._canvasParDom = document.querySelector(this.defaultParam.select)
        // 容器宽高
        this.containerWidth = this._canvasParDom.clientWidth
        this.containerHeight = this._canvasParDom.clientHeight
        // 创建标签
        this._canvas = document.createElement('canvas')
        // 设置默认配置
        this.defaultConfig = {
          styles: {
            borderColor: "#6b9bb8",
            lineColor: '#9ec8da',
            pointColor: '#41627c'
          },
          data: [],
          x: 40,
          padding: 20,
          fontSize: '16px',
          wd: this.containerWidth * this.defaultParam.ratio,
          ht: this.containerHeight * this.defaultParam.ratio,
          lineWidth: 2,
          hisColor: ['#7b8c7c', '#5c968a', '#576d93', '#a0d878', '#337d56', '#c1d0ae', '#93b469', '#bda29a']
        }
        // 绘制环境 上下文
        this.ctx = this._canvas.getContext('2d')
        // 缩放画布大小（高清处理）
        this._canvas.width = this.containerWidth * this.defaultParam.ratio
        this._canvas.height = this.containerHeight * this.defaultParam.ratio
        // 添加至div 当中
        this._canvasParDom.appendChild(this._canvas)
        // 扩展或者覆盖配置
        this.defaultParam = utils.extendsObj(this.defaultConfig, this.defaultParam)
        // 设置合适的画布宽度
        this.defaultParam.wid = this._canvas.width - 20
        // 设置缩放比 （折现图数据：数值较小的时候展示不友好）
        this.defaultParam.maxPoint = utils.maxData(this.defaultParam.data) / 0.8
        this.init()
      }
      init() {
        switch (this.defaultParam.type) {
          // 绘制圆环
          case 'cirque':
            let circleConfig = {
              // 设置圆心坐标
              x: this.defaultParam.wd / 2,
              y: this.defaultParam.ht / 2,
              // 设置半径
              radius: 200,
              // 开始角度 0
              startAngle: 0,
              // 结束角度 360
              endAngle: 2 * Math.PI,
              // 所有圆环线的宽度
              arcWidth: 30,
              // 进度圆环停止位置
              target: 90
            }
            // 设置圆环默认配置
            this.circleConfig = utils.extendsObj(this.defaultConfig, circleConfig)
            myAnimation.call(this, {
              // 动画时长
              percent: this.circleConfig.target,
              render: (current) => {
                // current 为动画系数比
                Cirque.call(this, current / 100)
              }
            })
            break
          case 'line':
            myAnimation.call(this, {
              // 动画时长
              percent: 200,
              render: (current) => {
                // 绘制坐标系
                drawAxis.call(this)
                // 绘制数据之间的虚线
                drawBrokenLine.call(this, current / 200)
                // 绘制数据 Y 轴虚线
                drawDashLine.call(this, current / 200)
                // 绘制数据 （数据圆点）
                drawPoint.call(this, current / 200)
              }
            })
            break;
          case 'histogram':
            myAnimation.call(this, {
              percent: 100,
              render: (current) => {
                // 绘制坐标系
                drawAxis.call(this)
                // 绘制直方图
                drawHistogram.call(this, current / 100)
              }
            })
            break
          default:
            console.log('无此功能的绘制')
        }
      }
    }
    export default MyCharts
    ```
2. src/histogram.js
    ```JS
    // 绘制直方图
    export function drawHistogram(speed) {
      const defaultParam = this.defaultParam
      const ctx = this.ctx
      const bottomPad = 30
      const data = defaultParam.data
      const ht = defaultParam.ht
      const maxPoint = defaultParam.maxPoint
      const len = data.length
      let rectHeight = this._canvas.height - bottomPad
    
      for (let i = 0; i < len; i++) {
        let yVal = data[i].yVal * speed
        let axisY = ht - ht * (yVal / maxPoint) - bottomPad
        const averageNum = defaultParam.wid / data.length - 1
        let axisX = i * averageNum + defaultParam.x
    
        ctx.save()
        ctx.beginPath()
        ctx.fillStyle = defaultParam.hisColor[i]
        // x, y, width, height
        ctx.fillRect(axisX - 15, axisY, 40, rectHeight - axisY)
        ctx.restore()
      }
    }
    ```
3. 效果展示
    <img src="绘制直方图.jpg" width="600px" height="auto" class="lazy-load" title="绘制直方图"/>


## <a class="attachment" name="myCharts.zip">代码附件下载</a>