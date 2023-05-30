---
title: 剑指 Offer 59 - II.队列的最大值
categories:
  - 数据结构与算法
  - 力扣
tags:
  - 算法
  - 队列
  - 单调队列
  - 双端队列
abbrlink: 5bee9125
date: 2023-05-30 09:47:22
---

## [队列的最大值](https://leetcode.cn/problems/dui-lie-de-zui-da-zhi-lcof/)

## 单调的双端队列
1. 解题思路：维护一个单调的双端队列
    - 本算法基于问题的一个重要性质：当一个元素进入队列的时候，它前面所有比它小的元素就不会再对答案产生影响。
    - 举个例子，如果向队列中插入数字序列 1 1 1 1 2，那么在第一个数字 2 被插入后，数字 2 前面的所有数字 1 将不会对结果产生影响。因为按照队列的取出顺序，数字 2 只能在所有的数字 1 被取出之后才能被取出，因此如果数字 1 如果在队列中，那么数字 2 必然也在队列中，使得数字 1 对结果没有影响。
    - 按照上面的思路，可以设计这样的方法：从队列尾部插入元素时，可以提前取出队列中所有比这个元素小的元素，使得队列中只保留对结果有影响的数字。这样的方法等价于要求维持队列单调递减，即要保证每个元素的前面都没有比它小的元素。
    - 那么如何高效实现一个始终递减的队列呢？只需要在插入每一个元素 value 时，从队列尾部依次取出比当前元素 value 小的元素，直到遇到一个比当前元素大的元素 value' 即可。
      - 上面的过程保证了只要在元素 value 被插入之前队列递减，那么在 value 被插入之后队列依然递减；
      - 而队列的初始状态（空队列）符合单调递减的定义；
      - 由数学归纳法可知队列将会始终保持单调递减；
    - 上面的过程需要从队列尾部取出元素，因此需要使用双端队列来实现。另外也需要一个辅助队列来记录所有被插入的值，以确定 pop_front 函数的返回值。
    - 保证了队列单调递减后，求最大值时只需要直接取双端队列中的第一项即可；
2. 复杂度：
    - 时间复杂度：O(1)（插入，删除，求最大值）：删除操作于求最大值操作显然只需要 O(1) 的时间，而插入操作虽然看起来有循环，做一个插入操作时最多可能会有 n 次出队操作。但要注意，由于每个数字只会出队一次，因此对于所有的 n 个数字的插入过程，对应的所有出队操作也不会大于 n 次。因此将出队的时间均摊到每个插入操作上，时间复杂度为 O(1)；
    - 空间复杂度：O(n)，需要用队列存储所有插入的元素；
3. 代码实现：
    ```JS
    var MaxQueue = function() {
      // 存储队列数据
      this.queue = {}
      // 准备队列相关的数据
      this.headQ = this.countQ = 0

      // 双端队列维护最大值（每个阶段的最大值）
      this.deque = {}
      this.headD = this.countD = 0
    };


    /** 队尾入队
      * @param {number} value
      * @return {void}
      */
    MaxQueue.prototype.push_back = function(value) {
      // 数据在 queue 入队
      this.queue[this.countQ++] = value
      // 检测是否可以将数据添加到双端队列
      //   - 队列不能为空
      //   - value 大于队尾值
      while (!this.isEmptyDeque() && value > this.deque[this.countD - 1]) {
        // 删除当前队尾值
        delete this.deque[--this.countD]
      }
      // 将 value 入队
      this.deque[this.countD++] = value
    };


    /** queue 队首出队
      * @return {number}
      */
    MaxQueue.prototype.pop_front = function() {
      if (this.isEmptyQueue()) {
        return - 1
      }
      // 比较 deque 与 queue 的队首值，如果相同，deque 出队，否则 deque 不操作
      if (this.queue[this.headQ] === this.deque[this.headD]) {
        delete this.deque[this.headD++]
      }
      // 给 queue 出队，并返回
      const frontData = this.queue[this.headQ]
      delete this.queue[this.headQ++]
      return frontData
    };


    /** 获取队列最大值
      * @return {number}
      */
    MaxQueue.prototype.max_value = function() {
      if (this.isEmptyDeque()) {
        return -1
      }
      // 返回 deque 队首值即可
      return this.deque[this.headD]
    };


    /** 检测队列 deque 是否为空
      * @returns 
      */
    MaxQueue.prototype.isEmptyDeque = function () {
      return !(this.countD - this.headD)
    };


    /** 检测队列 Queue 是否为空
      * @returns 
      */
    MaxQueue.prototype.isEmptyQueue = function () {
      return !(this.countQ - this.headQ)
    };


    /**
     * Your MaxQueue object will be instantiated and called as such:
     * var obj = new MaxQueue()
     * var param_1 = obj.max_value()
     * obj.push_back(value)
     * var param_3 = obj.pop_front()
     */
    ```

## 单调队列
1. 解题思路：
    - 维护一个单调递减的队列 max_queue；
    - push_back：max_queue 为空则直接入队，不为空要判断队尾的元素和新增的元素的大小；
      - 队尾的元素 < 新增元素，删掉队尾元素直到队尾元素小于新增的元素位置（维护单调递减队列）；
      - 队尾的元素 > 新增元素，直接入队；
    - pop_front：判断 queue 出队的元素是否等于 max_queue 的队列头元素，等于则一起出队，否则不出队；
    - max_value：如果队列是空的返回 -1，否则返回 max_queue 的第一个元素；
2. 复杂度：
    - 时间复杂度：O(1)，max_value(), push_back(), pop_front() 方法的均摊时间复杂度均为 O(1) ；
    - 空间复杂度：O(N)，当元素个数为 N 时，最差情况下 max_queue 中保存 N 个元素；
3. 代码实现：
    ```TS
    class MaxQueue {
      queue: number[]
      max_queue: number[]

      constructor() {
        this.queue = [];
        this.max_queue = [];
      }

      max_value(): number {
        if (!this.queue.length) return -1;
        return this.max_queue[0];
      }

      push_back(value: number): void {
        this.queue.push(value);
        while (this.max_queue.length && this.max_queue[this.max_queue.length - 1] < value) {
          this.max_queue.pop();
        }
        this.max_queue.push(value);
      }

      pop_front(): number {
        if (!this.queue.length) return -1;
        let front = this.queue.shift()
        if (front === this.max_queue[0]) {
          this.max_queue.shift();
        }
        return front;
      }
    }
    ```
    ```JS
    var MaxQueue = function () {
      this.queue = [];
      this.max_queue = [];
    };

    MaxQueue.prototype.max_value = function () {
      if (!this.queue.length) return -1;
      return this.max_queue[0];
    };

    MaxQueue.prototype.push_back = function (value) {
      this.queue.push(value);
      while (this.max_queue.length && this.max_queue[this.max_queue.length - 1] < value) {
        this.max_queue.pop();
      }
      this.max_queue.push(value);
    };

    MaxQueue.prototype.pop_front = function () {
      if (!this.queue.length) return -1;
      let front = this.queue.shift()
      if (front === this.max_queue[0]) {
        this.max_queue.shift();
      }
      return front;
    };
    ```

