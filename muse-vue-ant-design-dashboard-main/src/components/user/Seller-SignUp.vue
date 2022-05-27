<template>
  <div>
    <h5 class="font-semibold text-center">Register With</h5>
    <a-form
      id="components-form-demo-normal-login"
      :label-col="{ span: 5 }"
      class="login-form"
    >
      <a-form-item label="중개사무소명" class="mb-10">
        <a-input style="width: 350px" placeholder="Name" v-model="username">
        </a-input>
      </a-form-item>
      <a-form-item label="아이디" class="mb-10">
        <a-input
          style="width: 350px"
          placeholder="id"
          v-model="userid"
          @blur="checkId"
        >
        </a-input
        ><br /><span class="text-danger ml-50" v-if="!idavail"
          >이미 사용중인 아이디입니다.</span
        >
      </a-form-item>
      <a-form-item label="비밀번호" class="mb-5">
        <a-input
          style="width: 350px"
          type="password"
          placeholder="Password"
          v-model="userpass"
        >
        </a-input>
      </a-form-item>
      <a-form-item label="이메일" class="mb-10">
        <a-input style="width: 150px" placeholder="Email" v-model="emailid">
        </a-input>
        &nbsp; @ &nbsp;
        <a-select v-model="emaildomain" style="width: 170px">
          <a-select-option value="naver.com">naver.com </a-select-option>
          <a-select-option value="ssafy.com">ssafy.com </a-select-option>
          <a-select-option value="google.com">google.com </a-select-option>
          <a-select-option value="daum.com"> daum.net </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="전화번호" class="mb-10">
        <a-input style="width: 350px" placeholder="02-xxx-xxxx" v-model="phone">
        </a-input>
      </a-form-item>

      <a-form-item>
        <a-button
          type="primary"
          shape="round"
          block
          html-type="submit"
          class="login-form-button"
          @click="sellerregist"
        >
          SIGN UP
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
      userid: "",
      username: "",
      userpass: "",
      phone: "",
      emailid: "",
      emaildomain: "",
      idavail: "true",
    };
  },
  beforeCreate() {
    // Creates the form and adds to it component's "form" property.
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    checkId() {
      this.idavail = true;

      http.get("/restuser/checkid/" + this.userid).then(({ data }) => {
        if (data === "ok") {
          console.log("사용가능한 아이디");
          this.idavail = true;
        } else {
          this.idavail = false;
        }
      });
    },
    sellerregist() {
      let email = this.emailid + "@" + this.emaildomain;

      if (!this.username) {
        alert("이름을 입력하여 주세요");
      } else if (!this.idavail) {
        alert("아이디를 확인하여 주세요");
      } else if (!this.userpass) {
        alert("비밀번호를 입력하여 주세요");
      } else if (!email) {
        alert("이메일을 입력하여 주세요 !! ");
      } else if (!this.emailid || !this.emaildomain) {
        alert("이메일 형식을 확인하여 주세요 !! ");
      } else {
        http
          .post("/restuser/regist", null, {
            params: {
              userid: this.userid,
              username: this.username,
              userpass: this.userpass,
              email: email,
              phone: this.phone,
              level: 1,
            },
          })
          .then(function (response) {
            console.log(response);
            alert(response.data);
          });
        this.$router.push({ name: "Sign-In" });
      }
    },
  },
};
</script>

<style lang="scss"></style>
