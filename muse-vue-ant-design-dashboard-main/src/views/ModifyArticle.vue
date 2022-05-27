<template>
  <div>
    <a-card :bordered="false" class="header-solid" :bodyStyle="{ padding: 0 }">
      <template #title>
        <a-row type="flex" align="middle">
          <a-col :span="24" :md="12">
            <h5 class="font-semibold m-0">게시글 수정</h5>
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
          </a-col>
        </a-row>
      </template>
      <a-row :gutter="24" type="flex">
        <a-col :span="24">
          <template>
            <a-form :label-col="{ span: 2 }" :wrapper-col="{ span: 20 }">
              <a-form-item label="제목">
                <a-input
                  v-model="article.subject"
                  v-decorator="[
                    '제목',
                    {
                      rules: [
                        { required: true, message: '제목을 작성해주세요' },
                      ],
                    },
                  ]"
                />
              </a-form-item>
              <a-form-item label="내용">
                <a-textarea
                  v-model="article.content"
                  style="height: 300px"
                  v-decorator="[
                    '내용',
                    {
                      rules: [
                        { required: true, message: '내용을 작성해주세요' },
                      ],
                    },
                  ]"
                />
              </a-form-item>
            </a-form>
          </template>
        </a-col>
      </a-row>
      <a-row :gutter="24" type="flex" align="middle">
        <a-col
          :span="24"
          :md="12"
          style="
            display: flex;
            align-items: center;
            justify-content: flex-end;
            margin: 20px;
          "
        >
          <a-button type="primary" @click="isValid"> 수정 </a-button>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import http from "../api/http";

export default {
  name: "MuseVueAntDesignDashboardMainModifyArticle",

  props: {
    articleno: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      article: {
        articleno: 0,
        subject: "",
        content: "",
      },
    };
  },
  watch: {
    articleno: function (newval, oldval) {
      console.log("article no", newval, oldval);
    },
  },

  created() {
    http.get(`/board/${this.$route.params.articleno}`).then(({ data }) => {
      data.content = data.content.replaceAll("<br>", "\n");
      this.article = data;
    });
  },
  mounted() {},

  methods: {
    isValid() {
      if (this.article.subject == "") {
        alert("제목을 입력하세요");
      } else if (this.article.content == "") {
        alert("내용을 입력하세요");
      } else {
        this.handleSubmit();
      }
    },
    handleSubmit() {
      this.article.content = this.article.content.replaceAll("\n", "<br>");
      http
        .put("/board/" + this.article.articleno, this.article)
        .then(({ data }) => {
          console.log(data);
          this.$router.push("/Tables");
          alert("게시글이 수정되었습니다.");
        });
    },
  },
};
</script>

<style lang="scss" scoped></style>
