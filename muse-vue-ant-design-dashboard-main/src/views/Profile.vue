<template>
  <div v-if="userInfo">
    <!-- Header Background Image -->
    <div
      class="profile-nav-bg"
      style="background-image: url('images/home-decor-3.jpeg')"
    ></div>
    <!-- / Header Background Image -->

    <!-- User Profile Card -->
    <a-card
      :bordered="false"
      class="card-profile-head"
      :bodyStyle="{ padding: 0 }"
    >
      <template #title>
        <a-row type="flex" align="middle">
          <a-col :span="24" :md="12" class="col-info">
            <!-- <a-avatar :size="74" shape="square" src="images/face-1.jpg" /> -->
            <div class="avatar-info">
              <h4 class="font-semibold m-0">{{ userInfo.username }}</h4>
              <p>{{ userlevel }}</p>
            </div>
          </a-col>
          <a-col
            :span="24"
            :md="12"
            style="
              display: flex;
              align-items: center;
              justify-content: flex-end;
            "
          >
            <a-button @click="deleteUser">회원 탈퇴</a-button>
          </a-col>
        </a-row>
      </template>
    </a-card>
    <!-- User Profile Card -->

    <a-row type="flex" :gutter="24">
      <!-- Profile Information Column -->
      <a-col :span="24" :md="7" class="mb-24">
        <!--회원정보창-->
        <CardProfileInformation></CardProfileInformation>
      </a-col>

      <a-col :span="24" :md="17" class="mb-24">
        <!--관심목록-->
        <CardProfileInterest
          :data="tableData"
          :columns="columns"
        ></CardProfileInterest>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import http from "@/api/http";
import CardProfileInformation from "../components/Cards/CardProfileInformation";
import CardProfileInterest from "../components/Cards/CardProfileInterest";
import { mapState, mapMutations } from "vuex";
import { invokeArrayFns } from "@vue/shared";
const memberStore = "memberStore";
const columns = [
  {
    title: "",
    dataIndex: "aptname",
    scopedSlots: { customRender: "aptname" },
  },
];
export default {
  components: {
    CardProfileInformation,
    CardProfileInterest,
  },
  data() {
    return {
      // Active button for the "User Profile" card's radio button group.
      profileHeaderBtns: "overview",
      userlevel: "",
      tableData: [],
      columns: columns,
    };
  },
  // watch: {
  //   tableData: function (newData, oldData) {
  //     console.log(newData);
  //     oldData = newData;
  //     console.log("데이터 바꼈다");
  //   },
  // },
  created() {
    if (this.userInfo === null) this.$router.push({ name: "Sign-In" });
    if (this.userInfo.level === 1) this.userlevel = "중개사무소 ";
    if (this.userInfo.level === 0) this.userlevel = "일반사용자";
    if (this.userInfo.level === 2) this.userlevel = "관리자";
    let userid = this.userInfo.userid;
    http.get("/interest/" + userid).then(({ data }) => {
      data.forEach((element, index) => {
        this.tableData.push({ aptname: element, key: index });
      });
      // this.tableData = data;
      console.log(this.tableData);
    });
  },
  computed: {
    ...mapState(memberStore, ["userInfo"]),
  },
  methods: {
    ...mapMutations(memberStore, [
      "SET_IS_LOGIN",
      "SET_USER_INFO",
      "SET_LOGOUT",
    ]),
    deleteUser() {
      if (confirm("정말 회원 탈퇴를 하시겠습니까 ? ")) {
        // 탈퇴
        // user table 에서 지우고, interest 에 있는거 지우고 로그아웃 시키고 !!
        let userid = this.userInfo.userid;

        http.delete("/restuser/" + userid).then(({ data }) => {
          console.log(data);
          this.SET_IS_LOGIN(false);
          this.SET_USER_INFO(null);
          this.SET_LOGOUT();
          sessionStorage.removeItem("access-token");
          if (this.$route.path != "/") this.$router.push({ name: "Home" });
          console.log("bye");
        });
      }
    },
  },
};
</script>

<style lang="scss"></style>
