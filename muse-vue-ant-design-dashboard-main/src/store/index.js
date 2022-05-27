import Vue from "vue";
import Vuex from "vuex";
import createPersistedState from "vuex-persistedstate";
import http from "@/api/http";
import memberStore from "@/store/modules/memberStore.js";
Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    memberStore,
  },
  state: {
    userid: "",
    username: "",
    level: "",
    house: null,
    houseinfo: null,
    markers: [],
    apartCodes: [],
    aptcode: "",
    starbucks: [], // name, address
    setStarbucks: false,
  },
  getters: {},
  ////////////////////////////////// mutations /////////////////////////////////////

  mutations: {
    login(state, user) {
      state.userid = user.userid;
      state.username = user.username;
      state.level = user.level;
    },
    // update(state, newuser) {
    //   state.userid = newuser.userid;
    //   state.username = newuser.username;
    // },

    FORMAT_DATA(state) {
      state.markers = [];
      state.apartCodes = [];
    },
    SHOW_APART_DETAIL(state, houseDealInfo) {
      console.log("Show aprart detail");
      state.house = houseDealInfo;
      http
        .get("/resthouse/houseInfoByApartCode/" + houseDealInfo.aptCode)
        .then(({ data }) => {
          console.log(data);
          state.houseinfo = data;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    // SETTING_HOUSE_INFO(state, houseinfo) {
    //   console.log("Here 3");
    // },
    UPDATE_APTCODE(state, aptcodes) {
      state.apartCodes = aptcodes;
      let markerlist = [];
      let index = aptcodes.length;
      aptcodes.forEach((element) => {
        http
          .get("resthouse/houseInfoByApartCode/" + element)
          .then(({ data }) => {
            let marker = {
              name: data.aptName,
              code: data.aptCode,
              lat: data.lat,
              lng: data.lng,
            };
            markerlist.push(marker);
            index = index - 1;
            console.log(index);
          })
          .catch((error) => {
            console.log(error);
          });
      });
      console.log("INDEX : ", index);
      state.markers = markerlist;
    },
    SET_MAP_CENTER(state, aptcode) {
      state.aptcode = aptcode;
      console.log("set map center", aptcode);
    },
    SET_STARBUCKS(state, dongCode) {
      http
        .get("/starbucks/search/" + dongCode)
        .then(({ data }) => {
          let starbucks = [];
          data.forEach((element) => {
            starbucks.push(element);
          });
          state.starbucks = starbucks;
          console.log(state.starbucks);
        })
        .catch((error) => {
          console.log(error);
        });
      state.setStarbucks = true;
    },
  },
  ////////////////////////////////// actions /////////////////////////////////////
  actions: {
    initSetting({ commit }) {
      commit("FORMAT_DATA");
    },
    showApartDetail({ commit }, houseitem) {
      http
        .get("/resthouse/dealInfoByDealNo/" + houseitem.no)
        .then(({ data }) => {
          commit("SHOW_APART_DETAIL", data);
          commit("SET_MAP_CENTER", data.aptCode);
          console.log("detail apart code : " + data.aptCode);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    // loginvv(context, user) {
    //   console.log(user.userid + " " + user.userpass);
    //   http
    //     .post("/restuser/login", null, {
    //       params: {
    //         userid: user.userid,
    //         userpass: user.userpass,
    //       },
    //     })
    //     .then(function (response) {
    //       if (response.status == 204) {
    //         alert("로그인 실패 ");
    //       }
    //       const user = {
    //         userid: response.data.userid,
    //         username: response.data.username,
    //         level: response.data.level,
    //       };
    //       console.log(user);
    //       context.commit("login", user);
    //       // sessionStorage.setItem("userinfo", JSON.stringify(user));
    //     })
    //     .then(() => router.push({ name: "home" }))
    //     .catch((error) => {
    //       console.log(error + "로그인 실패입니다.");
    //     });
    // },
    async updateAptcodes({ commit }, payload) {
      commit("FORMAT_DATA");
      await commit("UPDATE_APTCODE", payload);
    },

    async clickStarbucks({ commit }, dongCode) {
      console.log("Vuex click Startbucks", dongCode);
      await commit("SET_STARBUCKS", dongCode);
    },
    formatData({ commit }) {
      commit("FORMAT_DATA");
    },
  },
  plugins: [
    createPersistedState({
      // 브라우저 종료시 제거하기 위해 localStorage가 아닌 sessionStorage로 변경. (default: localStorage)
      storage: sessionStorage,
    }),
  ],
});
