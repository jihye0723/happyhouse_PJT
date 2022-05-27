<template>
  <div>
    <a-row type="flex" :gutter="24">
      <a-col :span="12">
        <a-card
          :bordered="false"
          class="header-solid"
          :bodyStyle="{ padding: 0 }"
        >
          <template #title>
            <a-row type="flex" align="middle">
              <a-col :span="24" :md="12">
                <h5 class="font-semibold m-0">매매 목록</h5>
              </a-col>
            </a-row>
          </template>
          <a-table
            :columns="columns"
            :data-source="data"
            :pagination="true"
            :customRow="clickrow"
          >
            <template slot="no" slot-scope="no">
              <div class="author-info">
                <h6 class="m-0">{{ no }}</h6>
              </div>
            </template>

            <template slot="aptName" slot-scope="aptName">
              <div class="table-avatar-info">
                <!-- <a-avatar shape="square" :src="author.avatar" /> -->
                <div class="avatar-info">
                  <a>
                    <h6>{{ aptName }}</h6>
                  </a>
                  <!-- <p>{{ userid }}</p> -->
                </div>
              </div>
            </template>
            <template slot="dealAmount" slot-scope="dealAmount">
              <div class="table-avatar-info">
                <!-- <a-avatar shape="square" :src="author.avatar" /> -->
                <div class="avatar-info">
                  <h6>{{ dealAmount }}</h6>
                  <!-- <p>{{ userid }}</p> -->
                </div>
              </div>
            </template>
          </a-table>
        </a-card>
      </a-col>
      <a-col :span="12">
        <house-detail-table
          :detailInfo="detailInfo"
          @clickRecord="clickRecord"
          @showStarbucks="showStarbucks"
          :isFirst="isFirst"
          @registInterest="registInterest"
        ></house-detail-table>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import http from "@/api/http";
import HouseDetailTable from "./HouseDetailTable.vue";
import { mapState } from "vuex";
const memberStore = "memberStore";

var details = {};
export default {
  name: "MuseVueAntDesignDashboardMainDrawHouseTable",
  components: { HouseDetailTable },
  props: ["data"],
  data() {
    return {
      isFirst: true,
      columns: [
        {
          title: "거래번호",
          dataIndex: "no",
          scopedSlots: { customRender: "no" },
        },
        {
          title: "아파트 이름",
          dataIndex: "aptName",
          scopedSlots: { customRender: "aptName" },
        },
        {
          title: "매매가격",
          dataIndex: "dealAmount",
          scopedSlots: { customRender: "dealAmount" },
        },
      ],
      detailInfo: {
        no: "-",
        aptName: "-",
      },
    };
  },
  computed: {
    ...mapState(memberStore, ["userInfo"]),
  },

  created() {},
  mounted() {
    console.log("table items ", this.$props.data);
  },

  methods: {
    // <!--아파트 하나 행 선택 클릭-->
    clickrow: function (record, index) {
      return {
        on: {
          click: () => {
            details = record;
            console.log(details);
            this.detailInfo = record;
            this.$emit("clickRecord", record);
            console.log("detail info", this.detailInfo);
            if (this.userInfo != null) {
              console.log(
                "관심등록한적있는지 ? " +
                  this.userInfo.userid +
                  " " +
                  this.detailInfo.aptCode
              );
              let userid = this.userInfo.userid;
              let aptCode = this.detailInfo.aptCode;
              http
                .get("/interest/already/" + userid + "/" + aptCode)
                .then(({ data }) => {
                  if (data === 0) {
                    console.log("아직 등록한 적 없는 매물 ");
                    this.isFirst = true;
                  } else {
                    console.log("등록한 적 있는 관심매물");
                    this.isFirst = false;
                  }
                });
            }
          },
        },
      };
    },
    registInterest: function (first) {
      console.log("regist interest", first);
      let userid = this.userInfo.userid;
      let aptCode = this.detailInfo.aptCode;
      http
        .get("/interest/already/" + userid + "/" + aptCode)
        .then(({ data }) => {
          if (data === 0) {
            console.log("아직 등록한 적 없는 매물 ");
            this.isFirst = true;
          } else {
            console.log("등록한 적 있는 관심매물");
            this.isFirst = false;
          }
        });
    },
    clickRecord(record) {
      this.$emit("clickRecord", record);
    },
    showStarbucks(info) {
      this.$emit("showStarbucks", info);
    },
  },
};
</script>

<style lang="scss" scoped></style>
