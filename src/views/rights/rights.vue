<template>
  <div class="main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格 -->
    <el-table stripe style="width: 100%" :data="rightsList">
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="authName" label="权限名称" width="180"></el-table-column>
      <el-table-column prop="path" label="路径" width="180"></el-table-column>
      <el-table-column prop="pid" label="层级">
        <template v-slot='{row}'>
          <span>{{row.level | levelFilter(row.level)}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      rightsList: []
    }
  },
  async created() {
    let res = await this.$http({
      url: 'rights/list'
    })
    console.log(res)
    this.rightsList = res.data.data
  },
  methods: {
    
  },
  filters: {
    levelFilter(value) {
      switch (value) {
        case '0':
          return '一级'
        case '1':
          return '二级'
        case '2':
          return '三级'
      }
    }
  }
}
</script>
