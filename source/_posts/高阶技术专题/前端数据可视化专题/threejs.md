---
title: threejs
categories:
  - 高阶技术专题
  - 前端数据可视化专题
tags:
  - 数据可视化
abbrlink: f604b88f
date: 2022-03-17 14:15:40
---
## three.js
1. WebGL 和 three.js 是浏览器端的 3D 呈现技术；
    - WebGL：将 javascript 与 openGL ES2 结合操作显卡；
    - ThreeJS：采用 javascript 编写的类库；
2. ThreeJS 渲染过程：
    <img src="渲染过程.jpg" width="500px" height="auto" class="lazy-load" title="渲染过程"/>

    - 场景：一个显示呈现的舞台；
    - 相机：浏览器端呈现的内容；
      - 正投影相机：远处近处的内容做同等大小呈现处理；
      - 透视相机：符合心里习惯，近大远小，离视点近则大，远即小，灭点处消失；
        `THREE.PerspectiveCamera = function(fov，aspect，near，far){ }`
    - 渲染器：决定了内容如何呈现至屏幕；
3. 透视相机工作原理的理解
    <img src="透视相机工作原理的理解.jpg" width="auto" height="400px" class="lazy-load" title="透视相机工作原理的理解"/>
4. <a class="attachment" name="ThreeJS.zip">代码附件下载</a>


## 绘制立方体
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>绘制立方体</title>
      <script src="./three.min.js"></script>
    </head>
    <body>
      <script>
        /**
        01 场景 
        02 相机： 分类 位置
        03 渲染器：大小 颜色
        04 几何体：
        */
        // 场景
        const scene = new THREE.Scene()
        // 相机：视角、纵横比、相机离近裁面 1 米、相机离远裁面 1000 米（正常能看见的在1000以内）
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
        // 渲染器：抗锯齿渲染 antialias: true
        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setClearColor(0xffffff)
        renderer.setSize(window.innerWidth, window.innerHeight)
        // 挂载到 dom 树上
        document.body.appendChild(renderer.domElement)
        // 立方体：x、y、z 轴的大小
        const geometry = new THREE.BoxGeometry(1, 1, 1)
        // 三个轴的材质
        const material = new THREE.MeshBasicMaterial({
          color: 0x285b41,
          wireframe: true // 网格
        })
        // 将几何放到场景中
        const cube = new THREE.Mesh(geometry, material)
        scene.add(cube)
        camera.position.z = 4
        
        function animate() {
          requestAnimationFrame(animate)
          // 旋转
          cube.rotation.y += 0.01
          cube.rotation.x += 0.01
          renderer.render(scene, camera)
        }
        animate()
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="绘制立方体.jpg" width="auto" height="400px" class="lazy-load" title="绘制立方体"/>

## 材质与相机控制
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>轨迹球控制与材质</title>
      <script src="./three.min.js"></script>
      <script src="./TrackballControls.js"></script>
    </head>
    <body>
      <script>
        // 定义全局变量
        let scene, camera, geometry, mesh, renderer, controls
        // 初始化渲染器
        function initRenderer() {
          renderer = new THREE.WebGLRenderer({ antialias: true })
          renderer.setSize(window.innerWidth, window.innerHeight)
          renderer.setPixelRatio(window.devicePixelRatio)
          document.body.appendChild(renderer.domElement)
        }
    
        // 初始化场景
        function initScene() {
          scene = new THREE.Scene()
          const axesHelper = new THREE.AxesHelper(100)
          scene.add(axesHelper)
        }
    
        // 初始化相机
        function initCamera() {
          camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
          camera.position.set(0, 0, 15)
          controls = new THREE.TrackballControls(camera, renderer.domElement)
        }
    
        // 初始化模型
        function initMesh() {
          geometry = new THREE.BoxGeometry(2, 2, 2)
          // material = new THREE.MeshNormalMaterial()
          const texture = new THREE.TextureLoader().load('img/crate.gif')
          material = new THREE.MeshBasicMaterial({
            map: texture,
            side: THREE.DoubleSide
          })
          mesh = new THREE.Mesh(geometry, material)
          scene.add(mesh)
        }
    
        // 初始化动画
        function animate() {
          requestAnimationFrame(animate)
          controls.update()
          renderer.render(scene, camera)
        }
    
        // 定义初始化方法
        function init() {
          initRenderer()
          initScene()
          initCamera()
          initMesh()
          animate()
        }
    
        init()
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="材质与相机控制.jpg" width="auto" height="400px" class="lazy-load" title="材质与相机控制"/>

## 设置场景光
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>设置场景光</title>
      <script src="./three.min.js"></script>
      <script src="./TrackballControls.js"></script>
    </head>
    <body>
      <script>
        // 定义全局变量
        let scene, camera, geometry, mesh, renderer, controls
        // 初始化渲染器
        function initRenderer() {
          renderer = new THREE.WebGLRenderer({ antialias: true })
          renderer.setSize(window.innerWidth, window.innerHeight)
          renderer.setPixelRatio(window.devicePixelRatio)
          document.body.appendChild(renderer.domElement)
        }
    
        // 初始化场景
        function initScene() {
          scene = new THREE.Scene()
          const axesHelper = new THREE.AxesHelper(100)
          scene.add(axesHelper)
          // const directionalLight = new THREE.DirectionalLight('red')
          // const ambientLight = new THREE.AmbientLight('orange')
          // const pointLight = new THREE.PointLight('green')
          // const spotLight = new THREE.SpotLight('lightblue')
          const hemisphereLight = new THREE.HemisphereLight('red')
          hemisphereLight.position.set(0, 30, 0)
          scene.add(hemisphereLight)
        }
    
        // 初始化相机
        function initCamera() {
          camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
          camera.position.set(0, 0, 15)
          controls = new THREE.TrackballControls(camera, renderer.domElement)
        }
    
        // 初始化模型
        function initMesh() {
          geometry = new THREE.SphereGeometry(3, 26, 26)
          const texture = new THREE.TextureLoader().load('img/crate.gif')
          material = new THREE.MeshPhongMaterial({
            map: texture,
            side: THREE.DoubleSide
          })
          mesh = new THREE.Mesh(geometry, material)
          scene.add(mesh)
        }
    
        // 初始化动画
        function animate() {
          requestAnimationFrame(animate)
          controls.update()
          renderer.render(scene, camera)
        }
    
        // 定义初始化方法
        function init() {
          initRenderer()
          initScene()
          initCamera()
          initMesh()
          animate()
        }
    
        init()
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="设置场景光.jpg" width="auto" height="400px" class="lazy-load" title="设置场景光"/>

## vr 看房
1. 示例代码
    ```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>轨迹球控制与材质</title>
      <style>
        * {
          margin: 0;
          padding: 0;
        }
        canvas {
          display: block;
          height: 100%;
          width: 100%;
        }
      </style>
      <script src="./three.min.js"></script>
      <script src="./TrackballControls.js"></script>
    </head>
    <body>
      <script>
        // 定义全局变量
        let scene, camera, geometry, mesh, renderer, controls
        let sixPlane = []
        let spriteArrow = ""
        let raycaster = new THREE.Raycaster()
        const mouse = new THREE.Vector2()
    
        function onMouseMove(event) {
          // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
          mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
          mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
        }
        window.addEventListener('mousemove', onMouseMove, false)
    
        // 鼠标点击 
        function mouseClickEvent(ev) {
          ev.preventDefault();
          // 射线捕获
          raycaster.setFromCamera(mouse, camera)
          const intersects = raycaster.intersectObjects([spriteArrow])
          if (intersects.length > 0) {
            changeScene()
          }
        }
        window.addEventListener('click', mouseClickEvent, false)
    
        // 初始化渲染器
        function initRenderer() {
          renderer = new THREE.WebGLRenderer({ antialias: true })
          renderer.setSize(window.innerWidth, window.innerHeight)
          renderer.setPixelRatio(window.devicePixelRatio)
          document.body.appendChild(renderer.domElement)
        }
    
        // 初始化场景
        function initScene() {
          scene = new THREE.Scene()
          const axesHelper = new THREE.AxesHelper(100)
          scene.add(axesHelper)
        }
    
        // 初始化相机
        function initCamera() {
          camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)
          camera.position.set(0, 0, 15)
          controls = new THREE.TrackballControls(camera, renderer.domElement)
          controls.maxDistance = 2
          controls.minDistance = 0
        }
    
        // 初始化模型
        function initMesh() {
          // 利用精灵材质引入地面标记 
          new THREE.TextureLoader().load('img/icon.png', (texture) => {
            const spriteMaterial = new THREE.SpriteMaterial({
              map: texture
            })
            spriteArrow = new THREE.Sprite(spriteMaterial)
            spriteArrow.scale.set(0.1, 0.1, 0.1)
            spriteArrow.position.set(0.5, -1, -1.5)
            scene.add(spriteArrow)
          })
          sixPlane = createPlane(0)
          for (let i = 0; i < 6; i++) {
            scene.add(sixPlane[i])
          }
        }
    
        // 初始化动画
        function animate() {
          requestAnimationFrame(animate)
          controls.update()
          renderer.render(scene, camera)
        }
    
        // 定义初始化方法
        function init() {
          initRenderer()
          initScene()
          initCamera()
          initMesh()
          animate()
        }
        init()
    
        function createPlane(num) {
          const BoxGeometry = []
          // 前面
          const geometryF = new THREE.PlaneGeometry(4, 4)
          const materialF = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('img/' + num + '_f.jpg'),
            side: THREE.DoubleSide
          })
          const meshF = new THREE.Mesh(geometryF, materialF)
          meshF.rotation.y = 180 * Math.PI / 180
          meshF.position.z = 2
          BoxGeometry.push(meshF)
          // 后面
          const geometryB = new THREE.PlaneGeometry(4, 4)
          const materialB = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('img/' + num + '_b.jpg'),
            side: THREE.DoubleSide
          })
          const meshB = new THREE.Mesh(geometryB, materialB)
          // meshB.rotation.y = 180 * Math.PI / 180
          meshB.position.z = -2
          BoxGeometry.push(meshB)
          // 左侧 
          const geometryL = new THREE.PlaneGeometry(4, 4)
          const materialL = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('img/' + num + '_l.jpg'),
            side: THREE.DoubleSide
          })
          const meshL = new THREE.Mesh(geometryL, materialL)
          meshL.rotation.y = (-90) * Math.PI / 180
          meshL.position.x = 2
          BoxGeometry.push(meshL)
          // 右侧 
          const geometryR = new THREE.PlaneGeometry(4, 4)
          const materialR = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('img/' + num + '_r.jpg'),
            side: THREE.DoubleSide
          })
          const meshR = new THREE.Mesh(geometryR, materialR)
          meshR.rotation.y = (90) * Math.PI / 180
          meshR.position.x = -2
          BoxGeometry.push(meshR)
          // 上面
          const geometryU = new THREE.PlaneGeometry(4, 4)
          const materialU = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('img/' + num + '_u.jpg'),
            side: THREE.DoubleSide
          })
          const meshU = new THREE.Mesh(geometryU, materialU)
          meshU.rotation.x = (90) * Math.PI / 180
          meshU.rotation.z = (180) * Math.PI / 180
          meshU.position.y = 2
          BoxGeometry.push(meshU)
          // 下面
          const geometryD = new THREE.PlaneGeometry(4, 4)
          const materialD = new THREE.MeshBasicMaterial({
            map: new THREE.TextureLoader().load('img/' + num + '_d.jpg'),
            side: THREE.DoubleSide
          })
          const meshD = new THREE.Mesh(geometryD, materialD)
          meshD.rotation.x = (-90) * Math.PI / 180
          meshD.rotation.z = (180) * Math.PI / 180
          meshD.position.y = -2
          BoxGeometry.push(meshD)
          return BoxGeometry
        }
    
        function changeScene() {
          // 创建六个面 
          const sixBox = createPlane(2)
          const timer = setInterval(() => {
            camera.fov -= 1
            camera.updateProjectionMatrix()
            if (camera.fov == 20) {
              clearInterval(timer)
              camera.fov = 45
              camera.updateProjectionMatrix()
              for (let i = 0; i < 6; i++) {
                scene.remove(sixPlane[i])
              }
              sixPlane = sixBox
              for (let i = 0; i < 6; i++) {
                scene.add(sixPlane[i])
              }
              spriteArrow.visible = false
            }
          }, 50)
        }
      </script>
    </body>
    </html>
    ```
2. 效果展示
    <img src="vr看房.jpg" width="auto" height="400px" class="lazy-load" title="vr看房"/>