<template>
  <div>
    <h5 class="font-semibold text-center">아이디 찾기</h5>
    <a-form
      id="components-form-demo-normal-login"
      :label-col="{ span: 5 }"
      class="login-form"
    >
      <a-form-item label="이름" class="my-30">
        <a-input style="width: 350px" placeholder="name" v-model="username">
        </a-input
        ><br />
        <span class="ml-30 text-danger" v-if="!nameinput"
          >이름을 입력하여 주세요.</span
        >
      </a-form-item>
      <a-form-item label="이메일" class="my-30">
        <a-input style="width: 350px" placeholder="email" v-model="email">
        </a-input
        ><br />
        <span class="text-danger ml-40" v-if="!emailinput"
          >이메일을 입력하여 주세요.</span
        >
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          block
          html-type="submit"
          class="login-form-button"
          @click="findid"
        >
          아이디 찾기
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import http from "@/api/http";
export default {
  data() {
    return {
      username: "",
      email: "",
      nameinput: true,
      emailinput: true,
    };
  },
  beforeCreate() {
    // Creates the form and adds to it component's "form" property.
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    findid() {
      this.nameinput = true;
      this.emailinput = true;
      if (!this.username) {
        this.nameinput = false;
      }
      if (!this.email) {
        this.emailinput = false;
      } else if (this.nameinput && this.emailinput) {
        let username = this.username;
        let email = this.email;
        http
          .get("/restuser/findid/" + username + "/" + email)
          .then(function (response) {
            console.log(response.data);
            if (response.data === "") {
              alert("회원정보가 존재하지 않습니다");
            } else {
              alert(username + "님의 아이디 :  " + " " + response.data);
            }
          });
      }
    },
  },
};
</script>

<style lang="scss"></style>
