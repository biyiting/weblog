---
title: FS 模块
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: 2fa511c9
date: 2022-09-18 18:35:30
---
## FS 模块
### 介绍
1. 在 Nodejs 中存在着 Buffer（缓冲区） 和 Stream （数据流）两个非常常见的概念；
    - Buffer 就是存储的中间变量，目的是方便 CPU 在执行数据存取操作时，可以有一个中间的存储区域；
    - 而流操作类似水流一样，可以通过管道传输数据，以及将数据进行分段；
2. Buffer 和 Stream 一般操作的都是二进制数据，它们往往与 FS 密不可分，FS 是 Nodejs 内置核心模块，提供文件系统操作的 API；
3. 所有和文件相关的操作都是通过 FS 模块进行实现的，如文件目录的创建、删除，信息查询、文件读取/写入等；
### FS 模块结构分为两个部分
1. FS 基本操作类：实现文件信息的获取，如判断当前是目录还是文件、文件的可读流和可写流的操作、文件的监听行为等；
2. FS 实例常用 API：如文件的打开/关闭、文件的增删改查等；
### 关于系统和文件的前置知识
1. 「权限位」：当前操作系统内，不同的用户角色对于当前文件所具备的不同权限操作；
    <img src="权限位.jpg" width="auto" height="150px" class="lazy-load" title="权限位"/>
2. 「文件标志符」：文件系统标志符 flag 表示文件打开的方式；
    - 常见标识符有很多，这里只列举一部分：
      - a ：打开文件进行追加，如果文件不存在，则创建文件；
      - r ：打开文件进行读取，如果文件不存在，则抛出异常；
      - w ：打开文件进行写入，如果文件不存在，则创建；
      - s ：表示以同步模式操作，配合 a、r、w 进行使用；
      - x ：表示排它操作，如果路径存在则失败，配合 a、w 使用；
      - \+ ：表示附加操作，配合 a、w、r 使用，a和w包含写入操作，所以 a+和 w+附加 r 读取操作，而 r+ 附加 w 写入操作；
    - r+ 和 w+ 的区别是：
      - 如果文件不存在，前者抛出异常，后者会创建文件；
      - w+ 会将文件内容清空，再写入；  r+  会读取文件内容，从开头开始覆盖每个字节的内容，不会清空；
3. 「文件描述符」：文件描述符 fd 就是操作系统分配给被打开文件的数字标识；
    - 这个标识用于识别和跟踪每个特定文件；
    - windows 系统采用了不同但概念类似于文件描述符的机制追踪资源，为了方便用户，Nodejs 抽象了操作系统之间的差异，并为所有打开的文件分类的一个数字文件描述符；
    - 在 Nodejs 中每操作一个文件，文件描述符就会递增一次，并且这个描述符一般是从 3 开始，因为 0、1、2 被标准输入、标准输出、标准错误占用了；
    - 程序首次使用 fs.open() 打开一个文件的时候会获得一个 fd ，它就是这个文件的描述符，并且从 3 开始；
### fs 总结
1. fs 是 Nodejs 中内置的核心模块，所有与文件相关的操作都要通过它的 API 完成；
2. 代码层面上 fs 分为基本操作类和常用 API；
3. 文件操作有三个常用概念：权限位、文件标志符、文件描述符；

## 文件操作 API
> 主要的文件操作就是文件读写、拷贝、监控：Nodejs 中几乎所有文件 API 操作都有「同步」和「异步」两种方式，同步 API 名称比异步 API 名称多个 Sync，如 readFile 对应的同步 API 是 readFileSync；

1. 常用 API：
    - readFile：从指定文件中读取数据；
    - writeFile：向指定文件中写入数据；
    - appendFile：向指定文件中追加数据；
    - copyFile：将某个文件中的数据拷贝到另一个文件；
    - watchFile：监听指定文件，当文件内容发生修改，触发回调函数（没有对应的同步 API）；
2. readFile
> - path: fs.PathOrFileDescriptor
> - options: ({ encoding: BufferEncoding; flag?: string; }) | BufferEncoding
> - callback: (err: NodeJS.ErrnoException, data: string)
    ```JS
    const fs = require('fs')
    const path = require('path')
    
    // 文件操作通常建议使用绝对路径
    // 默认读取的数据是 buffer，通过指定字符编码转化读取的数据
    fs.readFile(path.resolve('data.txt'), 'utf-8', (err, data) => {
      if (err === null) {
        console.log(data) // data 中的内容
      }
    })
    
    // 如果文件不存在，则会报错
    fs.readFile(path.resolve('data1.txt'), 'utf-8', (err, data) => {
      console.log(err) // 报错
    })
    ```
3. writeFile
> - path: fs.PathOrFileDescriptor, 
> - data: string | NodeJS.ArrayBufferView, 
> - options?: ({ encoding: BufferEncoding; flag?: string; }) | BufferEncoding,
> - callback: (err: NodeJS.ErrnoException, data: string)
    ```JS
    const fs = require('fs')
    
    // 1.所谓写入，就是用新的内容替换原有的内容
    fs.writeFile('data.txt', 'Hi', err => {
      if (!err) {
        fs.readFile('data.txt', 'utf-8', (err, data) => {
          console.log(data) // Hi
        })
      }
    })
    
    // 2.如果写入的文件不存在，会创建该文件
    fs.writeFile('data1.txt', 'Hi', err => {
      if (!err) {
        fs.readFile('data1.txt', 'utf-8', (err, data) => {
          console.log(data) // Hi
        })
      }
    })
    
    // 3.
    fs.writeFile(
      'data.txt',
      'Hello!',
      {
        mode: 438, // 默认值 `0o666`（八进制表示） 的十进制表示（可读可写不可执行）
        flag: 'r+',
        encoding: 'utf8' // 与 `utf-8` 等效
      },
      err => {
        if (!err) {
          fs.readFile('data.txt', 'utf-8', (err, data) => {
            console.log(data) // Hello!世界
          })
        }
      }
    )
    ```
4. appendFile
> - path: fs.PathOrFileDescriptor
> - data: string | Uint8Array
> - options?: ({ encoding: BufferEncoding; flag?: string; }) | BufferEncoding
> - callback: (err: NodeJS.ErrnoException, data: string)
    ```JS
    const fs = require('fs')
	
    fs.appendFile('data.txt', 'Hello', err => {
      // 回调函数仅有 err
      fs.readFile('data.txt', 'utf8', (err, data) => {
        console.log(data) // 你好世界Hello
      })
    })
    
    // 同样可以接收用于配置的第三个参数
    fs.appendFile(
      'data.txt',
      'Hello',
      {
        flag: 'w' // 现在这个 appendFile 等效于默认的 writeFile
      },
      err => {
        fs.readFile('data.txt', 'utf8', (err, data) => {
          console.log(data) // Hello
        })
      }
    )
    ```
5. copyFile
> - src: fs.PathLike
> - dest: fs.PathLike
> - callback: fs.NoParamCallback
    ```JS
    const fs = require('fs')
    
    // 第二个参数是目标文件的路径
    // 如果目标文件不存在，则会创建文件
    fs.copyFile('data.txt', 'data2.txt', (err) => {
      // 回调函数仅接收 err
      if (err === null) console.log('拷贝成功')
    })
    ```
6. watchFile
> - filename: fs.PathLike, 
> - options: fs.WatchFileOptions & { bigint?: false;}, 
> - listener: (curr: fs.Stats, prev: fs.Stats) => void
    ```JS
    const fs = require('fs')
	
    // watchFile 通过定时轮询文件，检查文件是否发生变化
    // interval 表示轮询文件的时间间隔 默认 `5007`
    // 回调函数接收 current 和 previous 分别包含文件变化前后的相关信息
    fs.watchFile('data.txt', { interval: 200 }, (current, previous) => {
      if (current.mtime !== previous.mtime) {
        // mtime 表示最新修改时间
        console.log('文件内容被修改')
      }
    })
    // 调用 API 修改文件
    // 也可以手动打开文件去修改内容
    fs.writeFile('data.txt', 'Hello', err => {
      console.log('写入内容')
      setTimeout(() => {
        fs.writeFile('data.txt', 'Hello', err => {
          console.log('写入内容相同')
        })
      }, 1000)
    })
    // watchFile 监听任务会一直持续，控制台不会退出
    // 需要手动停止监听，当删除了所有监听器，程序就会停止运行
    // 第二个参数可以指定要删除的监听器(watchFile 的回调函数)，如果不指定则删除指定文件的全部监听器
    setTimeout(() => {
      fs.unwatchFile('data.txt')
    }, 3000)
    ```
7. 注意：
    - readFile、writeFile、appendFile、copyFile  都是一次性的操作，例如  copyFile  会将文件内容一次性获取并放到内存中，然后再一次性写入另一个文件，这些都不适用于大内存的文件操作；
    - 文件操作 API 通常最后一个参数是一个回调函数，Nodejs 中的回调函数通常都是 error-first 错误优先风格的 (err, ...args) => {}，即第一个参数是错误信息，后面还是要处理的数据，当没有错误的时候 err 为 null；


## 文件操作实现 md 转 html
1. 依赖
    - marked：将 markdown 内容转化成 html 的工具，官方文档；
    - browser-sync：开启一个 Web 站点打开 html 页面，并实时更新，官方文档；
2. 实现代码
    - mdToHtml.js
      ```JS
      const fs = require('fs')
      const path = require('path')
      const marked = require('marked') // 将 md-->html
      const browserSync = require('browser-sync') // 使用 browser-sync 来实时显示 Html 内容
      
      const temp = `
          <!DOCTYPE html>
          <html lang="en">
              <head>
                  <meta charset="UTF-8">
                  <title></title>
                  <style>
                      .markdown-body {
                          box-sizing: border-box;
                          min-width: 200px;
                          max-width: 1000px;
                          margin: 0 auto;
                          padding: 45px;
                      }
                      @media (max-width: 750px) {
                          .markdown-body {
                              padding: 15px;
                          }
                      }
                      {{style}}
                  </style>
              </head>
              <body>
                  <div class="markdown-body">
                      {{content}}
                  </div>
              </body>
          </html>
      `
      
      // 通过命令行 md 文档名称获取 md 绝对路径
      let mdPath = path.join(__dirname, process.argv[2])
      // 获取 css 绝对路径
      let cssPath = path.resolve('github.css')
      //生成 html 所在路径
      let htmlPath = mdPath.replace(path.extname(mdPath), '.html')
      
      fs.watchFile(mdPath, (curr, prev) => {
          // 监听 md 文档内容的变经，然后更新 html 内容
          if (curr.mtime !== prev.mtime) {
              fs.readFile(mdPath, 'utf-8', (err, data) => {
                  let htmlStr = marked(data)
                  fs.readFile(cssPath, 'utf-8', (err, data) => {
                      let retHtml = temp.replace('{{content}}', htmlStr).replace('{{style}}', data)
                      // 将上述的内容写入到指定的 html 文件中，用于在浏览器里进行展示
                      fs.writeFile(htmlPath, retHtml, (err) => console.log('html 生成成功了'))
                  })
              })
          }
      })
      
      // 开启服务 显示 html 内容
      browserSync.init({
          server: {
              baseDir: __dirname, // 服务的根目录
              index: path.basename(htmlPath) // 指定首页的文件名
          },
          watch: true // 监听更新
      })
      ```
    - index.md
      ```MD
      ### 标题一
        * 列表项2
        * 列表项3
        * 列表项4
        * 列表项5
    
      ### 标题二
      ```
    - 执行命令  `node mdToHtml.js index.md`

## 文件打开与关闭
1. 前面的 API 是将文件中的数据一次性的读取 / 写入到内存中，这种方式对于大体积的文件来说，显然不合理：所以需要实现一个可以「边读边写」或「边写边读」的操作方式，这就需要将文件的打开、读取、写入、关闭看作各自独立的环节；
2. open
> - path: fs.PathLike
> - flags: fs.OpenMode 
> - mode: fs.Mode
> - callback: (err: NodeJS.ErrnoException, fd: number) => void
    ```JS
    const fs = require('fs')
    const path = require('path')
    
    fs.open(path.resolve('data.txt'), 'r', (err, fd) => {
      console.log(fd)
    })
    ```
3. close
> - fd: number
> - callback?: fs.NoParamCallback
    ```JS
    const fs = require('fs')
    const path = require('path')
    
    fs.open(path.resolve('index.md'), 'r', (err, fd) => {
      // fd：文件描述符，用于追踪文件资源
      console.log(fd) // 第一次打开的文件的文件描述符是 3
      fs.close(fd, err => console.log('关闭成功'))
    })
    ```


## 大文件读写操作
1. 大文件读写操作的数据传输
    <img src="大文件读写操作的数据传输.jpg" width="auto" height="200px" class="lazy-load" title="大文件读写操作的数据传输"/>

    - A 文件中的数据要想拷贝到 B 文件中，默认情况下需要内存作为中转；
    - 如果是一次性的操作，就会存在内存占满并且溢出的潜在问题；
    - 因此更期望有一个中间暂存区，一点一点的读取，然后一点一点的写入，而这个中间暂存区就是 Buffer；
2. 读取/写入 API
    - read：从 fd 指定的文件中读取数据（这里是将数据从磁盘文件中写入到 buffer 中）；
    - write：向 fs 指定的文件写入数据（将缓冲区里的内容写入到磁盘文件中）；
3. read<Buffer>
> - fd: number, 
> - options: { buffer: TBuffer, offset: number, length: number, position: fs.ReadPosition }
> - callback: (err: NodeJS.ErrnoException, bytesRead: number, buffer: Buffer)
    ```JS
    const fs = require('fs')
    // 定义一个 Buffer 用于存储文件读取的数据
    const buf = Buffer.alloc(10)
    
    // A.txt 内容：1234567890
    fs.open('A.txt', 'r', (err, readFd) => {
      // 读取操作只会读取一次，并不会持续读取到读完所有数据
      fs.read(
        readFd, // 用于指定读取的文件
        {
          buffer: buf, // 数据写入缓冲区 buf
          offset: 0, // 获取 buf 数据的偏移量
          length: 3, // 读取 buf 数据的字节数
          position: 0 // 一般不需要指定（为 null/-1 自动更新当前文件位置）
        },
        (err, bytesRead, buffer) => {
          // bytesRead 实际读取的字节数
          // buffer 最终读取的数据
          console.log(bytesRead) // 3
          console.log(buffer) // <Buffer 31 32 33 00 00 00 00 00 00 00>
          console.log(buffer.toString()) // 123
        }
      )
    })
    ```
4. write<Buffer>
> - fd: number, 
> - buffer: Buffer, 
> - offset: number, 
> - length: number, 
> - position: number, // 写入数据的起始位置
> - callback: (err: NodeJS.ErrnoException, written: number, buffer: Buffer) => void
    ```JS
    const fs = require('fs')
    // 定义一个已有数据的 Buffer，作为写入文件的数据
    const buf = Buffer.from('1234567890')
    
    fs.open('B.txt', 'w', (err, writeFd) => {
      fs.write(writeFd, buf, 1, 3, 0, (err, bytesWritten, buffer) => {
        // bytesWritten 实际写入的字节数
        // buffer 指向写入的数据源
        console.log(bytesWritten) // 3
        console.log(buffer === buf) // true
      })
    })
    ```


## 大文件拷贝自定义实现（流的原理）
1. 默认情况下 Nodejs 提供了 copyFile 用于拷贝，但它是基于 readFile 和 writeFile 这类一次性的读写操作：
    - 针对于大体积的文件来说，它是不合适的，相对于 readFile 和 writeFile 一次性读写，这种方式会减轻内存的消耗，提高代码执行性能；
    - 对于 Nodejs 来说，针对这样的需求，更好的方式是使用流操作（后面会实现）；
2. 下面基于其它文件读写 API 实现适用于大文件的文件拷贝功能：
    ```JS
    // 将 A 文件内容拷贝到 B 文件
    // A.txt 内容：1234567890abcdefghigklmn
    
    // 01 打开 A 文件，利用 read 将数据保存到 buffer 暂存起来
    // 02 打开 B 文件，利用 write 将 buffer 中的数据写入到 B 文件中
    // 数据完全拷贝
    const fs = require('fs')
    const buf = Buffer.alloc(10)
    
    const BUFFER_SIZE = buf.length // 每次读取数据的字节数
    fs.open('A.txt', 'r', (err, readFd) => {
      fs.open('B.txt', 'w', (err, writeFd) => {
        function next() {
          // position 指定为 null 自动更新读取文件的起始位置
          fs.read(readFd, buf, 0, BUFFER_SIZE, null, (err, bytesRead, buffer) => {
            if (bytesRead === 0) {
              // 内容读取完毕，关闭文件
              fs.close(readFd, () => { })
              fs.close(writeFd, () => { })
              console.log('拷贝完成')
              return
            }

            // 不指定 position  自动更新写入文件的起始位置
            fs.write(writeFd, buf, 0, bytesRead, (err, bytesWritten) => {
              // 再次读取数据
              next()
            })
          })
        }
        // 首次启动读取
        next()
      })
    })
    ```

## 目录操作 API
1. 目录操作 API 同 文件操作 API 一样，大多存在同步和异步两种方式，这里只列举异步 API，同步 API 可以参考 Nodejs 文档;
2. 常用 API：
    - access：判断用户是否具有当前文件或目录的操作权限；
    - stat：获取目录及文件信息；
    - mkdir：创建目录 make directory；
    - rmdir：删除目录 remove directory；
    - readdir：读取目录中的内容；
    - unlink：删除文件；
    - rm：删除文件和目录；
      - 新增于 v14.14.0，rmdir 递归删除的替代推荐；
      - Nodejs v14.14.0 推荐使用 fs.rm 代替 fs.rmdir 的 recursive 选项；
      - Nodejs v16.0.0 弃用 fs.rmdir 的 recursive 选项，使用将导致错误；
3. access
    > - path: fs.PathLike, 
    > - mode?: number, 
    > - callback: (err: NodeJS.ErrnoException) => void)
    ```JS
    const fs = require('fs')
	
    // 常用于判断目录或文件是否存在
    // windows 环境下一般对文件都具有可读可写不可执行的权限
    fs.access('data.txt', err => {
      // 仅接收 err
      if (err) {
        console.log(err)
      } else {
        console.log('有操作权限')
      }
    })
    ```
4. stat
    > - path: fs.PathLike, 
    > - callback: (err: NodeJS.ErrnoException, stats: fs.Stats) => void)
    ```JS
    const fs = require('fs')
    
    fs.stat('data.txt', (err, stats) => {
      // 回调返回一个 `fs.stats` 类，该对象提供有关文件的信息
      console.log(stats.size) // 内容字节数
      console.log(stats.isFile()) // 是否文件
      console.log(stats.isDirectory()) // 是否目录
    })
    ```
5. mkdir
> - path: fs.PathLike, 
> - options: fs.MakeDirectoryOptions & { recursive: true }, 
> - callback: (err: NodeJS.ErrnoException, path?: string) => void
    ```JS
    const fs = require('fs')
	
    // 默认情况创建的是路径最后部分，前提是保证父级目录全部存在
    // 假设下例 a/b 不存在
    fs.mkdir('a/b/c', err => {
      if (err) {
        console.log(err) // 进入这里
      } else {
        console.log('c 创建成功')
      }
    })
    
    // recursive 表示递归，默认为 false，开启后递归目录创建
    fs.mkdir('a/b/c', { recursive: true }, err => {
      if (err) {
        console.log(err)
      } else {
        console.log('a b c 创建成功') // 进入这里
      }
    })
    ```
6. rmdir
> - path: fs.PathLike, 
> - callback: fs.NoParamCallback
    ```JS
    const fs = require('fs')
    
    // 默认情况下删除的是路径的最后部分
    // 如果删除的不是目录类型或者路径不存在，则会报错，windows 环境下报 `ENOENT` 错误
    fs.rmdir('a/b/c', err => {
      if (err) {
        console.log(err)
      } else {
        console.log('c 删除成功')
      }
    })
    
    // 默认情况下删除非空目录（目录下存在其它目录或文件）则会报错
    fs.rmdir('a', err => {
      if (err) {
        console.log(err) // 报 `ENOTEMPTY` 错误
      } else {
        console.log('a 删除成功')
      }
    })
    
    // 同 mkdir 一样，rmdir 也提供一个 recursive 选项用于递归删除
    // 不过官方 v16.0.0 已弃用这个选项，而推荐使用 fs.rm()
    fs.rmdir('a', { recursive: true }, err => {
      if (err) {
        console.log(err)
      } else {
        console.log('a 删除成功')
      }
    })
    ```
7. readdir
> - path: fs.PathLike, 
> - callback: (err: NodeJS.ErrnoException, files: string[]) => void)
    ```JS
    const fs = require('fs')
    /*
      示例目录：
      └─ a
          ├─ b
          │   └─ b.txt
          └─ a.txt
    */
    // 仅读取当前目录下一层文件列表，不会递归读取
    fs.readdir('a', (err, files) => console.log(files) /* [ 'a.txt', 'b' ] */)
    fs.readdir('a/b', (err, files) => console.log(files) /* [ 'b.txt' ] */)
    ```
8. unlink
> - path: fs.PathLike, 
> - callback: fs.NoParamCallback
    ```JS
    const fs = require('fs')
	
    // 删除的是 path 的最后部分，如果文件不存在则报错
    fs.unlink('a/a.txt', err => {
      if (err) {
        console.log(err)
      } else {
        console.log('文件删除成功')
      }
    })
    
    // 如果删除的文件是目录类型，则报错
    fs.unlink('a', err => {
      if (err) {
        console.log(err) // 报错不允许操作
      } else {
        console.log('不会进入到这里')
      }
    })
    ```
9. rm
> - path: fs.PathLike, 
> - options: fs.RmOptions, 
> - callback: fs.NoParamCallback
    ```JS
    const fs = require('fs')
    
    // force: true，如果 path 不存在，异常是否被忽略，默认 false
    // recursive: true，是否递归删除，默认 false
    fs.rm('a', { force: true, recursive: true }, err => {
      if (err) {
        console.log(err)
      } else {
        console.log('a 删除成功')
      }
    })
    ```


## 手写创建目录、删除目录
1. 同步递归创建目录
    ```JS
    const fs = require('fs')
    const path = require('path')
    
    function makeDirSync(dirPath) {
      const items = dirPath.split(path.sep) // 获取当前平台的路径分隔符 `/` 或 `\`
  
      // 对上述的数组进行遍历，需要拿到每一项，然后与前一项进行拼接 /
      for (let index = 1; index <= items.length; index++) {
        // ['a'] => a
        // ['a', 'b'] => a/b
        // ['a', 'b', 'c'] => a/b/c
        const dir = items.slice(0, index).join(path.sep)
        try {
          // 判断是否具有操作权限（即文件是否存在）
          fs.accessSync(dir)
        } catch (err) {
          // 不存在则创建
          fs.mkdirSync(dir)
        }
      }
    }
    makeDirSync(path.join('a/b/c'))
    ```
2. 异步递归创建目录
    - 回调方式
      ```JS
      const fs = require('fs')
      const path = require('path')
      
      function makeDirAsync(dirPath, cb) {
        const items = dirPath.split(path.sep) // ['a', 'b', 'c']
        let index = 1
    
        function next() {
          if (index > items.length) return cb && cb()
          // ['a'] => a/
          // ['a', 'b'] => a/b/
          // ['a', 'b', 'c'] => a/b/c/
          const dir = items.slice(0, index++).join(path.sep)
  
          fs.access(dir, err => {
            if (err) {
              // 判断是否具有操作权限（即文件是否存在）
              fs.mkdir(dir, next)
            } else {
              // 不存在则创建
              next()
            }
          })
        }
    
        next()
      }
      makeDirAsync(path.join('a/b/c'), () => console.log('创建完成'))
      ```
    - Promise 方式
      ```JS
      const fs = require('fs')
      const path = require('path')
      const { promisify } = require('util')
      
      // 将 access 和 mkdir 转化成 promise 风格
      const access = promisify(fs.access)
      const mkdir = promisify(fs.mkdir)
      
      async function makeDirAsync(dirPath, cb) {
        const items = dirPath.split(path.sep) // ['a', 'b', 'c']
    
        for (let index = 1; index <= items.length; index++) {
          // ['a'] => a/
          // ['a', 'b'] => a/b/
          // ['a', 'b', 'c'] => a/b/c/
          const dir = items.slice(0, index).join(path.sep)
  
          try {
            await access(dir)
          } catch (err) {
            await mkdir(dir)
          }
        }
        cb && cb()
      }
      
      makeDirAsync(path.join('a/b/c'), () => console.log('创建成功'))
      ```
3. 同步删除目录
    ```JS
    const fs = require('fs');
    const path = require('path');
    
    // 同步删除目录（树的先序遍历）
    function rmdirSync(dir) {
      // 判断 dir 是不是一个目录
      let statObj = fs.statSync(dir);
      if (statObj.isDirectory()) {
        let dirs = fs.readdirSync(dir); // 递归只考虑两层情况就可以了
        dirs.forEach(d => rmdirSync(path.join(dir, d)));
        fs.rmdirSync(dir);
      } else {
        fs.unlinkSync(dir);
      }
    }
    rmdirSync('b/c');
    ```
4. 异步递归删除目录
    - 串行删除
      ```JS
      const fs = require('fs')
      const path = require('path')
      
      function removeDir(dirPath, cb) {
        // 判断路径的类型
        fs.stat(dirPath, (err, stats) => {
          if (err) return
  
          if (stats.isDirectory()) {
            // 目录 --> 继续读取文件夹下的内容
            fs.readdir(dirPath, (err, files) => {
              // files 为文件夹下的内容，内容可能是 文件夹/文件
              const dirs = files.map(file => path.join(dirPath, file))

              // 记录当前目录下删除的文件数
              let index = 0
              // 定义递归删除的方法
              function next() {
                // 内容全部删除，删除最外层目录
                if (index === dirs.length) return fs.rmdir(dirPath, cb)
                // 当前要删除的文件
                let current = dirs[index++]
                removeDir(current, next)
              }
              next()
            })
          } else {
            // 文件 --> 直接删除
            fs.unlink(dirPath, cb)
          }
        })
      }
      
      // 删除 a 文件夹
      removeDir('a', () => console.log('删除完成'))
      ```
    - 并发删除
      ```JS
      const fs = require('fs');
      const path = require('path');
      
      function removeDir(dir, cb) {
        fs.stat(dir, (err, statObj) => { // 判断 a 是不是文件夹
    
          if (statObj.isDirectory()) { // 是文件夹
            fs.readdir(dir, (err, dirs) => {
              // 获取当前目录的所有的目录的集合 
              dirs = dirs.map(item => path.join(dir, item));
              // 没有子目录，直接删除当前文件夹
              if (dirs.length == 0) return fs.removeDir(dir, cb);  

              let index = 0;
              function done() { // Promise.all
                if (++index == dirs.length) {
                  fs.removeDir(dir, cb);
                }
              }

              for (let i = 0; i < dirs.length; i++) { // 并发删除子目录
                let dir = dirs[i];
                removeDir(dir, done); // 每个删除完毕后 累加删除的数量
              }
            })
          } else {
            fs.unlink(dir, cb); // 删除文件即可
          }
        })
      }
      
      // 删除 a 文件夹
      removeDir('a', () => console.log('异步并发删除'));
      ```