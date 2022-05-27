<template>
  <div>
    <h5 class="font-semibold text-center">비밀번호 찾기</h5>
    <p class="text-center">새로운 비밀번호로 변경하십시오.</p>
    <a-form
      id="components-form-demo-normal-login"
      :label-col="{ span: 5 }"
      class="login-form"
    >
      <a-modal :visible="visible" title="비밀번호 변경">
        <template #footer>
          <a-button key="cancel" @click="handleCancel">취소</a-button>
          <a-button key="ok" @click="changepass">확인</a-button>
        </template>

        <a-form>
          <a-form-item>
            <a-input addon-before="새 비밀번호" v-model="userpass" />
            <br />
            <span class="ml-30 text-danger" v-if="!passinput"
              >새로운 비밀번호를 입력하여 주세요.</span
            >
          </a-form-item>
          <a-form-item>
            <a-input addon-before="새 비밀번호 확인 " v-model="userpasscheck" />
            <span class="ml-30 text-danger" v-if="!newpassinput"
              >비밀번호가 일치하지 않습니다.</span
            >
          </a-form-item>
        </a-form>
      </a-modal>

      <a-form-item label="이름" class="my-30">
        <a-input style="width: 350px" placeholder="name" v-model="username">
        </a-input>
        <span class="ml-30 text-danger" v-if="!nameinput"
          >이름을 입력하여 주세요.</span
        >
      </a-form-item>
      <a-form-item label="아이디" class="my-30">
        <a-input style="width: 350px" placeholder="id" v-model="userid">
        </a-input>
        <span class="ml-30 text-danger" v-if="!idinput"
          >아이디를 입력하여 주세요.</span
        >
      </a-form-item>
      <a-form-item>
        <a-button
          type="primary"
          block
          html-type="submit"
          class="login-form-button"
          @click="findpw"
        >
          비밀번호찾기
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import http from "@/api/http";
import { mapState, mapMutations } from "vuex";
const memberStore = "memberStore";
export default {
  data() {
    return {
      passinput: true,
      newpassinput: true,
      visible: false,
      username: "",
      userid: "",
      userpass: "",
      userpasscheck: "",
      nameinput: true,
      idinput: true,
    };
  },
  beforeCreate() {
    // Creates the form and adds to it component's "form" property.
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  computed: {
    ...mapState(memberStore, ["userInfo"]),
    ...mapMutations(memberStore, ["changeUser"]),
  },
  methods: {
    changepass() {
      this.passinput = true;
      this.newpassinput = true;
      if (!this.userpass) {
        this.passinput = false;
      }
      if (this.userpass !== this.userpasscheck) {
        this.newpassinput = false;
      } else if (this.passinput && this.newpassinput) {
        // 비밀번호 변경 시켜야 해
        let now = this;
        http
          .put("/restuser/changepass", null, {
            params: {
              userid: this.userid,
              username: this.username,
              userpass: this.userpass,
            },
          })
          .then(({ data }) => {
            if (data === "success") {
              alert("새로운 비밀번호로 변경되었습니다.");
            } else {
              alert("비밀번호 변경에 실패하였습니다.");
            }
            now.visible = false;
          });
      }
    },
    handleCancel() {
      this.visible = false;
    },
    findpw() {
      this.nameinput = true;
      this.idinput = true;
      if (!this.username) {
        this.nameinput = false;
      }
      if (!this.userid) {
        this.idinput = false;
      }

      let userid = this.userid;
      let username = this.username;
      let isuser = this;
      http
        .get("/restuser/findpass/" + userid + "/" + username)
        .then(function (response) {
          if (response.data === "") {
            alert("회원정보가 존재하지 않습니다");
            return;
          } else {
            isuser.visible = true;
          }
        });
    },
  },
};
</script>

<style lang="scss"></style>
