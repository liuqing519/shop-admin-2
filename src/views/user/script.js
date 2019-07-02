export default {
  data() {
    return {
      tableList: [],
      total: 1,
      pagesize: 3,
      currentPage: 1,
      query: "",
      dialogFormVisibleAdd: false,
      dialogFormVisibleRdit: false,
      editForm: {
        id: 0,
        username: "",
        email: "",
        mobile: ""
      },
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
    async getUserList() {
      let res = await this.$http({
        url: "users",
        params: {
          query: this.query,
          pagenum: this.currentPage,
          pagesize: this.pagesize
        },
      });
      console.log(res)
      this.tableList = res.data.data.users;
      this.total = res.data.data.total;
    },
    async toggleState(user) {
      let res = await this.$http({
        url: `users/${user.id}/state/${user.mg_state}`,
        method: "put",
      })
      if (res.data.meta.status === 200) {
        this.$message({
          message: "恭喜你，状态修改成功",
          type: "success",
          duration: 1000
        });
      }
    },
    async search() {
      // 上面getUserList中发送请求是已经把query拼进去了 所以这里
      // 只需要重新请求即可
      // 搜索后要跳转到第一页, 否则在第2页搜索而数据只有第一页的就展示不出来
      this.currentPage = 1
      this.getUserList()
    },
    onPageChange(page) {
      this.currentPage = page;
      this.getUserList();
    },
    addUser() {
      this.dialogFormVisibleAdd = true;
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http({
            url: "users",
            method: "post",
            data: this.ruleForm
          }).then(res => {
            this.getUserList();
            this.dialogFormVisibleAdd = false;
          })
        } else {
          return false;
        }
      })

    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    delUser(id) {
      this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.$http({
          url: `users/${id}`,
          method: "delete",
        }).then(res => {
          this.getUserList();
        });
      }).catch(() => {
        this.$message({
          type: "info",
          message: "已取消删除"
        });
      });
    },
    async editUser(id) {
      this.dialogFormVisibleRdit = true;
      let res = await this.$http({
        url: `users/${id}`,
      });
      this.editForm = res.data.data;
    },
    submitEditUser(editform) {
      this.$refs[editform].validate(valid => {
        if (valid) {
          this.$http({
            url: `users/${this.editForm.id}`,
            data: {
              email: this.editForm.email,
              mobile: this.editForm.mobile
            },
            method: "put",
          }).then(res => {
            console.log(res);
            // 1. 提示用户编辑成功
            this.$message({
              message: "恭喜你，用户信息编辑成功",
              type: "success",
              duration: 1000
            });
            // 2. 刷新页面
            this.getUserList();
            // 3. 隐藏模态框
            this.dialogFormVisibleRdit = false;
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    }
  }
};