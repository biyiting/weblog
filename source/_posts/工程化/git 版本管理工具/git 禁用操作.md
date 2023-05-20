---
title: git 禁用操作
categories:
  - 工程化
  - git 版本管理工具
tags:
  - git
abbrlink: be9894ac
date: 2022-06-20 14:31:46
---
## 禁用 rebase
1. git rebase 的工作方式：
    - 从目标仓库中移除所有本地 patch；
    - 升级到上游的最新版本；
    - 重新向 HEAD 提交你的每个本地 change——如果有冲突则中止，直到你 fix 掉；
2. 而传统的 Merge 则与之相反：
    - 将上游的新 patch 更新到本地分支上；
    - 解掉冲突后提交为新的版本；
3. rebase 的问题：
    - git rebase 的 manpage 上说：“当你 rebase 一个分支时，你是在更改它的历史。如果有人已经保存了这个分支的一份拷贝，当他尝试从你那获取更新时，就可能有问题。”
    - 为什么会出现问题？因为 pull 和 rebase 完全不同，pull 是从上游获取一系列 commit 历史，而 rebase 则移除了旧的历史；
4. 结论
    - 只能对 private 的分支使用 rebase；
    - 千万不要对 public 的分支使用 rebase，会对其他人造成影响；

## 禁用强制 push
>强制 push 会使远程修改丢失，一般是不可取的，尤其是多人协作开发的时候