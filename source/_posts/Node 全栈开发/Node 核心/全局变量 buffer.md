---
title: 全局变量 buffer
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: 4430f70a
date: 2022-09-18 13:35:30
---

## 全局变量 buffer
1. 全局变量之 Buffer
    - Buffer 一般称之为 Buffer 缓冲区，让 JavaScript 可以操作二进制；
    - JavaScript 语言起初服务于浏览器平台，因此它内部主要操作的数据类型就是字符串；
    - Nodejs 的出现使得可以在服务端使用 JavaScript 进行编程，完成 IO 操作，例如文件的读写、网络服务中数据的传输等，在这个过程中就是用到了 Buffer；
2. base64 原理：二进制 3 * 8 的规则 改成了 4*6 的规则
    ```JS
    let buffer = Buffer.from('我'); // 将字符串转化成 16 进制
    console.log(buffer); // e6 88 91
    
    // 16进制 => 2进制
    console.log((0xe6).toString(2)); // 11100111
    console.log((0x88).toString(2)); // 10001111
    console.log((0x91).toString(2)); // 10100000
    
    // base64规则：将 3*8（11100111 10001111 10100000）的规则转成 4*6（111001 111000 111110 100000）的规则
    
    // 2进制 => 10进制
    console.log(parseInt('111001', 2)); // 57
    console.log(parseInt('111000', 2)); // 56
    console.log(parseInt('111110', 2)); // 62
    console.log(parseInt('100000', 2)); // 32
    
    // base64 编码表：
    let str = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
    
    // 最后转成 base64 格式的数据
    // 转成 base64 后（3beat => 4beat），比原来大了 三分之一
    console.log(str[57] + str[56] + str[62] + str[32]);  // 54+g
    ```
3. 前端二进制操作
    ```HTML
    <!-- 现在前端实现下载功能：将字符串包装成二进制文件类型 Blob -->
    <body>
      <script>
        let str = `你好`;
        // 包装后的文件类型不能直接修改
        const blob = new Blob([str], { type: 'text/html' });

        const a = document.createElement('a');
        a.setAttribute('download', 'index.txt');
        a.href = URL.createObjectURL(blob);
        a.click();
      </script>
    </body>
    ```
    ```HTML
    <!-- 前端实现预览功能：将二进制文件转成临时 url -->
    <body>
      <input type="file" id="file">
      <script>
        file.addEventListener('change', (e) => {
          let file = e.target.files[0]; //二进制文件类型

          let img = document.createElement('img');
          let url = URL.createObjectURL(file);
          img.src = url;
          document.body.appendChild(img);
        })
      </script>
    </body>
    ```
    ```HTML
    <!-- 前端实现预览功能：fileReader 读取二进制中内容 -->
    <body>
      <input type="file" id="file">
      <script> 
        file.addEventListener('change', (e) => {
          let file = e.target.files[0]; //二进制文件类型

          let fileReader = new FileReader();
          fileReader.onload = function () {
            let img = document.createElement('img');
            img.src = fileReader.result;
            document.body.appendChild(img)
          }

          fileReader.readAsDataURL(file);
        })
      </script>
    </body>
    ```
4. Buffer
    - 程序运行就会进行二进制的数据传输，而这个传输一般都是由 from 到 to 的过程，即数据的生产者和数据的消费者，中间就会使用流配合管道进行连接；
    - 但是这个模型在实际工作的时候也会出现问题，比如数据的生产速度无法满足数据的消费速度，又或者数据的消费速度比生产速度慢了许多；
    - 总归来说，不论出现哪种情况，数据都会有一个等待的过程，等待的时候那些多出来的数据，或者还不够一次消费的数据被存放在哪里呢？
      - 这个时候就有了 Buffer，所以也称为 Buffer 缓冲区；
      - Nodejs 中 Buffer 就是一片内存空间，只不过这个内存空间有些特殊；
      - Nodejs 中的代码最终都是由 V8 引擎执行完成的，因此理论上所有的内存消耗应该都属于 V8 的堆内存，而 Buffer 是 V8 之外的一片空间，它的大小不占据 V8 堆内存的大小；
      - 通过 process.memoryUsage() 获取内存消耗的信息中有一个 arrayBuffers，指的就是 Buffer 申请的内存；
      - Buffer 的空间申请不是由 Node 完成的，但是在使用层面上，它的空间分配又是由开发者编写的 JS 代码控制的，因此在空间回收的时候，它还是由 V8 的 GC（垃圾回收） 管理和回收，开发者无法参与其中；
5. Buffer 总结
    - Buffer 是 Nodejs 中的全局变量，无需 require；
    - Buffer 使得可以在 Nodejs 平台下的操作二进制数据；
    - Buffer 本身是一片内存空间，但是它不占据 V8 的堆内存大小，直接由 C++ 层面进行分配；
    - Buffer 内存的使用由 Node 控制，由 V8 的 GC 回收，无法进行人为参与；
    - Buffer 一般配合 Stream 流使用，充当数据缓冲区；
## 创建 Buffer 实例
1. Buffer 是 Nodejs 内置的类，它相关的 API 其实就是这个类的静态方法；
2. 三种通过 Buffer 静态方法创建实例对象（不能扩容）：
    - Buffer.alloc(size: number, fill?: string | number | Buffer, encoding?: BufferEncoding): Buffer：创建指定字节大小的 buffer；
      ```JS
      const b1 = Buffer.alloc(10) // 创建空间大小是 10 字节的 buffer
		
      // buffer 会以 16 进制格式存储每个字节的数据
      console.log(b1) // <Buffer 00 00 00 00 00 00 00 00 00 00>
      ```
    - Buffer.allocUnsafe(size: number): Buffer：创建指定字节大小的 buffer（不安全），不会向创建的内存填充数据；
      ```JS
      const b2 = Buffer.allocUnsafe(10)// 创建空间大小是 10 字节的 buffer
		
      // buffer 会以 16 进制格式存储每个字节的数据
      console.log(b2) // <Buffer 00 00 00 00 a0 00 00 00 00 00>
      ```
    - Buffer.from(arrayBuffer: WithImplicitCoercion < ArrayBuffer | SharedArrayBuffer >, byteOffset?: number, length?: number): Buffer：接收数据，创建 buffer（与前两者的区别是创建默认带数据的 buffer）；
      ```JS
      const b3 = Buffer.from('中') // utf8 一个汉字用 3 个字节表示
      console.log(b3) // <Buffer e4 b8 ad>
      console.log(b3.toString()) // 中
      
      
      // 第一个参数是数组，数组元素应该都是数字格式（十进制、八进制或十六进制等），否则会被忽略
      const b4 = Buffer.from([1, 2, '中']) // 汉字会被忽略
      console.log(b4) // <Buffer 01 02 00>
      // 将汉字中替换成数字
      const b5 = Buffer.from([228 /* 0xe4 的十进制 */ , 0270 /* 0xb8 的八进制 */ , 0xad]) 
      console.log(b5) // <Buffer e4 b8 ad>
      console.log(b5.toString()) // 中
      
      
      // 第一个参数是 buffer，创建的 buffer 只是传入的 buffer 的拷贝，并不会共享空间
      const b6 = Buffer.alloc(3)
      const b7 = Buffer.from(b6)
      b6[0] = 1
      console.log(b6) // <Buffer 01 00 00>
      console.log(b7) // <Buffer 00 00 00>
      ```
3. 为什么不使用 new 创建 Buffer？
    - 在 Nodejs 的 v6 版本之前可以直接通过 new 实例化 Buffer 对象，但是这种方式提供给 Buffer 实例对象的操作权限实在是太大了，所以在后续的版本中对它进行了一些处理；
    - 主要还是使用这种方式分配的内存是没有初始化过的，包含敏感数据，Node.js 认为在分配内存的安全性上需要更加明确的区分，所以建议使用 Buffer 类的静态方法创建，而不是通过 new 实例化；
4. 为什么 allocUnsafe 不安全？
    - 关键在于给 Buffer 申请分配的内存是否被初始化，被初始化的内存即填充了默认的数据（例如 0），没被初始化的内存可能包含敏感的旧数据，这是不安全的；
    - Buffer.alloc() 分配的内存是初始化过的内存（被 0 填满覆盖），这种创建方式虽然慢但被认为是安全的；
    - Buffer.allocUnsafe() 分配的内存没有被初始化，所以分配速度相当快，但内存中可能存在敏感旧数据，在 Buffer 可读的情况下，可能会泄露数据，这种方式被认为是不安全的，一般会建议手动通过 buf.fill(0) 初始化或写满这个 Buffer；
    - 虽然在使用 Buffer.allocUnsafe() 时有明显的性能优势，但必须额外小心，以避免给应用程序引入安全漏洞；

## Buffer 实例方法
1. 常用实例方法
    - fill：向 buffer 中反复填充数据，直到填满，返回填充后的 buffer；
    - write：向 buffer 中写入数据，返回写入的字节数；
    - toString：根据指定的字符编码将 buffer 解码为字符串；
    - slice：截取 buffer，类似数组的 slice；
    - indexOf：类似数组的 indexOf；
    - copy：从 buffer 数据源拷贝数据到目标 buffer 中；
    - split：buffer 分割（手动实现，Buffer 实例并未提供）；
2. buffer.fill(value: string | number | Uint8Array, offset?: number, end?: number, encoding?: BufferEncoding): Buffer
    ```JS
    // 创建一个空的 buffer
    const buf = Buffer.alloc(6)

    buf.fill('123') // 反复填充直到填满
    console.log(buf) // <Buffer 31 32 33 31 32 33>
    console.log(buf.toString()) // 123123

    buf.fill('123456789')
    console.log(buf.toString()) // 123456

    buf.fill('0').fill('123', 1) // 第二个参数：跳过填充的字节数
    console.log(buf.toString()) // 012312

    buf.fill('0').fill('123', 1, 3) // 第三个参数：停止填充的位置索引
    console.log(buf.toString()) // 012000

    buf.fill(123) // 如果填充的是数字，则转化成十六进制填充
    console.log(buf) // <Buffer 7b 7b 7b 7b 7b 7b>
    console.log(buf.toString())
    ```
3. buffer.write(string: string, offset: number,length:length, encoding?: BufferEncoding): number
    ```JS
    // 创建一个空的 buffer
    const buf = Buffer.alloc(6)
    
    // 与 fill 类似，但只会写入一次
    buf.write('123')
    console.log(buf) // <Buffer 31 32 33 00 00 00>
    console.log(buf.toString()) // 123
    
    buf.fill(0).write('123', 1) // 第二个参数表示跳过填充的字节数
    console.log(buf) // <Buffer 00 31 32 33 00 00>
    
    buf.fill(0).write('123', 1, 2) // 第三个参数是写入的字节数
    console.log(buf) // <Buffer 00 31 32 00 00 00>
    ```
4. buffer.toString(encoding?: BufferEncoding, start?: number, end?: number): string
    ```JS
    // 创建一个空的 buffer
    const buf = Buffer.from('abc你好')
    
    console.log(buf) // <Buffer 61 62 63 e4 bd a0 e5 a5 bd>
    console.log(buf.toString()) // abc你好
    console.log(buf.toString('utf8', 1, 6)) // bc你
    ```
5. buffer.slice(start?: number, end?: number): Buffer
    ```JS
    const buf = Buffer.from('abc你好')
	
    const b1 = buf.slice(1, 6)
    console.log(b1) // <Buffer 62 63 e4 bd a0>
    console.log(b1.toString()) // bc你
    ```
6. buffer.indexOf(value: string | number | Uint8Array, byteOffset?: number, encoding?: BufferEncoding): number
    ```JS
    const b2 = Buffer.from('a你b好a你b好')
    
    console.log(b2.indexOf('你')) // 1
    console.log(b2.indexOf('b')) // 4
    console.log(b2.toString().indexOf('b')) // 2
    console.log(b2.indexOf('b', 5)) // 12
    ```
7. buffer.copy(target: Uint8Array, targetStart?: number, sourceStart?: number, sourceEnd?: number): number
    ```JS
    const b1 = Buffer.from('你好abcde')
    const b2 = Buffer.alloc(6)
    
    b1.copy(b2)
    console.log(b1) // <Buffer e4 bd a0 e5 a5 bd 61 62 63 64 65>
    console.log(b1.toString()) // 你好abcde
    console.log(b2) // <Buffer e4 bd a0 e5 a5 bd>
    console.log(b2.toString()) // 你好
    
    const b3 = Buffer.alloc(6)
    b1.copy(b3, 2, 3, 7)
    console.log(b3) // <Buffer 00 00 e5 a5 bd 61>
    console.log(b3.toString()) // 好
    ```
8. buffer.split
    ```JS
      Buffer.prototype.split = function (separator) {
        const len = Buffer.from(separator).length // 获取分割符字节数
    
        let res = [] // 最终返回结果
        let start = 0 // 查询起始位置
        let offset = 0 // 偏移量
    
        while ((offset = this.indexOf(separator, start)) !== -1) {
            res.push(this.slice(start, offset))
            start = offset + len
        }
    
        // 处理结尾是分隔符的情况，追加尾部
        res.push(this.slice(start))
    
        return res
    }
    
    const buf = Buffer.from('夫战，勇气也，一鼓作气，再而衰，三而竭，彼竭我盈，顾克之，')
    console.log(buf.split('，').map(v => v.toString()))
    // [ '夫战', '勇气也', '一鼓作气', '再而衰', '三而竭', '彼竭我盈', '顾克之', '']
    ```
## Buffer 静态方法
1. 常用静态方法
    - concat：将多个 buffer （数组）拼接成一个新的 buffer，便于获取多个 buffer 组成的数据；
    - isBuffer：判断当前数据是否是 Buffer 类型；
2. Buffer.concat(list: readonly Uint8Array[], totalLength?: number): Buffer
    ```JS
    const b1 = Buffer.from('你好')
    const b2 = Buffer.from('世界')
    
    const b3 = Buffer.concat([b1, b2])
    console.log(b3.toString()) // 你好世界
    
    const b4 = Buffer.concat([b1, b2], 9)
    console.log(b4.toString()) // 你好世
    ```
3. Buffer.isBuffer(obj: any): obj is Buffer
    ```JS
    const b1 = Buffer.from('你好')

    console.log(Buffer.isBuffer([])) // false
    console.log(Buffer.isBuffer('123')) // false
    console.log(Buffer.isBuffer(b1)) // true
    ```