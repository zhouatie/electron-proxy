<template>
  <div class="page-request">
    <div class="request-header">
      <el-button type="primary" icon="el-icon-delete" @click="handleClear"
        >Clear</el-button
      >
    </div>
    <div class="request-content">
      <el-table :data="requests" border style="width: 100%" @row-click="handleDetail">
        <el-table-column type="index" width="50"> </el-table-column>
        <el-table-column prop="method" label="方法" width="180">
        </el-table-column>
        <el-table-column prop="statusCode" label="状态" width="60">
          <template slot-scope="scope">
            <span :class="handleFormatClass(scope.row.statusCode)">
              {{ scope.row.statusCode }}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="url" label="url">
          <template slot-scope="scope"> {{ scope.row.url }} </template>
        </el-table-column>
        <el-table-column prop="startTime" width="100" label="请求时长">
          <template slot-scope="scope">
            {{ handleFormatTime(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" fixed="right">
          <template slot-scope="scope">
            <el-button type="text" @click="handleDetail(scope.row)"
              >查看</el-button
            >
            <el-button type="text" @click="handleAddRule(scope.row)"
              >拦截</el-button
            >
          </template>
        </el-table-column>
        <!-- <el-table-column prop="address" label="地址"> </el-table-column> -->
      </el-table>
    </div>
    <el-drawer
      custom-class="request-drawer"
      title="请求详情"
      :visible.sync="drawer"
      direction="rtl"
      size="500px"
    >
      <div class="request-detail">
        <div style="font-weight: 600;color: red;">response</div>
        <div>
          <!-- {{typeofdetail.resBody}} -->
        </div>
        <pre v-if="detail.method === 'POST' && detail.resBody" v-html="JSON.stringify(JSON.parse(detail.resBody), null, 2)"></pre>
        <div style="font-weight: 600;color: red;">request</div>
        <pre>method: {{ detail.method }}</pre>
        <pre>url: {{ get(detail, 'req.url', '') }}</pre>
        <div>
          <div
            v-for="item in Object.entries(get(detail, 'req.headers', {}))"
            :key="item[0]"
          >
            <pre>{{ item[0] }}: </pre>
            <pre>{{ item[1] }}</pre>
          </div>
        </div>
        <!-- <div>
          <div
            v-for="item in Object.entries(get(detail, 'res', {}))"
            :key="item[0]"
          >
            <span>{{ item[0] }}: </span>
            <span>{{ item[1] }}</span>
          </div>
        </div> -->
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { get } from 'lodash';

export default {
  data() {
    return {
      drawer: false,
      detail: {}
    };
  },
  computed: {
    ...mapGetters({
      requests: 'getRequests'
    })
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
    },
    handleFormatTime(data) {
      return data.endTime ? `${data.endTime - data.startTime}ms` : '';
    },
    handleFormatClass(status) {
      const a = `${status}` && `${status}`[0];
      let className = '';
      switch (a) {
        case '2':
          className = 'code-success';
          break;
        case '3':
          className = 'code-warning';
          break;
        case '4':
          className = 'code-error';
          break;
        case '5':
          className = 'code-error';
          break;
      }
      return className;
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
  display: flex;
  flex-direction: column;
  .request-content {
    flex: 1;
    overflow: auto;
  }
  pre {
    white-space: wrap;
  }
  .code-error {
    color: red;
  }
  .code-waring {
    color: yellow;
  }
  .code-success {
    color: green;
  }
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
