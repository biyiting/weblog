<template>
  <div class="search-form">
    <el-form label-position="right">
      <!-- conditions: {
        fieldName: 'cabinet_type', // 字段名
        fieldDesc: '机柜类别', // 描述
        fieldType: 'text', // 字段类型:text文本、date时间、number数字
        isConfig: 1, // 是否为字典项:0否，1是配置项，2是固定值
        configCode: "[{ pkey: 'cabinetType01' }]", // 字典code,如果是固定值[{“1”:”布局中”}]
        index: 1, // 位次(顺序)
        deleted: 0,
        operator: 'gt',
        value: '',
      },-->
      <!--
        field: 'safetyNum',
        operator: 'gt',
        value: '',
        type:'',
        label:''
      -->
      <template v-for="(item, index) in advance" :key="item.id">
        <el-form-item :label="item.label">
          <div class="select-box">
            <!-- 字段列表 -->
            <el-select
              size="small"
              class="select-field"
              v-model="item.field"
              filterable
              @change="getTypebyFieldName($event, item)"
            >
              <el-option
                v-for="c in conditions"
                :key="c.fieldName"
                :value="c.fieldName"
                :label="c.fieldDesc"
              ></el-option>
            </el-select>
            <!-- 字典项类字段：自己去查询, 配置项类字段：接口返回-->
            <template v-if="[1, 2].includes(item.isConfig)">
              <div class="select-fitCon">
                <el-select
                  size="small"
                  filterable
                  multiple
                  collapse-tags
                  collapse-tags-tooltip
                  v-model="item.value"
                  style="vertical-align: top;"
                >
                  <el-option
                    v-for="oper in item.operatorList"
                    :key="oper.label"
                    :value="oper.value"
                    :label="oper.label"
                  ></el-option>
                </el-select>
              </div>
            </template>
            <!-- 非字典项类字段： -->
            <template v-else-if="[0].includes(item.isConfig)">
              <!-- 操作符 -->
              <el-select
                filterable
                size="small"
                class="select-operator"
                v-model="item.operator"
                @change="() => (item.value = null)"
              >
                <el-option
                  v-for="oper in item.operatorList"
                  :key="oper.label"
                  :value="oper.value"
                  :label="oper.label"
                ></el-option>
              </el-select>
              <el-select
                v-if="['date'].includes(item.type)"
                filterable
                size="small"
                class="select-operator"
                v-model="item.timeType"
                @change="() => (item.value = null)"
              >
                <el-option
                  v-for="timeType in [
                    { label: '年', value: 'year' },
                    { label: '月', value: 'month' },
                    { label: '日', value: 'day' },
                  ]"
                  :key="timeType.label"
                  :value="timeType.value"
                  :label="timeType.label"
                ></el-option>
              </el-select>
              <!-- 根据字段类型判断：组件 -->
              <div class="select-fitCon" v-if="['text'].includes(item.type)">
                <span
                  v-if="['contain', 'noContain', 'isStart', 'isNoEnd', 'isNoStart', 'isEnd'].includes(item.operator)"
                >
                  <el-input size="small" v-model="item.value"></el-input>
                </span>
              </div>
              <div class="select-fitCon" v-if="['date'].includes(item.type)">
                <span v-if="item.timeType === 'year'">
                  <el-date-picker
                    v-if="['between', 'noBetween'].includes(item.operator)"
                    size="small"
                    v-model="item.between.start"
                    type="year"
                    start-placeholder="开始年份"
                    end-placeholder="结束年份"
                    value-format="YYYY"
                  />
                  <el-date-picker
                    v-if="['between', 'noBetween'].includes(item.operator)"
                    size="small"
                    v-model="item.between.end"
                    type="year"
                    start-placeholder="开始年份"
                    end-placeholder="结束年份"
                    value-format="YYYY"
                    :disabled-date="time => time.getTime() < new Date(item.between.start).getTime()"
                  />
                  <el-date-picker
                    v-else-if="['lt', 'gt', 'eq', 'neq'].includes(item.operator)"
                    style="vertical-align:top;"
                    size="small"
                    v-model="item.value"
                    type="year"
                    placeholder="选择年份"
                    value-format="YYYY"
                  />
                </span>
                <span v-else-if="item.timeType === 'month'">
                  <el-date-picker
                    v-if="['between', 'noBetween'].includes(item.operator)"
                    size="small"
                    v-model="item.value"
                    type="monthrange"
                    range-separator="至"
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
                    value-format="YYYY-MM"
                  />
                  <el-date-picker
                    v-else-if="['lt', 'gt', 'eq', 'neq'].includes(item.operator)"
                    style="vertical-align:top;"
                    size="small"
                    v-model="item.value"
                    type="month"
                    placeholder="选择月份"
                    value-format="YYYY-MM"
                  />
                </span>
                <span v-else-if="item.timeType === 'day'">
                  <el-date-picker
                    v-if="['between', 'noBetween'].includes(item.operator)"
                    size="small"
                    v-model="item.value"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始时间"
                    end-placeholder="结束时间"
                    value-format="YYYY-MM-DD"
                  />
                  <el-date-picker
                    v-else-if="['lt', 'gt', 'eq', 'neq'].includes(item.operator)"
                    style="vertical-align:top;"
                    size="small"
                    v-model="item.value"
                    type="date"
                    placeholder="选择日期"
                    value-format="YYYY-MM-DD"
                  />
                </span>
              </div>
              <div class="select-fitCon" v-if="['number'].includes(item.type)">
                <span v-if="['between', 'noBetween'].includes(item.operator)">
                  <el-input
                    size="small"
                    onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                    v-model="item.between.start"
                  ></el-input>
                  <el-input
                    size="small"
                    onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                    v-model="item.between.end"
                  ></el-input>
                </span>
                <span v-else-if="['eq', 'neq', 'gt', 'gte', 'lt', 'lte'].includes(item.operator)">
                  <el-input
                    size="small"
                    onkeyup="this.value = this.value.replace(/[^\d.]/g,'');"
                    v-model="item.value"
                  ></el-input>
                </span>
              </div>
            </template>
            <div class="select-del">
              <i class="el-icon-delete" @click="onDel(index)"></i>
            </div>
          </div>
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script>
/* eslint-disable  @typescript-eslint/camelcase */
import { deepClonePlus, uuidv4 } from '@/utils/tool';

export default {
  name: 'CustomSearchItem',
  props: {
    defaultAdvance: {
      type: Object,
      default: null,
    },
    baseCodeObj: {
      type: Object,
      default: () => ({}),
    },
    type: {
      type: String,
      default: () => '',
    },
    conditionsList: {
      type: Array,
      default: () => [],
    },
  },
  // components: {
  //   CommonDialog,
  // },
  data() {
    return {
      advance: [
        // {
        //   id: 'asasasas',
        //   field: '',
        //   operator: '',
        //   type: '',
        //   value: '',
        //   operatorList,
        // },
      ],
      conditions:
        this.conditionsList.filter(it => [1, '1'].includes(it.isQuery)) ||
        [
          // {
          //   fieldName: 'cabinet_type', // 字段名
          //   fieldDesc: '机柜类别', // 描述
          //   fieldType: 'text', // 字段类型:text文本、date时间、number数字
          //   isConfig: 1, // 是否为字典项:0否，1是配置项，2是固定值
          //   configCode: "[{ pkey: 'cabinetType01' }]", // 字典code,如果是固定值[{“1”:”布局中”}]
          //   index: 1, // 位次(顺序)
          //   isQuery: 1, // 0:不支持查询，1:支持查询
          //   deleted: 0,
          // },
        ],
      // fix：此处操作符 value 和 上面 dom 一一对应
      operatorObj: {
        text: [
          { label: '包含', value: 'contain', sql: 'like' },
          { label: '不包含', value: 'noContain', sql: 'notlike' },
          { label: '开头是', value: 'isStart', sql: 'like' },
          { label: '结尾是', value: 'isEnd', sql: 'like' },
          { label: '开头不是', value: 'isNoStart', sql: 'notlike' },
          { label: '结尾不是', value: 'isNoEnd', sql: 'notlike' },
          { label: '为空', value: 'isnull', sql: 'isnull' },
          { label: '非空', value: 'notnull', sql: 'notnull' },
        ],
        date: [
          { label: '介于', value: 'between' },
          { label: '不介于', value: 'noBetween' },
          { label: '某个时间之前', value: 'lt' },
          { label: '某个时间之后', value: 'gt' },
          { label: '等于', value: 'eq' },
          { label: '不等于', value: 'neq' },
          { label: '为空', value: 'isnull' },
          { label: '非空', value: 'notnull' },
        ],
        number: [
          { label: '介于', value: 'between' },
          { label: '不介于', value: 'noBetween' },
          { label: '等于', value: 'eq' },
          { label: '不等于', value: 'neq' },
          { label: '大于', value: 'gt' },
          { label: '大于等于', value: 'gte' },
          { label: '小于', value: 'lt' },
          { label: '小于等于', value: 'lte' },
          { label: '为空', value: 'isnull' },
          { label: '非空', value: 'notnull' },
        ],
      },
    };
  },
  methods: {
    onDel(inx) {
      this.advance.splice(inx, 1);
      this.$emit('changeAdvance', this.advance);
    },
    // 根据字段类型，将字典项/配置项 放置 advItem 里面
    getTypebyFieldName(val, advItem) {
      try {
        let item = this.conditions.find(it => it.fieldName === val);
        advItem.type = item.fieldType;
        advItem.isConfig = item.isConfig;
        advItem.value = '';
        advItem.timeType = '';
        advItem.operatorList = [];
        advItem.operator = '';

        const operatorListTemp = [];
        if (item.isConfig === 1) {
          // 字典项
          let currDictList = [];
          item.configCode.forEach(d => {
            currDictList.push(...(this.baseCodeObj[d.pkey] ? this.baseCodeObj[d.pkey] : []));
          });
          currDictList.forEach(el => {
            operatorListTemp.push({ label: el.name, value: el.key });
          });
          advItem.operatorList = operatorListTemp;
        } else if (item.isConfig === 2) {
          // 配置项
          let tempObj = Object.assign({}, ...item.configCode);
          for (const key in tempObj) {
            const ele = tempObj[key];
            operatorListTemp.push({ label: ele, value: key });
          }
          advItem.operatorList = operatorListTemp;
        } else {
          advItem.operatorList = this.operatorObj[item.fieldType];
        }
        console.log(val, advItem, this.conditions, advItem);
      } catch (error) {
        console.log('高级查询error：' + error);
      }
    },
    onAddCondition() {
      this.advance.push({
        id: uuidv4(),
        field: '',
        operator: '',
        operatorList: [],
        type: 'text',
        value: '',
        timeType: '',
        between: {
          start: '',
          end: '',
        },
      });
      this.$emit('changeAdvance', this.advance);
    },
  },
  async created() {
    if (this.defaultAdvance) {
      this.advance = this.defaultAdvance;
    }
  },
};
</script>

<style lang="less" scoped>
.search-form {
  // max-height: 600px;
  // overflow-y: auto;
}

::v-deep(.el-form-item) {
  display: flex;
  margin: 0;

  .el-form-item__content {
    flex: 1;
    padding: 0 5% 0 2%;

    .select-box {
      display: flex;
      margin-top: 10px;

      > div:nth-of-type(n + 2) {
        padding-left: 10px;
      }

      > .select-field {
        width: 20%;
      }

      > .select-operator {
        width: 15%;
      }
      > .select-fitCon {
        height: 32px;
        flex: 1;
        > span {
          display: flex;
        }
      }
      > .select-del {
        width: 20px;
        position: absolute;
        right: 1%;
        line-height: 32px;
      }
    }
  }
}

::v-deep(.el-input__suffix) {
  right: 0 !important;
}

::v-deep(.el-select),
::v-deep(.el-cascader) {
  width: 100%;
}

::v-deep(.dialog-content) {
  height: 320px;
  overflow-y: auto;
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
