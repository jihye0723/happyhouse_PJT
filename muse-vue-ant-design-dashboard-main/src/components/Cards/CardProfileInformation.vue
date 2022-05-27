<template>
  <a-card
    :bordered="false"
    class="header-solid h-full card-profile-information"
    :bodyStyle="{ paddingTop: 0, paddingBottom: '16px' }"
    :headStyle="{ paddingRight: 0 }"
  >
    <template #title>
      <h6 class="font-semibold m-0 pl-10">회원정보</h6>
    </template>
    <a-button type="link" slot="extra" @click="showModal()">
      <svg
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          class="fill-muted"
          d="M13.5858 3.58579C14.3668 2.80474 15.6332 2.80474 16.4142 3.58579C17.1953 4.36683 17.1953 5.63316 16.4142 6.41421L15.6213 7.20711L12.7929 4.37868L13.5858 3.58579Z"
          fill="#111827"
        />
        <path
          class="fill-muted"
          d="M11.3787 5.79289L3 14.1716V17H5.82842L14.2071 8.62132L11.3787 5.79289Z"
          fill="#111827"
        />
      </svg>
    </a-button>
    <hr class="my-15" />

    <!-- 모달  -->
    <a-modal :visible="visible" title="회원정보 수정">
      <template #footer>
        <a-button key="back" @click="handleCancel">취소</a-button>
        <a-button key="modify" @click="modify">수정</a-button>
      </template>

      <a-form>
        <a-form-item>
          <a-input addon-before="이름" v-model="user.username" />
        </a-form-item>
        <a-form-item>
          <a-input addon-before="아이디" v-model="user.userid" disabled />
        </a-form-item>
        <a-form-item>
          <a-input addon-before="비밀번호" v-model="user.userpass" />
        </a-form-item>
        <a-form-item>
          <a-input addon-before="이메일" v-model="user.email" />
        </a-form-item>
        <a-form-item>
          <a-input addon-before="전화번호" v-model="user.phone" />
        </a-form-item>
      </a-form>
    </a-modal>

    <a-descriptions :column="1" class="text-center">
      <a-descriptions-item label="이름">
        {{ userInfo.username }}
      </a-descriptions-item>
      <a-descriptions-item label="아이디">
        {{ userInfo.userid }}
      </a-descriptions-item>
      <a-descriptions-item label="비밀번호">
        {{ userInfo.userpass }}
      </a-descriptions-item>
      <a-descriptions-item label="이메일">
        {{ userInfo.email }}
      </a-descriptions-item>
      <a-descriptions-item label="휴대폰">
        {{ userInfo.phone }}
      </a-descriptions-item>
      <a-descriptions-item label="Social">
        <a href="#" class="mx-5 px-5">
          <a-icon type="twitter" style="color: #3ea1ec" />
        </a>
        <a href="#" class="mx-5 px-5">
          <a-icon type="facebook" style="color: #344e86" />
        </a>
        <a href="#" class="mx-5 px-5">
          <a-icon type="instagram" style="color: #e1306c" />
        </a>
      </a-descriptions-item>
    </a-descriptions>
  </a-card>
</template>

<script>
import http from "@/api/http";
import { mapState, mapMutations } from "vuex";

const memberStore = "memberStore";
export default {
  data() {
    return {
      visible: false,
      user: {
        userid: "",
        username: "",
        userpass: "",
        email: "",
        phone: "",
      },
    };
  },

  computed: {
    ...mapState(memberStore, ["userInfo"]),
    ...mapMutations(memberStore, ["changeUser"]),
  },
  created() {
    this.user.username = this.userInfo.username;
    this.user.userpass = this.userInfo.userpass;
    this.user.userid = this.userInfo.userid;
    this.user.email = this.userInfo.email;
    this.user.phone = this.userInfo.phone;
  },
  methods: {
    showModal() {
      this.visible = true;
    },
    handleCancel() {
      this.visible = false;
    },
    modify() {
      // console.log(this.user);
      http
        .put("restuser/update", null, {
          params: {
            userid: this.user.userid,
            userpass: this.user.userpass,
            username: this.user.username,
            email: this.user.email,
            phone: this.user.phone,
          },
        })
        .then(({ data }) => {
          console.log("data", data);
          console.log("this user", this.user);
          this.$store.commit("memberStore/changeUser", this.user);
          //          this.changeUser(memberStore, this.user);

          // this.memberStore.commit("SET_USER_INFO", this.user);
        });
      this.handleCancel();
    },
  },
};
</script>
