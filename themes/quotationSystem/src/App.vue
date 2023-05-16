<template>
  <header class="logoBar"></header>
  <section class="content">
    <router-view />
  </section>
</template>

<script>
import { defineComponent, provide, reactive, toRefs, watch } from "vue";
export default defineComponent({
  setup() {
    const pageConfig = reactive({
      formData: {
        projectProvince: "",
        projectCity: "",
        projectArea: "",
        goodsType: "微模块数据中心",
      },
      list: [
        {
          label: "微模块数据中心",
          imgUrl: require('./img/u665.jpg').default,
          menuList: [
            {
              label: "机柜通道系统",
              widgetList: [
                {
                  type: "CustomSlider",
                  id: "123216541121231",
                  config: {
                    formMap: {
                      name: "itgsl",
                      value: 5,
                      type: "number",
                    },
                    customValida: {
                      codeString: `
                        if({{itgsl}} * {{itgdgfz}} >= 250){
                          ElMessage.warning('IT柜数量 * IT单柜功率 要小于 250，请重新选择');
                          setTimeout(()=>{
                            ##itgsl##.config.formMap.value = ##itgsl##.config.min;
                          },300);
                          return;
                        }
                      `,
                    },
                    min: 5,
                    max: 36,
                    step: 1,
                    tips: "aaa",
                    label: "所需IT柜数量",
                    defaultVal: 20,
                  },
                },
                {
                  type: "CustomSlider",
                  id: "1232165322321121231",
                  config: {
                    formMap: {
                      name: "itgdgfz",
                      value: 3,
                      type: "number",
                    },
                    customValida: {
                      codeString: `if({{itgsl}} * {{itgdgfz}} >= 250){
                        ElMessage.warning('IT柜数量 * IT单柜功率 要小于 250，请重新选择');
                        setTimeout(()=>{
                          ##itgdgfz##.config.formMap.value = ##itgdgfz##.config.min;
                        },300);
                        return;
                      }`,
                    },
                    min: 3,
                    max: 10,
                    step: 1,
                    tips: "aaa",
                    label: "IT柜单柜负载",
                    defaultVal: 20,
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "2243443434321",
                  config: {
                    formMap: {
                      name: "jgsd",
                      value: "",
                    },
                    tips: "aaa",
                    label: "IT机柜深度(mm)",
                    options: [
                      { label: "1100", value: "1100" },
                      { label: "1200", value: "1200" },
                    ],
                  },
                },
                {
                  type: "CustomInputCheck",
                  id: "3323241",
                  config: {
                    formMap: {
                      name: "qzcbsl",
                      value: "",
                      type: "number",
                    },
                    tips: "aaa",
                    label: "是否配置轻载层板",
                    placeholder: "配置数量",
                  },
                },
                {
                  type: "CustomInputCheck",
                  id: "5623423423",
                  config: {
                    formMap: {
                      name: "zzcbsl",
                      value: "",
                      type: "number",
                    },
                    tips: "aaa",
                    label: "是否配置重载层板",
                    placeholder: "配置数量",
                  },
                },
                {
                  type: "CustomInputCheck",
                  id: "65422342",
                  config: {
                    formMap: {
                      name: "lxdgsl",
                      value: "",
                      type: "number",
                    },
                    tips: "aaa",
                    label: "L型导轨配置数量",
                    placeholder: "配置数量",
                  },
                },
                {
                  type: "CustomInputCheck",
                  id: "8765423",
                  config: {
                    formMap: {
                      name: "oneulxjsl",
                      value: "",
                      type: "number",
                    },
                    tips: "aaa",
                    label: "1U理线架配置数量",
                    placeholder: "配置数量",
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "111245312132",
                  config: {
                    formMap: {
                      name: "tdpymlx",
                      value: "",
                    },
                    tips: "aaa",
                    label: "通道门类型",
                    options: [
                      { label: "手动平移门", value: "手动平移门" },
                      { label: "自动平移门", value: "自动平移门" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "2443321121",
                  config: {
                    formMap: {
                      name: "tdlx",
                      value: "",
                    },
                    tips: "aaa",
                    label: "通道类型",
                    options: [
                      { label: "单通道", value: "单通道" },
                      { label: "双通道", value: "双通道" },
                    ],
                  },
                },
              ],
            },
            {
              label: "配电系统",
              widgetList: [
                {
                  type: "CustomRadioGroup",
                  id: "65423422",
                  config: {
                    formMap: {
                      name: "sfpzups",
                      value: "",
                    },
                    customValida: {
                      codeString: `if({{sfpzups}} === '配置'){
                        setTimeout(()=>{
                          ##upswz##.config.hide = false;
                          ##upsryfs##.config.hide = false;
                        },300);
                      }else{
                        setTimeout(()=>{
                          ##upswz##.config.hide = true;
                          ##upsryfs##.config.hide = true;
                          ##upswz##.config.formMap.value='';
                          ##upsryfs##.config.formMap.value='';
                        },300);
                      }`,
                    },
                    tips: "aaa",
                    label: "是否配置UPS",
                    options: [
                      { label: "配置", value: "配置" },
                      { label: "不配置", value: "不配置" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "65654232",
                  config: {
                    formMap: {
                      name: "upswz",
                      value: "",
                    },
                    hide: true,
                    tips: "aaa",
                    label: "UPS安装位置",
                    options: [
                      { label: "微模块内部", value: "微模块内部" },
                      { label: "微模块外部", value: "微模块外部" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "651234232",
                  config: {
                    formMap: {
                      name: "upsryfs",
                      value: "",
                    },
                    hide: true,
                    tips: "aaa",
                    label: "UPS冗余方式",
                    options: [
                      { label: "功率模块冗余", value: "功率模块冗余" },
                      { label: "整机冗余", value: "整机冗余" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "8765654232",
                  config: {
                    formMap: {
                      name: "sfyxdc",
                      value: "",
                    },
                    customValida: {
                      codeString: `if({{sfyxdc}} === '配置'){
                        if({{itgsl}} * {{itgdgfz}} <= 25){
                          setTimeout(()=>{
                            ##xdcwz##.config.hide = false;
                          },300);
                        }
                        setTimeout(()=>{
                            ##upshbsj##.config.hide = false;
                        },300);
                      }else{
                        setTimeout(()=>{
                          ##upshbsj##.config.hide = true;
                          ##upshbsj##.config.formMap.value='';
                          ##xdcwz##.config.hide = true;
                          ##xdcwz##.config.formMap.value='';
                        },300);
                      }`,
                    },
                    tips: "aaa",
                    label: "是否配置蓄电池",
                    options: [
                      { label: "配置", value: "配置" },
                      { label: "不配置", value: "不配置" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "876565765444232",
                  config: {
                    formMap: {
                      name: "upshbsj",
                      value: "",
                      type: "number",
                    },
                    customValida: {
                      codeString: `
                        if(
                          ({{itgsl}} * {{itgdgfz}} <= 25) ||
                          ({{itgsl}} * {{itgdgfz}} > 25 && {{itgsl}} * {{itgdgfz}} <= 30 && ['30','60'].includes({{upshbsj}})) ||
                          ({{itgsl}} * {{itgdgfz}} > 30 && {{itgsl}} * {{itgdgfz}} <= 60 && ['30'].includes({{upshbsj}}))
                        ){
                          ##xdcwz##.config.hide = false;
                        }else{
                          ##xdcwz##.config.hide = true;
                          ##xdcwz##.config.formMap.value='';
                        }

                        let condition = [];
                        if({{itgsl}} * {{itgdgfz}} >= 240){
                          condition = [
                            { label: '30', value: '30' },
                            { label: '60', value: '60' },
                          ];
                        }else if({{itgsl}} * {{itgdgfz}} >= 145){
                          condition = [
                            { label: '30', value: '30' },
                          ];
                        }else{
                          condition = [
                            { label: '30', value: '30' },
                            { label: '60', value: '60' },
                            { label: '120', value: '120' },
                          ];
                        }
                        ##upshbsj##.config.options = condition;
                        ##upshbsj##.config.formMap.value='';
                      `,
                    },
                    hide: true,
                    tips: "aaa",
                    label: "UPS后备时间(分钟)",
                    options: [
                      { label: "30", value: "30" },
                      { label: "60", value: "60" },
                      { label: "120", value: "120" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "876999565765444232",
                  config: {
                    formMap: {
                      name: "xdcwz",
                      value: "",
                    },
                    hide: true,
                    tips: "aaa",
                    label: "蓄电池安装位置",
                    options: [
                      { label: "微模块内部", value: "微模块内部" },
                      { label: "微模块外部", value: "微模块外部" },
                    ],
                  },
                },
              ],
            },
            {
              label: "空调系统",
              widgetList: [
                {
                  type: "CustomRadioGroup",
                  id: "8765657654232",
                  config: {
                    formMap: {
                      name: "sfpzktcp",
                      value: "",
                    },
                    customValida: {
                      codeString: `if({{sfpzktcp}} === '配置'){
                        setTimeout(()=>{
                          ##ktlx##.config.hide = false;
                          ##ktnwjczjj##.config.hide = false;
                          ##ktnwjspjj##.config.hide = false;
                        },300);
                      }else{
                        setTimeout(()=>{
                          ##ktlx##.config.hide = true;
                          ##ktnwjczjj##.config.hide = true;
                          ##ktnwjspjj##.config.hide = true;
                          ##ktlx##.config.formMap.value='';
                          ##ktnwjczjj##.config.formMap.value='';
                          ##ktnwjspjj##.config.formMap.value='';
                        },300);
                      }`,
                    },
                    tips: "aaa",
                    label: "是否配置空调产品",
                    options: [
                      { label: "配置", value: "配置" },
                      { label: "不配置", value: "不配置" },
                    ],
                  },
                },
                {
                  type: "CustomBtnGroup",
                  id: "54238765256",
                  config: {
                    formMap: {
                      name: "ktlx",
                      value: "",
                    },
                    customValida: {
                      codeString: `if(['恒温恒湿底座空调','单冷底座空调'].includes({{ktlx}})){
                        setTimeout(()=>{
                          ##sfpzwmkdz##.config.disable = true;
                          ##sfpzwmkdz##.config.formMap.value='配置';
                        },300);
                      }else if(['恒温恒湿列间空调','单冷列间空调'].includes({{ktlx}})){
                        setTimeout(()=>{
                          ##sfpzwmkdz##.config.disable = false;
                          ##sfpzwmkdz##.config.formMap.value='';
                        },300);
                      }`,
                    },
                    hide: true,
                    tips: "aaa",
                    label: "空调产品选型",
                    options: [
                      { label: "恒温恒湿列间空调", value: "恒温恒湿列间空调" },
                      { label: "单冷列间空调", value: "单冷列间空调" },
                      { label: "恒温恒湿底座空调", value: "恒温恒湿底座空调" },
                      { label: "单冷底座空调", value: "单冷底座空调" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "876565765654232",
                  config: {
                    formMap: {
                      name: "sfpzwmkdz",
                      value: "",
                    },
                    tips: "aaa",
                    label: "是否配置微模块底座",
                    options: [
                      { label: "配置", value: "配置" },
                      { label: "不配置", value: "不配置" },
                    ],
                  },
                },
                {
                  type: "CustomNumberInput",
                  id: "87656576543654232",
                  config: {
                    formMap: {
                      name: "ktnwjczjj",
                      value: 0,
                      type: "number",
                    },
                    hide: true,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 20,
                    tips: "aaa",
                    label: "空调内外机垂直距离",
                  },
                },
                {
                  type: "CustomNumberInput",
                  id: "8765432165654232",
                  config: {
                    formMap: {
                      name: "ktnwjspjj",
                      value: 0,
                      type: "number",
                    },
                    hide: true,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 60,
                    tips: "aaa",
                    label: "空调内外机水平距离",
                  },
                },
              ],
            },
            {
              label: "监控系统",
              widgetList: [
                {
                  type: "CustomRadioGroup",
                  id: "76523422",
                  config: {
                    formMap: {
                      name: "sfpzzcjc",
                      value: "",
                    },
                    tips: "aaa",
                    label: "是否配置资产检测",
                    options: [
                      { label: "配置", value: "配置" },
                      { label: "不配置", value: "不配置" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "0987622",
                  config: {
                    formMap: {
                      name: "isSetBatteryMonitor",
                      value: "",
                    },
                    customValida: {
                      codeString: `if({{sfyxdc}} === '不配置' && {{isSetBatteryMonitor}} == true){
                        ##xdczzs##.config.hide = false;
                        ##xdczjs##.config.hide = false;
                      }else{
                        setTimeout(()=>{
                          ##xdczzs##.config.hide = true;
                          ##xdczjs##.config.hide = true;
                          ##xdczzs##.config.formMap.value='';
                          ##xdczjs##.config.formMap.value='';
                        },100);
                      }`,
                    },
                    tips: "aaa",
                    label: "是否配置蓄电池检测",
                    options: [
                      { label: "配置", value: true },
                      { label: "不配置", value: false },
                    ],
                  },
                },
                {
                  type: "CustomNumberInput",
                  id: "872222656576543654232",
                  config: {
                    formMap: {
                      name: "xdczzs",
                      value: 0,
                      type: "number",
                    },
                    hide: true,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 100,
                    tips: "aaa",
                    label: "蓄电池总组数",
                  },
                },
                {
                  type: "CustomNumberInput",
                  id: "8765657444446543654232",
                  config: {
                    formMap: {
                      name: "xdczjs",
                      value: 0,
                      type: "number",
                    },
                    hide: true,
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 100,
                    tips: "aaa",
                    label: "蓄电池总节数",
                  },
                },
                {
                  type: "CustomSlider",
                  id: "12321112129992331",
                  config: {
                    formMap: {
                      name: "sxtgs",
                      value: 1,
                      type: "number",
                    },
                    customValida: {
                      // ##name## => 获取这个组件的配置
                      codeString: `
                        let condition = [];
                        if({{sxtgs}}<=10){
                          condition = [
                            { label: '15', value: '15' },
                            { label: '30', value: '30' },
                            { label: '60', value: '60' },
                            { label: '90', value: '90' },
                            { label: '120', value: '120' },
                            { label: '180', value: '180' },
                          ];
                        }else if({{sxtgs}}>=11&&{{sxtgs}}<=16){
                          condition = [
                            { label: '15', value: '15' },
                            { label: '30', value: '30' },
                            { label: '60', value: '60' },
                            { label: '90', value: '90' },
                            { label: '120', value: '120' },
                          ];
                        }else if({{sxtgs}}>=17&&{{sxtgs}}<=21){
                          condition = [
                            { label: '15', value: '15' },
                            { label: '30', value: '30' },
                            { label: '60', value: '60' },
                            { label: '90', value: '90' },
                          ];
                        }else if({{sxtgs}}>=22&&{{sxtgs}}<=32){
                          condition = [
                            { label: '15', value: '15' },
                            { label: '30', value: '30' },
                            { label: '60', value: '60' },
                          ];
                        }
                        ##ccts##.config.options = condition;
                        ##ccts##.config.formMap.value='';
                      `,
                    },
                    min: 1,
                    max: 32,
                    step: 1,
                    tips: "aaa",
                    label: "摄像头配置个数",
                    defaultVal: 20,
                  },
                },
                {
                  type: "CustomBtnGroup",
                  id: "5423256",
                  config: {
                    formMap: {
                      name: "ccts",
                      value: "",
                      type: "number",
                    },
                    tips: "aaa",
                    label: "视频存储时间(天)",
                    options: [
                      { label: "15", value: "15" },
                      { label: "30", value: "30" },
                      { label: "60", value: "60" },
                      { label: "90", value: "90" },
                      { label: "120", value: "120" },
                      { label: "180", value: "180" },
                    ],
                  },
                },
              ],
            },
          ],
        },
        {
          label: "一体化柜数据中心",
          imgUrl: require('./img/u666.png').default,
          menuList: [
            {
              label: "机柜系统",
              widgetList: [
                {
                  type: "CustomSlider",
                  id: "123211122455551231",
                  config: {
                    formMap: {
                      name: "itgsl",
                      value: 0,
                      type: "number",
                    },
                    customValida: {
                      codeString: `
                        if({{itgsl}}>=0 && {{itgsl}}<=5){
                          ##itgdgfz##.config.min = 2;
                          ##itgdgfz##.config.max = 5;
                          ##itgdgfz##.config.formMap.value = 5;
                        }else if({{itgsl}}>=6 && {{itgsl}} <=7){
                          ##itgdgfz##.config.min = 2;
                          ##itgdgfz##.config.max = 4;
                          ##itgdgfz##.config.formMap.value = 4;
                        }else{
                          ##itgdgfz##.config.min = 2;
                          ##itgdgfz##.config.max = 3;
                          ##itgdgfz##.config.formMap.value = 3;
                        }
                      `,
                    },
                    min: 0,
                    max: 9,
                    step: 1,
                    tips: "aaa",
                    label: "所需IT柜数量",
                    defaultVal: 20,
                  },
                },
                {
                  type: "CustomSlider",
                  id: "123211121231",
                  config: {
                    formMap: {
                      name: "itgdgfz",
                      value: "",
                    },
                    min: 2,
                    max: 5,
                    step: 1,
                    tips: "aaa",
                    label: "IT柜单柜负载",
                    defaultVal: 20,
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "0988767622",
                  config: {
                    formMap: {
                      name: "itglx",
                      value: "",
                    },
                    tips: "aaa",
                    label: "机柜类型",
                    options: [
                      { label: "标准机柜", value: "标准机柜" },
                      { label: "智慧机柜", value: "智慧机柜" },
                    ],
                  },
                },
              ],
            },
            {
              label: "配电系统",
              widgetList: [
                {
                  type: "CustomRadioGroup",
                  id: "9887676547622",
                  config: {
                    formMap: {
                      name: "sfpzups",
                      value: "",
                    },
                    tips: "aaa",
                    label: "是否配置UPS",
                    options: [
                      { label: "配置", value: "配置" },
                      { label: "不配置", value: "不配置" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "76543465432",
                  config: {
                    formMap: {
                      name: "sfyxdc",
                      value: "",
                    },
                    customValida: {
                      codeString: `
                        if({{sfyxdc}} === '配置'){
                          ##upshbsj##.config.hide = false;
                        }else if({{sfyxdc}} === '不配置'){
                          ##upshbsj##.config.formMap.value = '';
                          ##upshbsj##.config.hide = true;
                        }
                      `,
                    },
                    tips: "aaa",
                    label: "是否配置蓄电池",
                    options: [
                      { label: "配置", value: "配置" },
                      { label: "不配置", value: "不配置" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "876565765753444232",
                  config: {
                    formMap: {
                      name: "upshbsj",
                      value: "",
                    },
                    hide: true,
                    tips: "aaa",
                    label: "UPS后备时间(分钟)",
                    options: [
                      { label: "15", value: "15" },
                      { label: "30", value: "30" },
                      { label: "60", value: "60" },
                      { label: "120", value: "120" },
                    ],
                  },
                },
              ],
            },
            {
              label: "空调系统",
              widgetList: [
                {
                  type: "CustomBtnGroup",
                  id: "5423256",
                  config: {
                    formMap: {
                      name: "ktlx",
                      value: "",
                    },
                    tips: "aaa",
                    label: "空调产品选型",
                    options: [
                      { label: "恒温恒湿型", value: "恒温恒湿型" },
                      { label: "恒温型", value: "恒温型" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "567767622",
                  config: {
                    formMap: {
                      name: "xdwz",
                      value: "",
                    },
                    customValida: {
                      codeString: `
                        if({{xdwz}} === '正落差'){
                          ##ktnwjczjj##.config.max = 15;
                          ##ktnwjczjj##.config.hide = true;
                          setTimeout(()=>{
                            ##ktnwjczjj##.config.hide = false;
                          },100);
                        }else if({{xdwz}} === '负落差'){
                          ##ktnwjczjj##.config.max = 20;
                          ##ktnwjczjj##.config.hide = true;
                          setTimeout(()=>{
                            ##ktnwjczjj##.config.hide = false;
                          },100);
                        }
                        if({{xdwz}} === '正落差'&&Number({{ktnwjczjj}})>15){
                          ##ktnwjczjj##.config.formMap.value = 15;
                        }else if({{xdwz}} === '负落差'&&Number({{ktnwjczjj}})>20){
                          ##ktnwjczjj##.config.formMap.value = 20;
                        }
                      `,
                    },
                    tips: "aaa",
                    label: "相对位置",
                    options: [
                      { label: "正落差", value: "正落差" },
                      { label: "负落差", value: "负落差" },
                    ],
                  },
                },
                {
                  type: "CustomNumberInput",
                  id: "879876565654232",
                  config: {
                    formMap: {
                      name: "ktnwjczjj",
                      value: "",
                    },
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 20,
                    tips: "aaa",
                    label: "空调内外机垂直距离",
                  },
                },
                {
                  type: "CustomNumberInput",
                  id: "4565654232",
                  config: {
                    formMap: {
                      name: "ktnwjspjj",
                      value: "",
                    },
                    precision: 0,
                    step: 1,
                    min: 0,
                    max: 50,
                    tips: "aaa",
                    label: "空调内外机水平距离",
                  },
                },
              ],
            },
            {
              label: "监控系统",
              widgetList: [
                {
                  type: "CustomRadioGroup",
                  id: "111113232121",
                  config: {
                    formMap: {
                      name: "sfpzzcjc",
                      value: "",
                    },
                    tips: "aaa",
                    label: "是否配置资产检测",
                    options: [
                      { label: "配置", value: "配置" },
                      { label: "不配置", value: "不配置" },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "45452312123131231",
                  config: {
                    formMap: {
                      name: "isSetLeakMonitor",
                      value: "",
                    },
                    tips: "aaa",
                    label: "是否配置漏水检测",
                    options: [
                      { label: "配置", value: true },
                      { label: "不配置", value: false },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "22238888523232",
                  config: {
                    formMap: {
                      name: "isSetBatteryMonitor",
                      value: "",
                    },
                    tips: "aaa",
                    label: "是否配置蓄电池检测",
                    options: [
                      { label: "配置", value: true },
                      { label: "不配置", value: false },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "2611126853",
                  config: {
                    formMap: {
                      name: "isSetFireMonitor",
                      value: "",
                    },
                    tips: "aaa",
                    label: "是否配置消防检测",
                    options: [
                      { label: "配置", value: true },
                      { label: "不配置", value: false },
                    ],
                  },
                },
                {
                  type: "CustomRadioGroup",
                  id: "012435988767622",
                  config: {
                    formMap: {
                      name: "isSetVideoMonitor",
                      value: "",
                    },
                    customValida: {
                      codeString: `
                        if({{isSetVideoMonitor}} == true){
                            ##sxtgs##.config.hide = false;
                        }else if({{isSetVideoMonitor}} == false){
                          ##sxtgs##.config.hide = true;
                        }
                      `,
                    },
                    tips: "aaa",
                    label: "是否配置视频检测",
                    options: [
                      { label: "配置", value: true },
                      { label: "不配置", value: false },
                    ],
                  },
                },
                {
                  type: "CustomNumberInput",
                  id: "4565654232",
                  config: {
                    formMap: {
                      name: "sxtgs",
                      value: "",
                    },
                    tips: "aaa",
                    label: "摄像头配置个数",
                  },
                },
                {
                  type: "CustomNumberInput",
                  id: "8886544677",
                  config: {
                    formMap: {
                      name: "ythgpzts",
                      value: "",
                      type: "number",
                    },
                    tips: "aaa",
                    label: "一体化柜配置套数",
                  },
                },
              ],
            },
          ],
        },
      ],
    });

    provide("pageConfig", pageConfig);
  },
});
</script>

<style lang="less">
html,
body,
#app {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
.logoBar {
  height: 40px;
  text-align: center;
  background: dimgray;
  background-image: url("./img/logo.png");
  background-repeat: no-repeat;
  background-size: 150px;
  background-position-x: 50%;
  background-position-y: 6px;
}
.content {
  height: calc(100% - 40px);
}
</style>
