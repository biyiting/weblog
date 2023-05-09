<template>
  <div class="unify-view">
    <header>
      <label
        v-for="menu in pageConfig.menuList"
        :key="menu.label"
        @click="menuClick(menu)"
        :class="{ 'nav-item': true, 'active': pageConfig.activeMenu===menu.label }"
      >{{menu.label}}</label>
    </header>
    <section>
      <el-scrollbar>
        <template v-for="widget in pageConfig.activeWidgetList" :key="widget.id">
          <custom-slider
            :ref="widgetRef"
            v-if="widget.type ==='CustomSlider'"
            :id="widget.id"
            :config="widget.config"
            :parentWidgets="pageConfig.menuList"
          />
          <custom-radio-group
            :ref="widgetRef"
            v-if="widget.type ==='CustomRadioGroup'"
            :id="widget.id"
            :config="widget.config"
            :parentWidgets="pageConfig.menuList"
          />
          <custom-input-check
            :ref="widgetRef"
            v-if="widget.type ==='CustomInputCheck'"
            :id="widget.id"
            :config="widget.config"
            :parentWidgets="pageConfig.menuList"
          />
          <custom-btn-group
            :ref="widgetRef"
            v-if="widget.type ==='CustomBtnGroup'"
            :id="widget.id"
            :config="widget.config"
            :parentWidgets="pageConfig.menuList"
          />
          <custom-number-input
            :ref="widgetRef"
            v-if="widget.type ==='CustomNumberInput'"
            :id="widget.id"
            :config="widget.config"
            :parentWidgets="pageConfig.menuList"
          />
        </template>
      </el-scrollbar>
    </section>
    <footer>
      <el-button class="config-btn-prev" size="large" @click="prevHandel">上一步</el-button>
      <el-button v-if="isLastStep" class="config-btn" size="large" @click="quotationHandel">生成报价单</el-button>
      <el-button v-else class="config-btn" size="large" @click="nextHandel">下一步</el-button>
    </footer>
  </div>

  <quotation-config ref="quotationConfigRef" :position="pageConfig.formData" :menuList="pageConfig.menuList"/>
</template>

<script>
import customSlider from '../engineComponents/customSlider.vue';
import customRadioGroup from '../engineComponents/customRadioGroup.vue';
import customInputCheck from '../engineComponents/customInputCheck.vue';
import customBtnGroup from '../engineComponents/customBtnGroup.vue';
import customNumberInput from '../engineComponents/customNumberInput.vue';
import quotationConfig from './quotationConfig.vue';
import { computed, defineComponent, inject, nextTick, reactive, ref, toRefs, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';

export default defineComponent({
  components: {
    customSlider,
    customRadioGroup,
    customInputCheck,
    customBtnGroup,
    customNumberInput,
    quotationConfig,
  },
  setup(props, context) {
    const route = useRoute();
    const router = useRouter();
    const config = inject('pageConfig', { formData: {}, list: [] });
    console.log(config);

    const quotationConfigRef = ref('');

    const pageConfig = reactive({
      menuList: [],
      menuLabelList: [],
      activeWidgetList: [],
      activeMenu: '',
      widgetRefMap: {}, // 每个菜单一个 []，存放这个菜单下的所有实例
    });

    const isFirstStep = computed(
      () => pageConfig.menuLabelList.indexOf(pageConfig.activeMenu) === 0
    );
    const isLastStep = computed(
      () =>
        pageConfig.menuLabelList.indexOf(pageConfig.activeMenu) ===
        pageConfig.menuLabelList.length - 1
    );

    // 收集组件
    const widgetRef = widgetInstance => {
      if (!widgetInstance) return;

      let widgetList = pageConfig.widgetRefMap[pageConfig.activeMenu];
      let widgetIdList = (widgetList || []).map(it => it.id);

      if (!widgetIdList.includes(widgetInstance.id)) {
        Array.isArray(pageConfig.widgetRefMap[pageConfig.activeMenu])
          ? pageConfig.widgetRefMap[pageConfig.activeMenu].push(widgetInstance)
          : (pageConfig.widgetRefMap[pageConfig.activeMenu] = []);
      }
    };

    const validaCurMenuWidget = widgetList => {
      console.log('校验表单');
      let validateRes = [];
      widgetList.forEach(widget => {
        widget.config.hide === true
          ? validateRes.push(widget)
          : validateRes.push(widget.validateFn());
      });

      console.log(validateRes);

      if (validateRes.includes(false)) return false; // 校验不通过
      return true; // 校验通过
    };

    let timer = ref(null);
    const menuClick = (menu, pass) => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => {
        if (!pass) {
          if (
            pageConfig.activeMenu !== '' &&
            pageConfig.menuLabelList.indexOf(menu.label) >
              pageConfig.menuLabelList.indexOf(pageConfig.activeMenu)
          ) {
            return;
          }
        }

        Object.assign(pageConfig, {
          activeMenu: menu.label,
          activeWidgetList: menu.widgetList,
          // activeWidgetList: menu.widgetList
          //   .filter(it => !(Reflect.has(it.config, 'hide')&&it.config.hide===true)),
        });
        console.log(pageConfig);
      }, 500);
    };

    watch(
      () => route.query.activeLabel,
      () => {
        pageConfig.menuList =
          config.list.find(it => it.label === route.query.activeLabel)?.menuList || [];
        pageConfig.menuLabelList = pageConfig.menuList.map(it => it.label);
        menuClick(pageConfig.menuList[0] || {}); // 初始化操作
      },
      {
        immediate: true,
      }
    );

    const quotationHandel = () => {
      // todo
      // 生成报价单
      console.log('生成报价单');
      console.log(pageConfig.menuList);
      quotationConfigRef.value.openQuotationDialog();
    };

    const prevHandel = () => {
      if (isFirstStep.value) {
        router.push({ path: '/' });
      } else {
        let activeMenuInx = pageConfig.menuLabelList.indexOf(pageConfig.activeMenu);
        menuClick(pageConfig.menuList[activeMenuInx - 1] || {});
      }
    };
    const nextHandel = () => {
      if (!isLastStep.value) {
        // 表单校验
        if (
          pageConfig.activeMenu !== '' &&
          !validaCurMenuWidget(pageConfig.widgetRefMap[pageConfig.activeMenu])
        ) {
          ElMessage({showClose: true,type:'error',message:'请把表单填写完整!'});
          return;
        }
        let activeMenuInx = pageConfig.menuLabelList.indexOf(pageConfig.activeMenu);
        menuClick(pageConfig.menuList[activeMenuInx + 1] || {}, true);

        console.log(pageConfig.menuList);
      }
    };

    return {
      widgetRef,
      pageConfig,
      menuClick,
      prevHandel,
      nextHandel,
      quotationHandel,
      isLastStep,
      quotationConfigRef,
    };
  },
});
</script>

<style lang="less" scoped>
.unify-view {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  > header {
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    font-weight: 700;
    text-align: center;
    .nav-item {
      border-bottom: 2px solid #fff;
      margin: 0 10px;
      &:hover {
        border-bottom: 2px solid #56bdbd;
      }
    }
    .active {
      border-bottom: 2px solid #56bdbd;
    }
  }
  > section {
    flex: 1;
    box-shadow: 0px 0px 12px rgba(0, 0, 0, 0.12);
    overflow: auto;
    padding: 5px 0;
  }
  > footer {
    text-align: center;
    padding: 1rem 0;
    .config-btn {
      border-radius: 500px !important;
      width: 150px !important;
      background: #56bdbd;
      color: #fff;
      &:hover {
        background: #0c2639;
      }
    }
    .config-btn-prev {
      border-radius: 500px !important;
      width: 150px !important;
      background: #fff;
      color: #000;
      border: 1px solid #0c2639;
      &:hover {
        border: 1px solid #56bdbd;
        color: #56bdbd;
      }
    }
  }
}
</style>
