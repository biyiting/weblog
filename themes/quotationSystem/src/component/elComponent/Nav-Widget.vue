<!--
 * @Author: liangchaoshun
 * @Email: liangchaoshun@xbrother.com
 * @Date: 2021-03-11 14:23:01
 * @LastEditors: liangchaoshun
 * @LastEditTime: 2021-04-15 16:48:18
 * @Description: 自定义导航条组件
 * @Description: 点击导航 tab 和前进/后退 button，都会改变导航条的展示内容
 * @Description: 所以设置 isDirectionKeyLead2RouteChange 以区分 link2Zone 和 backward/forward 操作 zones
 -->
<template>
  <div class="navi-widget clearfix">
    <div class="forward-back">
      <span class="back el-icon-arrow-left" @click="backward()" />
      <span class="forward el-icon-arrow-right" @click="forward()" />
    </div>
    <ul class="zone-container">
      <li class="zone" :key="zone.rid" v-for="(zone, index) in zones">
        <span class="zone-name" @click.stop="link2Zone(zone)">{{
          zone.name
        }}</span>
        <span
          v-show="+zone.spaceType < endTab"
          @click.stop="showSubZone(zone, index)"
          :class="zone.open ? 'el-icon-caret-bottom' : 'el-icon-caret-right'"
        />
        <div class="sub-zone" v-show="zone.open">
          <ul class="clearfix" v-if="zone.children && zone.children.length">
            <li
              class="zone-anchor"
              v-for="subzone in zone.children"
              :key="subzone.rid"
              @click="link2Zone(subzone)"
            >
              {{ subzone.name }}
            </li>
          </ul>
          <span class="no-data" v-else>暂无数据</span>
        </div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/camelcase */
import { useStore } from 'vuex';
import {
  ref,
  watch,
  computed,
  onMounted,
  onBeforeUnmount,
  defineComponent,
} from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getNodeInfo, getSubNodesInfo } from '@/api/overview';
import { ResType, SpaceNodeType } from '@/types/overview';
import { sortFn } from '@/view/resourceManage/enumData.js';

export default defineComponent({
  props: {
    rid: String, // !依赖于 resource_id，手动传入或者设置为地址中的查询参数
    startTab: {
      // 导航条第一个标签显示的区域
      type: Number, // 1: 区域, 2: 园区, 3: 楼宇, 4: 楼层, 5: 模块, 6: 机柜列, 7: 机柜位, 8: 机柜, 9: 设备
      default: 1,
    },
    endTab: {
      type: Number,
      default: 1,
    }, // 限制显示多少层，至少会有一层
    routes: {
      // !必须传入，
      type: Object,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const route = useRoute(); // 获取当前路由
    const router = useRouter(); // 路由实例

    const zonesDefault: SpaceNodeType[] = [
      {
        // !!! 不要修改这个默认值
        name: '--',
        path: '',
        spaceType: '1',
        open: false,
        children: [],
        rid: 'project_root',
      },
    ];

    const rid = computed(() => route.query.rid);

    const stMap2Class = computed(() => store.state.shared.stMap2Class);

    const zones = ref<SpaceNodeType[]>(zonesDefault);

    const isDirectionKeyLead2RouteChange = ref<boolean>(true); // 是否为前进/后退导致的路由发生变化

    const backward = () => {
      console.log('backward');
      isDirectionKeyLead2RouteChange.value = true;
      router.back(); // 回退
    };
    const forward = () => {
      console.log('forward');
      isDirectionKeyLead2RouteChange.value = true;
      router.forward(); // 前进
    };

    // 显示子区域
    const showSubZone = (zone: SpaceNodeType, index: number) => {
      const { open, spaceType } = zone;
      zones.value.forEach(item => {
        item.open = false;
      });
      if (!props.endTab || (props.endTab && +spaceType < props.endTab)) {
        zones.value[index].open = !open;
      }
    };

    const listenBodyClick = () => {
      // console.log('----- listenBodyClick -----');
      zones.value.forEach(data => {
        data.open = false;
      });
    };

    // 获取节点信息：仅返回数据
    const fetchNodeInfo = async (
      rid: string
    ): Promise<SpaceNodeType | null> => {
      const result = (await getNodeInfo(rid)) as unknown as ResType;
      if (result && `${result.status}` === '200' && result.data) {
        const {
          data: {
            name,
            resourceId: rid,
            parentId: pid,
            path = '',
            spaceType: spaceType,
            description,
          },
        } = result;
        return { name, rid, pid, path, spaceType, description, open: false };
      }
      console.log('获取节点信息失败~');
      return null;
    };

    // 获取子节点信息：仅返回数据
    const fetchSubNodesInfo = async (
      rid: string
    ): Promise<SpaceNodeType[] | null> => {
      const result = (await getSubNodesInfo(rid)) as unknown as ResType;
      if (result && `${result.status}` === '200' && result.data) {
        if (rid === 'project_root') {
          sortFn(result?.data);
        }
        const { data } = result;
        return data.map(
          (item: {
            name: string;
            path: string;
            parentId: string;
            description: string;
            resourceId: string;
            spaceType: string;
          }) => {
            const {
              name,
              path = '',
              description,
              parentId: pid,
              resourceId: rid,
              spaceType: spaceType,
            } = item;
            return {
              name,
              rid,
              pid,
              path,
              spaceType,
              description,
              open: false,
            };
          }
        );
      }
      console.log('获取子节点信息失败~');
      return null;
    };

    // 设置导航条子数据
    const setSubNodesData = async (rid: string) => {
      const data = await fetchSubNodesInfo(rid);
      if (data && data.length) {
        const pNode = zones.value.find(item => item.rid === rid);
        const { routes } = props;
        const dataWithRoute = data.map(obj => {
          obj.route = routes[obj.spaceType];
          return obj;
        });
        if (pNode) pNode.children = dataWithRoute;
      }
    };

    // 点击跳转【传入路由配置，跳转到不同的路由！】
    // 点击了导航某个节点或者其下的子节点
    const link2Zone = async (zone: SpaceNodeType) => {
      // console.log('link2Zone => ', zone);
      const { rid, route, spaceType } = zone;
      isDirectionKeyLead2RouteChange.value = false;
      const index = zones.value.findIndex(i => i.rid === rid);

      const navQuery = {
        rid,
        type: stMap2Class.value[spaceType],
        ...route?.query,
      };
      const tarRoute = { ...route, query: navQuery };
      // console.log('tarRoute => ', tarRoute);
      router.push(tarRoute);

      if (index > -1) {
        // 如果点击了节点已存在，则去掉后面的路径
        zones.value = zones.value.slice(0, index + 1);
      }

      setTimeout(() => {
        isDirectionKeyLead2RouteChange.value = true;
      }, 300);

      // 路由跳转后，如果导航条还存在，则会继续执行
      const data = await fetchNodeInfo(rid);
      // 成功返回数据
      if (data) {
        const { routes } = props;
        const { pid, spaceType } = data;
        data.route = routes[spaceType];
        const index = zones.value.findIndex(i => i.rid === pid); // 父节点的位置
        if (index > -1) {
          zones.value = zones.value.slice(0, index + 1).concat(data);
          setSubNodesData(rid);
        }
      }
    };

    // 初始化：设置导航条
    const setInitNavbar = async (rid: string) => {
      // 0为project_root的parentId
      if (rid === '0') {
        return;
      }
      const nodeData = await fetchNodeInfo(rid);
      // console.log('setInitNavbar => ', nodeData);
      if (nodeData) {
        const { routes } = props;
        const { pid, spaceType } = nodeData;
        nodeData.route = routes[spaceType];
        if (zones.value.length <= 1 && zones.value[0].name === '--') {
          zones.value = [nodeData];
        } else if (+spaceType >= props.startTab) {
          zones.value.unshift(nodeData);
        }
        // !!! 注意：设置子节点数据，必须在（start-end）区间内才设置
        if (
          +spaceType >= props.startTab &&
          (!props.endTab || +spaceType <= props.endTab)
        ) {
          setSubNodesData(rid);
          if (pid) setInitNavbar(pid); // 找到当前页面对一个的导航 tab。再以 parentId 往前设置
        }
      }
    };

    // 组件初始化
    const initNavibar = () => {
      let rid: string;
      if (props.rid) {
        rid = props.rid;
      }
      // 路由有 rid，则覆盖 props 传入值
      if (route.query.rid) {
        rid = route.query.rid as string;
      }
      if (rid) setInitNavbar(rid);
    };

    onMounted(() => {
      initNavibar(); // 组件初始化
      document.body.addEventListener('click', listenBodyClick, false);
    });

    watch(rid, rid => {
      // console.log('Nav-Widget => WATCH ', rid);
      if (isDirectionKeyLead2RouteChange.value) {
        // console.log('Nav-Widget => WATCH ', isDirectionKeyLead2RouteChange.value);
        zones.value = zonesDefault;
        initNavibar();
      }
    });

    onBeforeUnmount(() => {
      document.body.removeEventListener('click', listenBodyClick, false);
    });

    return {
      zones,
      forward,
      backward,
      link2Zone,
      showSubZone,
      isDirectionKeyLead2RouteChange,
    };
  },
});
</script>

<style lang="less" scoped>
.navi-widget {
  .forward-back {
    float: left;
    padding: 0 0.25rem;
    border-top-left-radius: 0.8rem;
    border-bottom-left-radius: 0.8rem;
    background-color: #fff;
    border: 1px solid #bcbcbc;
    span {
      font-size: 0.8rem;
      line-height: 1.25rem;
      color: #057cdd;
      font-weight: 500;
      cursor: pointer;
      padding: 0 0.25rem;
      &.forward {
        padding-left: 0;
      }
      &:hover {
        font-weight: 600;
      }
    }
  }
  .zone-container {
    float: left;
    background-color: #fff;
    .zone {
      float: left;
      position: relative;
      border: 1px solid #bcbcbc;
      border-left: none;
      cursor: pointer;
      padding: 0 0.25rem 0 0.5rem;
      height: 25px;
      &:hover .el-icon-caret-right {
        color: #057cdd;
      }
      span {
        font-size: 0.7rem;
        line-height: 1.25rem;
        &.zone-name {
          margin-right: 0.5rem;
        }
        &.el-icon-caret-right,
        &.el-icon-caret-bottom {
          font-size: 0.8rem;
        }
        &.el-icon-caret-bottom {
          color: #057cdd;
        }
      }
      .sub-zone {
        position: absolute;
        left: 0;
        top: 1.8rem;
        z-index: 10;
        padding: 0.5rem;
        cursor: default;
        background-color: #fff;
        border: 1px solid #057cdd;
        min-width: 15rem;
        max-width: 35rem;
        min-height: 1.25rem;
        ul .zone-anchor {
          float: left;
          margin: 4px 0.5rem;
          font-size: 0.6rem;
          line-height: 1.25rem;
          color: #333;
          cursor: pointer;
        }
        .no-data {
          display: inline-block;
          width: 100%;
          font-size: 12px;
          line-height: 1.25rem;
          color: #999;
          text-align: center;
        }
      }
    }
  }
}
</style>
