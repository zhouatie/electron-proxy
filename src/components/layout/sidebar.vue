<template>
  <div class="we-sidebar">
    <el-menu
      default-active="1"
      @open="handleOpen"
      :router="true"
      @close="handleClose"
      background-color="#2B75E8"
      class="sidebar-menu"
      text-color="#fff"
      active-text-color="#2b75e8"
    >
      <!-- <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>导航一</span>
        </template>
        <el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>
        <el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>
      </el-submenu>
      <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item> -->
      <el-menu-item :route="{ name: 'request' }" index="1">
        <i class="el-icon-s-data"></i>
        <span slot="title">请求监测</span>
      </el-menu-item>
      <el-menu-item :route="{ name: 'rules' }" index="2">
        <i class="el-icon-s-data"></i>
        <span slot="title">拦截规则</span>
      </el-menu-item>
    </el-menu>
  </div>
</template>
<script>
export default {
  methods: {
    handleOpen(key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style lang="less">
.we-sidebar {
  background: #2b75e8;
  height: 100%;
  padding-top: 20px;
  box-sizing: border-box;
  .sidebar-menu {
    .is-active {
      background: #fff!important;
    }
  }
}
</style>
