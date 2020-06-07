<template>
  <div class="page-request">
    <div class="request-header">
      <el-button type="primary" icon="el-icon-delete" @click="handleClear">Clear</el-button>
    </div>
    <div class="request-content">
      <el-table size="mini" :data="requests" border style="width: 100%">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="req.method" label="方法" width="180"> </el-table-column>
        <el-table-column prop="url" label="url">
          <template slot-scope="scope"> {{ scope.row.req.url }} </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)">查看</el-button>
            <el-button type="text" @click="handleAddRule(scope.row)">拦截</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="地址"> </el-table-column> -->
      </el-table>
    </div>
    <el-drawer custom-class="request-drawer" title="请求详情" :visible.sync="drawer" direction="rtl" size="500px">
      <div class="request-detail">
        <div>
          <span>method: </span>
          <span>{{ detail.req.method }}</span>
        </div>
        <div>
          <span>url: </span>
          <span>{{ get(detail, 'req.url', '') }}</span>
        </div>
        <div>
          <div v-for="item in Object.entries(get(detail, 'req.headers', {}))" :key="item[0]">
            <span>{{ item[0] }}: </span>
            <span>{{ item[1] }}</span>
          </div>
        </div>
        <div>response</div>
        <div>
          <div v-for="item in Object.entries(get(detail, 'res', {}))" :key="item[0]">
            <span>{{ item[0] }}: </span>
            <span>{{ item[1] }}</span>
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { mapState } from 'vuex';
import { get } from 'lodash';

export default {
  data() {
    return {
      drawer: false,
      detail: { req: {}, res: {} }
    };
  },
  computed: {
    ...mapState(['requests'])
  },
  methods: {
    get,
    handleDetail(item) {
      this.drawer = true;
      this.detail = item;
    },
    handleAddRule(item) {
      console.log(item);
    },
    handleClear() {
      this.$store.commit('clear');
    }
    // 发送信息给服务端
    // this.$socket.emit('login', {
    //   username: 'username',
    //   password: 'password',
    // });
    // console.log(this, 'this')
    // 接收服务端的信息
    // this.sockets.subscribe('relogin', (data) => {
    //   console.log(data, 'relogin');
    // });
  }
};
</script>
<style lang="less">
.page-request {
  height: 100%;
  overflow: auto;
  padding: 16px;
  box-sizing: border-box;
  .request-header {
    margin-bottom: 16px;
  }
  .request-drawer {
    .el-drawer__body {
      padding: 0 20px;
      overflow: auto;
    }
    .request-detail {
      overflow: auto;
    }
  }
}
</style>
