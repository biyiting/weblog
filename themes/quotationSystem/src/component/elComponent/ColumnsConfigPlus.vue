<template>
  <div style="text-align: center">
    <!-- title -->
    <span>{{ title }}</span>
    <!-- 设置 -->
    <el-tooltip class="box-item" effect="dark" content="设置" placement="top-start">
      <i class="save-button" @click="openDialog"></i>
    </el-tooltip>
  </div>
  <!-- 自定列弹窗 -->
  <aside v-if="showColumnsConfig">
    <common-dialog showFooter title="自定义列" width="800px" @handle-cancel="showColumnsConfig = false">
      <template #content>
        <div class="columnConfigBox">
          <span>
            <el-table ref="inxConfig" :data="inxData" style="width: 100%" :show-header="false" :row-key="row => row.id">
              <el-table-column type="selection" :selectable="() => false" reserve-selection="true" align="center" width="50" />
              <el-table-column prop="fieldDesc" label="字段名称">
                <template #default="scope">
                  <span class="field-bg">{{ scope.row.fieldDesc }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="required" label="是否必选" width="100" />
              <el-table-column prop="width" label="宽度" width="150" />
            </el-table>
          </span>
          <!-- 自定义列表操作 -->
          <span class="columnsConfig">
            <el-table
              ref="columnsConfig"
              :data="columnsConfigData"
              @selection-change="selectionChange"
              style="width: 100%"
              :show-header="false"
              :row-key="row => row.id"
            >
              <el-table-column type="selection" :selectable="selectable" reserve-selection="true" align="center" width="50" />
              <el-table-column prop="fieldDesc" label="字段名称">
                <template #default="scope">
                  <span
                    style="display: inline-block; background: rgb(128 128 128 / 40%)"
                    :style="{ width: (scope.row.width ? scope.row.width : 0) + 'px' }"
                  >
                    <span class="field-bg">{{ scope.row.fieldDesc }}</span>
                  </span>
                </template>
              </el-table-column>
              <el-table-column prop="required" label="是否必选" width="70" />
              <el-table-column prop="width" label="宽度" width="180">
                <template #default="scope">
                  <div style="display: flex">
                    <span style="line-height: 40px">宽度</span>
                    <el-input
                      style="flex: 1; margin: auto; padding: 0 5px"
                      v-model="scope.row.width"
                      size="small"
                      clearable
                      @keyup="scope.row.width = checkNum(scope.row.width)"
                    />
                    <span style="line-height: 40px">px</span>
                  </div>
                </template>
              </el-table-column>
            </el-table>
          </span>
          <span>
            <el-table ref="operaConfig" :data="operaData" style="width: 100%" :show-header="false" :row-key="row => row.id">
              <el-table-column type="selection" :selectable="() => false" reserve-selection="true" align="center" width="50" />
              <el-table-column prop="fieldDesc" label="字段名称">
                <template #default="scope">
                  <span class="field-bg">{{ scope.row.fieldDesc }}</span>
                </template>
              </el-table-column>
              <el-table-column prop="required" label="是否必选" width="100" />
              <el-table-column prop="width" label="宽度" width="150" />
            </el-table>
          </span>
        </div>
      </template>
      <template #footer>
        <div class="x-btn-group">
          <el-button @click="onSave" size="mini" type="primary">保存</el-button>
          <el-button @click="showColumnsConfig = false" size="mini">取消</el-button>
        </div>
      </template>
    </common-dialog>
  </aside>
</template>

<script>
import CommonDialog from '@/component/elComponent/CommonDialog';
import Sortable from 'sortablejs';
import { mapState } from 'vuex';
import { getTableFileds, updateTableFileds } from '@/api/model';
import { deepClonePlus, getCookieByKey, getUserId } from '@/utils/tool';
import { isNumber } from 'lodash-es';

export default {
  name: 'ColumnsConfig',
  props: {
    title: {
      type: String,
      default: () => '操作',
    },
    // 模块名
    type: {
      type: String,
      default: () => '',
    },
    customCB: Function,
  },
  components: {
    CommonDialog,
  },
  data() {
    const userId = getUserId();
    return {
      userId: userId,
      showColumnsConfig: false,
      // 自定义列的选中数据
      selectedData: [],
      // 接口返回选中的列数据
      columnsCheckData: [],
      // 自定义列的列表数据
      columnsConfigData: [],
      inxData: [{ id: 'inx', fieldDesc: '序号', required: '(必选)' }],
      operaData: [{ id: 'opera', fieldDesc: '操作', required: '(必选)' }],
    };
  },
  created() {
    // 根据用户 ID 获取列数据
    this.getTableFiledsData();
  },
  methods: {
    getColumnsConfigData() {
      return this.columnsConfigData || [];
    },
    getTableFiledsData() {
      getTableFileds({ userId: this.userId, moduleName: this.type })
        .then(({ data, message, status }) => {
          if (status !== 200) return;

          // 将数据格式化成 commonTable中的config.columns需要的数据类型
          data = data
            .sort((a, b) => a.sequence - b.sequence)
            .filter(item => {
              item.showTooltip = true;
              item.prop = item.fieldName;
              item.label = item.fieldDesc;
              item.required = '';
              if (item.isShow === 2) item.required = '(必选)';
              [1, '1'].includes(item.isQuery) ? (item.sortable = true) : (item.sortable = false);
              return item;
            });
          this.columnsConfigData = data;
          this.columnsCheckData = data.filter(it => [1, 2].includes(it.isShow));

          try {
            // 执行自定义回调函数
            this.customCB && this.customCB.call(null, [this.columnsConfigData, this.inxData]);
          } catch (error) {
            console.log('ColumnsConfigPlus错误:' + error);
          }

          this.$emit('setColumnsList', this.columnsCheckData);
        })
        .catch(err => {
          console.error(new Error('数据获取失败！', err));
        });
    },
    checkNum(val) {
      if (isNaN(Number(val))) return (val = val.replace(/[^\d.]/g, ''));
      else return (val = val > 500 ? 500 : val);
    },
    selectable(row, inx) {
      // 2为默认选中，禁止操作
      return row.isShow !== 2;
    },
    selectionChange(selected) {
      this.selectedData = selected;
    },
    openDialog() {
      this.showColumnsConfig = true;
      this.$nextTick(() => {
        // 初始化拖动插件
        this.rowDropInit();
        // 回显选中的自定义列数据
        this.columnsCheckData.forEach(row => this.$refs.columnsConfig.toggleRowSelection(row, true));
        this.inxData.forEach(row => this.$refs.inxConfig.toggleRowSelection(row, true));
        this.$refs.operaConfig.toggleRowSelection(...this.operaData, true);
      });
    },
    rowDropInit() {
      console.log(this.$refs.columnsConfig);
      const columnsConfigDom = document.querySelector('.columnsConfig .el-table__body-wrapper  tbody');
      Sortable.create(columnsConfigDom, {
        animation: 500,
        onEnd: ({ newIndex, oldIndex }) => {
          this.columnsConfigData.splice(newIndex, 0, ...this.columnsConfigData.splice(oldIndex, 1));
          this.columnsConfigData.forEach((it, inx) => (it.sequence = inx + 1));
        },
      });
    },
    onSave() {
      this.showColumnsConfig = false;
      this.columnsCheckData = this.selectedData;

      this.$emit(
        'setColumnsList',
        this.selectedData.sort((a, b) => a.sequence - b.sequence)
      );

      const checkIdList = this.selectedData.map(it => it.id);
      this.columnsConfigData.forEach(it => {
        if (it.isShow !== 2) {
          checkIdList.includes(it.id) ? (it.isShow = 1) : (it.isShow = 0);
        }
      });
      updateTableFileds(this.type, this.userId, this.columnsConfigData)
        .then(({ data, message, status }) => {
          if (status !== 200) return;
          this.$message.success('操作成功');
        })
        .catch(err => {
          this.$message.error('操作失败');
        });
    },
  },
};
</script>

<style lang="less" scoped>
.columnConfigBox {
  max-height: 400px;
  overflow-y: auto;
}
.field-bg {
  width: 45px;
  line-height: 40px;
  white-space: nowrap;
  margin-left: 25px;
}
.columnsConfig {
  display: block;
  margin: 5px 0;
}
.save-button {
  cursor: pointer;
  vertical-align: text-top;
  display: inline-block;
  width: 18px;
  height: 18px;
  background-size: 100% 100%;
  margin-left: 10px;
  background-image: url('../../../static/svg/setting.svg');
}
.x-btn-group {
  padding: 10px 10px 20px;

  display: flex;
  justify-content: flex-end;

  .x-button {
    padding: 5px;
  }
}
</style>
