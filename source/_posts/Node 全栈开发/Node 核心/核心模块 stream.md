---
title: 核心模块 stream
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: 17e26b96
date: 2022-09-18 19:35:30
---

## 核心模块 stream
### 流
1. 流并不是 Nodejs 中独创的概念；
    - 例如，可以直接在类 Unix 系统中使用 ls | grep *.js 查找当前目录下 .js 文件，这就是流操作的一种应用；
    - 它会将管道左侧命令执行之后的结果数据，交给右侧的命令进行处理，这种通过流操作数据的方式，无论在空间还是时间上都会有明显的效率提升；
2. Node.js 诞生之初就是为了解决 IO 密集型的性能问题（密集型：阻塞导致的等待状态），其中文件操作系统和网络模块就实现了流接口；
    - Node.js 中的流就是处理流式数据的抽象接口；
    - Nodejs 中的 stream 模块提供了用于实现流接口的对象；
### 应用程序中为什么使用流来处理数据
1. 想象一个场景，我们正在通过网络观看一部高清电影，它的大小是 1GB，客户端上大体流程就是：
    <img src="客户端上大体流程.jpg" width="auto" height="200px" class="custom-img" title="客户端上大体流程"/>

    >- 首先应用程序会从服务器读取 1GB 的内容；
    >- 然后通过网络传输到客户端；
    >- 最后客户端执行下载提供观看；
2. 如果应用程序在服务器读取文件时采用的 readFile 的方式，那么至少会存在两个常见的问题：
    >- 同步读取资源文件，用户需要等待数据全部读取完成；
    >- 资源文件最终一次性加载到内存，开销较大，Nodejs 底层采用 V8 引擎，默认情况下 V8 提供的内存大小只有 1GB 左右；
3. 因此可以采用流的方式处理数据：
    <img src="常见的问题.jpg" width="auto" height="200px" class="custom-img" title="常见的问题"/>

    >- 可以先把资源文件像水一样，一点一点的抽到一个池子里
    >- 然后再去选择需要的方式来抽干池子里的水
4. 这样对于用户来说就可以分段的看到资源里的内容，同时对内存的使用开销也会明显友好很多：
    <img src="进行需求的加工.jpg" width="auto" height="150px" class="custom-img" title="进行需求的加工"/>

    >- 除此之外，流操作还可以配合管道对分段的数据进行需求的加工；
    >- 例如，原始的数据是字符串，可以利用管道将它传给能够实现数据转换为 Buffer 的单元，还可以传给执行压缩操作的单元，只要类型支持，语法正常，就可以一直往后传递处理，直到最后使用数据；

### 流处理数据的优势
1. 时间效率：分段读取数据可以同时操作多个数据 chunk；
2. 空间效率：流的分段实现了每次只向内存中缓存指定大小的数据，降低内存开销；
3. 使用方便：配合管道进行连接，扩展程序变得简单。某一段的流无需关心其它部分做了什么，只需要在完成当前操作之后，再进入到具体的功能管道之中就可以了；

### Nodejs 中流的分类
1. Readable：可读流，能够实现数据的读取；
2. Writable：可写流，能够实现数据的写操作；
3. Duplex：双工流，即可读又可写（Readable 和 Writable）。例如 net 模块中的 Socket；
4. Transform：转换流，可读可写，还能实现数据修改或转换（可以在读写数据时修改或转换数据的 Duplex 流）；

### Node.js 流特点
1. Stream 模块实现的四个类型的流操作对象都是抽象的；
    - 可以理解为“Class 类”；
    - 如果想实现自己的可读流或可写流操作，就需要继承相应的 Class，然后重写它们内部提供的一个必须完成的方法；
    - 但是这种方法一般是不常见的，因为 IO 操作所常用的 fs、net 以及 http 模块本身就已经实现了流操作的接口，所以在使用的时候可以直接调用具体模块所具有的事件和 API，达到生产和消费数据的操作；
2. 所有流都继承自 EventEmitter：可以基于发布订阅的模式，让它们具备发布数据的读写事件，之后就交由事件循环来监控监听器的执行时机，从而完成数据的处理；
### 示例代码
```JS
const fs = require('fs')

// 创建可读流
const rs = fs.createReadStream('test.txt')
// 创建可写流(如果目标文件不存在则会自动创建)
const ws = fs.createWriteStream('./test1.txt')

// 将可读流中的数据通过可写流消费
rs.pipe(ws)
```
### 总结
1. Node.js 中 stream 是流操作的抽象接口集合；
2. 可读、可写、双工、转换是单一类型流操作的抽象具体实现；
3. 流操作的核心功能就是处理数据；
4. Node.js 诞生的初衷就是解决密集型 IO 事务；
5. Node.js 中处理数据的模块继承了流和 EventEmitter；

## 可读流
>可读流是专门生产供程序消费数据的流，最常见的数据生产方式就是读取磁盘文件或读取网络请求中的内容
### 例如下面的示例
1. 图示
    <img src="可读流.jpg" width="auto" height="200px" class="custom-img" title="可读流"/>
2. createReadStream 就是创建了一个可读流；
3. fs 模块内部实现了 Readable 的具体接口，同时继承了 EventEmitter 类；
4. 当前生产数据的方式其实就是读取指定路径的磁盘文件内容，最后得到一个可读流，相当于数据源，途中使用 rs 变量进行表示，之后利用 pipe 管道操作把之前获取到的数据传递给 process.stdout（标准输出）；
5. Nodejs 中标准输出本身就是一个可写流，所以最终代码执行完成后就会在控制台打印 test.txt 文件中的内容；
### 自定义可读流
1. 继承 stream 里的 Readable 类：Readable 类已经把可读流要做的很多工作实现了，只需要继承它即可；
2. 重写 _read 方法，内部调用 push 产出数据；
    - push 方法把读取的数据添加到缓冲区；
    - 这个缓冲区是一个链表结构，等待消费者读取使用；
### 消费数据为什么存在两种方式？
1. 主要为了满足不同使用场景，有时可能只需按需读取一定量的数据，而有时可能需要源源不断的将底层数据全部读出，基于这样的需求，在 Readable 的实现上就存在着两种模式：「流动模式」 和 「暂停模式」；
2. 对于使用者来说两者的区别就在于消费数据的时候是否需要主动调用 read() 方法读取数据。
3. 下面通过图示了解主要逻辑步骤：
    <img src="消费数据为什么存在两种方式.jpg" width="auto" height="200px" class="custom-img" title="消费数据为什么存在两种方式"/>
    - 先创建一个 Readable 对象的实现；
    - 然后调用 _read() 方法读取底层数据；
    - 接着触发 push 操作，把底层数据添加到缓存区；
    - 完成上述步骤后就相当于有了一个可读流，也就是数据源，接着数据就等待着被消费，内部提供了 readable 和 data 事件用于消费数据；

### 消费者如何获取可读流中的数据（如何消费数据）？
1. Readable 提供了两个事件：readable 和 data；
    - readable 事件：当流中存在可读取的数据时触发；
      >- 需要主动调用 read 方法消费数据；
      >- 这个过程中可能会触发 _read() 从而继续读取底层数据；
      >- 然后到缓存区，再到应用程序，直到消费者获取 null 就意味着底层数据被读取完成，这是它就会停下来；
    - data 事件：当流中数据块传给消费者后触发；
      >- 这个事件被监听后，就意味着可读流处于流动模式，这时数据就会被尽可能快的传递；
      >- 底层数据被读取后甚至都不会调用 push 进入缓存区，而直接的被消费掉；
      >- 同样的，被读取到 null，消费行为就会停止；
2. readable 和 data 相当于白盒环境，可以获取每次读取的数据执行自定义的消费操作，pipe 相当于封装好的黑盒，它直接将所有可读流的数据传递给可写流；

### 自定义可读流代码：
```JS
const { Readable } = require('stream')
// 自定义类继承 Readable
class MyReadable extends Readable {
    constructor(source) {
        super()
        this.source = source
    }
    _read() {
        // 在底层数据读取完成后，给 push 方法传递一个 null，这样内部实现就会知道底层数据已读取完毕
        const data = this.source.shift() || null
        this.push(data)
    }
}

// 定义数组存放数据，模拟底层数据
const source = ['Hello', 'world', 'bye-bye']
// 消费数据
const myReadable = new MyReadable(source)

myReadable.on('readable', () => {
    let data = null
    // 由于每次 read 就会触发 _read 读取数据，所以每次获取到的实际是读取两次的数据
    while ((data = myReadable.read()) !== null) {
        console.log(data.toString())
    }
})
// 打印结果：
// Helloworld
// bye-bye

myReadable.on('data', data => {
    // data 事件触发会将 _read 读取的数据传递给回调，不需要手动读取，所以每次只传递读取一次的数据
    // 注意：需注释上面的 readable，否则打印结果会不一样
    console.log(data.toString())
})
// 打印结果：
// Hello
// world
// bye-bye`
```


## 可写流
>可读流用于生产数据，处于结构的上游，而可写流用于消费数据，处于结构的下游，通过可写流可以把数据写入到指定的地方，常见的操作就是向磁盘文件中写入内容，或者对 TCP 或 HTTP 的网络响应进行操作；
### 自定义可写流
1. 继承 stream 模块的 Writable 类；
2. 重写 _write 方法，调用 write 方法，实现数据的写入操作；

### 事件流
1. pipe 事件：可读流调用 pipe() 方法向可写流传输数据时触发；
2. unpipe 事件：可读流调用 unpipe() 方法切换可写流时触发（不常用）；
3. drain 事件：当 writable.write() 返回 false，则 drain 事件将在适合继续将数据写入流时触发；
    - 由于一些原因（例如读的太快写的太慢）导致无法将数据写入流时，写入操作 writable.write() 会返回 false ，并将传入的 chunk 缓存；
    - 此时应该停止写入操作，等待 drain 事件；
    - 当流排空（操作系统允许写入）将触发 drain 事件，可以在事件回调中恢复写入；
    - pipe 方法封装了这些机制；
### 示例代码
```JS
const { Writable } = require('stream')

class MyWritable extends Writable {
    constructor() {
        super()
    }

    // chunk 当前要写入的数据、en 编码集、done 回调
    _write(chunk, en, done) {
        process.stdout.write(chunk.toString() + '<----')
        done()
    }
}

const myWritable = new MyWritable()
myWritable.write('Hello world','utf-8', () => console.log('啊啊啊啊啊啊啊'))
```
## 双工流
>Duplex 是双工流，同时实现了 Readable 和 Writable，在管道操作中，既可以作为上游生产数据，也可以作为下游消费数据；

### 自定义双工流：
1. 继承 Duplex 类；
2. 重写 _read 方法，调用 push 生产数据；
3. 重写 _write 方法，调用 write 消费数据；
	
### 示例代码：
```JS
let {Duplex} = require('stream')

class MyDuplex extends Duplex{
  constructor(source) {
    super()
    this.source = source
  }

  _read() {
    let data = this.source.shift() || null 
    this.push(data)
  }

  _write(chunk, en, next) {
    process.stdout.write(chunk)
    process.nextTick(next)
  }
}

let source = ['a', 'b', 'c']
let myDuplex = new MyDuplex(source)

// 可读流测试
/* myDuplex.on('data', (chunk) =>console.log(chunk.toString())) */

// 可写流测试
myDuplex.write('写入数据', () => console.log(1111))
```

## 转换流
> Transform 本质上也是一个双工流，它和 Duplex 的区别是，Duplex 中的读和写是相互独立的，它的读操作所创建的数据不能被写操作直接当作数据源使用，但是在 Transform 中这个操作是可以的，也就是说在转换流的底层是将读写操作进行了联通；
>除此之外，转换流还可以对数据执行相应的转换操作，具体的转换由开发者定义实现；
### 自定义转换流：
1. 继承 Transform 类；
2. 重写 _transform 方法，调用 pull 和 callback，在 _transform 方法内部就可以将获取到的数据再交给可读流使用，同时还可以完成自定义的转换操作；
3. 重新 _flush 方法，处理剩余数据，这个方法不是必须的；
	
### 示例代码：
```JS
const { Transform } = require('stream')

class MyTransform extends Transform {
  constructor() {
    super()
  }

  _transform(chunk, en, callback) {
    // push 经过转换后的数据
    this.push(chunk.toString().toUpperCase())
    // 回调是 error-first 风格的回调，第一个参数接收的是错误信息
    callback(null)
  }
}

const myTransform = new MyTransform()

// 可以调用可写流的 write 方法写入数据
myTransform.write('a')

// 可以监听可读流的事件
myTransform.on('data', chunk => console.log(chunk.toString()))
```

## 文件可读流

### 文件可读流创建
>文件的可读流操作实际上就是继承了 Readable 和 EventEmitter 类的内置 API，可以通过 fs 创建使用
1. 示例代码
    ```JS
    const fs = require('fs')
    
    // 参数1：是底层数据来源
    // 参数2：是可选的选项对象
    const rs = fs.createReadStream('test.txt', {
      flags: 'r', // 以什么模式打开文件，`r` 表示可读模式
      encoding: null, // 编码，默认 `null，表示 Buffer
      fd: null, // 文件描述符，默认 null，从 `3` 开始
      mode: 0o66, // 权限，默认 438（十进制）或 0o66（八进制）
      autoClose: true, // 是否自动关闭文件
      start: 0, // 读取的起始位置，包前又包后
      // end: 3, // 读取的截至位置
      highWaterMark: 4 // 水位线，表示每次读取多少字节的数据
    })
    ```
2. 读取的测试文件：test.txt
    ```txt
    0123456789
    ```
### 文件可读流消费
1. 通过暂停和恢复 data 事件可以切换 暂停/流动模式
    ```JS
    rs.on('data', chunk => {
      console.log(chunk.toString())
    
      // 暂停触发 data 事件：进入暂停模式
      rs.pause()
    
      setTimeout(() => {
        // 恢复触发 data 事件：进入流动模式
        rs.resume()
      }, 1000)
    })
    ```
2. readable 事件消费数据的流程
> - 可读流首先内部调用 _read 读取 4 个字节（highWaterMark）的数据 0123 放入缓冲区，触发 readable 事件；
> - readable 事件回调中通过调用 read 方法读取 1 个字节的数据；
> - 因为缓冲区有数据，所以从里面读取了 0；
> - 缓冲区还剩下 123，仍可以被消费，于是继续触发 readable 事件；
> - 直到缓冲区清空，可读流又会调用 _read 从底层数据源读取数据；
> - 直到底层数据被消费完；
    ```JS
    rs.on('readable', () => {
      let data = null
      while ((data = rs.read(1)) !== null) {
        // 获取缓冲区存储的数据的长度
        const len = rs._readableState.length
        console.log(data.toString(), '---', len)
      }
    })
    // 打印结果：
    // 0 --- 3
    // 1 --- 2
    // 2 --- 1
    // 3 --- 0
    // 4 --- 3
    // 5 --- 2
    // 6 --- 1
    // 7 --- 0
    // 8 --- 1
    // 9 --- 0
    ```


### 文件可读流事件与应用
1. 常见事件
    ```JS
    // 文件打开
    // 在创建或实例化可读流后就会触发，并不需要数据被消费时才会触发
    rs.on('open', fd => console.log(fd, '文件打开了'))
    
    // 文件关闭
    // 默认情况下，可读流是一个暂停模式，所以 close 只能在数据被消费完才会触发
    rs.on('close', () => console.log('文件关闭了'))
    
    // 消费数据
    rs.on('data', chunk => console.log(chunk.toString()))
    
    // 当数据被消费完成之后，可读流关闭之前触发
    rs.on('end', () => console.log('当数据被清空之后触发'))
    
    // 可尝试修改文件路径抛出错误
    rs.on('error', err => console.log('出错了'))
    ```
2. 常见使用方式：可读流每次读取的都是不完整的数据片段，在使用时需要将其暂时存储起来，当全部数据消费完再重新拼接；
    ```JS
    // 存放 Buffer 格式的数据片段
    let bufferArr = []
    
    // 消费数据
    rs.on('data', chunk => bufferArr.push(chunk))
    
    // 拼接数据片段，当数据被消费完成之后，可读流关闭之前触发
    rs.on('end', () => console.log(Buffer.concat(bufferArr).toString()))
    ```
## 文件可写流
1. 文件的可写流操作实际上就是继承了 Writeable 和 EventEmitter 类的内置 API，可以通过 fs 创建使用
    ```JS
    const fs = require('fs')
    
    // 参数 1 是写入数据的目标文件
    // 参数 2 是可选的选项对象
    const ws = fs.createWriteStream('test.txt', {
      flags: 'w', // 以什么模式打开文件，`w` 表示写入模式
      mode: 438, // 权限
      fd: null,
      encoding: 'utf-8',
      start: 0,
      highWaterMark: 3 // 1 个汉字占 3 个字节
    })
    ```
2. 写入回调执行顺序
    ```JS
    ws.write('蚌埠住了', () => console.log('ok1'))
    // 追加写入
    ws.write('123456', () => console.log('ok2'))
    // ok1 永远打印在 ok2 之前
    // write 方法的异步回调是按照 writer 方法的调用顺序串行执行的
    ```
3. 数据类型
> - 对于可写流，它里面可写入的数据类型并不受限制；
> - Writable 中也有不同的模式，不同的模式可以写入不同的数据类型，例如如果是 objectMode 则可以写入 JavaScript 中任意类型的值；
> - 但是当前示例是一个文件的可写流，而文件的可写流实际上是对 Writable 的重新实现和继承，所以它要求写入的数据必须是字符串或者是 Buffer；
    ```JS
    // 报错
    // ws.write(1, () => console.log('ok1'))

    ws.write(Buffer.from('1'), () => console.log('ok2'))
    ```
4. 常用事件
    ```JS
    // 可写流被创建就会触发 open 事件
    ws.on('open', fd => console.log('open', fd))
    
    // close 是在数据写入操作全部完成后触发
    ws.on('close', () => console.log('close'))
    
    // 写操作并不能触发 close 事件
    ws.write('1')
    
    // 执行写入
    // end 执行意味着写操作结束，从而触发 close 事件
    // end 可以接收参数，会将参数和缓冲区里的数据执行写入，如果不传参数则只会写入缓冲区里的数据
    ws.end()
    
    ws.on('error', err => console.log('在 end 之后不允许执行写操作'))
    
    ws.write('2')
    ```

## write 执行流程及源码分析
### 执行流程
1. 流程梳理
    - 通过文件可写流执行流程的梳理，可以帮助理解背压机制，还能帮助更好的确认 drain 事件的触发时机；
    - drain 事件：当前缓冲区可以继续执行数据写入的时候就会触发 drain 事件；
2. 示例代码：
    ```JS
    const fs = require('fs')
    
    let ws = fs.createWriteStream('test.txt', {
      highWaterMark: 3 // 水位线，可写流缓冲区上限
    })
    
    let flag = ws.write('1')
    console.log(flag) // true
    
    flag = ws.write('2')
    console.log(flag) // true
    
    // 如果 flag 为 false 并不是说明当前数据不能被执行写入
    flag = ws.write('2')
    console.log(flag) // false
    
    ws.on('drain', () => console.log('11'))
    ```
3. write 的执行流程设计三个角色：数据生产者、可写流、文件；
    <img src="执行流程设计.jpg" width="auto" height="300px" class="custom-img" title="执行流程设计"/>

    - 示例中数据是立即生产的；
    - 调用 writeable.write() 写入数据；
      > - 如果是第一次写入，会直接写入到文件，不进行缓存；
      > - 如果不是第一次，内部会将数据存入缓冲区，然后慢慢提取缓冲区的数据写入到文件中，整个过程就是消费数据的过程；
    - 当缓冲区的数据达到设置的上限（默认 16KB，示例中是 3B）后，write 方法返回值（示例中以 flag 表示）就返回 false，否则返回 true；
    - 生产速度和消费速度是不一样的，一般情况下生产速度要比消费速度快很多；
    - flag 并不是用于控制当前的写入操作是否发生（数据仍会写入），它只是为了用于控制上游数据的产量问题，作为判断的依据；
      > - 当 flag 为 false 后，表示可写流的缓冲区已达上限，可写流仍会缓存数据，等待写入到文件中，可是这样就会占用额外的内存，如果超过内存最大使用量，Node.js 将无条件中止，即便不会中止，高内存使用量也会消耗内存降低性能；
      > - 所以当 flag 为 false 时应该告知数据的生产者，当前消费速度已经跟不上生产速度了；这个时候，一般会将可读流的模块修改为暂停模式；
    - 当数据生产者暂停之后，消费者会慢慢消化它内部缓冲区的数据，直到可以再次被执行写入操作；
    - 当缓冲区可以继续写入数据时，可写流会触发 drain 事件通知生产者，生产者就可以恢复数据读取，从而控制内存消耗；
### 源码分析
1. write
    ```JS
    Writable.prototype.write = function (chunk, encoding, cb) {
      // 获取 writable 基础信息对象
      //  buffer 属性表示缓冲区存储的数据
      //    继承的 getBuffer() 方法用于获取 buffer（官方建议使用方法代替直接访问 buffer 属性）
      //  length 当前累计要写入的数据长度，作为判断是否超限的依据
      //  highWaterMark 水位线，缓冲区上限，作为判断是否超限的依据
      //  needDrain 是否需要排水，记录超限状态
      const state = this._writableState;
      var ret = false;
      const isBuf = !state.objectMode && Stream._isUint8Array(chunk);
    
      // 非 objectMode 模式，将数据转化成 Buffer
      if (isBuf && !(chunk instanceof Buffer)) {
        chunk = Stream._uint8ArrayToBuffer(chunk);
      }
    
      // 判断第二个参数是回调还是编码
      if (typeof encoding === 'function') {
        cb = encoding;
        encoding = null;
      }
    
      // 设置编码
      if (isBuf)
        encoding = 'buffer';
      else if (!encoding)
        // state.defaultEncoding 为 utf8
        encoding = state.defaultEncoding;
    
      // 如果没有回调则赋值为一个空的方法
      if (typeof cb !== 'function')
        cb = nop;
      
      // 判断数据是否写完
      if (state.ending)
        // 在 end 后写入数据抛出错误
        writeAfterEnd(this, cb);
      else if (isBuf || validChunk(this, state, chunk, cb)) {
        // 更新回调次数计数
        state.pendingcb++;
        // 写入或缓存，方法返回是否超限
        // 第一次直接写入，之后放入缓存
        ret = writeOrBuffer(this, state, chunk, encoding, cb);
      }
    
      // 返回，ret 基本上相当于 needDrain
      return ret;
    };
    ```
2. validChunk
    ```JS
    // validChunk 校验数据是否合法
    function validChunk(stream, state, chunk, cb) {
      var er;
      // chunk不能为null
      if (chunk === null) {
        er = new ERR_STREAM_NULL_VALUES();
      // 不是 objectMode 模式下，chunk 必须是字符串
      } else if (typeof chunk !== 'string' && !state.objectMode) {
        er = new ERR_INVALID_ARG_TYPE('chunk', ['string', 'Buffer'], chunk);
      }
    
      if (er) {
        errorOrDestroy(stream, er);
        process.nextTick(cb, er);
        return false;
      }
      return true;
    }
    ```
3. writeOrBuffer
    ```JS
    function writeOrBuffer(stream, state, chunk, encoding, cb) {
      // 判断数据类型，非 objectMode 模式下将数据转化成 Buffer
      if (!state.objectMode && state.decodeStrings !== false && encoding !== 'buffer' && 
            typeof chunk === 'string') {
          chunk = Buffer.from(chunk, encoding);
          encoding = 'buffer';
      }
    
      const len = state.objectMode ? 1 : chunk.length;
      // 更新 length，它记录待写入文件的数据长度
      state.length += len;
    
      // 判断缓冲区数据是否达到上限（仍有空间）
      // 依据记录的待写入数据长度判断，而不是缓冲区的长度
      // （因为有些场景不会缓存，例如首次写入或强制写入）
      // 注意是 小于 而不是 小于等于
      const ret = state.length < state.highWaterMark;
    
      // We must ensure that previous needDrain will not be reset to false.
      // 更新 needDrain
      if (!ret)
        // 之后执行 drain 事件
        state.needDrain = true;
    
      // writing 表示是否有写入过文件内容的标记
      // corked 表示是否强制把内容写入到缓冲区
      if (state.writing || state.corked) {
        // 构建链表结构的缓存
        // 获取最后一次的缓存
        var last = state.lastBufferedRequest;
        // 更新最后一次的缓存为当前数据
        state.lastBufferedRequest = {
          chunk,
          encoding,
          callback: cb,
          next: null
        };
        if (last) {
          // 如果曾经缓存过，则关联本次缓存
          last.next = state.lastBufferedRequest;
        } else {
          // bufferedRequest 记录当前要处理缓存的任务（从缓存中提取并写入到文件，这里就不细讲了）
          // 首次缓存直接存储到 bufferedRequest
          state.bufferedRequest = state.lastBufferedRequest;
        }
        // 更新处理缓存任务的数量
        state.bufferedRequestCount += 1;
      } else {
        // 如果是首次写数据，则直接写入到文件（不缓存）
        doWrite(stream, state, false, len, chunk, encoding, cb);
      }
      // 返回是否超限
      return ret;
    }
    ```
4. doWrite
    >onwrite 在 fs.write() 文件写入操作完成后执行的回调，内部主要是写入流的属性进行更新和还原
    ```JS
    function doWrite(stream, state, writev, len, chunk, encoding, cb) {
      // 属性赋值
      // 每次写入量
      state.writelen = len;
      // 写入回调
      state.writecb = cb;
      // 记录写入状态：正在写入
      state.writing = true;
      // 是否异步操作
      state.sync = true;
    
      // 当前写入流是否已销毁
      if (state.destroyed)
        // 调用回调抛出错误
        state.onwrite(new ERR_STREAM_DESTROYED('write'));
      else if (writev)
        stream._writev(chunk, state.onwrite);
      else
        // 调用 _write 执行文件写入操作
        // onwrite 是传递给 _write 的回调
        stream._write(chunk, encoding, state.onwrite);
    
      // 还原 sync 属性
      // _write 中的文件写入是异步的，所以此重置会在文件写入操作回调之前执行
      // 它用于在 onwrite 中区分是否执行了文件写入操作
      state.sync = false;
    }
    ```
5. _write
    ```JS
    WriteStream.prototype._write = function (data, encoding, cb) {
      // fd默认是从3开始，fd不为number时，文件还没打开或打开失败（例如文件不存在）
      // 写入流从创建到打开文件中间有一定时间，这期间如果执行写入操作可能文件还没打开
      if (typeof this.fd !== 'number') {
        // 绑定 open 事件，等待文件打开后再执行一次写入操作
        return this.once('open', function () {
          this._write(data, encoding, cb);
        });
      }
    
      // 如果写入流已销毁，抛出错误
      if (this.destroyed) return cb(new ERR_STREAM_DESTROYED('write'));
    
      this[kIsPerformingIO] = true;
      // 调用 fs.write() 方法，执行文件写入操作
      this[kFs].write(this.fd, data, 0, data.length, this.pos, (er, bytes) => {
        // 写入完成回调
        this[kIsPerformingIO] = false;
        // Tell ._destroy() that it's safe to close the fd now.
        // 如果写入流已销毁，抛出错误
        if (this.destroyed) {
          cb(er);
          return this.emit(kIoDone, er);
        }
        // 处理报错
        if (er) {
          if (this.autoClose) {
            this.destroy();
          }
          return cb(er);
        }
        // 更新已写入的数据的字节数
        this.bytesWritten += bytes;
        // 调用写入完成回调 onwrite
        cb();
      });
      // 更新下次写入的位置
      // 但 fs.write 写入是异步的，首次写入 pos 为 undefined 并不会更新
      if (this.pos !== undefined)
        this.pos += data.length;
    };
    ```
6. onwrite
    ```JS
    function onwrite(stream, er) {
      const state = stream._writableState;
      const sync = state.sync;
      // 用户调用 writable.write() 传入的回调
      const cb = state.writecb;
      if (typeof cb !== 'function')
        throw new ERR_MULTIPLE_CALLBACK();
      // 标记写入状态
      state.writing = false;
      // 重置存储用户自定义写入回调的属性
      state.writecb = null;
      // 更新待写数据计数，减去已写入的数据长度
      state.length -= state.writelen;
      // 重置存储当前写入数据长度的属性
      state.writelen = 0;
    
      if (er)
        onwriteError(stream, state, sync, er, cb);
      else {
        // Check if we're actually ready to finish, but don't emit yet
        // 判断写入流是否 end，是否需要 finish
        var finished = needFinish(state) || stream.destroyed;
    
        if (!finished &&
          !state.corked &&
          !state.bufferProcessing &&
          state.bufferedRequest) {
          clearBuffer(stream, state);
        }
        if (sync) {
          // false：表示没有执行文件写入操作
          // It is a common case that the callback passed to .write() is always
          // the same. In that case, we do not schedule a new nextTick(), but rather
          // just increase a counter, to improve performance and avoid memory
          // allocations.
          if (state.afterWriteTickInfo !== null &&
            state.afterWriteTickInfo.cb === cb) {
            state.afterWriteTickInfo.count++;
          } else {
            state.afterWriteTickInfo = {
              count: 1,
              cb,
              stream,
              state
            };
            process.nextTick(afterWriteTick, state.afterWriteTickInfo);
          }
        } else {
          // true：表示执行了文件写入操作
          // 执行写入完成的收尾工作
          afterWrite(stream, state, 1, cb);
        }
      }
    }
    ```
7. afterWrite
    ```JS
    function afterWrite(stream, state, count, cb) {
      // 判断是否在排水状态下处理完待写数据（排空流）
      const needDrain = !state.ending && !stream.destroyed && state.length === 0 && state.needDrain;
    
      if (needDrain) {
        // 重置状态
        state.needDrain = false;
        // 触发 drain 事件通知用户
        stream.emit('drain');
      }
    
      while (count-- > 0) {
        state.pendingcb--;
        cb();
      }
    
      finishMaybe(stream, state);
    }
    ```
### 总结
1. 相关属性：写入流实例对象中存储了一些属性帮助使用者控制缓存：
    - length：待写入文件的数据长度
      > - 在 write() 方法内部执行写入之前会先更新这个属性
      > - 此时数据还未写入文件甚至还没存入缓冲区
      > - 它主要用来作为判断缓冲区是否超限（实际上是待写数据是否超限）
      > - 当文件写入操作完成会更新这个属性，减去已写入数据的长度
    - highWaterMark：水位线，缓冲区存储上限，只是作为判断是否超限的依据，并不限制缓冲区的真实存储
    - buffer：缓冲区的缓存数据，Node.js 要求使用 getBuffer() 方法访问
    - needDrain：是否需要排水，当根据 length 和 highWaterMark 判断缓冲区是否超限，基本上是作为 write() 方法的返回值，作为用户判断是否需要暂停读取的依据
    - bufferedRequest：当前要处理的缓存
      > - 链表结构，通过 next 属性关联下一个要处理的缓存
      > - Nodejs 会沿着链表依次从缓冲区提取缓存数据写入到文件中
    - lastBufferedRequest：最近一次存储的缓存，用于构建链表结构
2. 流程
    - 可写流每次调用 write() 写入数据都会先更新 length （增加），当文件写入操作完成后再次更新 length（减少）
    - 首次写入数据会直接写入到文件中，不会进行缓存
    - 首次写入时如果文件还没打开，则会等待 open 事件触发后再执行写入
    - 首次之后的写入会先将数据存入缓冲区
    - 每次写入都会用更新后的 length 和 highWaterMark 判断缓存区是否超限（已满或溢出），如果超限则标记 needDrain，表示应该进行排水，判断结果作为 write() 方法的返回值提醒用户
    - 用户可以依据 write() 的返回值判断是否需要控制内存消耗，例如暂停读取
    - 当写入流将缓冲区中的缓存全部清空（排空流），会更新 needDrain 并触发 drain 方法通知用户，用户可以在这个事件中恢复读取数据。


## 背压机制
1. Node.js 的 steam 已经实现了可以保证数据平滑流动的背压机制：
    - 通过 drain 事件和 highWaterMark 可以很好的控制数据写入速度和控制内存消耗；
    - pipe 方法实现了这个背压机制；

2. 数据读写时可能存在的问题：
    - 需要注意的是，数据从磁盘中读取出来速度，远远大于数据写入磁盘的速度，也就是消费者的速度往往跟不上生产者的速度，这样就会出现产能过剩；
    - 而 Writeable 的内部又维护了一个队列，在它不能实时的去消费由上游传输的数据时，它就会尝试把当前不能消化的数据先缓存到队列中；
    - 但是队列的内存大小设置了上限，因此读写的过程中如果不实现一个背压机制，很可能会出现内存溢出、GC 频繁调用、其它进程变慢的场景；
    - 基于这种场景，就需要提供一种可以让数据生产者和消费者之间平滑流动的机制，这就是背压机制；

3. 数据读取流程
    <img src="数据读取流程.jpg" width="auto" height="300px" class="custom-img" title="数据读取流程"/>

    - 数据的读取操作分为三个部分：
      > - 底层数据；
      > - 缓冲区：缓存读取的数据。Readable 默认空间上限是 16KB，在文件可读流中为 64KB，一旦读取流的缓冲区大小达到 highWaterMark 就会暂停从底层数据源读取数据，直到缓冲区的数据被消费；
      > - 消费者：通过主动调用 read 方法或监听 data 事件来消费数据；
    - 数据读取分为两种模式：
      > - 流动模式；
      > - 暂停模式（默认）；
    - 读取流程：
      > - 从消费者的视角来看，可读流就相当于一个水池，里面装满了要消费的数据，但是池子外部有一个水龙头开关，如果处于流动模式，就相当于一直放水，直到放完位置；
      > - 如果在这个过程中，用水的人跟不上放水的速度，不可能拿着 1 升的杯子去接 10 升的水，所以这时用水的人在受不了的情况下，就要想办法告诉可读流要停一停，等自己先消化一下；
      > - 此时可读流就可以去调用 pause 方法将流动模式切换为暂停模式，放水的阀门就会被关闭；
      > - 现在用水的人就可以先慢慢消化之前缓冲的水资源，等到都消费完之后，就可以告诉可读流可以继续放水了；

4. 数据写入流程
    <img src="数据写入流程.jpg" width="auto" height="300px" class="custom-img" title="数据写入流程"/>

    - 数据的写入操作分为三个部分：
      > - 生产者
      > - 缓存区
      > - 底层资源
    - 写入流程：
      > - 数据从上游的生产者传递过来，然后可写流调用 write() 方法消费数据；
      > - 在可写流内部同样也有一片内存空间作为缓存队列，同样具有水位线（highWaterMark）；
      > - 如果某个时刻缓冲区的数据超过了水位线，就说明当前无法再消费更多的水资源，此时 write() 方法调用后就会返回 false 给上游的生产者，让他暂停放水，等可写流将缓存的数据消费完，就会再触发 drain 事件通知上游的生产者可以继续放水了，此时可读流就可以调用 resume 方法再次打开阀门；
      > - 如此往复就可以保证数据的平滑流动，既不会出现内存被撑爆的情况，也不会存在某一时刻无水可用，这就是 pipe() 方法内部的实现原理；

5. 模拟 pipe 中的背压机制
    - 实际应用中很少自定义背压机制，除非要对每个获取的数据进行单独的处理，一般情况下使用 pipe 即可，模拟背压机制是为了更好的理解它的原理；
      ```JS
      const fs = require('fs')
		
      // 文件内容：马上要过年啦
      const rs = fs.createReadStream('test.txt', { highWaterMark: 3 })
      const ws = fs.createWriteStream('test1.txt', { highWaterMark: 1 })
      
      let flag = true
      // 以 流动 的方式消费数据 
      rs.on('data', chunk => {
        // 消费数据
        flag = ws.write(chunk, () => console.log('ok'))
        if (!flag) {
          // 将流动模式切换为暂停模式
          rs.pause()
        }
      })
      
      // 当缓冲区数据被消费完之后，会执行 drain 事件
      ws.on('drain', () => {
        // 将暂停模式切换为流动模式
        rs.resume()
        console.log('drain');
      })
      // drain
      // ok
      // drain
      // ok
      // drain
      // ok
      // drain
      // ok
      // drain
      // ok
      // drain
      // ok
      ```
    - 使用 pipe 方法的话就相当于：
      ```JS
      const fs = require('fs')
      
      const rs = fs.createReadStream('test.txt', { highWaterMark: 3 })
      const ws = fs.createWriteStream('test1.txt', { highWaterMark: 1 })
      
      rs.pipe(ws)
      ```

## 手写文件可读流
1. 参考原生文件可读流的使用，实现自定义可读流，以理解数据生产的流程以及文件可读流的一些原理；
	
2. 实现代码：
    ```JS
    const fs = require('fs')
    const EventEmitter = require('events')
    
    class MyFileReadStream extends EventEmitter {
      constructor(path, options = {}) {
        super()
        this.fd = null
        this.path = path
        this.flags = options.flags || 'r' // 文件打开模式，默认可读模式
        this.mode = options.mode || 438 // 权限位，默认438 （wr权限）
        this.autoClose = options.autoClose || true // 读取完是否自动关闭文件
        this.start = options.start || 0 // 读取的起始位置
        this.end = options.end // 读取的结束位置(包含结束位置的数据)
        this.highWaterMark = options.highWaterMark || 64 * 1024 // 缓存区的水位线（KB）
        this.readOffset = 0 // 每次读取的起始位置
        this.open()
    
        // 注册事件触发事件
        this.on('newListener', type => {
          if (type === 'data') {
            this.read()
          }
        })
      }
    
      open() {
        // 原生 open 方法打开指定位置上的文件
        fs.open(this.path, this.flags, this.mode, (err, fd) => {
          if (err) return this.emit('error', err)
    
          this.fd = fd
          this.emit('open', fd)
        })
      }
    
      read() {
        // 注册 data 事件是同步代码，
        // 注册 data 事件的时机可能早于 fs.open 的回调，此时 fd 还未赋值
        // 当文件打开后，调用 read 方法
        if (typeof this.fd !== 'number') return this.once('open', this.read)
    
        // 申请指定大小的缓存空间
        const buf = Buffer.alloc(this.highWaterMark)
        // 要读取的数据量
        const howMuchToRead = this.end ? Math.min(this.end - this.readOffset + 1, this.highWaterMark) : this.highWaterMark
    
        // 原生 read 方法读取文件数据
        fs.read(this.fd, buf, 0, howMuchToRead, this.readOffset, (err, readBytes) => {
          console.log(readBytes)
          if (readBytes) {
            // 更新偏移量
            this.readOffset += readBytes
            // 触发 data 事件
            this.emit('data', buf.slice(0, readBytes))
            // 继续读取
            this.read()
          } else {
            // 没有数据可读
            // 先触发 end 再触发 close
            this.emit('end')
            if (this.autoClose) {
              this.close()
            }
          }
        })
      }
    
      close() {
        fs.close(this.fd, () => this.emit('close'))
      }
    }
    
    
    const rs = new MyFileReadStream('test.txt', {
      highWaterMark: 3,
      end: 7
    })
    // rs.on('open', fd => console.log('open', fd))
    // rs.on('error', err => console.log('error', err))
    // 与原生 fs 一样，如果不绑定 data 事件就不会触发 end 和 close 事件
    // rs.on('end', () => console.log('end'))
    // rs.on('close', () => console.log('close'))
    rs.on('data', chunk => console.log(chunk))
    ```
  
3. 可读流解决的问题
    ```JS
    // 如果使用 fs 的文件读写 API 实现文件复制就会出现下面的嵌套
    // 流操作优雅的代替了这种嵌套
    fs.open('A.txt', (err, readFd) => {
      fs.open('B.txt', (err, writeFd) => {
        // 需要管理缓存、读取位置、长度等参数
        fs.read(readFd, ..., chunk => {
          fs.write(writeFd, chunk, () => {})
          // 循环读取
          next()
        })
      })
    })
    ```

## 手写文件可写流
1. 单链表实现
    ```JS
    // 节点
    class Node {
        constructor(element, next) {
            this.element = element
            this.next = next
        }
    }
    
    // 链表
    class LinkedList {
        constructor() {
            this.head = null
            this.size = 0
        }
    
        /**
         * 截取指定位置的节点
        * @param {*} index 
        * @returns 
        */
        _getNode(index) {
            // 处理边界
            if (index < 0 || index >= this.size) throw new Error('越界了')
            // 遍历获取节点
            let currentNode = this.head
            for (let i = 0; i < index; i++) {
                currentNode = currentNode.next
            }
            return currentNode
        }
    
        /**
         * 增加
        * @param {number} index [可选] 增加节点的位置
        * @param {*} element 节点的数据
        */
        add(index, element) {
            if (arguments.length === 1) {
                element = index // 第一个参数为节点数据
                index = this.size // 添加到末尾
            }
    
            // 处理边界
            if (index < 0 || index > this.size) throw new Error('越界了')
    
            if (index === 0) {
                // 添加到首部
                // 保留原有的 head 指向，作为新增节点的 next 指向
                const head = this.head
                // 新的 head 指向新增节点
                this.head = new Node(element, head)
            } else {
                // 添加到中间或尾部
                // 将链表从指定位置截断，获取添加位置前面的节点
                // 节点的 next 指向新增节点
                // 节点之前 next 指向的引用存入新增节点的 next
                const prevNode = this._getNode(index - 1)
                prevNode.next = new Node(element, prevNode.next)
            }
    
            // 更新计数
            this.size++
        }
    
        // 删除指定位置的节点
        remove(index) {
            let rmNode = null
            if (index === 0) {
                rmNode = this.head
                if (!rmNode) {
                    return undefined
                }
                this.head = rmNode.next
            } else {
                const prev = this._getNode(index - 1)
                rmNode = prev.next
                prev.next = rmNode.next
            }
            this.size--
            return rmNode
        }
    
        // 修改
        set(index, element) {
            const node = this._getNode(index)
            node.element = element
        }
    
        // 查询
        get(index) {
            return this._getNode(index)
        }
    
        // 清空
        clear() {
            this.head = null
        }
    }
    
    
    const l1 = new LinkedList()
    l1.add('node1')
    l1.add('node2')
    l1.add(1, 'node3')
    console.log(l1)
    // l1.remove(1)
    l1.set(1, 'node4')
    console.log(l1)
    console.log(l1.get(1))
    l1.clear()
    console.log(l1);
    ```
2. 单链表实现队列
    ```JS
    // 节点
    class Node {
        ...
    }
    
    // 链表
    class LinkedList {
        ...
    }
    
    class Queue {
        constructor() {
            this.linkedList = new LinkedList()
        }
        // 入列
        enQueue(data) {
            this.linkedList.add(data)
        }
        // 出列
        deQueue() {
            return this.linkedList.remove(0)
        }
    }
    
    
    const q = new Queue()
    console.log(q)
    q.enQueue('node1')
    q.enQueue('node2')
    console.log(q)
    
    let a = q.deQueue()
    console.log(a)
    a = q.deQueue()
    console.log(a)
    a = q.deQueue()
    console.log(a)
    ```
3. 实现代码
    ```JS
    const fs = require('fs')
    const EventEmitter = require('events')
    // 自定义的单向链表队列
    const Queue = require('./linked-queue')
    
    class MyFileWriteStream extends EventEmitter {
        constructor(path, options) {
            super()
            this.path = path
            this.flags = options.flags || 'w'
            this.mode = options.mode || 438
            this.autoClose = options.autoClose || true
            this.start = options.start || 0
            this.encoding = options.encoding || 'utf8'
            this.highWaterMark = options.highWaterMark || 16 * 1024
            this.open()
    
            this.writeOffset = this.start // 执行写入的偏移量
            this.writing = false // 当前是否正在执行写入
            this.length = 0 // 累计待写入量
            this.needDrain = false // 是否需要触发 drain 事件
            this.cache = new Queue()
        }
    
        open() {
            fs.open(this.path, this.flags, (err, fd) => {
                if (err) return this.emit('error', err)
    
                // 正常打开文件
                this.fd = fd
                this.emit('open', fd)
            })
        }
    
        write(chunk, encoding, cb) {
            // 仅作了简单判断：字符串 或 buffer
            chunk = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
            this.length += chunk.length
            const flag = this.length < this.highWaterMark
            this.needDrain = !flag
    
            // 利用队列来一个一个处理 多个写入操作
            if (this.writing) {
                // 当前正在执行写入，内容应该排队
                this.cache.enQueue({ chunk, encoding, cb })
            } else {
                // 当前不是正在写入，执行写入
                this.writing = true
                this._write(chunk, encoding, cb)
            }
    
            return flag
        }
    
        _write(chunk, encoding, cb) {
            // 保证在 open 后执行
            if (typeof this.fd !== 'number') {
                // 在执行回调的同时处理缓存队列
                return this.once('open', () => this._write(chunk, encoding, cb))
            }
    
            fs.write(this.fd, chunk, this.start, chunk.length, this.writeOffset, (err, written) => {
                // 更新写入偏移量
                this.writeOffset += written
                // 更新累计待写入量
                this.length -= written
                // 执行回调
                cb && cb()
                // 清空排队的内容
                this._clearBuffer()
            })
        }
    
        _clearBuffer() {
            const data = this.cache.deQueue()
            if (data) {
                this._write(data.element.chunk, data.element.encoding, data.element.cb)
            } else {
                if (this.needDrain) {
                    // 重置写入写入状态（否则第一次 drain 后无法继续写入）
                    this.writing = false
                    // 重置 drain 状态
                    this.needDrain = false
                    this.emit('drain')
                }
            }
        }
    }
    
    
    const ws = new MyFileWriteStream('./test.txt', { highWaterMark: 3 })
    ws.on('open', fd => console.log('open----', fd))
    
    let flag = ws.write('1', 'utf8', () => console.log('ok1'))
    console.log(flag)
    
    flag = ws.write('2', 'utf8', () => console.log('ok2'))
    console.log(flag)
    
    flag = ws.write('3', 'utf8', () => console.log('ok3'))
    console.log(flag)
    
    flag = ws.write('4', 'utf8', () => console.log('ok4'))
    console.log(flag)
    
    ws.on('drain', () => console.log('drain'))
    ```
## pipe 实现
1. pipe 方法的用处：pipe 方法可以看作是文件读写操作的终极语法糖；
    - 无论是文件的可写流还是可读流，它们的核心目的都是去为了完成数据从一个文件中拿出来写入另一个文件中的操作，本质上是一个拷贝的作用；
    - 在使用传统（fs 模块）的 read 和 write 方法时，存在大量异步嵌套的语法现象，而采用流的方式可以在语法上解决这种嵌套的问题，但是在使用时还是要通过文件的可读流进行数据的读取，接着使用文件的可写流完成数据的写入，所以这个过程看起来还是非常麻烦；
    - 因此 Node 内部提供了一个 pipe 方法，它的底层是基于流来实现的，但是在使用上就会显得更加简便一些；

2. 原生 pipe 使用：
    ```JS
    const fs = require('fs')

    const rs = fs.createReadStream('./A.txt', { highWaterMark: 4 })
    const ws = fs.createWriteStream('./B.txt', { highWaterMark: 1 })

    rs.pipe(ws)
    ```

3. 手动实现 pipe：
    ```JS
    const fs = require('fs')
    const EventEmitter = require('events')
    
    class MyFileReadStream extends EventEmitter {
        constructor(path, options = {}) {
            // ...
        }
        open() {
            // ...
        }
        read() {
            // ...
        }
        close() {
            // ...
        }
        pipe(ws) {
            this.on('data', chunk => {
                const flag = ws.write(chunk)
                if (!flag) {
                    // 暂停读取
                    this.pause()
                }
            })
    
            // 恢复读取
            ws.on('drain', () => this.resume())
        }
    }
    module.exports = MyFileReadStream
    
    
    // 测试：
    const fs = require('fs')
    const MyFileReadStream = require('./read-stream');
    const MyFileWriteStream = require('./write-stream');
    const rs = new MyFileReadStream('./A.txt', { highWaterMark: 4 })
    const ws = new MyFileWriteStream('./B.txt', { highWaterMark: 1 })
    rs.pipe(ws)
    ```