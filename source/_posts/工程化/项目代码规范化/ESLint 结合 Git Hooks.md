---
title: ESLint 结合 Git Hooks
categories:
  - 工程化
  - 项目代码规范化
tags:
  - eslint
  - git hooks
abbrlink: dcf75ccf
date: 2021-11-15 09:02:34
---

## Git Hooks 介绍
### 什么是 Git Hooks？
1. 如同其他许多的版本控制系统一样，Git 也具有在特定事件发生之前或之后执行特定脚本代码功能。Git Hooks 就是那些在 Git 执行特定事件（如commit、push、receive等）后触发运行的脚本；
2. 按照 Git Hooks 脚本所在的位置可以分为两类：
    - 本地 Hooks，触发事件如 commit、merge 等；
    - 服务端 Hooks，触发事件如 receive 等；

### Git Hooks 能做什么？
1. Git Hooks 是定制化的脚本程序，所以它实现的功能与相应的 git 动作相关；在实际工作中，Git Hooks 还是相对比较万能的；
2. 下面仅举几个简单的例子：
    - pre-commit: 检查每次的 commit message 是否有拼写错误，或是否符合某种规范；
    - pre-receive: 统一上传到远程库的代码的编码；
    - post-receive: 每当有新的提交的时候就通知项目成员（可以使用 Email 或 SMS 等方式）；
    - ...

### Git Hooks 是如何工作的？
1. 每一个 Git repo 下都包含有 .git/hooks 这个目录（没错，本地和远程都是这样），这里面就是放置 Hooks 的地方；
2. 可以在这个目录下自由定制 Hooks 的功能，当触发一些 Git 行为时，相应地 Hooks 将被执行；
    - applypatch-msg
    - pre-applypatch
    - post-applypatch
    - pre-commit
    - prepare-commit-msg
    - commit-msg
    - post-commit
    - pre-rebase
    - post-checkout
    - post-merge
    - pre-receive
    - update
    - post-receive
    - post-update
    - pre-auto-gc
    - post-rewrite


### 如何开始使用 Git Hooks？
> 如图中所示的文件，是由本地执行的脚本语言写成的，尽管这些文件默认会是 Shell Script，你完全可以给它替换成自己喜欢的 Ruby，Python 或者 Perl。关于这些脚本文件的命名，细心的读者就会发现图中的文件都是上面 Git 行为列表中列出的名称加上后缀 .sample。没错就是这样，把那些文件的后缀去掉，或者以列表中的名字直接命名，就会把该脚本绑定到特定的 Git 行为上。所以说，Git Hooks的正确操作方式是：写脚本；

<img src="写脚本.jpg" width="500px" height="auto" class="custom-img" title="写脚本"/>


### 本地 Hooks 和 服务端 Hooks
<img src="Hooks.jpg" width="500px" height="auto" class="custom-img" title="Hooks"/>

#### 本地 Hooks
1. commit hooks：与git commit相关的hooks一共有四个，均由git commit命令触发调用，按照一次发生的顺序分别是：
    - pre-commit 是最先触发运行的脚本。在提交一个 commit 之前，该 hook 有能力做许多工作，比如检查待提交东西的快照，以确保这份提交中没有缺少什么东西、文件名是否符合规范、是否对这份提交进行了测试、代码风格是否符合团队要求等等。 这个脚本可以通过传递 --no-verify 参数而禁用，如果脚本运行失败（返回非零值），git 提交就会被终止；
    - prepare-commit-msg 脚本会在默认的提交信息准备完成后但编辑器尚未启动之前运行。 这个脚本的作用是用来编辑 commit 的默认提交说明。 该脚本有 1~3 个参数：包含提交说明文件的路径，commit 类型（message, template, merge, squash），一个用于 commit 的 SHA1 值。这个脚本用的机会不是太多，主要是用于能自动生成 commit message 的情况。 该不会因为 --no-verify 参数而禁用，如果脚本运行失败（返回非零值），git 提交就会被终止；
    - commit-msg 包含有一个参数，用来规定提交说明文件的路径。 该脚本可以用来验证提交说明的规范性，如果作者写的提交说明不符合指定路径文件中的规范，提交就会被终止。 该脚本可以通过传递 --no-verify 参数而禁用，如果脚本运行失败（返回非零值），git 提交就会被终止；
    - post-commit 脚本发生在整个提交过程完成之后。这个脚本不包含任何参数，也不会影响 commit 的运行结果，可以用于发送 new commit 通知；
2. e-mail hooks：与 git am 相关的脚本有三个，均由 git am 触发运行，按顺序依次是：
    - applypatch-msg 脚本最先被触发，它包含一个参数，用来规定提交说明文件的路径。该脚本可以修改文件中保存的提交说明，以便规范提交说明以符合项目标准。如果提交说明不符合规定的标准，脚本返回非零值，git终止提交；
    - pre-applypatch 会在补丁应用后但尚未提交前运行。这个脚本没有参数，可以用于对应用补丁后的工作区进行测试，或对 git tree 进行检查。如果不能通过测试或检查，脚本返回非零值，git 终止提交。 同样需要注意，git 提供的此默认脚本中只是简单调用了 pre-commit，因此在实际工作中需要视情况修改；
    - post-applypaych 脚本会在补丁应用并提交之后运行，它不包含参数，也不会影响 git am 的运行结果。该脚本可以用来向工作组成员或补丁作者发送通知；
3. 其他
    - 由 git rebase 命令调用，运行在 rebase 执行之前，可以用来阻止任何已发发生过的提交参与变基（字面意思，找不到合适的词汇了）。默认的 pre-rebase 确实是这么做的，不过脚本中的 next 是根据 Git 项目自身而写的分支名，在使用过程中应该将其改成自己的稳定分支名称；
    - 由 git checkout 命令调用，在完成工作区更新之后执行。该脚本由三个参数：之前 HEAD 指向的引用，新的 HEAD 指向的引用，一个用于标识此次检出是否是分支检出的值（0表示文件检出，1表示分支检出）；
      - 也可以被 git clone 触发调用，除非在克隆时使用参数 --no-checkout，在由 clone 调用执行时，三个参数分别为 null, 1, 1；
      - 这个脚本可以用于为自己的项目设置合适的工作区，比如自动生成文档、移动一些大型二进制文件等，也可以用于检查版本库的有效性；
    - 由 git merge 调用，在 merge 成功后执行。该脚本有一个参数，标识合并是否为压缩合并。该脚本可以用于对一些Git无法记录的数据的恢复，比如文件权限、属主、ACL等；

#### 服务端 Hooks
>除了本地执行的 Hooks 脚本之外，还有一些放在 Git Server 上的 Hooks 脚本，作为管理员，可以利用这些服务端的脚本来强制确保项目的任何规范；
>这些运行在服务端的脚本，会在push 命令发生的前后执行；
>pre 系列的脚本可以在任何时候返回非零值来终止某次 push，并向 push 方返回一个错误说明；
1. pre-receive：由服务器端的 git receive-pack 命令调用，当从本地版本库完成一个推送之后，远端服务器开始批量更新之前，该脚本被触发执行。该脚本会从标准输入中读入一连串push过 来的引用，如果这里面存在任何非零值，这批更新将不会被服务器接受。可以利用这个脚本来检查推送过来的提交是否合法。
2. update ：这是一个强大的 hook 脚本。它和 pre-recieve 有些类似，只是它会为推送过来的更新中涉及到的每一个分支都做一次检查，而后者则至始至终只有一次检查。另外，它不是从标准输入中读取数据，而是包含三个参数：
    - 要更新的引用或分支的名称；
    - 引用中保存的旧对象名称（SHA1）；
    - 将要保存到引用中的新对象名称(SHA1)；

## ESLint 结合 Git Hooks
>很多前端开发者并不擅长使用 shell；Husky 可以实现 Git Hooks 的使用需求；
1. Husky 模块的使用：在使用 Husky 之前，需要将我们先前测试钩子所创建的 pre-commit 文件删除掉，否则它会影响到 Husky 的工作；
    - 安装 Husky `yarn add husky --dev`
    - 配置 package.json
      ```JSON
      "scripts": {
        "lint": "eslint ./index.js --fix"
      }, 
      "husky": {
        "hooks": {
          "pre-commit": "npm run lint"
        }
      }
      ```
2. lint-staged：经过以上对 Husky 的使用，已经可以对代码在 commit 之前进行 lint 检查，但是如果想要在检查之后再对代码进行一些后续的操作，例如格式化，这时候 Husky 就显得有些不够用了。所以就要用到另一个模块，也就是 lint-staged。它可以配合 Husky，再对代码继续执行一些其他的操作。
    - 安装 lint-staged `yarn add lint-staged --dev`
    - 配置 package.json
      ```JSON
      "scripts": {
        "precommit":"lint-staged"
      },
      "husky": {
        "hooks": {
          "pre-commit": "npm run precommit"
        }
      },
      "lint-staged":{
        "*.js":[ // 在这里配置一些后续想要执行的任务
          "eslint --fix",
          "git add"
        ]
      }
      ```
