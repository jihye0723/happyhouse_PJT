<template>
  <div>
    <!-- Sign Up Image And Headings -->
    <div
      class="sign-up-header"
      style="
        background-image: url(https://photo.coolenjoy.net/data/editor/2108/2117eaf4086e95f302f5fdcc3dd04c979011f6e2.jpg);
      "
    >
      <div class="content">
        <h1 class="mb-5">Sign Up</h1>
      </div>
    </div>
    <!-- / Sign Up Image And Headings -->

    <!-- Sign Up Form -->
    <a-card
      :bordered="false"
      class="card-signup header-solid h-full"
      :bodyStyle="{ paddingTop: 0 }"
    >
      <div>
        <a-tabs default-active-key="1">
          <a-tab-pane key="1" tab="일반사용자">
            <user-sign-up-vue></user-sign-up-vue>
          </a-tab-pane>
          <a-tab-pane key="2" tab="중개사무소" force-render>
            <seller-sign-up-vue></seller-sign-up-vue>
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
import UserSignUpVue from "../components/user/User-SignUp.vue";
import SellerSignUpVue from "../components/user/Seller-SignUp.vue";
export default {
  components: {
    UserSignUpVue,
    SellerSignUpVue,
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

<style lang="scss">
.login-form-button {
  border: 0ch;
  background-color: rgb(89, 96, 108);
  font-size: medium;
}
</style>
