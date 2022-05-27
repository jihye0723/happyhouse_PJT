<template>
  <div>
    <!-- Sign Up Image And Headings -->
    <div
      class="sign-up-header"
      style="
        background-image: url(https://photo.coolenjoy.net/data/editor/2108/2117eaf4086e95f302f5fdcc3dd04c979011f6e2.jpg);
      "
    ></div>
    <!-- / Sign Up Image And Headings -->

    <!-- Sign Up Form -->
    <a-card
      :bordered="false"
      class="card-signup header-solid h-full"
      :bodyStyle="{ paddingTop: 0 }"
    >
      <div>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="아이디찾기">
            <find-user-id></find-user-id>
          </a-tab-pane>
          <a-tab-pane key="2" tab="비밀번호찾기" force-render>
            <find-user-pass></find-user-pass>
          </a-tab-pane>
        </a-tabs>
      </div>
      <p class="font-semibold text-muted text-center">
        Already have an account?
        <router-link to="/sign-in" class="font-bold text-dark"
          >Sign In</router-link
        >
      </p>
    </a-card>
    <!-- / Sign Up Form -->
  </div>
</template>

<script>
import FindUserId from "../components/user/findUserId.vue";
import FindUserPass from "../components/user/findUserPass.vue";
export default {
  components: {
    FindUserId,
    FindUserPass,
  },
  data() {
    return {};
  },
  beforeCreate() {
    // Creates the form and adds to it component's "form" property.
    this.form = this.$form.createForm(this, { name: "normal_login" });
  },
  methods: {
    // Handles input validation after submission.
    handleSubmit(e) {
      e.preventDefault();
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log("Received values of form: ", values);
        }
      });
    },
  },
};
</script>

<style lang="scss"></style>
