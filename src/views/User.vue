<template>
  <div>
    <el-table :data="tableList" stripe style="width: 100%">
      <el-table-column prop="username" label="姓名" width="180"></el-table-column>
      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
      <el-table-column prop="mobile" label="电话"></el-table-column>
      <el-table-column label="用户状态">
        <!-- 作用域插槽 -->
        <template v-slot="{row}">
          <!-- {{row}} -->
          <el-switch v-model="row.mg_state" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
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
    // axios({
    //   url: 'http://localhost:8888/api/private/v1/users',
    //   params: {
    //     pagenum: 1,
    //     pagesize: 5
    //   },
    //   headers: {
    //     "Authorization": localStorage.getItem('token')
    //   }
    // }).then( ({data: {data, meta}}) => {
    //   this.tableList = data.users
    // })

    this.getUserList();
  },
  methods: {
    onPageChange(page) {
      this.currentPage = page
      this.getUserList()
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

      this.tableList = res.data.data.users;
      this.total = res.data.data.total;
    }
  }
};
</script>
