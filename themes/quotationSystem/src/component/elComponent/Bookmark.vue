<template>
  <div class="markBox">
    <div class="mark-left" ref="barparent">
      <!-- 标题 -->
      <label v-if="leftMarkList.length" class="search-title">快捷查询:</label>
      <!-- 快捷查询体 -->
      <template v-for="fast in leftMarkList" :key="fast.id">
        <div class="mark-item" @contextmenu.prevent="openMenu($event, fast)">
          <span :title="fast.displayName" @click.stop="onFastSearch(fast)">{{ fast.displayName }}</span>
        </div>
        <ul v-show="visible" :style="{ left: left + 'px', top: top + 'px' }" class="contextmenu">
          <li @click.stop="openFastDialogR"><i class="el-icon-edit"></i>编辑</li>
          <li @click.stop="onFastDeleteR"><i class="el-icon-close"></i>删除</li>
        </ul>
      </template>
    </div>
    <div class="drop" v-show="rightMarkList.length > 0">
      <el-dropdown>
        <i class="el-icon-arrow-down el-icon--right"></i>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item v-for="fast in rightMarkList" :key="fast.id" @click="onFastSearch(fast)">
              {{ fast.displayName }}
              <i style="padding-left: 10px" @click.stop="openFastDialog(fast)" class="el-icon-edit"></i>
              <i @click.stop="onFastDelete(fast)" class="el-icon-close"></i>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bookmark',
  props: {
    fastList: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      markItemWidth: 90,
      leftMarkList: [],
      rightMarkList: [],
      visible: false,
      showTrigger: false,
      top: 0,
      left: 0,
      currentFast: null,
      gridData: [
        {
          date: '2016-05-02',
          name: 'Jack',
          address: 'New York City',
        },
        {
          date: '2016-05-04',
          name: 'Jack',
          address: 'New York City',
        },
        {
          date: '2016-05-01',
          name: 'Jack',
          address: 'New York City',
        },
      ],
    };
  },
  mounted() {
    this.initMarkList();
  },
  computed: {
    markItemNum() {
      return Math.floor((this.$refs.barparent.clientWidth - 80 - 20) / this.markItemWidth);
    },
  },
  watch: {
    fastList: {
      deep: true,
      handler: function() {
        this.initMarkList();
      },
    },
    visible(value) {
      if (value) {
        document.body.addEventListener('click', this.closeMenu);
      } else {
        document.body.removeEventListener('click', this.closeMenu);
      }
    },
  },
  methods: {
    changeVisible() {
      this.visible = false;
    },
    initMarkList() {
      // 不满一行
      if (this.fastList.length <= this.markItemNum) {
        this.leftMarkList = [...this.fastList];
        return;
      }

      // 超过一行
      if (this.fastList.length > this.markItemNum) {
        this.leftMarkList = this.fastList.slice(0, this.markItemNum);
        this.rightMarkList = this.fastList.slice(this.markItemNum);
        return;
      }
    },
    openFastDialogR() {
      this.$emit('openFastDialog', this.currentFast);
    },
    onFastDeleteR() {
      this.$emit('onFastDelete', this.currentFast);
    },
    openFastDialog(args) {
      this.$emit('openFastDialog', args);
    },
    onFastDelete(args) {
      this.$emit('onFastDelete', args);
    },
    onFastSearch(args) {
      this.$emit('onFastSearch', args);
    },
    openMenu(e, fast) {
      this.currentFast = fast;

      this.left = e.clientX;
      this.top = e.clientY + 20;

      this.visible = true;
    },
    closeMenu() {
      this.visible = false;
    },
  },
};
</script>
<style lang="less" scoped>
.markBox {
  width: 100%;
  height: 30px;
  display: flex;

  .search-title {
    width: 70px;
    line-height: 30px;
    font-size: 14px;
    font-weight: 400;
    padding-left: 10px;
    color: #409eff;
  }
  .mark-left {
    flex: 1;
    display: flex;
  }
  .mark-item {
    cursor: pointer;
    border-radius: 8px;
    padding: 0 10px;
    display: inline-block;
    width: 60px;
    height: 25px;
    line-height: 25px;
    margin-right: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #409eff;
    text-align: center;
    border: 1px solid;
  }
  .mark-item:hover {
    text-decoration: underline;
  }
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: #eee;
  display: flex;
  align-items: center;
}
.drop {
  width: 50px;
  line-height: 30px;
}

.contextmenu {
  background: #d9d8d8cc;
  position: fixed;
  z-index: 2000;
  border-radius: 5px;
  > li {
    padding: 0 20px;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ccc;
  }
  > li:last-child {
    border-bottom: 0;
  }
  > li:hover {
    border-radius: 5px;
    background-color: #409eff;
    color: #eff5f9;
  }
}
</style>
