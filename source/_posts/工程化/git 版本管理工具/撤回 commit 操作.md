---
title: 撤回 commit 操作
categories:
  - 工程化
  - git 版本管理工具
tags:
  - git
abbrlink: 332561d1
date: 2022-06-18 19:34:46
---

## reset 撤回
1. reset 其他参数
    - mixed： 不删除工作空间改动代码，撤销 commit，并且撤销 `git add .` 操作； 这个为默认参数，`git reset --mixed (commit id)`；
    - soft： 不删除工作空间改动代码，撤销 commit，不撤销 `git add .` 操作，`git reset --soft (commit id)`；
    - hard： 删除工作空间改动代码，撤销 commit，撤销 `git add .` 操作； `git reset --hard (commit id)` 注意完成这个操作后，就恢复到了上一次的 commit 状态；
2. 图解
    <img src="reset.jpg" width="300px" height="auto" class="lazy-load" title="reset"/>
3. 注意
    - 撤销指定 commit，之后的所有提交都被删掉；如果在错误那次 commit 之后已经有其他 commit，仅仅删掉或撤销那一次 commit 用指令：`git rebase -i HEAD~5`（HEAD~5 为当前分支的倒数第五个 commit）；
    - 在本地仓库的时候使用，推送到远程仓库不推荐使用；


## revert 撤回
1. git revert ：撤销某次操作，此次操作之前和之后的 commit 和 history 都会保留，并且把这次撤销作为一次最新的提交；
2. 图解
    <img src="revert.jpg" width="300px" height="auto" class="lazy-load" title="revert"/>
3. 结论
    - 要撤销的提交记录后面居然多了一个新提交！这是因为新提交记录 C2’引入了更改 —— 这些更改刚好是用来撤销 C2 这个提交的，也就是说 C2’ 的状态与 C1 是相同的；
    - revert 之后就可以把更改推送到远程仓库与别人分享；

## git revert 和 git reset 对比
1. git revert 是用一次新的 commit 来回滚之前的 commit，git reset 是直接删除指定的 commit；
2. 在回滚这一操作上看，效果差不多，但是在日后继续 merge 以前的老版本时有区别，因为 git revert 是用一次逆向的 commit 中和之前的提交，因此日后合并老的 branch 时，导致这部分改变不会再次出现，但是 git reset 是之间把某些 commit 在某个 branch 上删除，因而和老的 branch 再次 merge 时，这些被回滚的 commit 应该还会被引入；
3. git reset 是把 HEAD 向后移动了一下，而 git revert 是 HEAD 继续前进，只是新的 commit 的内容和要 revert 的内容正好相反，能够抵消要被 revert 的内容；