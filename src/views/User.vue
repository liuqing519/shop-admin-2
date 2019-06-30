<template>
  <div class="main">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-input placeholder="请输入搜索内容" class="input-with-select">
          <el-button slot="append" icon="el-icon-search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="success" plain>添加用户</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- 作用域插槽 -->
        <template v-slot="{row}">
          <!-- {{row}} -->
          <el-switch
            v-model="row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
            @change="toggleState(row)"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
        <el-button type="success" icon="el-icon-check" plain size="mini">分配角色</el-button>
      </el-table-column>
    </el-table>

    <!-- 分页器 -->
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="currentPage"
      @current-change="onPageChange"
    ></el-pagination>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data() {
    return {
      tableList: [],
      total: 1,
      pagesize: 3,
      currentPage: 1
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page;
      this.getUserList();
    },
    async getUserList() {
      let res = await axios({
        url: "http://localhost:8888/api/private/v1/users",
        params: {
          pagenum: this.currentPage,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      // console.log(res);
      this.tableList = res.data.data.users;
      this.total = res.data.data.total;
    },
    toggleState(user) {
      console.log(user);
      axios({
        url: `http://localhost:8888/api/private/v1/users/${user.id}/state/${user.mg_state}`,
        method: "put",
        headers: {
          Authorization: localStorage.getItem("token")
        }
      }).then(res => {
        if (res.data.meta.status === 200) {
          this.$message({
            message: "恭喜你，状态修改成功",
            type: "success"
          });
        }
      });
    }
  }
};
</script>

<style>
.el-main {
  background-color: #eaeef1;
}
.main .el-breadcrumb {
  height: 50px;
  background-color: #d4dae0;
  line-height: 50px;
  font-size: 16px;
  padding-left: 10px;
}
</style>
