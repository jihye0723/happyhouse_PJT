<template>
  <div class="sign-in">
    <a-row type="flex" :gutter="[24, 24]" justify="space-around" align="middle">
      <!-- Sign In Form Column -->
      <a-col
        :span="24"
        :md="10"
        :lg="{ span: 12, offset: 0 }"
        :xl="{ span: 6, offset: 2 }"
        class="col-form"
      >
        <h3 class="mb-40">Sign In</h3>

        <!-- Sign In Form -->
        <a-form
          id="components-form-demo-normal-login"
          :form="form"
          class="login-form"
          :hideRequiredMark="true"
        >
          <a-form-item class="mb-10" label="아이디" :colon="false">
            <a-input v-model="user.userid" placeholder="id" />
          </a-form-item>
          <span class="text-danger" v-if="!idinput"
            >아이디를 입력하여 주세요.</span
          >
          <a-form-item class="mb-30" label="비밀번호" :colon="false">
            <a-input
              type="password"
              v-model="user.userpass"
              placeholder="Password"
            />
          </a-form-item>
          <span class="text-danger" v-if="!passinput"
            >비밀번호를 입력하여 주세요.</span
          >

          <a-form-item>
            <a-button
              type="primary"
              block
              class="login-form-button"
              @click="loginBtn"
            >
              SIGN IN
            </a-button>
          </a-form-item>
        </a-form>
        <p class="font-semibold text-muted">
          <router-link to="/FindUser" class="font-bold text-dark"
            >아이디 / 비밀번호 찾기</router-link
          >
        </p>
        <!-- / Sign In Form -->
        <p class="font-semibold text-muted">
          Don't have an account?
          <router-link to="/sign-up" class="font-bold text-dark"
            >Sign Up</router-link
          >
        </p>
      </a-col>
    </a-row>
  </div>
</template>

<script>
const memberStore = "memberStore";
import { mapState, mapActions } from "vuex";
export default {
  data() {
    return {
      // Binded model property for "Sign In Form" switch button for "Remember Me" .
      user: {
        userid: "",
        userpass: "",
      },
      rememberMe: true,
      idinput: true,
      passinput: true,
    };
  },
  beforeCreate() {
    // Creates the form and adds to it component's "form" property.
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  computed: {
    ...mapState(memberStore, ["isLogin"]),
  },
  methods: {
    ...mapActions(memberStore, ["userConfirm", "getUserInfo"]),

    async loginBtn() {
      this.idinput = this.passinput = true;
      if (!this.user.userid) {
        this.idinput = false;
      }
      if (!this.user.userpass) {
        this.passinput = false;
      }
      //아이디 비번 둘다 입력했으면,
      if (this.idinput && this.passinput) {
        console.log("로그인할 사용자 : " + this.user.userid);

        await this.userConfirm(this.user);
        let token = sessionStorage.getItem("access-token");
        //로그인 됬으면,
        if (this.isLogin) {
          //console.log("로그인 되었음 ");
          await this.getUserInfo(token);
          this.$router.push({ name: "Home" });
        }
      }
    },
  },
};
</script>

<style lang="scss">
.login-form-button {
  border: 0ch;
  background-color: rgb(133, 143, 160);
  font-size: medium;
}
</style>
