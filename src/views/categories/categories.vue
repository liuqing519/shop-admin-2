<template>
  <div class="main">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain class="add" @click="addGategories">添加分类</el-button>
    <el-table :data="categoriesList" stripe style="width: 100%">
      <!-- 
        file-icon指的是叶子节点的图标
        folder-icon指的是可展开的项的图标
        prop指的是当前列要显示的数据的属性名称
        label指的是表头
        treekey 节点的唯一标识
        parentKey 数据的父节点id
        childKey 当前节点的所有子节点存放的属性的名字, 默认是children
        indent-size 用来设置每个层级之间的缩进距离
        设置indent-size 需要同时制定 层级属性
        level-key 设置为数据中标识层级的属性名即可
      -->

      <el-table-tree-column
        file-icon="el-icon-notebook-2"
        folder-icon="el-icon-folder"
        prop="cat_name"
        label="分类名称"
        width="220"
        tree-key="cat_id"
        parent-key="cat_pid"
        level-key="cat_level"
        :indent-size="50"
      ></el-table-tree-column>
      <el-table-column label="是否有效" width="120">
        <template v-slot="{row}">{{row.cat_deleted ? '否' : '是'}}</template>
      </el-table-column>
      <el-table-column prop="cat_level" label="层级"></el-table-column>
      <el-table-column label="操作">
        <el-button type="primary" icon="el-icon-edit" plain size="mini"></el-button>
        <el-button type="danger" icon="el-icon-delete" plain size="mini"></el-button>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pagesize"
      :current-page="pagenum"
      @current-change="chagnePage"
    ></el-pagination>

    <!-- 添加分类的模态框 -->
    <el-dialog title="添加分类" :visible.sync="dialogFormVisible">
      <el-form label-width="100px" :model='addCateFormData' ref="addCateForm">
        <el-form-item label="分类名称">
          <el-input auto-complete="off" v-model="addCateFormData.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <el-cascader :options="cateOptions" :props='defaultProps' v-model="addCateFormData.parentArr"></el-cascader>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 如果只是需要某个页面中使用 局部注册组件即可
// 在使用到这个组件的页面中, 引入该组件, 然后进行components 局部注册即可
const ElTreeGrid = require("element-tree-grid");
// console.log(ElTreeGrid.name) 结果是 el-table-tree-column
// 页面中使用该组件, 只需要用 el-table-tree-column标签即可

export default {
  components: {
    [ElTreeGrid.name]: ElTreeGrid
  },
  data() {
    return {
      dialogFormVisible: false,
      categoriesList: [],
      pagenum: 1,
      pagesize: 5,
      total: 0,
      cateOptions: [],
      defaultProps: {
        value: 'cat_id',
        label: 'cat_name',
        checkStrictly: true
      },
      // 绑定级联列表的数据, 用来添加分类时作为参数传过去
      addCateFormData: {
        cat_name: '',
        parentArr: []
      }
    };
  },
  methods: {
    async getCategoriesList() {
      let res = await this.$http({
        url: "categories",
        params: {
          type: 3,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      this.categoriesList = res.data.data.result;
      this.total = res.data.data.total;
    },
    chagnePage(currentPage) {
      this.pagenum = currentPage;
      this.getCategoriesList();
    },
    // 点击添加分类按钮弹出模态框
    async addGategories() {
      // 添加分类的时候最多添加的是3级分类, 所以请求回来的数据只需要前两级就可以了
      let res = await this.$http({
        url: 'categories',
        params: {
          type: 2
        }
      })
      this.cateOptions = res.data.data

      //让模态框显示出来
      this.dialogFormVisible = true;
    },
    async addCate() {
      // 获取发送请求时的参数数据
      let cat_name = this.addCateFormData.cat_name
      // cat_level 其实可以直接用parentArr.length
      let cat_level = this.addCateFormData.parentArr.length
      // this.addCateFormDate.parentArr 这个里面放的是所有的父分类的id 我们只需要最后一个就可以
      //添加一级分类的时候 父分类的id是0, 所有默认为0
      let cat_pid = this.addCateFormData.parentArr.pop() || 0
      let res = await this.$http({
        url: 'categories',
        method: 'post',
        data: {
          cat_name: cat_name,
          cat_level: cat_level,
          cat_pid: cat_pid
        }
      })
      console.log(res)
      if (res.data.meta.status === 201) {
        this.$message({
          type: 'success',
          message: res.data.meta.msg,
          duration: 1000
        })
        this.dialogFormVisible = false
        // 重置表单
        this.$refs.addCateForm.resetFields()
        // 刷新页面 重新获取数据
        this.getCategoriesList()
      }
    }
  },
  created() {
    this.getCategoriesList();
  }
};
</script>
