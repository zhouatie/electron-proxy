<template>
  <div id="app">
    <div class="app-header">
      <we-header></we-header>
    </div>
    <div class="app-content">
      <div class="app-sidebar">
        <we-sidebar></we-sidebar>
      </div>
      <div class="app-main">
        <router-view />
      </div>
    </div>
  </div>
</template>
<script>
import weSidebar from './components/layout/sidebar';
import weHeader from './components/layout/header';

export default {
  components: {
    weSidebar,
    weHeader
  },
  mounted() {
    console.log(this, 'store');
  }
};
</script>

<style lang="less" scoped>
#app {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  .app-content {
    flex: 1;
    display: flex;
    .app-sidebar {
      width: 200px;
      height: 100%;
    }
    .app-main {
      flex: 1;
      height: 100%;
    }
  }
}
</style>
