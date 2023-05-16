<template>
  <common-dialog
    v-if="isShowDialog"
    title="导出报价单"
    width="1000px"
    @handle-cancel="isShowDialog = false"
  >
    <template #content>
      <div class="quotation-view">
        <el-form
          label-position="left"
          label-width="180px"
          :model="quotationFormConfig.form"
        >
          <el-row v-for="item in quotationFormConfig.widgets" :key="item">
            <el-col
              v-for="w in item.widgetList"
              :key="w.id"
              :span="w.layout.span"
              :offset="w.layout.offset"
            >
              <el-form-item :label="w.label" :style="w.layout.item">
                <!-- line -->
                <div v-if="w.formItemType === 'line'" :style="w.style"></div>
                <!-- switch -->
                <el-switch
                  v-if="w.formItemType === 'switch'"
                  v-model="quotationFormConfig.form[w.prop]"
                  class="ml-2"
                  size="small"
                  style="
                    --el-switch-on-color: #13ce66;
                    --el-switch-off-color: #ff4949;
                  "
                />
                <!-- date-picker -->
                <el-date-picker
                  v-if="w.formItemType === 'date-picker'"
                  style="width: 170px"
                  size="small"
                  v-model="quotationFormConfig.form[w.prop]"
                  type="date"
                  :placeholder="w.placeholder"
                  format="YYYY-MM-DD"
                  value-format="YYYY/MM/DD"
                />
                <!-- inpput -->
                <el-input
                  v-if="w.formItemType === 'input'"
                  style="width: 170px"
                  size="small"
                  :placeholder="w.placeholder"
                  v-model="quotationFormConfig.form[w.prop]"
                />
                <!-- input-number -->
                <el-input-number
                  v-if="w.formItemType === 'input-number'"
                  size="small"
                  v-model="quotationFormConfig.form[w.prop]"
                  :min="w.min"
                  :max="w.max"
                  :step="w.step"
                  :precision="w.precision"
                />
                <!-- radio-button -->
                <el-radio-group
                  v-model="quotationFormConfig.form[w.prop]"
                  size="small"
                >
                  <el-radio-button
                    v-for="op in w.options"
                    :key="op.value"
                    :label="op.value"
                    >{{ op.label }}</el-radio-button
                  >
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div style="text-align: center; padding-top: 20px">
          <el-button
            class="config-btn"
            size="large"
            @click="onGeneroateQuotation"
            >生成报价单</el-button
          >
        </div>
      </div>
    </template>
  </common-dialog>
</template>

<script>
import {
  defineComponent,
  inject,
  reactive,
  toRefs,
  watch,
  watchEffect,
  computed,
  ref,
} from "vue";
import { useRouter ,useRoute} from "vue-router";
import { ElMessage } from "element-plus";
import CommonDialog from "@/view/common/CommonDialog";
import { doCost } from "@/api/cost";
import axios from 'axios';

export default defineComponent({
  name: "QuotationConfig",
  props: {
    menuList: Array,
    position: Object,
  },
  components: { CommonDialog },
  setup(props) {
    const route = useRoute();
    let isShowDialog = ref(false);

    const quotationFormConfig = reactive({
      form: {
        isOutputGjLogo: true,
        expireTime: "",
        projectNo: "",
        projectName: "",
        agentName: "",
        preSaleName: "",
        customerInfo: "",
        jgtdxtzkl: 0.3,
        jkxtzkl: 0.3,
        upsxtzkl: 0.3,
        bzfcxtzkl: 0.3,
        dcxtzkl: 0.3,
        ybfzkl: 0.3,
        pdxtzkl: 0.3,
        gcaztsfyzkl: 0.3,
        zlxtzkl: 0.3,
        bjqdscwd: "",
        isOutputShippingCost: true,
        isOutputInstallCost: true,
        isOutputCost: true,
      },
      widgets: [
        {
          widgetList: [
            {
              id: "1919191",
              formItemType: "switch",
              label: "是否输出共济logo",
              prop: "isOutputGjLogo",
              layout: {
                span: 12,
              },
            },
            {
              id: "181818",
              formItemType: "date-picker",
              label: "报价单有效期至",
              prop: "expireTime",
              placeholder: "请选择日期",
              layout: {
                span: 12,
              },
            },
            {
              id: "171717",
              formItemType: "input",
              label: "项目编号",
              prop: "projectNo",
              placeholder: "请从erp复制",
              layout: {
                span: 12,
              },
            },
            {
              id: "1616161",
              formItemType: "input",
              label: "项目名称",
              prop: "projectName",
              placeholder: "请输入",
              layout: {
                span: 12,
              },
            },
            {
              id: "151515",
              formItemType: "input",
              label: "商务人员",
              prop: "agentName",
              placeholder: "请输入",
              layout: {
                span: 12,
              },
            },
            {
              id: "141414",
              formItemType: "input",
              label: "售前技术人员",
              prop: "preSaleName",
              placeholder: "请输入",
              layout: {
                span: 12,
              },
            },
            {
              id: "141414",
              formItemType: "input",
              label: "客户信息",
              prop: "customerInfo",
              placeholder: "请输入",
              layout: {
                span: 12,
              },
            },
            {
              id: "87651212",
              formItemType: "line",
              style: "border: 1px solid rgb(238, 238, 238);margin-left: -180px",
              layout: {
                span: 23,
                item: "height: 0;",
              },
            },
          ],
        },
        {
          widgetList: [
            {
              id: "131313",
              formItemType: "input-number",
              label: "机柜通道系统折扣率",
              prop: "jgtdxtzkl",
              precision: 2,
              step: 0.1,
              min: 0.3,
              max: 1,
              layout: {
                span: 12,
              },
            },
            {
              id: "121212",
              formItemType: "input-number",
              label: "监控系统折扣率",
              prop: "jkxtzkl",
              precision: 2,
              step: 0.1,
              min: 0.3,
              max: 1,
              layout: {
                span: 12,
              },
            },
            {
              id: "111111",
              formItemType: "input-number",
              label: "UPS统折扣率",
              prop: "upsxtzkl",
              precision: 2,
              step: 0.1,
              min: 0.3,
              max: 1,
              layout: {
                span: 12,
              },
            },
            {
              id: "1010101",
              formItemType: "input-number",
              label: "包装辅材系统折扣率",
              prop: "bzfcxtzkl",
              precision: 2,
              step: 0.1,
              min: 0.3,
              max: 1,
              layout: {
                span: 12,
              },
            },
            {
              id: "999",
              formItemType: "input-number",
              label: "电池系统折扣率",
              prop: "dcxtzkl",
              precision: 2,
              step: 0.1,
              min: 0.3,
              max: 1,
              layout: {
                span: 12,
              },
            },
            {
              id: "888",
              formItemType: "input-number",
              label: "运保费折扣率",
              prop: "ybfzkl",
              precision: 2,
              step: 0.1,
              min: 0.3,
              max: 1,
              layout: {
                span: 12,
              },
            },
            {
              id: "777",
              formItemType: "input-number",
              label: "配电系统折扣率",
              prop: "pdxtzkl",
              precision: 2,
              step: 0.1,
              min: 0.3,
              max: 1,
              layout: {
                span: 12,
              },
            },
            {
              id: "666",
              formItemType: "input-number",
              label: "工程安装调试费用折扣率",
              prop: "gcaztsfyzkl",
              precision: 2,
              step: 0.1,
              min: 0.3,
              max: 1,
              layout: {
                span: 12,
              },
            },
            {
              id: "555",
              formItemType: "input-number",
              label: "制冷系统折扣率",
              prop: "zlxtzkl",
              precision: 2,
              step: 0.1,
              min: 0.3,
              max: 1,
              layout: {
                span: 12,
              },
            },
            {
              id: "56785456",
              formItemType: "line",
              style: "border: 1px solid rgb(238, 238, 238);margin-left: -180px",
              layout: {
                span: 23,
                item: "height: 0;",
              },
            },
          ],
        },
        {
          widgetList: [
            {
              id: "444",
              formItemType: "radio-button",
              label: "报价清单输出维度",
              prop: "bjqdscwd",
              options: [
                { label: "输出L2级清单", value: "输出L2级清单" },
                { label: "输出L2,L3级清单", value: "输出L2，L3级清单" },
              ],
              layout: {
                span: 12,
              },
            },
            {
              id: "333",
              formItemType: "radio-button",
              label: "输出运保费用明细清单",
              prop: "isOutputShippingCost",
              options: [
                { label: "输出", value: true },
                { label: "不输出", value: false },
              ],
              layout: {
                span: 12,
                offset: 0,
              },
            },
            {
              id: "222",
              formItemType: "radio-button",
              label: "输出安装费用明细清单",
              prop: "isOutputInstallCost",
              options: [
                { label: "输出", value: true },
                { label: "不输出", value: false },
              ],
              layout: {
                span: 12,
              },
            },
            {
              id: "111",
              formItemType: "radio-button",
              label: "成本清单输出",
              prop: "isOutputCost",
              options: [
                { label: "输出", value: true },
                { label: "不输出", value: false },
              ],
              layout: {
                span: 12,
                offset: 0,
              },
            },
          ],
        },
      ],
    });

    // isTransformBlob:是否需要转成blob
    const fileDownload = (data, fileName, isTransformBlob) => {
      const el = document.createElement("a");
      el.download = `${fileName}`;
      el.style.display = "none";
      let urlBlob = null;
      if (isTransformBlob) {
        const blob = new Blob([data]);
        urlBlob = URL.createObjectURL(blob);
      } else {
        urlBlob = URL.createObjectURL(data);
      }
      el.href = urlBlob;
      document.body.appendChild(el);
      el.click();
      document.body.removeChild(el);
      URL.revokeObjectURL(urlBlob);
    };

    const onGeneroateQuotation = () => {
      console.log(props.menuList);
      console.log(quotationFormConfig.form);

      let menuListForm = {};
      props.menuList.forEach((it) => {
        it.widgetList.reduce((obj, curr) => {
          let { name, value, type } = curr.config.formMap;
          obj[name] = type === "number" ? Number(value) : value;
          return obj;
        }, menuListForm);
      });

      let params = Object.assign(
        {},
        props.position,
        menuListForm,
        quotationFormConfig.form
      );

      const {userId,userName} = route.query;
      axios
        .post(`/customApi/v1/doCost?userId=${userId}&userName=${userName}`, params, { responseType: "blob" })
        .then(
          (res) => {
            if (res.status === 200 && res.data.size > 0) {
              let name = res.headers["content-disposition"].match(/fileName=(.*)/)[1];
              name = name.replace(new RegExp('"', 'g'), '');
              console.log('--decodeURI(name)--');
              console.log(decodeURI(name));
              console.log('--decodeURI(name)--');
              fileDownload(res.data, decodeURI(name), false);
            } else {
              ElMessage({showClose: true,type:'error',message: res?.data?.message || "下载失败！"});
            }
          },
          (err) => {
            ElMessage({showClose: true,type:'error',message:  "服务器异常！"});
          }
        )
        .finally(() => {
        });
    };

    const openQuotationDialog = () => {
      isShowDialog.value = true;
    };
    const closeQuotationDialog = () => {
      isShowDialog.value = false;
    };

    return {
      quotationFormConfig,
      onGeneroateQuotation,
      isShowDialog,
      openQuotationDialog,
      closeQuotationDialog,
    };
  },
});
</script>

<style lang="less" scoped>
.quotation-view {
  width: 100%;
  height: 100%;
  padding: 0.5rem 0.5rem 0.5rem 2rem;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

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

::v-deep(.el-form-item) {
  display: flex;
  margin-bottom: 10px;
}
::v-deep(.el-input-number--small) {
  width: 8.5rem;
  line-height: 1.5rem;
}

::v-deep(.el-radio-button--small .el-radio-button__inner) {
  width: 115px;
  padding: 0.45rem 0px;
  display: inline-block;
}
::v-deep(.el-switch.is-checked .el-switch__core .el-switch__action) {
  left: 100%;
  margin-left: calc(-15px - 0.05rem);
}
</style>
