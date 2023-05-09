module.exports = function (app) {
  // home
  // app.post('/api/v1/xaidc/resource/resource/root/project_root/park', function(req, res) {
  //   console.log(req);
  //   res.json({
  //     status: 200,
  //     message: '操作成功！',
  //     data: [
  //       {
  //         resourceId: 'ca9a81554a9f4afd97510b44a16f81f4',
  //         parentId: 'project_root',
  //         name: '稻香湖',
  //         number: 'DX',
  //         location: 'project_root',
  //         spaceType: 2,
  //         responsibleDepartment: null,
  //         responsiblePerson: null,
  //         builtUpArea: 280000.0,
  //         area: 32112.0,
  //         roomDensity: null,
  //         roomModulesCount: 48,
  //         parkProductionTime: '2021-01-01 00:00:00',
  //         designStandards: null,
  //         designPueValue: 1.6,
  //         description:
  //           '稻香湖生产园区位于北京市海淀区中关村创新园内，占地面积约约200亩；其中IT机房楼三栋，机房按照国家标准（《数据中心设计规范》GB50174）A级机房设计和建设。',
  //         status: null,
  //         designCabinetNum: 9000,
  //         pcserverNum: 7,
  //         networkNum: 450,
  //         storageNum: 450,
  //         otherNum: 1350,
  //         cabinetCapacity: 4719,
  //         cabinetUsed: 437,
  //         cabinetFree: 4282,
  //         cabinetPreplace: 10,
  //         plannedCabinet: 447,
  //         notPlannedCabinet: 4272,
  //         safetyCapacity: null,
  //         powerCapacity: 0.0,
  //         powerUsed: 0.0,
  //         powerFree: 0.0,
  //         powerPreplace: 0.0,
  //         uCapacity: 201918,
  //         uUsed: 15595,
  //         uFree: 186323,
  //         uPreplace: 27,
  //         uReserved: 0,
  //         siteCapacity: 4919,
  //         siteUsed: 4919,
  //         siteFree: 0,
  //         pduCapacity: null,
  //         pduUsed: 0,
  //         pduFree: 0,
  //         routingModel: null,
  //         networkArea: null,
  //         orderNum: null,
  //         moduleUsag: null,
  //         techType: null,
  //         deviceAvgTime: null,
  //         installedCapacity: null,
  //         safeStartTime: '2021-08-25 00:00:00',
  //         createTime: '2021-07-07 17:25:00',
  //         deleted: 0,
  //         updateTime: '2021-10-15 18:48:31',
  //         extField: "{'test2':'女','test':'G','rrt':'2021-07-02','zzz':'123aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'}",
  //         extMap: {
  //           test2: '女',
  //           test: 'G',
  //           rrt: '2021-07-02',
  //           zzz: '123aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  //         },
  //         upreplace: 27,
  //         ureserved: 0,
  //         uused: 15595,
  //         ufree: 186323,
  //         ucapacity: 201918,
  //       },
  //       {
  //         resourceId: 'ee63299eb87f49269ebaf78a518fd2ae',
  //         parentId: 'project_root',
  //         name: '武汉南湖',
  //         number: 'WH',
  //         location: 'project_root',
  //         spaceType: 2,
  //         responsibleDepartment: null,
  //         responsiblePerson: null,
  //         builtUpArea: 66937.0,
  //         area: 20520.0,
  //         roomDensity: null,
  //         roomModulesCount: 54,
  //         parkProductionTime: '2014-01-01 00:00:00',
  //         designStandards: null,
  //         designPueValue: 1.6,
  //         description:
  //           '园区占地面积19.3万平方米，总占地面积20.8万平方米。湖岸线长约1200米。目前园区入驻单位有武汉生产园区办公室、业务处理中心、运营数据中心、远程智能银行中心武汉分中心、建信金科武汉事业群和湖北分行信息技术部5家机构入驻，工作人员超过3000人。',
  //         status: null,
  //         designCabinetNum: 6000,
  //         pcserverNum: 0,
  //         networkNum: null,
  //         storageNum: 0,
  //         otherNum: 0,
  //         cabinetCapacity: 5798,
  //         cabinetUsed: 0,
  //         cabinetFree: 5798,
  //         cabinetPreplace: 0,
  //         plannedCabinet: 0,
  //         notPlannedCabinet: 5798,
  //         safetyCapacity: null,
  //         powerCapacity: 0.0,
  //         powerUsed: 0.0,
  //         powerFree: 0.0,
  //         powerPreplace: 0.0,
  //         uCapacity: 243516,
  //         uUsed: 16392,
  //         uFree: 227124,
  //         uPreplace: 0,
  //         uReserved: 0,
  //         siteCapacity: 6612,
  //         siteUsed: 6090,
  //         siteFree: 522,
  //         pduCapacity: null,
  //         pduUsed: 0,
  //         pduFree: 0,
  //         routingModel: null,
  //         networkArea: null,
  //         orderNum: null,
  //         moduleUsag: null,
  //         techType: null,
  //         deviceAvgTime: null,
  //         installedCapacity: null,
  //         safeStartTime: '2014-11-15 00:00:00',
  //         createTime: '2021-07-07 17:13:00',
  //         deleted: 0,
  //         updateTime: '2021-07-22 20:30:06',
  //         extField: "{'test2':'男','ccc':'框','test':'','rrt':'2021-07-03','zzz':'222'}",
  //         extMap: {
  //           test2: '男',
  //           ccc: '框',
  //           test: '',
  //           rrt: '2021-07-03',
  //           zzz: '222',
  //         },
  //         upreplace: 0,
  //         ureserved: 0,
  //         uused: 16392,
  //         ufree: 227124,
  //         ucapacity: 243516,
  //       },
  //       {
  //         resourceId: 'ee63299eb87f49269ebaf78a518fd2af',
  //         parentId: 'project_root',
  //         name: '上海花木',
  //         number: 'HM',
  //         location: 'project_root',
  //         spaceType: 2,
  //         responsibleDepartment: null,
  //         responsiblePerson: null,
  //         builtUpArea: 66937.0,
  //         area: 20520.0,
  //         roomDensity: null,
  //         roomModulesCount: 54,
  //         parkProductionTime: '2014-01-01 00:00:00',
  //         designStandards: null,
  //         designPueValue: 1.6,
  //         description:
  //           '园区占地面积19.3万平方米，总占地面积20.8万平方米。湖岸线长约1200米。目前园区入驻单位有武汉生产园区办公室、业务处理中心、运营数据中心、远程智能银行中心武汉分中心、建信金科武汉事业群和湖北分行信息技术部5家机构入驻，工作人员超过3000人。',
  //         status: null,
  //         designCabinetNum: 6000,
  //         pcserverNum: 0,
  //         networkNum: null,
  //         storageNum: 0,
  //         otherNum: 0,
  //         cabinetCapacity: 5798,
  //         cabinetUsed: 0,
  //         cabinetFree: 5798,
  //         cabinetPreplace: 0,
  //         plannedCabinet: 0,
  //         notPlannedCabinet: 5798,
  //         safetyCapacity: null,
  //         powerCapacity: 0.0,
  //         powerUsed: 0.0,
  //         powerFree: 0.0,
  //         powerPreplace: 0.0,
  //         uCapacity: 243516,
  //         uUsed: 16392,
  //         uFree: 227124,
  //         uPreplace: 0,
  //         uReserved: 0,
  //         siteCapacity: 6612,
  //         siteUsed: 6090,
  //         siteFree: 522,
  //         pduCapacity: null,
  //         pduUsed: 0,
  //         pduFree: 0,
  //         routingModel: null,
  //         networkArea: null,
  //         orderNum: null,
  //         moduleUsag: null,
  //         techType: null,
  //         deviceAvgTime: null,
  //         installedCapacity: null,
  //         safeStartTime: '2014-11-15 00:00:00',
  //         createTime: '2021-07-07 17:13:00',
  //         deleted: 0,
  //         updateTime: '2021-07-22 20:30:06',
  //         extField: "{'test2':'男','ccc':'框','test':'','rrt':'2021-07-03','zzz':'222'}",
  //         extMap: {
  //           test2: '男',
  //           ccc: '框',
  //           test: '',
  //           rrt: '2021-07-03',
  //           zzz: '222',
  //         },
  //         upreplace: 0,
  //         ureserved: 0,
  //         uused: 16392,
  //         ufree: 227124,
  //         ucapacity: 243516,
  //       },
  //       {
  //         resourceId: '99e52d2466a04b758968c94069ba77a2',
  //         parentId: 'project_root',
  //         name: '洋桥园区',
  //         number: 'YQ',
  //         location: 'project_root',
  //         spaceType: 2,
  //         responsibleDepartment: null,
  //         responsiblePerson: null,
  //         builtUpArea: 73602.0,
  //         area: 13791.0,
  //         roomDensity: null,
  //         roomModulesCount: 17,
  //         parkProductionTime: '1997-10-01 00:00:00',
  //         designStandards: null,
  //         designPueValue: 1.8,
  //         description: '洋桥园区',
  //         status: null,
  //         designCabinetNum: 2000,
  //         pcserverNum: 0,
  //         networkNum: null,
  //         storageNum: 0,
  //         otherNum: 0,
  //         cabinetCapacity: 1836,
  //         cabinetUsed: 300,
  //         cabinetFree: 1836,
  //         cabinetPreplace: 0,
  //         plannedCabinet: 0,
  //         notPlannedCabinet: 1836,
  //         safetyCapacity: null,
  //         powerCapacity: 0.0,
  //         powerUsed: 0.0,
  //         powerFree: 0.0,
  //         powerPreplace: 0.0,
  //         uCapacity: 77112,
  //         uUsed: 5508,
  //         uFree: 71604,
  //         uPreplace: 0,
  //         uReserved: 0,
  //         siteCapacity: 1851,
  //         siteUsed: 1836,
  //         siteFree: 15,
  //         pduCapacity: null,
  //         pduUsed: 0,
  //         pduFree: 0,
  //         routingModel: null,
  //         networkArea: null,
  //         orderNum: null,
  //         moduleUsag: null,
  //         techType: null,
  //         deviceAvgTime: null,
  //         installedCapacity: null,
  //         safeStartTime: '1997-10-01 00:00:00',
  //         createTime: '2021-07-07 17:21:00',
  //         deleted: 0,
  //         updateTime: '2021-07-22 20:30:54',
  //         extField: "{'test2':'女','ccc':'拉','test':'D','rrt':'2021-07-10','zzz':'666'}",
  //         extMap: {
  //           test2: '女',
  //           ccc: '拉',
  //           test: 'D',
  //           rrt: '2021-07-10',
  //           zzz: '666',
  //         },
  //         upreplace: 0,
  //         ureserved: 0,
  //         uused: 5508,
  //         ufree: 71604,
  //         ucapacity: 77112,
  //       },
  //     ],
  //     total: 4,
  //   });
  // });
  // app.get('/api/v1/xaidc/resource/es/query/:id', function(req, res) {
  //   console.log(req);
  //   res.json({
  //     status: 200,
  //     message: '操作成功！',
  //     data: [
  //       { title: 'vue', url: 'https://github.com/vuejs/vue' },
  //       { title: 'element', url: 'https://github.com/ElemeFE/element' },
  //       { title: 'cooking', url: 'https://github.com/ElemeFE/cooking' },
  //       { title: 'mint-ui', url: 'https://github.com/ElemeFE/mint-ui' },
  //       { title: 'vuex', url: 'https://github.com/vuejs/vuex' },
  //       { title: 'vue-router', url: 'https://github.com/vuejs/vue-router' },
  //       { title: 'babel', url: 'https://github.com/babel/babel' },
  //     ],
  //   });
  // });
  // // 首页智搜
  // app.get('/das/api/es/query/DDD', function(req, res) {
  //   res.json({
  //     status: 200,
  //     message: '操作成功！',
  //     data: [
  //       {
  //         authKey: '',
  //         createTime: '2020-01-20 09:55:00',
  //         description: '哈哈哈',
  //         id: 'distributor-list',
  //         module: 'faultDomain',
  //         tag: '配电柜DDD画像d',
  //         title: '配电柜DDD画像ddd',
  //         url: '/fault.html#/device/distributor-list',
  //       },
  //       {
  //         authKey: '',
  //         createTime: '2020-01-20 09:55:01',
  //         description: '哈哈哈',
  //         id: 'server-device-list',
  //         module: 'faultDomain',
  //         tag: '服务器DDD画像',
  //         title: '服务器DDD画像DDDD',
  //         url: '/fault.html#/device/server-list',
  //       },
  //       {
  //         authKey: '',
  //         createTime: '2020-01-20 09:55:01',
  //         description: '哈哈哈',
  //         id: 'subject-list',
  //         module: 'subject',
  //         tag: '稻香湖C栋',
  //         title: 'ddd稻香d湖C栋ddd',
  //         url: '/subject.html#/building_search/584320378e944af5aea90fe96cbced69',
  //       },
  //       {
  //         authKey: '',
  //         createTime: '2020-01-20 09:55:01',
  //         description: '哈哈哈',
  //         id: 'subject-list11',
  //         module: 'subject',
  //         tag: '配电柜',
  //         title: '稻香湖C栋',
  //         url: '/subject.html#/park_search/ca9a81554a9f4afd97510b44a16f81f4?tabKey=energy',
  //       },
  //     ],
  //     total: 10,
  //   });
  // });
  // // 首页智搜
  // app.get('/niemp/system/custom/module/data/fields?moduleName=resource_cabinet', function(req, res) {
  //   res.json({
  //     status: 200,
  //     message: '操作成功！',
  //     data: [
  //       {
  //         configCode: '',
  //         deleted: 0,
  //         fieldDesc: '编号',
  //         fieldName: 'number',
  //         fieldType: 'text',
  //         id: 'resource_cabinet_001',
  //         isConfig: 0,
  //         isShow: 1,
  //         moduleName: 'resource_cabinet',
  //         sequence: 1,
  //       },
  //       {
  //         configCode: '',
  //         deleted: 0,
  //         fieldDesc: '机柜SN号',
  //         fieldName: 'sn',
  //         fieldType: 'text',
  //         id: 'resource_cabinet_002',
  //         isConfig: 0,
  //         isShow: 1,
  //         moduleName: 'resource_cabinet',
  //         sequence: 2,
  //       },
  //     ],
  //     total: 10,
  //   });
  // });

  app.post('/api/v1/xaidc/resource/subSystem/getSubSystemByNumber', function (req, res) {
    console.log(req);
    res.json({
      status: 200,
      message: '操作成功！',
      data: [
        {
          compEname: '系统名称',
          systemType: '系统类别',
          systemLevel: '系统级别',
          appManagerAname: '应用管理员A角',
          appManagerBname: '应用管理员B角',
          appManageDept: '应用管理处室',
          cabinetNumberList: ['DXC1101AA01', 'DXC1101AA02'],
          phyCount: '物理服务器数量',
          virtualCount: '虚拟服务器数量',
        },
        {
          compEname: '系统名称',
          systemType: '系统类别',
          systemLevel: '系统级别',
          appManagerAname: '应用管理员A角',
          appManagerBname: '应用管理员B角',
          appManageDept: '应用管理处室',
          cabinetNumberList: ['DXC1101AA03', 'DXC1101AA04'],
          phyCount: '物理服务器数量',
          virtualCount: '虚拟服务器数量',
        },
        {
          compEname: '系统名称',
          systemType: '系统类别',
          systemLevel: '系统级别',
          appManagerAname: '应用管理员A角',
          appManagerBname: '应用管理员B角',
          appManageDept: '应用管理处室',
          cabinetNumberList: ['DXC1101AA05', 'DXC1101AA07'],
          phyCount: '物理服务器数量',
          virtualCount: '虚拟服务器数量',
        },
        {
          compEname: '系统名称',
          systemType: '系统类别',
          systemLevel: '系统级别',
          appManagerAname: '应用管理员A角',
          appManagerBname: '应用管理员B角',
          appManageDept: '应用管理处室',
          cabinetNumberList: ['DXC1101AA09', 'DXC1101AA10'],
          phyCount: '物理服务器数量',
          virtualCount: '虚拟服务器数量',
        },
        {
          compEname: '系统名称',
          systemType: '系统类别',
          systemLevel: '系统级别',
          appManagerAname: '应用管理员A角',
          appManagerBname: '应用管理员B角',
          appManageDept: '应用管理处室',
          cabinetNumberList: ['DXC1101AA09', 'DXC1101AA10'],
          phyCount: '物理服务器数量',
          virtualCount: '虚拟服务器数量',
        },
        {
          compEname: '系统名称',
          systemType: '系统类别',
          systemLevel: '系统级别',
          appManagerAname: '应用管理员A角',
          appManagerBname: '应用管理员B角',
          appManageDept: '应用管理处室',
          cabinetNumberList: ['DXC1101AA09', 'DXC1101AA10'],
          phyCount: '物理服务器数量',
          virtualCount: '虚拟服务器数量',
        },
        {
          compEname: '系统名称',
          systemType: '系统类别',
          systemLevel: '系统级别',
          appManagerAname: '应用管理员A角',
          appManagerBname: '应用管理员B角',
          appManageDept: '应用管理处室',
          cabinetNumberList: ['DXC1101AA09', 'DXC1101AA10'],
          phyCount: '物理服务器数量',
          virtualCount: '虚拟服务器数量',
        },
        {
          compEname: '系统名称',
          systemType: '系统类别',
          systemLevel: '系统级别',
          appManagerAname: '应用管理员A角',
          appManagerBname: '应用管理员B角',
          appManageDept: '应用管理处室',
          cabinetNumberList: ['DXC1101AA09', 'DXC1101AA10'],
          phyCount: '物理服务器数量',
          virtualCount: '虚拟服务器数量',
        },
        {
          compEname: '系统名称',
          systemType: '系统类别',
          systemLevel: '系统级别',
          appManagerAname: '应用管理员A角',
          appManagerBname: '应用管理员B角',
          appManageDept: '应用管理处室',
          cabinetNumberList: ['DXC1101AA09', 'DXC1101AA10'],
          phyCount: '物理服务器数量',
          virtualCount: '虚拟服务器数量',
        },
      ],
      total: 4,
    });
  });
  app.post('/api/v1/xaidc/resource/subSystem/getSystemLevelCount', function (req, res) {
    console.log(req);
    res.json({
      status: 200,
      message: '操作成功！',
      data: {
        applicationNameAA: 3, // (应用物理子系统A+)
        applicationNameA: 4, // (应用物理子系统A)
        applicationNameB: 5, // (应用物理子系统B)
        applicationNameC: 6, // (应用物理子系统C)
        subsystemNameAA: 7, // (基础设施物理子系统A+)
        subsystemNameA: 7, // (基础设施物理子系统A)
        subsystemNameB: 7, // (基础设施物理子系统B)
        subsystemNameC: 7, // (基础设施物理子系统C)
      },
      total: 4,
    });
  });

  app.post('/das/api/tsdb/orig/pueHistoryData', function (req, res) {
    console.log(req);
    res.json({
      status: 200,
      message: '操作成功！',
      data: [
        {
          time: '2020-01-02',
          value: '123',
        },
        {
          time: '2020-01-03',
          value: '22',
        },
        {
          time: '2020-01-04',
          value: '25',
        },
        {
          time: '2020-01-05',
          value: '123',
        },
        {
          time: '2020-01-06',
          value: '53',
        },
      ],
      total: 4,
    });
  });
  app.post('/das/api/tsdb/orig/carbonHistoryData', function (req, res) {
    console.log(req);
    res.json({
      status: 200,
      message: '操作成功！',
      data: [
        {
          time: '2020-01-02',
          value: '123',
        },
        {
          time: '2020-01-03',
          value: '22',
        },
        {
          time: '2020-01-04',
          value: '25',
        },
        {
          time: '2020-01-05',
          value: '123',
        },
        {
          time: '2020-01-06',
          value: '53',
        },
      ],
      total: 4,
    });
  });

  app.post('/umonitor/cabinet/u/monit/temperature', function (req, res) {
    console.log(req);
    res.json({
      status: 200,
      message: '操作成功！',
      data: {
        DXC1101AA01: {
          upperTemperature: '-', // 上温度（没温度和独体这个为"-"）
          middleTemperature: '-', // 中温度（独体展示一个温度，取这个）
          downTemperature: '-', // 下温度（没温度和独体这个为"-"）
        },
        DXC1101AA02: {
          upperTemperature: '-', // 上温度（没温度和独体这个为"-"）
          middleTemperature: '-', // 中温度（独体展示一个温度，取这个）
          downTemperature: '-', // 下温度（没温度和独体这个为"-"）
        },
        DXC1101AA03: {
          upperTemperature: '-', // 上温度（没温度和独体这个为"-"）
          middleTemperature: '-', // 中温度（独体展示一个温度，取这个）
          downTemperature: '-', // 下温度（没温度和独体这个为"-"）
        },
        DXC1101AA04: {
          upperTemperature: '-', // 上温度（没温度和独体这个为"-"）
          middleTemperature: '-', // 中温度（独体展示一个温度，取这个）
          downTemperature: '-', // 下温度（没温度和独体这个为"-"）
        },
        DXC1101AA05: {
          upperTemperature: '-', // 上温度（没温度和独体这个为"-"）
          middleTemperature: '-', // 中温度（独体展示一个温度，取这个）
          downTemperature: '-', // 下温度（没温度和独体这个为"-"）
        },
      },
      total: 4,
    });
  });
};
