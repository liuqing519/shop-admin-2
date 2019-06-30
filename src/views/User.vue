<template>
  <div class="main">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-row :gutter="20">
      <el-col :span="8">
        <el-input
          placeholder="请输入搜索内容"
          class="input-with-select"
          v-model="query"
          @keyup.enter.native="search"
        >
          <el-button slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </el-col>
      <el-col :span="8">
        <el-button type="success" plain @click="addUser">添加用户</el-button>
      </el-col>
    </el-row>

    <el-dialog title="添加用户" :visible.sync="dialogFormVisible">
      <el-form :model="ruleForm" label-width="100px" :rules="rules" ref="ruleForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="ruleForm.username" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input auto-complete="off" v-model="ruleForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="ruleForm.mobile" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('ruleForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('ruleForm')">确 定</el-button>
      </div>
    </el-dialog>

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
      currentPage: 1,
      query: "",
      dialogFormVisible: false,
      ruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: ""
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 5,
            max: 12,
            message: "长度在 5 到 12 个字符",
            trigger: "change"
          }
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "change"
          }
        ],
        email: [
          {
            pattern: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            message: "请输入正确的邮箱格式",
            trigger: "change"
          }
        ],
        mobile: [
          {
            pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/,
            message: "请输入正确的手机格式",
            trigger: "change"
          }
        ]
      }
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
      // console.log(user);
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
            type: "success",
            duration: 1000
          });
        }
      });
    },
    async search() {
      let res = await axios({
        url: `http://localhost:8888/api/private/v1/users`,
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem("token")
        }
      });
      this.tableList = res.data.data.users;
      this.total = res.data.data.total;
    },
    addUser() {
      this.dialogFormVisible = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          axios({
            url: 'http://localhost:8888/api/private/v1/users',
            method: 'post',
            data: this.ruleForm,
            headers: {
              Authorization: localStorage.getItem("token")
            }
          }).then( res => {
            this.getUserList()
            this.dialogFormVisible = false
            // this.ruleForm = ''
          })
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
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
