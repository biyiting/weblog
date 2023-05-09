<template>
  <div class="config-view">
    <header>
      <div class="position">
        <label class="label">省</label>
        <el-select v-model="positionForm.projectProvince" size="small">
          <el-option
            v-for="item in provinceOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <label class="label">市</label>
        <el-select v-model="positionForm.projectCity" size="small">
          <el-option
            v-for="item in cityOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>

        <label class="label">区</label>
        <el-select v-model="positionForm.projectArea" size="small">
          <el-option
            v-for="item in areaOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
    </header>
    <section class="section">
      <div class="config-title">选购产品类型</div>
      <div class="config-box">
        <label
          v-for="item in config.list"
          :key="item.label"
          @click="checkHandel(item)"
          :class="{
            active: item.label === positionForm.goodsType,
            'config-item': true,
          }"
          >{{ item.label }}</label
        >
      </div>
      <div style="flex: 1">
        <el-image :src="getActiveImg" fit="fill" />
      </div>
    </section>
    <footer class="footer">
      <el-button class="config-btn" size="large" @click="startConfigHandel"
        >开始配置</el-button
      >
    </footer>
  </div>
</template>

<script>
import { regionData, CodeToText, TextToCode } from "element-china-area-data";
import {
  defineComponent,
  inject,
  reactive,
  toRefs,
  watch,
  watchEffect,
  computed,
} from "vue";
import { useRouter, useRoute } from "vue-router";
import { ElMessage } from "element-plus";

export default defineComponent({
  name: "Main",
  setup() {
    const pageConfig = inject("pageConfig", { formData: {}, list: [] });
    const router = useRouter();
    const route = useRoute();

    const positionOptions = reactive({
      provinceOptions: regionData,
      cityOptions: [],
      areaOptions: [],
    });
    const positionForm = reactive({
      projectProvince: "",
      projectCity: "",
      projectArea: "",
      goodsType: "",
    });
    Object.assign(positionForm, pageConfig.formData);

    const config = reactive({
      list: pageConfig.list,
    });

    const getActiveImg = computed(() => {
      return (
        config.list.find((it) => it.label === positionForm.goodsType)?.imgUrl ||
        ""
      );
    });

    watch(
      () => positionForm.projectProvince,
      () => {
        positionOptions.cityOptions =
          regionData.find((it) => it.value === positionForm.projectProvince)
            ?.children || [];

        let currAllKeys = positionOptions.cityOptions.map((it) => it.value);
        if (
          positionForm.projectCity !== "" &&
          !currAllKeys.includes(positionForm.projectCity)
        ) {
          positionForm.projectCity = "";
        }
      },
      {
        immediate: true,
      }
    );
    watch(
      () => positionForm.projectCity,
      () => {
        positionOptions.areaOptions =
          positionOptions.cityOptions.find(
            (it) => it.value === positionForm.projectCity
          )?.children || [];

        let currAllKeys = positionOptions.areaOptions.map((it) => it.value);
        if (
          positionForm.projectArea !== "" &&
          !currAllKeys.includes(positionForm.projectArea)
        ) {
          positionForm.projectArea = "";
        }
      },
      {
        immediate: true,
      }
    );

    watchEffect(() => {
      pageConfig.formData = Object.assign({}, positionForm);
      console.log(pageConfig.formData);
    });

    const checkHandel = (item) => {
      positionForm.goodsType = item.label;
    };

    const startConfigHandel = () => {
      console.log(route.query);
      if (
        !positionForm.projectProvince ||
        !positionForm.projectCity ||
        !positionForm.projectArea
      ) {
        ElMessage({
          showClose: true,
          type: "error",
          message: "请选择省份信息!",
        });
        return;
      }

      Object.assign(pageConfig.formData, positionForm);
      const { userId, userName } = route.query;
      router.push({
        path: "/micromodule",
        query: { activeLabel: positionForm.goodsType, userId, userName },
      });
    };

    return {
      ...toRefs(positionOptions),
      positionForm,
      config,
      checkHandel,
      getActiveImg,
      startConfigHandel,
    };
  },
});
</script>

<style lang="less" scoped>
.config-view {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;

  > header {
    .position {
      text-align: center;
      display: flex;
      justify-content: center;
      padding: 10px 0;
    }
    .label {
      width: 30px;
      line-height: 30px;
    }
  }

  > section {
    flex: 1;
    overflow: auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    .config-title {
      line-height: 40px;
      font-size: 16px;
      font-weight: 800;
    }
    .config-box {
      padding: 5px 0 10px;
      .config-item {
        line-height: 1.5rem;
        margin: 0 0.5rem;
        font-size: 0.7rem;
        font-weight: 600;
        border: 2px solid #e9ebec;
        border-radius: 4px;
        padding: 10px 30px;
      }
      .config-item:hover {
        border: 2px solid #56bdbd;
      }
      .active {
        border: 2px solid #56bdbd;
      }
    }
    .el-image {
      position: relative;
      display: inline-block;
      overflow: hidden;
      margin-top: 10px;
      max-width: 30% !important;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      top: 50%;
    }
  }

  > footer {
    height: 2.5rem;
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
  }
}
</style>
