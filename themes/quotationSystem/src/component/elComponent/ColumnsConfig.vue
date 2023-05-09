<template>
  <el-dropdown :hide-on-click="false" v-if="showSelect">
    <span class="el-dropdown-link">
      {{ title }}
      <i class="el-icon-arrow-down el-icon--right"></i>
    </span>
    <!--  -->
    <template #dropdown>
      <el-dropdown-menu style="max-height: 25rem">
        <el-checkbox-group v-model="checkList" v-for="dropItem in columnList" :key="dropItem">
          <el-dropdown-item>
            <el-checkbox :label="dropItem.label" :disabled="dropItem.isDefault === '0'"></el-checkbox>
          </el-dropdown-item>
        </el-checkbox-group>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script>
import { mapState } from 'vuex';
import { getResourceTableFileds } from '@/api/model';
import { deepClone, getCookieByKey } from '@/utils/tool';
export default {
  name: 'ColumnsConfig',
  props: {
    title: {
      type: String,
      default: () => '',
    },
    arg: {
      type: String,
      default: () => '',
    },
    showSelect: {
      type: Boolean,
      default: () => true,
    },
    setColumnsList: {
      type: Function,
    },
  },
  data() {
    return {
      timer: '',
      checkList: [
        // {
        //   label: '序号',
        //   isDisplay: true,
        // },
      ],
      columnList: [
        // '序号'
      ],
    };
  },
  watch: {
    checkList: {
      deep: true,
      immediate: true,
      handler(oldVal, newVal) {
        setTimeout(() => {
          // 更新localStorage
          if (this.checkList.length > 0) {
            localStorage.setItem(`${getCookieByKey('ACCOUNT')}_column_${this.arg}`, JSON.stringify(this.checkList));
          }
          this.$store.commit('room/setCurrentColumsChecked', this.checkList);
          this.setColumnsList(this.currentList);
        }, 10);
      },
    },
  },
  created() {
    if (this.currentColumsChecked.length > 0) {
      this.columnList = this.currentColumsAll;
      this.checkList = this.currentColumsChecked;
      return;
    }

    getResourceTableFileds(this.arg)
      .then(res => {
        let { data, message, status } = res;

        data = data.filter(item => {
          if (item.field === 'deviceType') {
            item.field = 'deviceTypeCn';
          }
          item.showTooltip = true;
          item.prop = item.field;
          item.label = item.name;
          return item;
        });

        this.columnList = deepClone(data);
        this.columnList.unshift({
          label: '序号',
          name: '序号',
          isDisplay: true,
        });
        this.columnList.filter(it => {
          // 可用功率和已用功率 不排序
          if (it.prop !== 'powerFree' && it.prop !== 'powerUsed') it.sortable = true;
        });

        let localColumns = localStorage.getItem(`${getCookieByKey('ACCOUNT')}_column_${this.arg}`);

        if (localColumns && JSON.parse(localColumns).length > 0) {
          this.checkList = JSON.parse(localColumns);
        } else {
          let temp = data.filter(item => {
            // 默认展示的字段(0不能勾选，1可以勾选)
            return item.isDefault === '0' || item.isDefault === '1';
          });
          let t = ['序号']; // 默认展示序号列
          temp.forEach(it => {
            t.push(it.label);
          });
          this.checkList = t;
        }

        // console.log(this.columnList);
        // console.log(this.checkList);
        this.$store.commit('room/setCurrentColumsAll', this.columnList);
      })
      .catch(err => {
        console.error(new Error('数据获取失败！', err));
      });
  },
  computed: {
    ...mapState('room', {
      currentColumsChecked: state => state.currentColumsChecked,
      currentColumsAll: state => state.currentColumsAll,
    }),
    currentList() {
      return this.columnList.filter(item => {
        return this.checkList.includes(item.label);
      });
    },
  },
  beforeDestory() {
    this.$store.commit('room/setCurrentColumsChecked', []);
  },
};
</script>

<style lang="less" scoped>
.space-view {
  width: 100%;
  height: 100%;
  padding: 20px;
  background: #eff5f9;
  box-sizing: border-box;
  > header {
    width: 100%;
    box-sizing: border-box;
    background: #fff;
  }
  > section {
    height: calc(100% - 57px);
    background: #fff;
  }
}
.table-top {
  padding: 0px 8px;
  height: 56px;
  line-height: 56px;
}
.label-txt {
  color: #606266;
  font-size: 16px;
  font-style: normal;
  font-weight: 800;
  display: inline;
  max-width: 20px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 4px;
  margin-right: 8px;
}
.table-title {
  color: #606266;
  font-size: 14px;
  font-style: normal;
  font-weight: 800;
}
.table-content {
  height: 100%;
  overflow-y: scroll;
}
</style>
