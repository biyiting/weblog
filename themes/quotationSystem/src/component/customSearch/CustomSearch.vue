<template>
  <div class="search">
    <el-dropdown class="export-drop">
      <el-button type="primary" size="small">
        添加查询条件
        <i class="el-icon-arrow-down el-icon--right"></i>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item @click="onAddConditionAnd">添加条件-与</el-dropdown-item>
          <el-dropdown-item @click="onAddConditionOr">添加条件-或</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <!-- <el-button type="primary" size="small" @click="ceshi">测试</el-button> -->

    <section>
      <div v-if="advance.orAdvance.length" class="orClassName" style="margin-right:10px;">
        <label class="label">或</label>
      </div>
      <div
        v-if="advance.andAdvance.length"
        class="orClassName"
        :style="{height: `${andContionsNums * 42 - 10}px`}"
      >
        <label class="label">与</label>
      </div>
      <div style="flex:1;">
        <custom-search-item
          ref="andOpear"
          :defaultAdvance="advance.andAdvance"
          :baseCodeObj="baseCodeObj"
          :type="type"
          :conditionsList="conditionsList"
          @changeAdvance="changeAndAdvance"
        ></custom-search-item>

        <custom-search-item
          ref="orOpear"
          :defaultAdvance="advance.orAdvance"
          :baseCodeObj="baseCodeObj"
          :type="type"
          :conditionsList="conditionsList"
          @changeAdvance="changeOrAdvance"
        ></custom-search-item>
      </div>
    </section>
  </div>
</template>

<script>
/* eslint-disable  @typescript-eslint/camelcase */
import CustomSearchItem from '@/component/customSearch/CustomSearchItem';
import dayjs from 'dayjs';

export default {
  name: 'CustomSearch',
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
  components: {
    CustomSearchItem,
  },
  data() {
    return {
      advance: {
        // 与 条件
        andAdvance: [],
        // 或 条件
        orAdvance: [],
      },
    };
  },
  methods: {
    ceshi() {
      console.log(this.advance.andAdvance);
      console.log(this.advance.orAdvance);
    },
    onAddConditionAnd() {
      this.$refs.andOpear.onAddCondition();
    },
    onAddConditionOr() {
      this.$refs.orOpear.onAddCondition();
    },
    changeAndAdvance(advance) {
      this.advance.andAdvance = advance;
    },
    changeOrAdvance(advance) {
      this.advance.orAdvance = advance;
    },
  },
  computed: {
    andContionsNums() {
      return this.advance.andAdvance.length;
    },
  },
  async created() {
    if (this.defaultAdvance) {
      this.advance.andAdvance = [...this.defaultAdvance.andAdvance];
      this.advance.orAdvance = [...this.defaultAdvance.orAdvance];
    }
  },
};
</script>

<style lang="less" scoped>
.search {
  > section {
    height: calc(100% - 40px);
    display: flex;
  }
}
.orClassName {
  width: 50px;
  margin-top: 10px;
  text-align: center;
  background: #bcd9f6;
  border-radius: 5px;
  position: relative;
  .label {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 20px;
  }
}
</style>
