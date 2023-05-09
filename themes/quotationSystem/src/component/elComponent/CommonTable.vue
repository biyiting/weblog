<template>
  <div ref="tableContainer">
    <el-table
      ref="commonTable"
      v-loading="listLoading"
      :data="showData"
      :max-height="maxHeight"
      tooltip-effect="dark"
      header-row-class-name="table-header"
      :row-class-name="rowClassNameFn"
      :class="`common-table ${pageSize >= 10 ? 'page20' : ''}`"
      :highlight-current-row="!config.showSelection"
      @current-change="currentChange"
      :cell-style="cellStyle"
      @row-click="rowClick"
      @cell-click="cellClick"
      @sort-change="sortChange"
      @filter-change="filterChange"
      @selection-change="selectionChange"
      :row-key="row => (row.resource_id ? row.resource_id : row.id ? row.id : row.hardwareId)"
      :border="border"
      :stripe="stripe"
      :span-method="config.spanMethod"
      @expand-change="expandChange"
      :expand-row-keys="expands"
      :default-sort="defSort"
      @select="handleSelectionChange"
      @select-all="handleSelectionAll"
    >
      <!-- 多选 -->
      <el-table-column
        v-if="showSelection"
        type="selection"
        align="center"
        :fixed="fixedSelection"
        width="50"
        :reserve-selection="true"
      ></el-table-column>
      <el-table-column width="50" align="center" v-if="showRadio">
        <template v-slot="scope">
          <el-radio
            :label="scope.row.resourceId"
            v-model="radio"
            style="color: #fff; padding-left: 10px; margin-right: -25px"
          >{{ '' }}</el-radio>
        </template>
      </el-table-column>
      <!-- 序号 -->
      <el-table-column
        v-if="showIndex"
        type="index"
        :fixed="fixedIndex"
        width="80"
        align="center"
        label="序号"
        :index="setIndex"
      ></el-table-column>
      <!-- 其他列数据 -->
      <el-table-column
        v-for="item in columns"
        :key="item.id"
        :prop="item.prop"
        :align="item.align || 'center'"
        :label="item.label || ''"
        :width="item.width || ''"
        :sortable="item.sortable || false"
        :show-overflow-tooltip="item.showTooltip || false"
        :formatter="formatterData"
        :resizable="true"
      >
        <!-- 渲染input、select等组件 -->
        <template v-slot="scope" v-if="item.slot">
          <el-input
            v-if="item.slot === 'input'"
            size="mini"
            @click="e => e.stopImmediatePropagation()"
            @blur="inputFocus(scope.row)"
            v-model="scope.row[item.prop]"
            :disabled="item.disabled === 'disabled'"
          />
          <el-checkbox v-else-if="item.slot === 'checkbox'" v-model="scope.row[item.prop]" />
          <el-select
            v-else-if="item.slot === 'select'"
            size="mini"
            v-model="scope.row[item.prop]"
            placeholder="请选择"
            @change="selectChange(scope.row)"
            :disabled="item.disabled === 'disabled'"
          >
            <el-option
              v-for="(op, idx) in item.options"
              :key="idx"
              :label="op.label"
              :value="op.value"
            ></el-option>
          </el-select>
          <span v-else-if="item.slot === 'icon'">
            <span>{{ scope.row[item.prop] }}</span>
            <span>
              <i
                class="el-icon-document-copy"
                @click="copyNo(scope.row)"
                v-if="scope.row[item.prop] && scope.row[item.prop] !== ''"
              ></i>
            </span>
          </span>
        </template>
      </el-table-column>
      <!-- 操作列 -->
      <slot />
    </el-table>
    <!-- 分页 -->
    <el-pagination
      v-if="showPagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[10, 30, 50, 100]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
      class="table-page"
      :background="paginationBackground"
    ></el-pagination>
  </div>
</template>

<script>
import { deepClonePlus } from '@/utils/tool';

export default {
  name: 'CommonTable',
  props: {
    config: {
      type: Object,
      default: () => ({}),
    },
    configChildren: {
      type: Object,
      default: () => ({}),
    },
    dealListData: {
      type: Function,
    },
    formatterData: {
      type: Function,
      default: (row, column, cellValue, index) => {
        return cellValue;
      },
    },
    selecTable: {
      type: Function,
      default: (row, index) => {
        return true;
      },
    },
    rowClassNameFn: {
      type: Function,
      default: ({ row, rowIndex }) => {
        return 'row-class-name';
      },
    },
    maxHeight: {
      type: Number,
    },
    cellStyleFn: {
      type: Function,
      default: () => {
        return {};
      },
    },
    defSort: {
      type: Object,
      default: () => ({}),
    },
    stripe: {
      type: Boolean,
      default: false,
    },
    paginationBackground: {
      type: Boolean,
      default: false,
    },
    border: {
      type: Boolean,
      default: true,
    },
    dealListChildrenData: {
      type: Function,
    },
    formatterChildrenData: {
      type: Function,
      default: (row, column, cellValue, index) => {
        return cellValue;
      },
    },
    childrenShow: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      autoDealData: this.config.autoDealData || false, // 是否自动处理数据(前端分页)
      allData: deepClonePlus(this.config.data || []), // autoDealData为true时设置; 列表所有数据(前端分页)
      showData: [], // 当前页显示的数据
      showSelection: this.config.showSelection || false, // 复选
      showRadio: this.config.showRadio || false, // 单选选
      showIndex: this.config.showIndex || false, // 序号
      fixedSelection: this.config.fixedSelection || false, // 序号
      fixedIndex: this.config.showIndex ? this.config.fixedIndex : false, // 序号是否固定
      showPagination: this.config.showPagination === undefined ? true : this.config.showPagination,
      total: (this.config.data || []).length || 0, // 总数
      // currentPage: this.config.currentPage || 1, // 当前页
      // pageSize: this.config.pageSize || 10, // 页数
      currentPage:  1, // 当前页
      pageSize:  10, // 页数
      columns: this.config.columns || [], // 列数据
      sortObj: { ...this.defSort }, // 排序值
      listLoading: true, // 列表加载loading
      currSelectData: deepClonePlus(this.config.selectData || []), // 当前选中数据
      tableHeight: '400',
      expands: [],
      countryShow: false,
      indeX: null,
      selectChildrenData: [],
      radio: '', // 单选
      isRadio: false,
    };
  },
  mounted() {
    if (this.autoDealData) {
      this.dealShowData(this.allData);
      this.listLoading = false;
    } else {
      this.refreshTableData();
    }
    this.setContainerHeight();
  },
  methods: {
    // 点击复制图标
    copyNo(row) {
      this.$emit('copyNo', row);
    },
    // 下拉框改变
    selectChange(row) {
      this.$emit('selectChange', row);
    },
    // input框失去焦点
    inputFocus(row) {
      this.$emit('inputFocus', row);
    },
    // 点击选择位置
    selectLocation(row) {
      this.$emit('selectLocation', row);
    },
    // 移除
    remove(row) {
      this.$emit('remove', row);
    },
    onSelectionChange(val) {
      // console.log(val);
      this.$emit('on-selection-children-change', this.indeX, this.currSelectData);
    },
    onChildrenSelection() {
      this.selectChildrenData = [];
      this.showData.forEach((x, y) => {
        if (this.$refs[`childrenTable${y}`]) {
          this.selectChildrenData.push(this.$refs[`childrenTable${y}`].currSelectData);
        }
      });
    },
    setColumnsList(list) {
      this.columns = deepClonePlus(list).filter(it => {
        return (it.id = `${it.id}-${Math.random() * 10}`);
      });
    },
    // 点击查看
    onChildrenView(row) {
      this.$emit('onChildrenView', row);
    },
    cellStyle(data) {
      return this.cellStyleFn(data);
    },
    // 刷新列表数据，向父组件取数据重新渲染
    refreshTableData(initPage) {
      this.listLoading = true;
      let page = this.currentPage;
      if (initPage) {
        this.currentPage = initPage;
        page = initPage;
      }
      this.listLoading = true;
      // console.log('this.pageSize', this.pageSize);
      this.dealListData(page, this.pageSize, this.sortObj)
        .then(
          result => {
            // console.log('this.$route.name', this.$route.name);
            this.showData = result.data;
            this.total = result.total;
          },
          error => {
            this.$message({
              type: 'error',
              showClose: true,
              message: error.message || error.msg?.message,
            });
            // console.log(error);
            this.showData = [];
            this.total = 0;
          }
        )
        .finally(() => {
          this.listLoading = false;
        });
    },
    // 刷新列表数据，向父组件取数据重新渲染
    refreshChildrenTableData(initPage) {
      this.$nextTick(() => {
        this.$refs[`childrenTable${this.indeX}`].refreshTableData(initPage);
      });
    },
    // 局部刷新二级列表数据
    partRefreshChildrenTableData(rowId) {
      let num = null;
      this.showData.forEach((x, y) => {
        if (x.id === rowId || x.hardwareId === rowId) {
          num = y;
        }
      });
      this.$nextTick(() => {
        this.$refs[`childrenTable${num}`].refreshTableData();
      });
    },
    /* 渲染数据 前端分页 */
    dealShowData(allData) {
      if (undefined === allData) {
        return;
      }
      this.allData = allData;
      let tempData = allData;
      if (this.showPagination) {
        let start = (this.currentPage - 1) * this.pageSize;
        var end = this.currentPage * this.pageSize;
        tempData = allData.slice(start, end);
      }

      this.showData = [];
      this.total = allData.length;
      for (let i in tempData) {
        if (tempData[i]) {
          // tempData[i]._checked = false;
          this.showData.push(tempData[i]);
        }
      }

      // 设置当前选中
      if (this.currSelectData) {
        let tempArr = this.currSelectData;
        for (let i1 in tempArr) {
          for (let j1 in this.showData) {
            if (this.showData[j1].id === tempArr[i1].id) {
              this.showData[j1]._checked = true;
              break;
            }
          }
        }
      }
    },
    sortChange(column) {
      const { prop, order } = column;
      this.sortObj = {
        prop,
        order,
      };
      if (!this.autoDealData) {
        this.refreshTableData();
      }
    },
    rowClick(row, column, event) {
      if (this.$route.name === 'order-todorequest' || this.$route.name === 'order-electricShelves' || this.$route.name === 'order-withdrawing') {
        this.$refs.commonTable?.toggleRowSelection(row);
      }
      this.$emit('row-click', row, column, event);
    },
    cellClick(row, column, cell, event) {
      this.$emit('cell-click', { row, column, cell, event });
    },
    currentChange(val) {
      if (this.showRadio) {
        this.radio = val.resourceId;
      } else {
        this.radio = '';
      }
      this.currSelectData = val;
      this.$emit('on-selection-change', this.currSelectData);
    },
    selectionChange(selection, row) {
      if (this.showRadio) {
        this.$emit('on-selection-change', this.currSelectData);
      } else {
        this.currSelectData = selection;
        this.$emit('on-selection-change', this.currSelectData);
      }
    },
    handleSizeChange(val) {
      this.setContainerHeight();
      this.pageSize = val;
      if (this.autoDealData) {
        this.dealShowData(this.allData);
      } else {
        this.refreshTableData();
      }
    },
    handleCurrentChange(index) {
      if (this.total === 0) {
        return;
      }
      this.currentPage = index;
      if (this.autoDealData) {
        this.dealShowData(this.allData);
      } else {
        this.refreshTableData();
      }
    },
    // 重新展开
    againOpenexpandChange(row) {
      if (row.countryShow) {
        this.expandChange(row);
      } else {
        row.countryShow = !row.countryShow;
        this.expandChange(row);
      }
    },
    // 展开行
    expandChange(row, expandedRows) {
      row.countryShow = !row.countryShow;
      if (row.countryShow) {
        for (let x = 0; x < this.showData.length; x++) {
          if (this.showData[x].id && this.showData[x].id === row.id) {
            this.indeX = x;
          } else if (this.showData[x].hardwareId && this.showData[x].hardwareId === row.hardwareId) {
            this.indeX = x;
          }
        }
        // console.log(row.resource_id ? row.resource_id : row.hardwareId ? row.hardwareId : row.id);
        this.expands.push(row.resource_id ? row.resource_id : row.id ? row.id : row.hardwareId);
        this.$emit('expandOpenChangeRow', row);
      } else {
        this.expands = this.expands.filter(item => item !== (row.resource_id ? row.resource_id : row.id ? row.id : row.hardwareId));
        this.$emit('expandDownChangeRow', row);
      }
      row.extenShow = false;
    },
    // 设置表格高度
    setContainerHeight() {
      const containerRef = this.$refs.tableContainer;
      if (containerRef) {
        setTimeout(() => {
          const containerHei = containerRef.clientHeight - 32; // 减去分页的高度
          this.tableHeight = `${containerHei}`;
        }, 100);
      }
    },
    // 设置索引，从 0 开始
    setIndex(index) {
      return index + 1 + this.pageSize * (this.currentPage - 1);
    },
    toggleRowSelection(...rest) {
      this.$refs.commonTable.toggleRowSelection(rest);
    },
    clearSelection() {
      this.$refs.commonTable.clearSelection();
    },
    setCurrentRow(row) {
      this.$refs.commonTable.setCurrentRow(row);
    },
    filterChange(...rest) {
      this.$emit('filter-change', ...rest);
    },
    // 一级表格勾选
    handleSelectionChange(selection, row) {
      if (!this.childrenShow) return;
      // 判断一级表格是否选中  选中--true  未选中--0
      let isCheck = !!(selection.length && selection.indexOf(row) !== -1);
      // 循环整个表数据--找到勾选的 index
      this.showData.forEach((item, index) => {
        if ((row.id && item.id === row.id) || (row.hardwareId && item.hardwareId === row.hardwareId)) {
          // 在勾选时展开本行数据--不然找不到toggleRowSelection
          this.$refs.commonTable.toggleRowExpansion(item, true);
          setTimeout(() => {
            let tempList = this.$refs[`childrenTable${index}`].showData;
            this.$nextTick(() => {
              // 以防二级列表没有数据
              if (tempList) {
                // 循环本次勾选的数据
                tempList.forEach((selectionItem, selectionIndex) => {
                  if (isCheck) {
                    this.$refs[`childrenTable${index}`].$refs.commonTable.clearSelection();
                    this.$refs[`childrenTable${index}`].$refs.commonTable.toggleAllSelection();
                  } else {
                    this.$refs[`childrenTable${index}`].$refs.commonTable.clearSelection();
                    // this.$refs[`childrenTable${index}`].$refs.commonTable.toggleRowSelection(selectionItem, isCheck);
                  }
                });
              }
            });
          }, 500);
        }
      });
    },

    // 一级表格全选->子表格全部勾选
    handleSelectionAll(selection, row) {
      if (!this.childrenShow) return;
      this.showData.forEach(async (item, index) => {
        await this.$refs.commonTable.toggleRowExpansion(item, true);
        // 判断取消还是勾选--取消清空选择数据
        setTimeout(() => {
          if (selection.length) {
            this.$refs[`childrenTable${index}`].$refs.commonTable.clearSelection();
            this.$refs[`childrenTable${index}`].$refs.commonTable.toggleAllSelection();
          } else {
            this.$refs[`childrenTable${index}`].$refs.commonTable.clearSelection();
          }
        }, 500);
      });
    },
  },
};
</script>
<style lang="less" scoped>
.table-page {
  display: flex;
  justify-content: flex-end;
}
.common-table.page20 {
  height: calc(100% - 56px);
}
::v-deep(.el-table__body-wrapper) {
  overflow-y: scroll;
  // max-height: 601px;
  max-height: calc(100% - 80px);

  .el-tooltip {
    white-space: pre !important;
  }
}
::v-deep(.el-table--border th) {
  border-right: 0.05rem solid #ddd;
}
::v-deep(.el-table--border td) {
  // border-right: 0px;
}
::v-deep(.el-table__expand-icon) {
  -webkit-transform: rotate(0deg);
  transform: rotate(0deg);
}

::v-deep(.el-table__expand-icon .el-icon-arrow-right:before) {
  content: '\e6d9';
  border: 1px solid #ccc;
  // padding: 2px;
}

::v-deep(.el-table__expand-icon--expanded .el-icon-arrow-right:before) {
  content: '\e6d8';
}
</style>
