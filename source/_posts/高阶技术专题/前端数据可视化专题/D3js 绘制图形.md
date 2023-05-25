---
title: D3js 绘制图形
categories:
  - 高阶技术专题
  - 前端数据可视化专题
tags:
  - 数据可视化
abbrlink: c559f906
date: 2022-03-16 10:50:40
---
> D3.js 底层采用 svg 完成图形绘制 <a class="attachment" name="d3.min.js">d3.min.js下载</a>

## 简单使用
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>D3.js使用</title>
      <script src="./d3.min.js"></script>
    </head>
    <body>
      <script>
        const data = [100, 20, 30, 50]
        // select 获取元素
        d3.select('body')
          .selectAll('p')
          .data(data)
          .enter()
          .append('p')
          .text('你好')
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="简单使用.jpg" width="400px" height="auto" class="lazy-load" title="简单使用"/>

## 操作 svg
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>d3操作svg</title>
      <script src="./d3.min.js"></script>
    </head>
    <body>
      <div id="box">
        <p>p元素</p>
        <p>p元素</p>
        <p>p元素</p>
      </div>
      <div>第二个div元素</div>
      <svg width="600" height="400">
        <rect x="100" y="100" width="200" height="100" style=" stroke:red; stroke-width: 4"></rect>
      </svg>
      <script>
        // 01 d3 获取元素
        console.log(d3.select('#box'))
        console.log(d3.select('#box p'))
        console.log(d3.selectAll('#box p'))
        console.log(d3.selectAll('div'))
            
    
        // 02 获取元素属性
        console.log(+d3.select('rect').attr('width') === 200)
    
        // 03 设置属性
        d3.select('rect')
          .attr('fill', 'seagreen')
          .attr('transform', 'translate(100, 100)')
    
        // 04 添加元素
        d3.select('svg').append('rect')
          .attr('x', 100)
          .attr('y', '300')
          .attr('width', '200')
          .attr('height', '100')
          .attr('fill', 'lightblue')
    
        d3.select('svg').append('text')
          .attr('x', 50)
          .attr('y', 100)
          .attr('fill', 'red')
          .attr('font-size', 20)
          .attr('textLength', 200)
          .text('操作 svg')
    
        // 05 删除元素
        // d3.selectAll('rect').remove()
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="操作svg.jpg" width="600px" height="auto" class="lazy-load" title="操作svg"/>


## 绑定数据
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>绑定数据</title>
      <script src="./d3.min.js"></script>
    </head>
    <body>
      <script>
        // 01 添加 svg 画布
        d3.select('body').append('svg')
          .attr('width', 600)
          .attr('height', 400)
    
        // 02 绘制圆形1 
        // d3.select('svg').append('circle')
        //   .attr('cx', 100)
        //   .attr('cy', 100)
        //   .attr('r', 10)
        //   .attr('fill', 'orange')
    
        // d3.select('svg').append('circle')
        //   .attr('cx', 120)
        //   .attr('cy', 130)
        //   .attr('r', 20)
        //   .attr('fill', 'seagreen')
    
        // 03 定义数据 
        const data = [
          { cx: 100, cy: 100, r: 10, fill: 'orange' },
          { cx: 130, cy: 140, r: 20, fill: 'seagreen' },
          { cx: 230, cy: 240, r: 19, fill: 'lightblue' },
        ]
        // 多个图形绘制
        d3.select('svg').selectAll('circle')
          .data(data)
          .enter()
          .append('circle')
          .attr('cx', d => d.cx) // 取 data 中的值
          .attr('cy', d => d.cy)
          .attr('r', d => d.r)
          .attr('fill', d => d.fill)
    
      // update  enter  exit 
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="绑定数据.jpg" width="600px" height="auto" class="lazy-load" title="绑定数据"/>


## 三种选择集
1. 三种选择集的关系
    <img src="三种选择集的关系.jpg" width="600px" height="auto" class="lazy-load" title="三种选择集的关系"/>

    -	update：元素和数据一一对应；
    - enter：数据比元素数量多；
    - exit：数据比元素数量少；
2. 示例代码
    - update
      ```HTML
      <body>
        <p></p>
        <p></p>
        <p></p>
        <script>
          const data = [1, 2, 3, 4, 5]
          d3.selectAll('body p')
            .data(data)
            .text(d => "更新" + d)
        </script>
      </body>
      ```
      <img src="update.jpg" width="300px" height="auto" class="lazy-load" title="update"/>
    - enter
      ```HTML
      <body>
        <script>
          const data = [1, 2, 3, 4, 5]
          d3.select('body').selectAll('p')
            .data(data)
            .enter()
            .append('p')
            .text(d => '新增' + d)
        </script>
      </body>
      ```
      <img src="enter.jpg" width="300px" height="auto" class="lazy-load" title="enter"/>
    - exit
      ```HTML
      <body>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <p></p>
        <script>
          const data = [1, 2, 3, 4, 5]
          d3.select('body').selectAll('p')
            .data(data)
            .exit()
            .append('p')
            .text(d => '删除' + d)
        </script>
      </body>
      ```
      <img src="exit.jpg" width="300px" height="auto" class="lazy-load" title="exit"/>
3. data VS datum
    - data
      ```HTML
      <body>
        <p></p>
        <p></p>
        <p></p>
        <script>
          const data = [1, 2, 3, 4, 5]
          d3.selectAll('body p')
            .data(data)
            .text(d => d)
        </script>
      </body>
      ```
      <img src="data.jpg" width="300px" height="auto" class="lazy-load" title="data"/>
    - datum
      ```HTML
      <body>
        <p></p>
        <p></p>
        <p></p>
        <script>
          const data = [1, 2, 3, 4, 5]
          d3.selectAll('body p')
            .datum(data)
            .text(d => d)
        </script>
      </body>
      ```
      <img src="datum.jpg" width="300px" height="auto" class="lazy-load" title="datum"/>


## 绘制直方图
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>绘制直方图</title>
      <script src="./d3.min.js"></script>
      <style>
        div svg {
          display: block;
          margin: 40px auto 0;
          border: 1px solid orange;
        }
      </style>
    </head>
    <body>
      <div id="svg"></div>
      <script>
        // 定义数据
        // 画布宽高
        const width = 700
        const height = 400
        // 步帧
        const rectStep = 80
        const rectWidth = 30
        // 直方图数据
        const data = [10, 50, 280, 122, 90, 230, 250, 300]
        // 定义填充
        const margin = { left: 20, right: 20, top: 20, bottom: 20 }
    
        // 创建 svg 画布
        d3.select('#svg').append('svg')
          .attr('width', width)
          .attr('height', height)
    
        // 绘制矩形
        d3.select('svg').selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('x', (d, i) => margin.left + i * rectStep)
          .attr('y', d => height - d - margin.bottom)
          .attr('width', rectWidth)
          .attr('height', d => d)
          .attr('fill', 'lightblue')
    
        // 绘制文字
        d3.select('svg').selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .attr('fill', '#666')
          .attr('font-size', '20')
          .attr('x', (d, i) => margin.left + i * rectStep)
          .attr('y', d => height - d - margin.bottom - 5)
          .attr('text-anchor', 'middle')
          .attr('transform', `translate(${rectWidth / 2})`)
          .text(d => d)
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="绘制直方图.jpg" width="300px" height="auto" class="lazy-load" title="绘制直方图"/>


## 线性比例尺
1. 为什么要使用比例尺？
    - 数据是 1：1 放在画布上；
    - 当数据特别大（超出画布高度）、或者数据特别小的时候，展示不友好；
    - 使用比例尺按照一定的比例 放大 或者 缩小 ；
2. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>绘制直方图</title>
      <script src="./d3.min.js"></script>
      <style>
        div svg {
          display: block;
          margin: 40px auto 0;
          border: 1px solid orange;
        }
      </style>
    </head>
    <body>
      <div id="svg"></div>
      <script>
        // 定义数据
        const width = 700
        const height = 400
        const rectStep = 80
        const rectWidth = 30
        const data = [10, 50, 180, 122, 900, 230, 250, 300]
        // 定义填充
        const margin = { left: 20, right: 20, top: 20, bottom: 20 }
    
        // 定义线性比例尺：按照比例 放大 缩小 直方图
        const linear = d3.scaleLinear()
          .domain([0, d3.max(data)]) // 定义域
          .range([0, 300]) //值域
    
        // 创建 svg 
        d3.select('#svg').append('svg')
          .attr('width', width)
          .attr('height', height)
    
        // 绘制矩形
        d3.select('svg').selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('x', (d, i) => margin.left + i * rectStep)
          .attr('y', d => height - linear(d) - margin.bottom)
          .attr('width', rectWidth)
          .attr('height', d => linear(d))
          .attr('fill', 'lightblue')
    
        // 绘制文字
        d3.select('svg').selectAll('text')
          .data(data)
          .enter()
          .append('text')
          .attr('fill', '#666')
          .attr('font-size', '20')
          .attr('x', (d, i) => margin.left + i * rectStep)
          .attr('y', d => height - linear(d) - margin.bottom - 5)
          .attr('text-anchor', 'middle')
          .attr('transform', `translate(${rectWidth / 2})`)
          .text(d => d)
      </script>
    </body>
    </html>
    ```
3. 效果展示
    <img src="线性比例尺.jpg" width="300px" height="auto" class="lazy-load" title="线性比例尺"/>

## 常见比例尺
1. d3.scaleLinear() 线性比例尺
    - 创造一个线性比例尺，而domain()是输入域，range()是输出域，相当于将domain中的数据集映射到range的数据集中：
      ```js
      let scale = d3.scaleLinear()
        .domain([1, 5])
        .range([0, 100])
      ```
    - 映射关系
      <img src="映射关系.jpg" width="300px" height="auto" class="lazy-load" title="映射关系"/>
    - 比例尺的输入和输出
      ```js
      let scale = d3.scaleLinear()
        .domain([1, 5])
        .range([0, 100])

      console.log(scale(1)) // 1
      console.log(scale(4)) // 75
      console.log(scale(5)) // 100
      console.log(scale(-1)) // -50
      console.log(scale(10)) // 225
      scale.clamp(true) // 限制最大值范围在 【1,100】
      console.log(scale(-1)) // 0
      console.log(scale(10)) // 100
      ```
2. d3.scaleBand() 序数比例尺
    - d3.scaleBand()并不是一个连续性的比例尺，domain()中使用一个数组，不过range()需要是一个连续域：
      ```js
      let scale = d3.scaleBand()
        .domain([1, 2, 3, 4])
        .range([0, 100])
      ```
    - 映射关系
      <img src="序数比例尺.jpg" width="300px" height="auto" class="lazy-load" title="序数比例尺"/>
    - 比例尺的输入和输出
      ```js
      let scale = d3.scaleBand()
        .domain([1, 2, 3, 4])
        .range([0, 100])
    
      console.log(scale(1)) // 0
      console.log(scale(2)) // 25
      console.log(scale(3)) // 50
      console.log(scale(4)) // 75
      console.log(scale(0)) // undefined
      console.log(scale(10)) // undefined
      ```
3. d3.scaleOrdinal() 序数比例尺
    - d3.scaleOrdinal()的输入域和输出域都使用离散的数据
      ```js
      let scale = d3.scaleOrdinal()
        .domain(['jack', 'rose', 'john'])
        .range([10, 20, 30])
      ```
    - 映射关系
      <img src="scaleOrdinal.jpg" width="500px" height="auto" class="lazy-load" title="scaleOrdinal"/>
    - 比例尺的输入和输出
      ```js
      let scale = d3.scaleOrdinal()
        .domain(['jack', 'rose', 'john'])
        .range([10, 20, 30])

      console.log(scale('jack')); // 输出:10
      console.log(scale('rose')); // 输出:20
      console.log(scale('john')); // 输出:30
      // 当输入不是domain()中的数据集时：
      console.log(scale('tom')); // 输出:10
      console.log(scale('trump')); // 输出:20
      ```
4. d3.scaleQuantize() 量化比例尺
    - d3.scaleQuantize()也属于连续性比例尺。定义域是连续的，而输出域是离散的；
      ```js
      let scale = d3.scaleQuantize()
        .domain([0, 10])
        .range(['small', 'medium', 'long'])
      ```
    - 映射关系
      <img src="scaleQuantize.jpg" width="300px" height="auto" class="lazy-load" title="scaleQuantize"/>
    - 比例尺的输入和输出
      ```js
      let scale = d3.scaleQuantize()
        .domain([0, 10])
        .range(['small', 'medium', 'long'])
        
      console.log(scale(1)) // 输出:small
      console.log(scale(5.5)) // 输出:medium
      console.log(scale(8)) // 输出:long  
      console.log(scale(-10)) // 输出：small
      console.log(scale(10)) // 输出：long
      ```
5. d3.scaleTime() 时间比例尺：
6. 颜色比例尺：
7. ......


## 比例尺与坐标轴
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>比例尺与坐标轴</title>
      <script src="./d3.min.js"></script>
    </head>
    <body>
      <div id="box"></div>
      <script>
        // 定义数据
        const width = 600
        const height = 500
        const margin = { left: 50, right: 50, bottom: 50, top: 50 }
        const kindData = ['ES6+', "NodeJS", "Vue", "React", "Angular"]
        const kindPixel = [margin.left, width - margin.right]
        const ratioData = [80, 60, 50, 20, 100]
        const ratioPixel = [height - margin.bottom, margin.top]
    
        // 设置画布
        d3.select('#box').append('svg')
          .attr('width', width)
          .attr('height', height)
    
        // 定义比例尺
        const xScale = d3.scaleBand().domain(kindData).rangeRound(kindPixel)
        // 定义坐标刻度生成器
        const xAxis = d3.axisBottom(xScale)
    
        // 绘制X轴具体的刻度内容
        d3.select('svg').append('g')
          .call(xAxis)
          .attr('transform', `translate(0, ${height - margin.bottom})`)
          .attr('font-size', 14)
    
        // 定义y轴比例尺
        const yScale = d3.scaleLinear().domain([0, d3.max(ratioData)]).range(ratioPixel)
        const yAxis = d3.axisLeft(yScale)
        d3.select('svg').append('g')
          .call(yAxis)
          .attr('transform', `translate(50, 0)`)
          .attr('font-size', 14)
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="比例尺与坐标轴.jpg" width="300px" height="auto" class="lazy-load" title="比例尺与坐标轴"/>

## 过渡
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>D3过渡</title>
      <script src="./d3.min.js"></script>
    </head>
    <body>
      <script>
        // 添加画布
        const svg = d3.select('body').append('svg')
          .attr('width', 600)
          .attr('height', 400)
    
        // 绘制图形
        const circle = d3.select('svg').append('circle')
          .attr('cx', 100)
          .attr('cy', 100)
          .attr('r', 20)
          .attr('fill', 'seagreen')
    
        // 初始状态
        circle.attr('cx', 100).attr('cy', 100)
    
        // 结束状态
        circle.transition()
          .duration(3000) // 持续时间
          .delay(1000) // 延时
          .ease(d3.easeBounce) // 补间动画
          .attr('cx', 500)
          .attr('cy', 300)
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="过渡.jpg" width="300px" height="auto" class="lazy-load" title="过渡"/>

## 柱状图带过渡
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>柱状图带过渡</title>
      <script src="./d3.min.js"></script>
    </head>
    <body>
      <script>
        // 画布大小
        const width = 600
        const height = 400
    
        // 1 添加画布
        const svg = d3.select('body').append('svg')
          .attr('width', width)
          .attr('height', height)
    
        // 2 填充
        const margin = { left: 30, right: 30, top: 20, bottom: 30 }
        // 3 准备源数据
        const data = [10, 20, 30, 40, 36, 25, 18, 5]
        // 4 绘制坐标轴（比例尺）[0, 1 , 2, 3]=>[0, 540]
        const xScale = d3.scaleBand()
          .domain(d3.range(data.length))
          .range([margin.left, width - margin.left - margin.right])
          .padding(0.1)
    
        // 5 定义X轴的生成器
        const xAxis = d3.axisBottom(xScale)
        // 6 绘制X轴坐标
        const gx = d3.select('svg').append('g')
          .call(xAxis)
          .attr('transform', `translate(0, ${height - margin.bottom})`)
    
        // 7 绘制Y轴（比例尺  生成器 Y绘制）[5, 40]=>[30, 400]
        const yScale = d3.scaleLinear()
          .domain([0, d3.max(data)])
          .range([height - margin.top - margin.bottom, margin.bottom])
        const yAxis = d3.axisLeft(yScale)
        const gy = d3.select('svg').append('g')
          .call(yAxis)
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
    
        // 8 绘制柱状图
        const rects = svg.selectAll('.myRect')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'myRect')
          .attr('x', (d, i) => xScale(i))
          .attr('y', d => yScale(d))
          .attr('width', xScale.bandwidth())
          .attr('height', d => yScale(0) - yScale(d))
          .attr('fill', 'orange')
          .attr('transform', `translate(0, ${margin.top})`)
    
        // 提供二个状态
        rects.attr('y', () => yScale(0)).attr('height', 0)
        rects.transition()
          .duration(1000)
          .delay((d, i) => i * 200)
          .ease(d3.easeBounce)
          .attr('y', d => yScale(d))
          .attr('height', d => yScale(0) - yScale(d))
    
        // 9 绘制文件
        const texts = svg.selectAll('myText')
          .data(data)
          .enter()
          .append('text')
          .attr('class', 'myText')
          .attr('fill', '#666')
          .attr('text-anchor', 'middle')
          .attr('x', (d, i) => xScale(i))
          .text(d => d)
          .attr('transform', `translate(${xScale.bandwidth() / 2}, ${margin.top})`)
    
        texts.attr('y', () => yScale(0))
        texts.transition()
          .delay((d, i) => i * 200)
          .duration(1000)
          .ease(d3.easeBounce)
          .attr('y', (d) => yScale(d) - 5)
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="柱状图带过渡.jpg" width="300px" height="auto" class="lazy-load" title="柱状图带过渡"/>

## 柱状图带交互
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>柱状图带交互</title>
      <style>
        html,
        body {
          width: 100%;
          margin: 0;
        }
        #tip {
          color: #fff;
          display: none;
          margin-top: 15px;
          margin-left: 15px;
          position: absolute;
          padding: 5px 10px;
          border-radius: 3px;
          background: rgba(0, 0, 0, .4);
          font: normal 14px/1em '微软雅黑';
        }
      </style>
      <script src="./d3.min.js"></script>
    </head>
    <body>
      <script>
        // 画布大小
        const width = 600
        const height = 400
    
        // 1 添加画布
        const svg = d3.select('body').append('svg')
          .attr('width', width)
          .attr('height', height)
        // 2 填充
        const margin = { left: 30, right: 30, top: 20, bottom: 30 }
        // 3 准备源数据
        const data = [10, 20, 30, 40, 36, 25, 18, 5]
    
        // 4 绘制坐标轴（比例尺）[0, 1 , 2, 3]=>[0, 540]
        const xScale = d3.scaleBand()
          .domain(d3.range(data.length))
          .range([margin.left, width - margin.left - margin.right])
          .padding(0.1)
        // 5 定义X轴的生成器
        const xAxis = d3.axisBottom(xScale)
        // 6 绘制X轴坐标
        const gx = d3.select('svg').append('g')
          .call(xAxis)
          .attr('transform', `translate(0, ${height - margin.bottom})`)
    
        // 7 绘制Y轴（比例尺  生成器 Y绘制）[5, 40] [30, 400]
        const yScale = d3.scaleLinear()
          .domain([0, d3.max(data)])
          .range([height - margin.top - margin.bottom, margin.bottom])
        const yAxis = d3.axisLeft(yScale)
        const gy = d3.select('svg').append('g')
          .call(yAxis)
          .attr('transform', `translate(${margin.left}, ${margin.top})`)
    
        // 8 绘制柱状图
        const rects = svg.selectAll('.myRect')
          .data(data)
          .enter()
          .append('rect')
          .attr('class', 'myRect')
          .attr('x', (d, i) => xScale(i))
          .attr('y', d => yScale(d))
          .attr('width', xScale.bandwidth())
          .attr('height', d => yScale(0) - yScale(d))
          .attr('fill', 'orange')
          .attr('transform', `translate(0, ${margin.top})`)
        // 提供二个状态
        rects.attr('y', () => yScale(0)).attr('height', 0)
        rects.transition()
          .duration(1000)
          .delay((d, i) => i * 200)
          .ease(d3.easeBounce)
          .attr('y', d => yScale(d))
          .attr('height', d => yScale(0) - yScale(d))
    
        // 9 绘制文件
        const texts = svg.selectAll('myText')
          .data(data)
          .enter()
          .append('text')
          .attr('class', 'myText')
          .attr('fill', '#666')
          .attr('text-anchor', 'middle')
          .attr('x', (d, i) => xScale(i))
          .text(d => d)
          .attr('transform', `translate(${xScale.bandwidth() / 2}, ${margin.top})`)
          .attr('y', () => yScale(0))
          .transition()
          .delay((d, i) => i * 200)
          .duration(1000)
          .ease(d3.easeBounce)
          .attr('y', (d) => yScale(d) - 5)
    
        // 自定义缓动类
        class EaseObj {
          constructor(target) {
            // target 要做动画的元素
            this.target = target
            // 默认位置为居中
            this.pos = { x: width / 2, y: height / 2 }
            // 默认结束位置
            this.endPos = { x: 0, y: 0 }
            this._play = false
            this.fm = 0
            this.speed = 0.1
          }
          set animate(value) {
            if (value !== this._play) {
              if (value) {
                // 做动画
                this.render()
              } else {
                // 取消动画
                this.cancel()
              }
              this._play = value
            }
          }
          render() {
            const { pos, endPos, speed, target } = this
            pos.x += (endPos.x - pos.x) * speed
            pos.y += (endPos.y - pos.y) * speed
            target.style('left', `${pos.x}px`)
              .style('top', `${pos.y}px`)
            this.fm = requestAnimationFrame(() => {
              this.render()
            })
          }
          cancel() {
            cancelAnimationFrame(this.fm)
          }
        }
        // 10 定义提示框元素
        const tip = d3.select('body').append('div').attr('id', 'tip')
    
        // 11 鼠标移上
        rects.on('mouseover', ({ clientX, clientY }, data) => {
          tip.style('left', `${clientX}px`)
            .style('top', `${clientY}px`)
            .style('display', 'block')
            .html(`
              <p>此项平均值：${data}</p>
            `)
        })
        const tipObj = new EaseObj(tip)
        rects.on('mousemove', ({ clientX, clientY }, data) => {
          tipObj.endPos = { x: clientX, y: clientY }
          tipObj.animate = true
        })
        rects.on('mouseout', () => {
          tipObj.animate = false
          tip.style('display', 'none')
        })
    
        // rects.on('mousemove', ({ clientX, clientY }, data) => {
        //   tip.style('left', `${clientX}px`)
        //     .style('top', `${clientY}px`)
        // })
        // rects.on('mouseout', ({ clientX, clientY }, data) => {
        //   tip.style('left', `${clientX}px`)
        //     .style('top', `${clientY}px`)
        //     .style('display', 'none')
        // })
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="柱状图带交互.jpg" width="300px" height="auto" class="lazy-load" title="柱状图带交互"/>