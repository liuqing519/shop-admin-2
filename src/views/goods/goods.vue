<template>
  <div class="main">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" plain class="add" @click="addGood">添加商品</el-button>
    <el-table :data="goodsList" highlight-current-row style="width: 100%" stripe>
      <el-table-column type="index" width="50"></el-table-column>
      <el-table-column property="goods_name" label="商品名称"></el-table-column>
      <el-table-column property="goods_price" label="商品价格"></el-table-column>
      <el-table-column property="goods_weight" label="商品重量"></el-table-column>
      <el-table-column label="创建时间">
        <template v-slot='{row}'>
          {{row.add_time | timeFilter}}
        </template> 
      </el-table-column>
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
      @current-change="changePage"
    ></el-pagination>
  </div>
</template>

<script>
import moment from 'moment'

export default {
  data() {
    return {
      goodsList: [],
      pagenum: 1,
      pagesize: 6,
      total: 0
    };
  },
  filters: {
    timeFilter(value) {
      return moment.unix(value).format('YYYY-MM-DD HH-mm-ss')
    }
  },
  methods: {
    async getGoodsList() {
      let res = await this.$http({
        url: "goods",
        params: {
          pagenum: this.pagenum,
          pagesize: this.pagesize
        }
      });
      // console.log(res);
      this.goodsList = res.data.data.goods;
      this.total = res.data.data.total;
    },
    changePage(currentPage) {
      this.pagenum = currentPage;
      this.getGoodsList();
    },
    addGood() {
      this.$router.push('./goods-add')
    }
  },
  created() {
    // console.log(moment.unix(1318781876).format('YYYY-MM-DD HH-mm-ss'))
    this.getGoodsList();
  }
};
</script>

<style>
.el-button--success.is-plain.add {
  margin-top: 20px;
}
</style>
