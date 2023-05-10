<template>
  <div>
    <el-dialog
      :title="title && title.length > 30 ? title.substring(0, 30) + '...' : title"
      v-model="showDialog"
      :before-close="handleClose"
      :width="width"
      :fullscreen="fullscreen"
      :top="top"
      :close-on-click-modal="false"
      center
      destroy-on-close
      custom-class="config-dialog"
    >
      <div class="dialog-content">
        <slot name="content" />
      </div>
      <div v-show="showFooter" class="dialog-footer">
        <slot name="footer" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'CenterDialog',
  props: {
    title: {
      type: String,
      default: () => '',
    },
    width: {
      type: String,
      default: () => '30%',
    },
    top: {
      type: String,
      default: () => '10vh',
    },
    showFooter: {
      type: Boolean,
      default: () => false,
    },
    fullscreen: {
      type: Boolean,
      default: () => false,
    },
  },
  data() {
    return {
      showDialog: true,
    };
  },
  mounted() {
    // this.showDialog = true;
  },
  methods: {
    handleClose(done) {
      this.showDialog = false;
      done();
      this.$emit('handle-cancel');
    },
  },
};
</script>
<style lang="less" scoped>
::v-deep(.config-dialog) {
  .el-dialog__body {
    padding: 0px !important;
    // .el-form-item__label {
    //   width: 20% !important;
    // }
    // .el-form-item__error {
    //   left: 22% !important;
    // }
  }
  .el-dialog__title {
    float: left;
    font-size: 16px;
  }
  .el-dialog__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
    border-bottom: 1px solid #ddd;
    padding: 0px 8px;
  }
}
.dialog-content {
  height: 100%;
  padding: 10px;
  overflow-y: auto;
  overflow-x: hidden;
}
.dialog-footer {
  border-top: 1px solid #ddd;
  padding: 0px 8px;
  height: 50px;
}
</style>
