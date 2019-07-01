<template>
  <el-row type="flex" class="row-bg" justify="center" align="middle">
    <el-col :xs="6" :sm="8" :md="10" :lg="12" :xl="14">
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
        label-position="top"
        class="loginForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button type="primary"  @click="submitForm('form')" size="small">登录</el-button>
          <el-button @click="resetForm('form')">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script>

// login页面要用所有在login引入
// import axios from 'axios'  已经把axios加到了vue的原型上 这里就不需要引入了

export default {
  data() {
    return {
      form: {
        username: "admin",
        password: "123456"
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
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$http({
            url: 'login',
            method: 'post',
            data: this.form
          }).then( ({data: {data, meta}}) => {
            if (meta.status === 200) {
              console.log(data)
              // 登录成功就跳转到home页, 这是服务端会返回token
              // 把token存到本地, 用来下次进来时判断有没有登录
              localStorage.setItem('token',data.token)
              // 
              console.log(this)
              this.$router.push('/home')

            }
          })
        } else {
          // console.log("error submit!!");
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
.row-bg {
  height: 100%;
  background-color: rgb(2, 41, 31);
}

.loginForm {
  padding: 30px 20px;
  background-color: #fff;
  min-width: 300px;
  border-radius: 10px;
}
</style>
