<template>
  <div>
    <el-upload
      class="upload"
      ref="upload"
      drag
      :headers="headerObj"
      v-loading.fullscreen="loading"
      element-loading-text="文件上传中"
      element-loading-background="rgba(0, 0, 0, 0.8)"
      :file-list="fileList"
      :action="autoUpload ? action : ''"
      :accept="acceptFileType"
      :auto-upload="autoUpload"
      :limit="1"
      :on-success="onSuccess"
      :on-error="onError"
      :before-upload="onBeforeUpload"
      :on-change="onHandleChange"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">
        将文件拖到此处，或
        <em>点击上传</em>
      </div>
      <template #tip>
        <div class="el-upload__tip">{{ acceptFileTips }}</div>
      </template>
    </el-upload>
  </div>
</template>
<script>
import { reactive, ref, toRefs } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';

const upload = ref(null);

export default {
  name: 'CommonUpload',
  props: {
    action: {
      type: String,
      default: '',
    },
    acceptFileType: {
      type: String,
      default: '.xl*',
    },
    acceptFileTips: {
      type: String,
      default: '注：只能上传 Excel 文件',
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, context) {
    const _data = reactive({
      upload,
      fileSize: -1,
      fileList: [],
      loading: false,
    });

    let importFile;

    const onClearFiles = () => {
      _data.upload.clearFiles();
    };

    const onSuccess = res => {
      if (res.code === 200) {
        context.emit('on-upload-success', res);
      } else {
        onClearFiles();
        context.emit('on-upload-error', res);
      }
    };

    const onError = () => {
      onClearFiles();
      context.emit('on-upload-error');
    };

    const onBeforeUpload = file => {
      let fileNameArr = file.name.split('.');
      let type = fileNameArr[fileNameArr.length - 1];
      let isAcceptType = props.acceptFileType.split(',').indexOf('.' + type) >= 0;
      if (props.acceptFileType.includes('*')) {
        let preType = props.acceptFileType.split('*')[0];
        if (('.' + type).startsWith(preType)) {
          isAcceptType = true;
        }
      }
      let isAcceptSize = _data.fileSize === -1 ? true : file.size / 1024 / 1024 < _data.fileSize;
      if (!isAcceptType) {
        ElMessage.error('上传的文件格式不符!');
        return false;
      }
      if (!isAcceptSize) {
        ElMessage.error(`上传的文件不能超过 ${_data.fileSize}MB!`);
        return false;
      }
      context.emit('on-submit', _data.fileList);
      return true;
    };

    // 手动上传
    const onHandleChange = file => {
      if (props.autoUpload) {
        return;
      }
      let fileNameArr = file.name.split('.');
      let type = fileNameArr[fileNameArr.length - 1];
      let isAcceptType = props.acceptFileType.split(',').indexOf('.' + type) >= 0;
      if (props.acceptFileType.includes('*')) {
        let preType = props.acceptFileType.split('*')[0];
        if (('.' + type).startsWith(preType)) {
          isAcceptType = true;
        }
      }
      let isAcceptSize = _data.fileSize === -1 ? true : file.size / 1024 / 1024 < _data.fileSize;
      if (!isAcceptType) {
        ElMessage.error('上传的文件只能是Excel格式!');
        return false;
      }
      if (!isAcceptSize) {
        ElMessage.error(`上传的文件不能超过 ${_data.fileSize}MB!`);
        return false;
      }
      context.emit('on-submit', _data.fileList);
      importFile = file.raw;
      return true;
    };

    const handleImportFile = async () => {
      if (!importFile) {
        ElMessage.warning({
          showClose: true,
          message: '请先上传文件！',
        });
        return;
      }
      const xlsxFile = new FormData();
      xlsxFile.append('file', importFile);
      try {
        _data.loading = true;
        axios.post(props.action, xlsxFile).then(
          res => {
            _data.loading = false;
            console.log(res);
            if (res?.data?.code === 200) {
              context.emit('on-upload-success', res?.data);
            } else {
              onClearFiles();
              importFile = null;
              context.emit('on-upload-error', res?.data);
            }
          },
          err => {
            _data.loading = false;
            onClearFiles();
            importFile = null;
            context.emit('on-upload-error', err);
          }
        );
      } catch (e) {
        _data.loading = false;
        importFile = null;
        ElMessage.error({
          type: 'error',
          showClose: true,
          message: e,
        });
      }
    };

    const headerObj = reactive({ token: localStorage.getItem('sid') });
    if (process.env.NODE_ENV === 'development') {
      headerObj['jasypt'] = '4FjKbe76IfkTMpNItxuO/g=='; // 白名单token ,仅用于本地开发联调
    }

    return {
      ...toRefs(_data),
      onBeforeUpload,
      onSuccess,
      onError,
      onHandleChange,
      handleImportFile,
      headerObj,
    };
  },
};
</script>

<style lang="less" scoped>
::v-deep(.upload) {
  .el-upload {
    width: 100%;
  }
  .el-upload-dragger {
    width: 100% !important;
  }
}
</style>
