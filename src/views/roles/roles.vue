<template>
  <div class="main">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 表格 -->
    <el-table
      stripe
      style="width: 100%"
      ref="roleTable"
      :data="rolesList"
      @expand-change="openRoles"
    >
      <el-table-column type="expand" width="50">
        <template v-slot="{row}">
          <el-row type="flex" v-for="level1 in row.children" :key="level1.id" class="tag-row">
            <el-col :span="6">
              <!-- 一级列表 -->
              <el-tag closable class="tag" @close="delRights(row,level1.id)">{{level1.authName}}</el-tag>
              <i class="el-icon-arrow-right"></i>
            </el-col>
            <el-col>
              <el-row v-for="level2 in level1.children" :key="level2.id" type="flex">
                <el-col :span="6">
                  <!-- 二级列表 -->
                  <el-tag
                    @close="delRights(row,level2.id)"
                    type="success"
                    closable
                    class="tag"
                  >{{level2.authName}}</el-tag>
                  <i class="el-icon-arrow-right"></i>
                </el-col>
                <el-col>
                  <el-tag
                    v-for="level3 in level2.children"
                    :key="level3.id"
                    type="warning"
                    closable
                    class="tag"
                    @close="delRights(row,level3.id)"
                  >{{level3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="180"></el-table-column>
      <el-table-column prop="roleDesc" label="描述" width="180"></el-table-column>
      <el-table-column label="操作">
        <template v-slot='{row}'>
          <!-- {{row}} -->
          <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
          <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
          <el-button
            type="success"
            icon="el-icon-check"
            plain
            size="mini"
            @click="showAssainRightsDialog(row)"
          >分配权限</el-button>

          <!-- 角色授权模态框 -->
          <el-dialog title="角色授权" :visible.sync="dialogFormVisible">
            <!-- 
              data 是用来绑定数据的
              show-checkbox是用来设置是否要展示checkbox
              node-key 指的是当前节点的唯一表示
              default-expanded-keys 这是一个数组, 表示默认让哪些节点展示
              default-checked-keys 这是一个数据, 表示默认选中哪些节点
              props: children是用来指定子级树的数据属性名,label以及节点要展示到文字的属性名
              default-expand-all 是否默认展开所有节点

             -->
              <el-tree :data="treeList" :props="defaultProps" show-checkbox :default-expand-all='true' node-key='id' :default-checked-keys='checkedRights' ref='rightsTree'></el-tree>

            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="primary" @click='updateRoleRights'>确 定</el-button>
            </div>
          </el-dialog>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
export default {
  data() {
    return {
      rolesList: [],
      dialogFormVisible: false,
      treeList: [],
      // 设置tree组件, 数据展示, 子节点以及展示的文字
      defaultProps: {
        // 子级元素的属性名
        children: 'children',
        // 当前节点展示的文字的属性名
        label: 'authName'
      },
      // 默认选中的节点所组成的数组
      checkedRights: [],
      // 用来存储要编辑的role的id
      currentEditRoleId: -1
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    async getRolesList(callback) {
      let res = await this.$http({
        url: "roles"
      });
      // console.log(res)
      this.rolesList = res.data.data;
      // console.log(this.rolesList)
      callback && callback();
    },
    async openRoles() {
      let res = await this.$http({
        url: "roles"
      });
      // console.log(res);
    },
    async delRights(row, id) {
      // console.log(row,id)
      // 获取每个权限列表中的id,并把他们拼成一个数组
      let level1Ids = [];
      let level2Ids = [];
      let level3Ids = [];
      row.children.forEach(level1 => {
        level1Ids.push(level1.id);
        level1.children.forEach(level2 => {
          level2Ids.push(level2.id);
          level2.children.forEach(level3 => {
            level3Ids.push(level3.id);
          });
        });
      });
      let result = [...level1Ids, ...level2Ids, ...level3Ids];
      let ids = result.filter(item => item !== id).join();
      // console.log(ids)
      let res = await this.$http({
        url: `roles/${row.id}/rights`,
        method: "post",
        data: {
          rids: ids
        }
      });
      // console.log(res)
      this.$message({
        type: "success",
        message: res.data.meta.msg,
        duration: 1000
      });

      // 保证在页面刷新后再展开对应的行
      this.getRolesList(() => {
        this.$nextTick(() => {
          this.$refs.roleTable.toggleRowExpansion(
            this.rolesList.find(v => v.id === row.id),
            true
          );
        });
      });
    },
    // 点击分配权限弹出模态框
    async showAssainRightsDialog(row) {
      // 把要编辑的role的id等于当前行的id
      this.currentEditRoleId = row.id
      let res = await this.$http({
        url: "rights/tree"
      });
      // console.log( res);
      // 把权限列表绑定给了tree组件
      this.treeList = res.data.data
      // 把当前角色中所有权限的id组成数组赋值给checkedRights, 在页面中默认选中
      let checkedIds = []
      row.children.forEach( level1 => {
        level1.children.forEach( level2 => {
          level2.children.forEach( level3 => {
            checkedIds.push(level3.id)
          })
        })
      })
      this.checkedRights = [...checkedIds]
      // 显示模态框
      this.dialogFormVisible = true;
    },
    // 点击确定分配权限
    async updateRoleRights() {
      // 被选中的节点所组成的数组
      let allRids = this.$refs.rightsTree.getCheckedKeys()
      // 半选中的节点(即子集被选中)所组成的数组
      let halfRids = this.$refs.rightsTree.getHalfCheckedKeys()
      let ids = [...allRids,...halfRids].join()
      let res = await this.$http({
        url: `roles/${this.currentEditRoleId}/rights`,
        method: 'post',
        data: {
          rids: ids
        }
      })
      // 提示用户更新成功
      this.$message({
        type: 'success',
        message: res.data.meta.msg,
        duration: 1000
      })
      // 刷新页面
      this.getRolesList()
      // 关闭模态框
      this.dialogFormVisible = false

    }
  }
};
</script>


<style>
.tag-row {
  border-bottom: 1px dashed #ccc;
  /* margin: 10px 0; */
}
.tag-row:last-child {
  border-bottom: none;
}
.tag {
  margin: 10px;
}
</style>
