---
title: markdown 常用语法
comment: true
top: 100000
categories:
  - hexo
tags:
  - markdown
abbrlink: 74dfa7c4
date: 2023-04-26 10:34:11
---
## 二级标题
### 三级标题
#### 四级标题
##### 五级标题
###### 六级标题

## 字体样式

1. **这是加粗的文字**
2. _这是倾斜的文字_`
3. **_这是斜体加粗的文字_**
4. ~~这是加删除线的文字~~

## 有序列表

1. 列表内容
2. 列表内容
3. 列表内容

## 无序列表

- 列表内容
- 列表内容
- 列表内容

## 分割线

1. ***
2. ***

## 超链接

1. 你好，请点击链接 [百度](http://baidu.com)
1. [百度](http://baidu.com)
1. [百度](http://baidu.com)
1. [百度](http://baidu.com)
1. [百度](http://baidu.com)
1. [百度](http://baidu.com)

## 在线图片链接
![霉霉](https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201502%2F09%2F20150209171221_uFkTa.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1685866238&t=442c26597b5dc85fbb2fff987f95d4b4)

## 本地图片链接
{% asset_img meimei.png 霉霉 %}

## 本地图片支持自定义宽高
<img src="meimei.png" width="auto" height="200px" class="custom-img" title="meimei"/>

## <a class="attachment" name="meimei.zip">附件下载(meimei.zip)</a>
## 表格

| 表头   | 表头   | 表头   |
| ------ | ------ | ------ |
| 第一行 | 第一行 | 第一行 |
| 第二行 | 第二行 | 第二行 |
| 第三行 | 第三行 | 第三行 |
| 第四行 | 第四行 | 第四行 |
| 第五行 | 第五行 | 第五行 |
| 第六行 | 第六行 | 第六行 |

## 代码
1. 这是单行代码-> `单行代码`
2. 多行代码块

```javaScript
console.log(1)
console.log(1)
console.log(1)
```

## 列表嵌套(无序套有序)

- 列表内容
  - 列表内容
  - 列表内容
  - 列表内容
- 列表内容
- 列表内容

## 列表嵌套(有序套无序)

1. 列表内容
   - 列表内容
   - 列表内容
   - 列表内容
2. 列表内容
   1. 列表内容
   2. 列表内容
   3. 列表内容
3. 第一项
   > 区块一
   > 区块二
4. 第二项
   > 区块一  
   > 区块二

## 引用

> 这是引用的内容
>
> > 这是引用的内容
> >
> > > 这是引用的内容
> > >
> > > 1. 列表内容
> > >    - 列表内容
> > >    - 列表内容
> > > 2. 列表内容
> > >    1. 列表内容
> > >    2. 列表内容
> > >    3. 列表内容

## 转义

\\ 反斜线
\` 反引号 \* 星号
\_ 底线
\{} 花括号
\[] 方括号
\() 括弧
\# 井字号
\+ 加号
\- 减号
\. 英文句点
\! 惊叹号


## HTML 标签

- 换<br/>行
- 水平分割线<hr/>
- ***
- <mark>标记</mark>
- <del>删除线</del>
- <u>下划线</u>
- <small>小字体</small>
- <big>大字体</big>
- <code>单行代码文本 hello world</code>
- 文字<sup>上标</sup>
- 文字<sub>下标</sub>
- <b>加粗</b>
- <i>斜体</i>
- <a href="http://www.baidu.com" target="_blank">超链接</a>
- <center>居中</center>
- <p align=right>右对齐</p>
- 使用 <kbd>Ctrl</kbd>+<kbd>Alt</kbd>+<kbd>Del</kbd> 重启电脑

