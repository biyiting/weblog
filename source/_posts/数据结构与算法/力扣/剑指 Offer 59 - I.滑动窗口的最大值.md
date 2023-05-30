---
title: 剑指 Offer 59 - I.滑动窗口的最大值
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 队列
  - 双端队列
  - 单调队列
abbrlink: 454320df
date: 2023-05-30 09:47:23
---

## [滑动窗口的最大值](https://leetcode.cn/problems/hua-dong-chuang-kou-de-zui-da-zhi-lcof/)

## 双端队列
1. 解题思路：
    - 回忆 「包含 min 函数的栈」 ，其使用 单调栈 实现了随意入栈、出栈情况下的 O(1) 时间获取 “栈内最小值” 。本题同理，不同点在于 “出栈操作” 删除的是 “列表尾部元素” ，而 “窗口滑动” 删除的是 “列表首部元素”；
      - 窗口对应的数据结构为 双端队列 ，本题使用 单调队列 即可解决以上问题。遍历数组时，每轮保证单调队列 deque；
      - deque 内仅包含窗口内的元素 ⇒ 每轮窗口滑动移除了元素 nums[i - 1]，需将 deque 内的对应元素一起删除；
      - deque 内的元素 非严格递减 ⇒ 每轮窗口滑动添加了元素 nums[j + 1]，需将 deque 内所有 < nums[j + 1]的元素删除；
    - 算法流程：
      - 初始化： 双端队列 deque ，结果列表 res ，数组长度 n ；
      - 滑动窗口： 左边界范围 i∈[1 - k, n - k]，右边界范围 j∈[0, n - 1]；
        - 若 i > 0 且 队首元素 deque[0] = 被删除元素 nums[i - 1]：则队首元素出队；
        - 删除 deque 内所有 < nums[j] 的元素，以保持 deque 递减；
        - 将 nums[j] 添加至 deque 尾部；
        - 若已形成窗口（即 i ≥0 ）：将窗口最大值（即队首元素 deque[0]）添加至列表 res；
      - 返回值： 返回结果列表 res；
2. 复杂度：
    - 时间复杂度 O(n)： 其中 n 为数组 nums 长度；线性遍历 nums 占用 O(n)；每个元素最多仅入队和出队一次，因此单调队列 deque 占用 O(2n)；
    - 空间复杂度 O(k)： 双端队列 deque 中最多同时存储 k 个元素（即窗口大小）；
3. 代码实现：
    ```JS
    /**
      * @param {number[]} nums 传入数组
      * @param {number} k 滑动窗口宽度
      * @return {number[]} 
      */
    var maxSlidingWindow = function (nums, k) {
      if (k <= 1) {
        return nums
      }

      const result = []
      const deque = []
      // 1 将窗口第一个位置的数据添加到 deque 中，保持递减（第一次取 k 个进行比较）
      deque.push(nums[0])
      let i = 1
      for (; i < k; i++) {
        // - 存在数据
        // - 当前数据大于队尾值
        //   - 出队，再重复比较
        while (deque.length && nums[i] > deque[deque.length - 1]) {
          deque.pop()
        }
        deque.push(nums[i])
      }
      // 将第一个位置的最大值添加到 result
      result.push(deque[0])


      // 2 遍历后续的数据（每次后移一位进行比较）
      const len = nums.length
      for (; i < len; i++) {
        // 同上进行比较
        while (deque.length && nums[i] > deque[deque.length - 1]) {
          deque.pop()
        }
        deque.push(nums[i])
        // 检测当前最大值是否位于窗口外（是否在 k 的范围内）
        if (deque[0] === nums[i - k]) {
          deque.shift()
        }
        // 添加最大值到 result
        result.push(deque[0])
      }
      return result
    };
    ```

## 单调队列
1. 解题思路：
    - 维护一个单调递减的队列 deque 和一个结果数组 res；
    - 当没形成窗口之前，deque 为空则直接入队，不为空要判断队尾的元素和新增的元素的大小，维护 deque 的长度等于 k；
      - 队尾的元素 < 新增元素，删掉队尾元素直到队尾元素小于新增的元素位置（维护单调递减队列）；
      - 队尾的元素 > 新增元素，直接入队；
    - 形成窗口之后，向 res 放入 deque 的队首元素（队首元素为窗口的最大值），不断维护 deque，若 deque 的队首元素等于窗口的左边界值，说明下一次滑动窗口 deuqe 的队首不在窗口内，则 deque 队首出队；
    - 滑动窗口滑到最后，返回 res；
2. 复杂度：
    - 时间复杂度：O(n) ： 其中 n 为数组 nums 长度；线性遍历 nums 占用 O(n)；每个元素最多仅入队和出队一次，因此单调队列 deque 占用 O(2n)；
    - 空间复杂度：O(k) ： 双端队列 deque 中最多同时存储 k 个元素（即窗口大小）；
3. 代码实现：
    ```TS
    function maxSlidingWindow(nums: number[], k: number): number[] {
      if (k === 1) return nums;

      let deQueue = [];
      let res = [];

      for (let right = 0; right < nums.length; right++) {
        let num = nums[right];
        while (deQueue.length && deQueue[deQueue.length - 1] < num) {
            deQueue.pop();
        }
        deQueue.push(nums[right]);

        let left = right - k + 1;
        if (left >= 0) {
          res.push(deQueue[0]);
          // 滑动过程中，如果序列中的最大元素即退出窗口，则移除队列头部元素
          if (nums[left] === deQueue[0]) {
            deQueue.shift();
          }
        }
      }
      return res;
    };
    ```

