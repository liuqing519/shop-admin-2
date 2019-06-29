<template>
  <el-container>
    <el-header>
      <el-row type="flex" class="row-bg" justify="space-between" align="middle">
        <el-col :span="6">
          <div class="grid-content bg-purple">
            <img src="../assets/logo.png" alt="">
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
              <a href="#">退出</a>
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
              default-active="$route.path"
              class="el-menu-vertical-demo"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              :router='true'
              :unique-opened='true'
            >
              <el-submenu index="1">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>用户管理</span>
                </template>
                  <el-menu-item index="/user">
                    <i class="el-icon-menu"></i>
                    <span>用户管理</span>
                  </el-menu-item>
              </el-submenu>
              <el-submenu index="2">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>权限管理</span>
                </template>
                  <el-menu-item index="1-1">
                    <i class="el-icon-menu"></i>
                    <span>角色列表</span>
                  </el-menu-item>
                  <el-menu-item index="1-2">
                    <i class="el-icon-menu"></i>
                    <span>权限列表</span>
                  </el-menu-item>
              </el-submenu>
              <el-submenu index="3">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>商品管理</span>
                </template>
                  <el-menu-item index="1-1">
                    <i class="el-icon-menu"></i>
                    <span>商品列表</span>
                  </el-menu-item>
                  <el-menu-item index="1-2">
                    <i class="el-icon-menu"></i>
                    <span>分类参数</span>
                  </el-menu-item>
                  <el-menu-item index="1-3">
                    <i class="el-icon-menu"></i>
                    <span>商品分类</span>
                  </el-menu-item>
              </el-submenu>
              <el-submenu index="4">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>订单管理</span>
                </template>
                  <el-menu-item index="1-1">
                    <i class="el-icon-menu"></i>
                    <span>订单列表</span>
                  </el-menu-item>
                
              </el-submenu>
              <el-submenu index="5">
                <template slot="title">
                  <i class="el-icon-location"></i>
                  <span>数据统计</span>
                </template>
                  <el-menu-item index="1-1">
                    <i class="el-icon-menu"></i>
                    <span>数据列表</span>
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
}
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
  background-color: #B3C1CD;
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

