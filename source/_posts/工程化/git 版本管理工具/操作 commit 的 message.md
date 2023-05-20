---
title: 操作 commit 的 message
categories:
  - 工程化
  - git 版本管理工具
tags:
  - git
abbrlink: f0da3e73
date: 2022-06-18 18:34:46
---

## 修改最近一次的提交的 message
>`git commit -amend`

## 修改历史提交的 message
>`git rebase -i hash`
>指定需要修改 commit 的前一次 commit id，将需要修改 message 的 commit 修改 Commands 为 reword，无需修改的保持 pick；
<img src="修改历史.jpg" width="auto" height="400px" class="custom-img" title="修改历史"/>

## 连续多次 commit 合并成一个 commit
1. 进入仓库 git log 查看 commit；
2. 指定需要修改 commit 的前一次 commit id；
3. 假设选取要合并的3条 commit，第一条为 pick（保留该commit），第二、三条为 squash（将该 commit 和前一个 commit 合并）；