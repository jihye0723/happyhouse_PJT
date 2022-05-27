<template>
  <div>
    <!-- Authors Table -->
    <a-row :gutter="24" type="flex" v-if="article.articleno > 0">
      <a-col :span="24" class="mb-24">
        <a-card
          :bordered="false"
          class="header-solid"
          :bodyStyle="{ padding: 0 }"
        >
          <template #title>
            <a-row type="flex" align="middle">
              <a-col :span="24" :md="12">
                <h5 class="font-semibold m-0">게시글 상세정보</h5>
              </a-col>
            </a-row>
          </template>

          <template>
            <a-descriptions title="" bordered style="margin: 20px">
              <a-descriptions-item label="글번호">
                {{ article.articleno }}
              </a-descriptions-item>
              <a-descriptions-item label="작성자 이름">
                {{ article.userid }}
              </a-descriptions-item>
              <a-descriptions-item label="작성날짜">
                {{ article.regtime }}
              </a-descriptions-item>
              <a-descriptions-item label="제목" :span="2">
                {{ article.subject }}
              </a-descriptions-item>
              <a-descriptions-item label="조회수">
                {{ article.hit }}
              </a-descriptions-item>
              <a-descriptions-item label="내용" :span="3">
                <span v-html="article.content"></span>
              </a-descriptions-item>
            </a-descriptions>
          </template>
          <a-row :gutter="24" v-if="userInfo && userInfo.level >= 2">
            <a-col :span="18"></a-col>
            <a-col :span="2" style="margin: 10px">
              <router-link
                :to="{
                  name: 'modifyArticle',
                  params: { articleno: article.articleno },
                }"
              >
                <a-button type="primary" block ghost @click="updatearticle">
                  수정
                </a-button>
              </router-link>
            </a-col>
            <a-col :span="2" style="margin: 10px">
              <a-button type="danger" block ghost @click="deleteArticle">
                삭제
              </a-button>
            </a-col>
          </a-row>
        </a-card>
      </a-col>
    </a-row>
    <a-row :gutter="24" type="flex">
      <!-- Authors Table Column -->
      <a-col :span="24" class="mb-24">
        <!-- Authors Table Card -->
        <CardAuthorTable
          :data="table1Data"
          :columns="table1Columns"
          @selectArticle="selectArticle"
        ></CardAuthorTable>
        <!-- / Authors Table Card -->
      </a-col>
      <!-- / Authors Table Column -->
    </a-row>
    <!-- / Authors Table -->
  </div>
</template>

<script>
// "Authors" table component.
import CardAuthorTable from "../components/Cards/CardAuthorTable";
import http from "@/api/http";
import { mapState } from "vuex";
const memberStore = "memberStore";

// "Authors" table list of columns and their properties.
const table1Columns = [
  {
    title: "글번호",
    dataIndex: "articleno",
    scopedSlots: { customRender: "articleno" },
  },
  {
    title: "작성자",
    dataIndex: "userid",
    scopedSlots: { customRender: "userid" },
  },
  {
    title: "제목",
    dataIndex: "subject",
    scopedSlots: { customRender: "subject" },
  },
  {
    title: "조회수",
    dataIndex: "hit",
    scopedSlots: { customRender: "hit" },
  },
  {
    title: "작성일",
    dataIndex: "regtime",
    scopedSlots: { customRender: "regtime" },
  },
];

export default {
  components: {
    CardAuthorTable,
  },
  data() {
    return {
      // Associating "Authors" table data with its corresponding property.
      table1Data: [],

      // Associating "Authors" table columns with its corresponding property.
      table1Columns: table1Columns,

      article: {
        articleno: 0,
      },
    };
  },
  computed: {
    ...mapState(memberStore, ["userInfo"], ["isLogin"]),
  },

  created() {
    this.updateArticles();
  },
  methods: {
    selectArticle(article) {
      console.log(article, typeof article);
      http.put("/board/hit/" + article.articleno).then(({ data }) => {
        if (data == "success") {
          console.log("hit increase");
          this.updateArticles();
          article.hit = article.hit + 1;
          this.article = article;
        }
      });
    },

    deleteArticle() {
      console.log("delete article ", this.article.articleno);
      http.delete(/board/ + this.article.articleno).then(({ data }) => {
        let msg = "삭제 처리시 문제가 발생했습니다.";
        if (data === "success") {
          msg = "삭제가 완료되었습니다.";
          this.deleteTableArticle();
        }
        alert(msg);
      });
    },
    deleteTableArticle() {
      this.table1Data.forEach((element, index) => {
        if (element.articleno == this.article.articleno) {
          this.table1Data.splice(index, 1);
          this.article = {};
        }
      });
    },
    updateArticles() {
      http.get("/board").then(({ data }) => {
        this.table1Data = data;
      });
    },
    updatearticle() {
      console.log(this.article.articleno);
    },
  },
};
</script>

<style lang="scss"></style>
