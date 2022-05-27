<template>
  <!-- Conversations Card -->

  <a-card
    :bordered="false"
    class="header-solid h-full card-profile-information"
    :bodyStyle="{ paddingTop: 0, paddingBottom: '16px' }"
    :headStyle="{ paddingRight: 0 }"
  >
    <template #title>
      <h6 class="font-semibold m-0 pl-10">나의 관심목록</h6>
    </template>

    <a-col :span="24" :md="10" class="mb-24">
      <a-table
        :columns="columns"
        :data-source="tableData"
        :pagination="true"
        :customRow="clickrow"
      >
        <template slot="aptname" slot-scope="aptname">
          <div class="table-avatar-info">
            <div class="avatar-info">
              <h6>{{ aptname }}</h6>
            </div>
          </div>
        </template>
      </a-table>
    </a-col>
    <a-col :span="24" :md="14" class="mb-24">
      <card-interest-detail
        @deleteInterest="deleteInterest"
        :data="aptdetail"
        :aptname="aptname"
        :sidodetail="sidodetail"
        :columns="columnsdetail"
      ></card-interest-detail>
    </a-col>
  </a-card>
  <!-- / Conversations Card -->
</template>

<script>
import http from "@/api/http";
import { mapState } from "vuex";
import CardInterestDetail from "./CardInterestDetail.vue";
const memberStore = "memberStore";
const columnsdetail = [
  {
    title: "거래가격(만원)",
    dataIndex: "dealAmount",
    scopedSlots: { customRender: "dealAmount" },
  },
  {
    title: "건축년도",
    dataIndex: "buildYear",
    scopedSlots: { customRender: "buildYear" },
  },
  {
    title: "면적",
    dataIndex: "area",
    scopedSlots: { customRender: "area" },
  },
  {
    title: "층",
    dataIndex: "floor",
    scopedSlots: { customRender: "floor" },
  },
];
export default {
  components: {
    CardInterestDetail,
  },
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
    },
  },
  data() {
    return {
      aptdetail: [],
      aptname: "",
      sidodetail: {},
      tableData: [],

      columnsdetail: columnsdetail,
    };
  },
  watch: {
    data: function (newData, oldData) {
      console.log("change");
      this.tableData = newData;
    },
  },
  created() {},
  computed: {
    ...mapState(memberStore, ["userInfo"]),
  },

  methods: {
    deleteInterest(aptname) {
      this.tableData.forEach((element, index) => {
        if (element.aptname == aptname) {
          this.tableData.splice(index, 1);
        }
      });
    },
    clickrow: function (record, index) {
      return {
        on: {
          click: () => {
            this.aptname = record.aptname;
            let aptname = this.aptname;
            http.get("/interest/list/" + aptname).then(({ data }) => {
              console.log(data);

              this.aptdetail = data;

              this.dongCode = data[0].dongCode;
              let dongCode = this.dongCode;
              console.log("동코드", dongCode);
              http.get("/interest/sidoName/" + dongCode).then(({ data }) => {
                this.sidodetail = data;
              });
            });
          },
        },
      };
    },
  },
};
</script>
