<template>
  <div class="login">
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
    >
      <div class="loginTitle">城市生活垃圾分类平台</div>
      <div class="loginContent">
        <el-form-item prop="username">
          <el-input
            v-model="loginForm.username"
            type="text"
            auto-complete="off"
            placeholder="账号"
          >
            <svg-icon
              slot="prefix"
              icon-class="user"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            auto-complete="off"
            placeholder="密码"
            @keyup.enter.native="handleLogin"
          >
            <svg-icon
              slot="prefix"
              icon-class="password"
              class="el-input__icon input-icon"
            />
          </el-input>
        </el-form-item>
        <el-row type="flex" justify="space-between">
          <el-checkbox v-model="loginForm.rememberMe" class="rememberMe"
            >记住密码</el-checkbox
          >
          <router-link to="/register"
            ><el-link style="color: #00e5ff; font-size: 12px;line-height:26px"
              >立即注册</el-link
            ></router-link
          >
        </el-row>
        <el-button
          :loading="loading"
          size="medium"
          class="login-btn"
          @click.native.prevent="handleLogin"
        >
          <div v-if="!loading">登 录</div>
          <div v-else>登 录 中...</div>
        </el-button>
        <div class="login-form-bottom"></div>
      </div>
    </el-form>
    <!--  底部  -->
    <div class="el-login-footer">
      <span
        >Copyright ©      
      </span>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie";
import { encrypt, decrypt } from "@/utils/jsencrypt";
export default {
  name: "Login",
  data() {
    return {
      recordnoform: {},
      // codeUrl: "",
      cookiePassword: "",
      loginForm: {
        username: "",
        password: "",
        rememberMe: false,
      },
      loginRules: {
        username: [
          {
            required: true,
            trigger: "blur",
            message: "用户名不能为空",
          },
        ],
        password: [
          {
            required: true,
            trigger: "blur",
            message: "密码不能为空",
          },
        ],
      },
      loading: false,
      redirect: undefined,
    };
  },
  watch: {
    $route: {
      handler: function (route) {
        this.redirect = route.query && route.query.redirect;
      },
      immediate: true,
    },
  },
  created() {
    // this.getCode();
    this.getCookie();
  },
  methods: {
    getCookie() {
      const username = Cookies.get("username");
      const password = Cookies.get("password");
      const rememberMe = Cookies.get("rememberMe");
      this.loginForm = {
        username: username === undefined ? this.loginForm.username : username,
        password:
          password === undefined ? this.loginForm.password : decrypt(password),
        rememberMe: rememberMe === undefined ? false : Boolean(rememberMe),
      };
    },
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true;
          if (this.loginForm.rememberMe) {
            Cookies.set("username", this.loginForm.username, {
              expires: 30,
            });
            Cookies.set("password", encrypt(this.loginForm.password), {
              expires: 30,
            });
            Cookies.set("rememberMe", this.loginForm.rememberMe, {
              expires: 30,
            });
          } else {
            Cookies.remove("username");
            Cookies.remove("password");
            Cookies.remove("rememberMe");
          }
          this.$store
            .dispatch("Login", this.loginForm)
            .then(() => {
              this.loading = false;
              this.$router.push({
                path: this.redirect || "/",
              });
            })
            .catch(() => {
              this.loading = false;
            });
        }
      });
    },
  },
};
</script>

<style rel="stylesheet/scss" lang="scss">
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  background-image: url("../assets/image/login-bg.png");
  background-size: cover;

  .login-form {
    border-radius: 6px;
    width: 519px;
    background: url("../assets/image/login-form-bg.png") no-repeat;
    background-size: 100% 100%;

    .loginTitle {
      margin: 0px auto;
      text-align: center;
      width: 399px;
      height: 72px;
      font-size: 22px;
      line-height: 64px;
      letter-spacing: 1px;
      color: #00e5ff;
      background: url("../assets/image/login-title-bg.png") no-repeat;
      background-size: 100% 100%;
    }

    .loginContent {
      padding: 0px 125px;

      .el-input {
        background: url("../assets/image/login-form-input-bg.png") no-repeat;
        background-size: 100% 100%;
      }

      .el-input__inner {
        height: 48px;
        border: none;
        padding-left: 46px;
      }

      input:-internal-autofill-previewed,
      input:-internal-autofill-selected {
        -webkit-text-fill-color: #ffffff !important;
        transition: background-color 500s ease-in-out 0s !important;
      }

      .input-icon {
        height: 48px;
        width: 14px;
        margin-left: 18px;
        color: #00e5ff;
      }

      .el-form-item {
        margin-bottom: 13px;
      }

      .login-code {
        width: 33%;
        height: 38px;
        float: right;

        img {
          cursor: pointer;
          vertical-align: middle;
          width: 100%;
        }
      }

      .rememberMe {
        font-size: 12px;
        line-height: 26px;
        letter-spacing: 1px;
        color: #00e5ff;
      }

      .el-checkbox__input.is-focus .el-checkbox__inner,
      .el-checkbox__inner:hover {
        border-color: #00e5ff;
      }

      .el-checkbox__input.is-checked .el-checkbox__inner {
        border-color: #00e5ff;
        background-color: #00e5ff;
      }

      .el-checkbox__input.is-checked + .el-checkbox__label {
        color: #00e5ff;
      }

      .login-btn {
        width: 100%;
        height: 64px;
        border: none;
        background: url("../assets/image/login-btn-bg.png") no-repeat;
        background-size: 100% 100%;
        margin-bottom: 0;

        div {
          font-family: Y4;
          font-size: 18px;
          line-height: 26px;
          letter-spacing: 1px;
          color: #00e5ff;
        }
      }

      .login-form-bottom {
        height: 64px;
        background: url("../assets/image/login-form-bottom.png") no-repeat;
        background-size: 100% 100%;
      }
    }
  }

  .el-login-footer {
    height: 40px;
    line-height: 40px;
    position: fixed;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #fff;
    font-family: Arial;
    font-size: 12px;
    letter-spacing: 1px;
  }
}
</style>
