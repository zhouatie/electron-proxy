<template>
  <div class="we-header">
    <div class="we-header-text">weProxy</div>
    <div>
      <el-switch
        v-model="openProxy"
        active-color="#2b75e8"
        inactive-color="#dcdfe6"
        @change="handleSwitch"
      >
      </el-switch>
      <span class="proxy-remind-text" :class="{ active: openProxy }"
        >代理已{{ openProxy ? '开启' : '关闭' }}</span
      >
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      openProxy: false
    };
  },
  methods: {
    handleSwitch(val) {
      if (val) {
        this.$ipcRenderer.send('startProxy');
      } else {
        this.$ipcRenderer.send('stopProxy');
      }
    }
  }
};
</script>
<style lang="less">
.we-header {
  display: flex;
  height: 56px;
  background: #fff;
  box-shadow: 0 2px 10px 0 rgba(52, 56, 75, 0.1);
  align-items: center;
  .we-header-text {
    color: #2b75e8;
    line-height: 56px;
    font-size: 28px;
    font-weight: bold;
    width: 200px;
    padding-left: 16px;
    box-sizing: border-box;
  }
  .proxy-remind-text {
    color: #dcdfe6;
    margin-left: 10px;
    &.active {
      color: #2b75e8;
    }
  }
}
</style>
