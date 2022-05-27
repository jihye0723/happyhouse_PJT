<template>
  <div class="mb-24">
    <a-row style="margin: 20px">
      <a-card
        :bordered="false"
        class="header-solid"
        :bodyStyle="{ padding: 0 }"
      >
        <a-descriptions bordered title="아파트 매매 상세정보">
          <a-descriptions-item label="매매번호">{{ no }}</a-descriptions-item>
          <a-descriptions-item label="아파트 명">{{
            aptName
          }}</a-descriptions-item>
          <a-descriptions-item label="거래 날짜">{{
            date
          }}</a-descriptions-item>
          <a-descriptions-item label="행정동">{{
            dongName
          }}</a-descriptions-item>
          <a-descriptions-item label="면적">{{ area }}</a-descriptions-item>
          <a-descriptions-item label="층">{{ floor }}</a-descriptions-item>
          <a-descriptions-item label="건축년도">{{
            buildYear
          }}</a-descriptions-item>
          <a-descriptions-item label="매매 가격">{{
            dealAmount | comma
          }}</a-descriptions-item>
        </a-descriptions>
      </a-card>
    </a-row>
    <a-row v-if="no != ''">
      <a-col :span="24" align="middle">
        <a-button type="primary" style="margin: 10px" @click="clickStarbucks"
          >스타벅스 매장 보러가기</a-button
        >

        <a-button
          v-if="userInfo && first"
          type="primary"
          style="margin: 10px"
          @click="interestplus"
          >관심등록</a-button
        >
        <p v-if="userInfo && !first">관심 등록한 매물입니다.</p>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import http from "@/api/http";
import { mapState } from "vuex";
const memberStore = "memberStore";

export default {
  name: "MuseVueAntDesignDashboardMainHouseDetailTable",

  props: {
    detailInfo: {},
    isFirst: {
      type: Boolean,
    },
  },
  data() {
    return {
      no: "",
      aptName: "",
      dealAmount: "",
      date: "",
      dongName: "",
      area: "",
      floor: "",
      buildYear: "",
      first: true,
    };
  },
  filters: {
    comma(val) {
      if (val == "") return "";
      return (
        (val + "0000").replace(",", "").replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
        "원"
      );
    },
  },

  watch: {
    detailInfo() {
      this.no = this.detailInfo.no;
      this.aptName = this.detailInfo.aptName;
      this.dealAmount = this.detailInfo.dealAmount;
      this.date =
        this.detailInfo.dealYear +
        "-" +
        this.detailInfo.dealMonth +
        "-" +
        this.detailInfo.dealDay;
      this.dongName = this.detailInfo.dongName;
      this.area = this.detailInfo.area;
      this.floor = this.detailInfo.floor;
      this.buildYear = this.detailInfo.buildYear;
    },
    isFirst() {
      this.first = this.$props.isFirst;
    },
  },
  mounted() {},
  computed: {
    ...mapState(memberStore, ["userInfo"]),
  },
  methods: {
    clickStarbucks() {
      console.log("clickStarbucks");
      this.$emit("showStarbucks", this.detailInfo);
    },
    interestplus() {
      if (!this.userInfo) {
        if (
          confirm(
            "로그인 후 관심등록이 가능합니다. 로그인페이지로 이동하시겠습니까 ?"
          )
        ) {
          this.$router.push({ name: "Sign-In" });
          return;
        }
      } else {
        let userid = this.userInfo.userid;
        let aptCode = this.detailInfo.aptCode;
        http
          .get("/interest/regist/" + userid + "/" + aptCode)
          .then(({ data }) => {
            console.log(data);
            alert("관심목록에 추가되었습니다.");
            this.$emit("registInterest", this.first);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
  },
};
</script>

<style lang="scss" scoped></style>
