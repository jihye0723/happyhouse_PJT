import jwt_decode from "jwt-decode";
import http from "@/api/http.js";

const memberStore = {
  namespaced: true,

  state: {
    isLogin: false,
    isLoginError: false,
    userInfo: null,
  },
  getters: {},
  mutations: {
    SET_IS_LOGIN: (state, isLogin) => {
      state.isLogin = isLogin;
    },
    SET_LOGOUT: (state) => {
      state.isLogin = false;
      state.userInfo = null;
    },
    SET_USER_INFO: (state, userInfo) => {
      state.userInfo = userInfo;
      state.isLogin = true;
      console.log("state ", userInfo);
    },
    changeUser: (state, userInfo) => {
      state.userInfo = userInfo;
      console.log("changeUser", state.userInfo);
    },
  },
  actions: {
    async userConfirm({ commit }, user) {
      // console.log("로그인 통신 : " + user.userid + user.userpass);
      await http
        .post("/restuser/login", null, {
          params: {
            userid: user.userid,
            userpass: user.userpass,
          },
        })
        .then(function (response) {
          console.log(response);
          if (response.data.message === "success") {
            let token = response.data["access-token"];
            commit("SET_IS_LOGIN", true);
            alert(response.data.username + " 님 환영합니다.");
            sessionStorage.setItem("access-token", token);
          } else {
            alert("아이디와 비밀번호를 확인하여 주세요!! ");
          }
        });
    },

    getUserInfo({ commit }, token) {
      let decode_token = jwt_decode(token);
      // 해당 토큰을 요청 헤더에 담아서 요청
      http.defaults.headers["access-token"] =
        sessionStorage.getItem("access-token");
      http
        .get(`restuser/info/${decode_token.userid}`)
        .then(function (response) {
          if (response.data.message === "success") {
            console.log("해당 토큰에 대한 사용자 있음 성공 ! ");
            //console.log(response.data.userInfo);
            commit("SET_USER_INFO", response.data.userInfo);
          } else {
            console.log("사용자 정보 없음!!");
          }
        })
        .catch(function (error) {
          console.log(error);
        });
    },
  },
};

export default memberStore;
