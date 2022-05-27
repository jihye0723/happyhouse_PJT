<template>
  <div>
    <a-card :bordered="false" class="header-solid" :bodyStyle="{ padding: 0 }">
      <template #title>
        <a-row type="flex" align="middle">
          <a-col :span="24" :md="12">
            <h5 class="font-semibold m-0">FAQ 작성</h5>
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
            <a-form
              :form="form"
              :label-col="{ span: 2 }"
              :wrapper-col="{ span: 20 }"
            >
              <a-form-item label="제목">
                <a-input
                  v-model="subject"
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
                  v-model="content"
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
          <a-button type="primary" @click="isValid"> Submit </a-button>
        </a-col>
      </a-row>
    </a-card>
  </div>
</template>

<script>
import http from "@/api/http";
import { mapState } from "vuex";
const memberStore = "memberStore";

export default {
  name: "MuseVueAntDesignDashboardMainRegistArticle",

  data() {
    return {
      subject: "",
      content: "",

      formLayout: "horizontal",
      form: this.$form.createForm(this, { name: "coordinated" }),
    };
  },
  computed: {
    ...mapState(memberStore, ["userInfo"], ["isLogin"]),
  },

  methods: {
    isValid() {
      if (this.subject == "") {
        alert("제목을 입력하세요");
      } else if (this.content == "") {
        alert("내용을 입력하세요");
      } else {
        this.handleSubmit();
      }
    },
    handleSubmit() {
      const params = {
        userid: this.userInfo.userid,
        subject: this.subject,
        content: this.content.replaceAll("\n", "<br>"),
      };
      http.post("/board", params).then(({ data }) => {
        console.log(data);
        alert("게시글이 등록되었습니다.");
        this.$router.push("/Tables");
      });
    },
  },
};
</script>

<style lang="scss" scoped></style>
