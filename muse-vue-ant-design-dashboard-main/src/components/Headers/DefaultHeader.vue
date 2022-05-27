<template>
  <!-- Layout Header ( Navbar ) -->
  <a-layout-header>
    <div class="header-col header-brand">
      <router-link to="/"><h5>HappyHouse</h5> </router-link>

      <!-- Trigger Button For Navigation Menu For Small Screens -->
    </div>
  </a-layout-header>
  <!-- / Layout Header ( Navbar ) -->
</template>

<script>
export default {
  data() {
    return {
      // Collapse navigation value.
      // Binded model property for "Collapsible Navigation Menu" collapsed status .
      collapseNav: 0,
    };
  },
};
</script>

<style lang="scss" scoped>
.nav-link svg {
  margin-right: 5px;
  vertical-align: middle;
}
.nav-link span {
  vertical-align: middle;
}
.ant-menu-submenu-popup {
  width: 100%;
}
</style>
