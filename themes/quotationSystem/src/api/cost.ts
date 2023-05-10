/* eslint-disable @typescript-eslint/camelcase */
import { JSONFetch } from './CommonFetch';

interface Cost {
    isOutputGjLogo: boolean;    // 是否输出共济logo
    expireTime: string;    //	报价单有效期（yyyy/MM/dd）
    projectNo: string;    //	项目编号
    projectName: string;    //	项目名称
    agentName: string;    //	商务人员
    preSaleName: string;    //	售前技术
    customerInfo: string;    //	客户信息

    jgtdxtzkl: number;    //	机柜通道-系统折扣率
    upsxtzkl: number;    //	UPS-系统折扣率
    dcxtzkl: number;    //	电池-系统折扣率
    pdxtzkl: number;    //	配电-系统折扣率
    zlxtzkl: number;    //	制冷-系统折扣率
    jkxtzkl: number;    //	监控-系统折扣率
    bzfcxtzkl: number;    //	包装辅材-系统折扣率
    ybfzkl: number;    //	运保费-折扣率
    gcaztsfyzkl: number;    //	工程安装调试费用-折扣率

    bjqdscwd: string; // 报价清单输出维度(枚举：输出L2级清单，输出L2,L3级清单)
    isOutputInstallCost: boolean; // 输出安装费用明细清单
    isOutputShippingCost: boolean; // 输出运保费用明细清单
    isOutputCost: boolean; // 成本清单输出
}

interface Info {
    projectProvince: string; //	项目所在-省
    projectCity: string; //	项目所在-市
    projectArea: string; //	项目所在-区
    goodsType: string; //	选购产品类型(枚举：微模块数据中心、一体化柜数据中心)

    itgsl: number; // 所需IT柜数量
    itgdgfz: number; //	IT柜单柜负载
    jgsd: string; // IT机柜深度(mm)
    qzcbsl: number; // 是否配置轻载层板
    zzcbsl: number; // 是否配置重载层板
    lxdgsl: number; // L型导轨配置数量
    oneulxjsl: number; // 1U理线架配置数量
    tdpymlx: string; // 通道门类型
    tdlx: string; // 通道类型
    sfpzups: string; //	是否配置UPS
    upswz: string; // UPS安装位置
    upsryfs: string; //	UPS冗余方式
    sfyxdc: string; // 是否配置蓄电池
    upshbsj: number; //	UPS后备时间(分钟)
    xdcwz: string; // 蓄电池安装位置
    sfpzktcp: string; // 是否配置空调产品
    ktlx: string; // 空调产品选型
    sfpzwmkdz: string; // 是否配置微模块底座
    ktnwjczjj: number; // 空调内外机垂直距离
    ktnwjspjj: number; // 空调内外机水平距离
    sfpzzcjc: string; // 是否配置资产检测
    sfyxdcjc: string; // 是否配置蓄电池检查
    sxtgs: number; // 摄像头配置个数
    ccts: number; // 视频存储时间(天)
    xdwz: string; //相对位置

    isSetLeakMonitor: boolean; // 是否配置漏水检测
    isSetBatteryMonitor: boolean; // 是否配置蓄电池检测
    isSetFireMonitor: boolean; // 是否配置消防检测
    isSetVideoMonitor: boolean; // 是否配置视频检测
    ythgpzts: number; // 一体化柜配置套数
    xdczzs: number; // 蓄电池总组数
    xdczjs: number; // 蓄电池总节数
}
export const doCost = (params: Cost & Info) => JSONFetch({ method: 'post', url: '/api/v1/doCost', data: params });
