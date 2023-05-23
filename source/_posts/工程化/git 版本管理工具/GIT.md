---
title: GIT
categories:
  - 工程化
  - git 版本管理工具
tags:
  - git
abbrlink: c72923f6
date: 2022-06-18 16:02:46
---

## 版本管理的演变
1. 集中式 VCS
    <img src="集中式.jpg" width="auto" height="215px" class="lazy-load" title="集中式"/>
2. 分布式 VCS
    <img src="分布式.jpg" width="auto" height="200px" class="lazy-load" title="分布式"/>

## GIT 特点：
1. 最优的存储能力；
2. 非凡的性能；
3. 开源的；
4. 很容易做备份；
5. 支持离线操作；
6. 很容易定制工作流程；

## 认识工作区、暂存区和版本库
1. 理解下 Git 工作区、暂存区和版本库概念
    - 工作区：就是你在电脑里能看到的目录；
    - 暂存区：英文叫 stage 或 index，一般存放在 .git 目录下的 index 文件（.git/index）中，所以把暂存区有时也叫作索引（index）；
    - 版本库：工作区有一个隐藏目录 .git，这个不算工作区，而是 Git 的版本库；
2. 下面这个图展示了工作区、版本库中的暂存区和版本库之间的关系
    <img src="暂存区和版本库之间的关系.jpg" width="auto" height="305px" class="lazy-load" title="暂存区和版本库之间的关系"/>
3. git 操作
    <img src="git操作.jpg" width="auto" height="200px" class="lazy-load" title="git操作"/>

## 面试题

### git 与 svn 的区别在哪里？
1. git 和 svn 最大的区别在于 git 是分布式的，而 svn 是集中式的。因此我们不能再离线的情况下使用 svn，如果服务器出现问题，我们就没有办法使用 svn 来提交我们的代码。 
2. svn 中的分支是整个版本库的复制的一份完整目录，而 git 的分支是指针指向某次提交，因此 git 的分支创建更加开销更小并且分支上的变化不会影响到其他人，svn 的分支变化会影响到所有的人；
3. svn 的指令相对于 git 来说要简单一些，比 git 更容易上手；


### git pull 和 git fetch 的区别
1. git fetch 只是将远程仓库的变化下载下来，并没有和本地分支合并；
2. git pull 会将远程仓库的变化下载下来，并和当前分支合并；


### git rebase 和 git merge 的区别
1. git merge 和 git rebase 都是用于分支合并，关键在 commit 记录的处理上不同；
2. git merge 会新建一个新的 commit 对象，然后两个分支以前的 commit 记录都指向这个新 commit 记录。这种方法会保留之前每个分支的 commit 历史；
3. git rebase 会先找到两个分支的第一个共同的 commit 祖先记录，然后将提取当前分支这之后的所有 commit 记录，然后将这个 commit 记录添加到目标分支的最新提交后面；经过这个合并后，两个分支合并后的 commit 记录就变为了线性的记录了；