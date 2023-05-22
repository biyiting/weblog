---
title: 内置模块 path
categories:
  - Node 全栈开发
  - Node 核心
tags:
  - node
abbrlink: b5929ac7
date: 2022-09-15 18:35:30
---
## path：用于处理 文件/目录 的路径
	
## path 模块常用 API
1. basename(path: string，ext?: string)：获取路径中的基础名称；
    ```JS
    const path = require('path')
    console.log(__filename) // /Users/wushuai/Downloads/Code/02Path/01-path.js
      
    /**
     * 获取路径中的基础名称
      *  01 返回的就是接收路径当中的最后一部分 
      *  02 第二个参数表示扩展名，如果说没有设置则返回完整的文件名称带后缀
      *  03 第二个参数做为后缀时，如果没有在当前路径中被匹配到，那么就会忽略
      *  04 处理目录路径的时候如果说，结尾处有路径分割符，则也会被忽略掉
      */
    console.log(path.basename(__filename)) //  01-path.js
    console.log(path.basename(__filename, '.js')) //  01-path
    console.log(path.basename(__filename, '.css')) //  01-path.js
    console.log(path.basename('/a/b/c')) // c
    console.log(path.basename('/a/b/c/')) // c
    ```
2. dirname(path: string)：获取路径中的目录名称；
    ```JS
    const path = require('path')
    
    console.log(path.dirname('/a/b/c'))  //  /a/b
    console.log(path.dirname('/a/b/c/')) //  /a/b
    ```
3. extname(path: string)：获取路径中扩展名称；
    ```JS
    const path = require('path')
    /**
     * 获取路径的扩展名
      *  01 返回 path路径中相应文件的后缀名
      *  02 如果 path 路径当中存在多个点，它匹配的是最后一个点，到结尾的内容
      */
    console.log(path.extname('/a/b/index.js')) //  .js
    console.log(path.extname('/a/b')) // 
    console.log(path.extname('/a/b/index.html.js.css')) //  .css
    console.log(path.extname('/a/b/index.html.js.')) //  .
    ```
4. isAbsolute(path: string)：判断获取路径是否为绝对路径；
    ```JS
    const path = require('path')
    
    console.log(path.isAbsolute('foo')) // false
    console.log(path.isAbsolute('/foo')) // true
    console.log(path.isAbsolute('///foo')) // true
    console.log(path.isAbsolute('')) // false
    console.log(path.isAbsolute('.')) // false
    console.log(path.isAbsolute('../bar')) // false
    ```
5. join(...path: string[])：拼接多个路径判断；
    ```JS
    const path = require('path')
    
    console.log(path.join('a/b', 'c', 'index.html')) // a/b/c/index.html
    console.log(path.join('/a/b', 'c', 'index.html')) // /a/b/c/index.html
    console.log(path.join('/a/b', 'c', '../', 'index.html')) // /a/b/index.html
    console.log(path.join('/a/b', 'c', './', 'index.html')) // /a/b/c/index.html
    console.log(path.join('/a/b', 'c', '', 'index.html')) // /a/b/c/index.html
    console.log(path.join('')) // .
    ```
6. resolve(...from?: string[], to: string)：返回绝对路径；
    ```JS
    const path = require('path');
                
    // to 不是一个绝对路径，form优先被考虑，直到找到一个绝对路径
    console.log(path.resolve('/foo/bar', '../', './baz')); // 返回 /foo/bar
    // to 是一个绝对路径，那么久直接返回 to
    console.log(path.resolve('/foo/bar','/baz')); // 返回 /baz
    // 如果 from 和 to 都不是绝对路径的话，就会使用当前的工作目录 + form + to
    console.log(path.resolve('foo', 'bar')); 
    // /Users/wushuai/Downloads/Code/02Path/foo/bar
    ```
7. pasre(path: string)：将路径解析成一个对象；
    ```JS
    const path = require('path')
    
    console.log(path.parse('/a/b/c/index.html'))
    // { root:'/',dir:'/a/b/c',base:'index.html',ext:'.html', name: 'index' }
    console.log(path.parse('/a/b/c/'))
    // { root: '/', dir: '/a/b', base: 'c', ext: '', name: 'c' }
    console.log(path.parse('./a/b/c/'))
    // { root: '', dir: './a/b', base: 'c', ext: '', name: 'c' }
    ```
8. formart(pathObj: Object)：序列化路径；
    ```JS
    const path = require('path');
    
    // 如果提供了 pathObject.dir，则 pathObject.root 会被忽略。
    const str = {
        root: '/ignored',
        dir: '/node/base/path',
        base: 'index.js',
        ext: '.js',
        name: 'index'
    };
    console.log(path.format(str)); // 输出 /node/base/path/index.js
    
    // 如果没有提供了 pathObject.dir，则 pathObject.root 会使用。
    const str2 = {
        root: '/',
        base: 'index.js',
        ext: '.js',
        name: 'index'
    };
    console.log(path.format(str2)); // 输出 /index.js
    
    // 如果没有指定 'base', 则 'name' + 'ext' 会被使用
    const str3 = {
        root: '/',
        ext: '.js',
        name: 'index'
    };
    console.log(path.format(str3)); // 输出 /index.js
    ```
9. normalize(path: string)：规范化路径；
    ```JS
    const path = require('path')
    
    console.log(path.normalize('')) // .
    console.log(path.normalize('a/b/c/d')) // a/b/c/d
    console.log(path.normalize('a///b/c../d')) // a/b/c../d
    console.log(path.normalize('a///b/c\/d')) // a/b/c/d
    console.log(path.normalize('a//\b/c\/d')) // \b为转译字符，被去掉了，a/c/d
    ```