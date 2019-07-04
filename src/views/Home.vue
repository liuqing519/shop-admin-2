<template>
  <el-container>
    <el-header>
      <el-row type="flex" class="row-bg" justify="space-between" align="middle">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <img src="../assets/logo.png" alt />
          </div>
        </el-col>
        <el-col>
          <div class="grid-content bg-purple-light">
            <h1>品优购后台管理系统</h1>
          </div>
        </el-col>
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <div>
              欢迎39期星耀会员
              <a href="javacript:;" @click="logout">退出</a>
            </div>
          </div>
        </el-col>
      </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-row class="tac">
          <el-col>
            <el-menu
              :default-active="$route.path"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              :router="true"
              :unique-opened="true"
            >
              <el-submenu v-for="menu1 in menuList" :key='menu1.id' :index="menu1.id + ''">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>{{menu1.authName}}</span>
                </template>
                <el-menu-item v-for='menu2 in menu1.children' :key='menu2.id' :index='"/" + menu2.path'>
                  <i class="el-icon-menu"></i>
                  <span>{{menu2.authName}}</span>
                </el-menu-item>
              </el-submenu>
              
            </el-menu>
          </el-col>
        </el-row>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  async created() {
    let res = await this.$http({
      url: 'menus'
    })
    // console.log(res)
    this.menuList = res.data.data
  },
  methods: {
    logout() {
      // console.log("hahha");
      this.$confirm("确定退出登录吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          localStorage.removeItem("token");
          this.$router.push('/login')
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  }
};
</script>


<style>
* {
  margin: 0;
  padding: 0;
}

.el-container {
  height: 100%;
}

.el-container .el-header {
  background-color: #b3c1cd;
  padding: 0;
}
.el-container .el-header img {
  width: 200px;
}

.el-container .el-header .row-bg {
  background-color: transparent;
}

.el-container .el-header .row-bg h1 {
  padding: 0;
  margin: 0;
  text-align: center;
  color: #fff;
  font-size: 28px;
}

.el-container .el-header .row-bg a {
  color: orange;
  font-weight: 700;
}

.el-aside,
.tac.el-row,
.tac.el-row .el-col {
  height: 100%;
}

.el-menu-vertical-demo.el-menu {
  background-color: #545c64;
  height: 100%;
}
</style>

