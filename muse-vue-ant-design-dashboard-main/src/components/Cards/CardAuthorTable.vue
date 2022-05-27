<template>
  <!-- Authors Table Card -->
  <a-card :bordered="false" class="header-solid" :bodyStyle="{ padding: 0 }">
    <template #title>
      <a-row type="flex" align="middle">
        <a-col :span="24" :md="12">
          <h5 class="font-semibold m-0">QnA 게시판</h5>
        </a-col>
        <a-col
          :span="24"
          :md="12"
          style="display: flex; align-items: center; justify-content: flex-end"
        >
          <a-radio-group v-model="authorsHeaderBtns" size="small">
            <a-radio-button value="no" @click="recentArticleSort"
              >최신글</a-radio-button
            >
            <a-radio-button value="hit" @click="hitDescendSort"
              >조회수</a-radio-button
            >
          </a-radio-group>
        </a-col>
      </a-row>
      <a-row v-if="userInfo && userInfo.level >= 2" :gutter="24" type="flex">
        <a-col
          :span="24"
          style="
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin-top: 20px;
          "
        >
          <router-link to="/table/regist">
            <a-button type="primary" ghost to="/table/regist"
              >게시글 작성</a-button
            >
          </router-link>
        </a-col>
      </a-row>
    </template>

    <a-table
      :columns="columns"
      :data-source="tableData"
      :pagination="true"
      :customRow="clickrow"
    >
      <template slot="articleno" slot-scope="articleno">
        <div class="author-info">
          <h6 class="m-0">{{ articleno }}</h6>
        </div>
      </template>

      <template slot="userid" slot-scope="userid">
        <div class="table-avatar-info">
          <!-- <a-avatar shape="square" :src="author.avatar" /> -->
          <div class="avatar-info">
            <h6>{{ userid }}</h6>
            <!-- <p>{{ userid }}</p> -->
          </div>
        </div>
      </template>
      <template slot="subject" slot-scope="subject">
        <div class="table-avatar-info">
          <div class="avatar-info">
            <h6>{{ subject }}</h6>
          </div>
        </div>
      </template>
      <template slot="hit" slot-scope="hit">
        <div class="table-avatar-info">
          <!-- <a-avatar shape="square" :src="author.avatar" /> -->
          <div class="avatar-info">
            <h6>{{ hit }}</h6>
            <!-- <p>{{ userid }}</p> -->
          </div>
        </div>
      </template>
      <template slot="regtime" slot-scope="regtime">
        <div class="table-avatar-info">
          <!-- <a-avatar shape="square" :src="author.avatar" /> -->
          <div class="avatar-info">
            <h6>{{ regtime }}</h6>
            <!-- <p>{{ userid }}</p> -->
          </div>
        </div>
      </template>
    </a-table>
  </a-card>
  <!-- / Authors Table Card -->
</template>
<script>
import { mapState } from "vuex";

const memberStore = "memberStore";
var article = {};
export default {
  props: {
    data: {
      type: Array,
      default: () => [],
    },
    columns: {
      type: Array,
      default: () => [],
    },
    article,
  },

  data() {
    return {
      // Active button for the "Authors" table's card header radio button group.
      authorsHeaderBtns: "no",
      tableData: [],
    };
  },
  computed: {
    ...mapState(memberStore, ["userInfo"]),
  },
  watch: {
    data: function (newData, oldData) {
      this.tableData = newData;
    },
  },
  created() {},
  methods: {
    clickrow: function (record, index) {
      return {
        on: {
          click: () => {
            this.$emit("selectArticle", record);
            console.log("click row", record, this.article);
          },
        },
      };
    },
    recentArticleSort() {
      console.log("recent articleno sort");
      this.tableData.sort((a, b) => b.articleno - a.articleno);
    },
    hitDescendSort() {
      console.log("hit descend sort");
      this.tableData.sort((a, b) => b.hit - a.hit);
    },
  },
};
</script>
