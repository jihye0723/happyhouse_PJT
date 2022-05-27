<template>
  <div class="sellerpage">
    <a-row type="flex" :gutter="[24, 24]" justify="space-around" align="middle">
      <!-- Sign In Form Column -->
      <a-col
        :span="24"
        :md="8"
        :lg="{ span: 12, offset: 0 }"
        :xl="{ span: 6, offset: 0 }"
      >
        <h3 class="mb-10">매물 등록하기</h3>
        <p>등록을 원하시는 아파트를 찾아, 거래 정보를 입력하여 주세요.</p>

        <!-- Sign In Form -->
        <a-form id="components-form-demo-normal-login" :hideRequiredMark="true">
          <a-form-item
            class="font-semibold"
            label="[ 아파트정보 ] "
            :colon="false"
            ><a-row class="mb-2">
              <span class="text-danger" v-if="!inputapt"
                >등록 아파트 정보를 정확하게 입력하여 주세요.</span
              >
              <a-select
                v-model="sidocode"
                style="width: 100%"
                @change="sidoChange"
              >
                <a-select-option
                  v-for="(sido, index) in sidoList"
                  :key="index"
                  rowKey="index"
                  :value="sido.code"
                  >{{ sido.name }}
                </a-select-option>
              </a-select>
            </a-row>

            <a-row class="my-10">
              <a-select
                v-model="guguncode"
                style="width: 100%"
                @change="gugunChange"
              >
                <a-select-option
                  v-for="(gugun, index) in gugunList"
                  :key="index"
                  :value="gugun.code"
                  >{{ gugun.name }}
                </a-select-option>
              </a-select>
            </a-row>

            <a-row class="my-10">
              <a-select v-model="aptcode" style="width: 100%">
                <a-select-option
                  v-for="(apt, index) in aptlist"
                  :key="index"
                  :value="apt.aptCode"
                  >{{ apt.aptName }}
                </a-select-option>
              </a-select>
            </a-row>
            <span class="text-danger" v-if="!haveapt"
              >해당 지역은 매매가능한 아파트가 없습니다.</span
            >
          </a-form-item>

          <a-form-item
            class="font-semibold"
            label="[ 거래정보 ]"
            :colon="false"
          >
            <a-form-item>
              <a-input
                addon-before="매매가격"
                v-model="dealAmount"
                placeholder="(만)원"
              />
            </a-form-item>

            <a-form-item>
              <a-input
                addon-before="면적"
                v-model="area"
                placeholder="면적(㎡)"
              />
            </a-form-item>

            <!--type은 1로-->
            <a-form-item>
              <a-input
                addon-before="층"
                v-model="floor"
                placeholder="층(floor)"
              />
            </a-form-item>
          </a-form-item>
        </a-form>
        <a-col
          :span="24"
          style="display: flex; align-items: center; justify-content: flex-end"
        >
          <a-button
            class="seller-form-button"
            size="small"
            @click="sellerRegist"
            >등록</a-button
          >
        </a-col>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import DrawHouseTable from "../components/MapComponent/DrawHouseTable";
import http from "@/api/http";

export default {
  components: {
    DrawHouseTable,
  },
  data() {
    return {
      centerSetting: false,
      sidoList: [{ code: "default", name: "시/도 선택" }],
      sidocode: "default",
      gugunList: [{ code: "default", name: "구/군 선택" }],
      guguncode: "default",
      aptlist: [{ code: "default", name: "아파트 선택" }],
      infos: [],
      inputName: "",
      // filter

      aptcode: "아파트선택",
      inputapt: true,
      haveapt: true,
      data: [],
      dealAmount: "",
      area: "",
      floor: "",
    };
  }, // end of data
  created() {
    this.getSidoList();
  },

  clickRecord: function (record) {
    console.log("clickrecord : ", record);
    let position = new kakao.maps.LatLng(
      this.clickRecord.lat,
      this.clickRecord.lng
    );
    this.map.setCenter(position);
  },

  methods: {
    sellerRegist() {
      let aptList = {};
      this.inputapt = true;
      if (this.aptcode === "아파트선택") {
        this.inputapt = false;
      } else if (!this.dealAmount || !this.area || !this.floor) {
        alert("모든 정보를 정확하게 입력하여 주세요.");
      } else {
        console.log("아파트리스트", this.aptlist);
        Array.from(this.aptlist).forEach((element, index) => {
          if (element.aptCode === this.aptcode) {
            aptList = this.aptlist.splice(index, 1);
          }
        });
        let date = new Date();
        console.log(
          date.getFullYear() + " " + date.getMonth() + " " + date.getDay()
        );
        // console.log(aptList);
        // console.log(aptList[0].aptCode);
        //aptlist : 지금 팔려고 하는 apt aptCode
        let apt = aptList[0];

        http
          .post("/resthouse/sell", null, {
            params: {
              aptCode: apt.aptCode,
              area: this.area,
              dealAmount: this.dealAmount
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ","),
              dealDay: date.getDay(),
              dealMonth: date.getMonth(),
              dealYear: date.getFullYear(),
              floor: this.floor,
              type: 1,
              no: 1,
            },
          })
          .then(({ data }) => {
            console.log(data);
            alert("매물 등록이 완료되었습니다.");
            this.$router.push({ name: "Home" });
          });
      }
    },

    getSidoList() {
      console.log("get sido list");
      http.get("/region/sido").then(({ data }) => {
        data.forEach((element) => {
          this.sidoList.push(element);
        });
      });
    },
    sidoChange() {
      console.log("sido change");
      const code = this.sidocode;
      this.gugunList = [{ code: "default", name: "구/군 선택" }];

      http.get("/region/gugun/" + code).then(({ data }) => {
        data.forEach((element) => {
          this.gugunList.push(element);
        });
      });
    },
    gugunChange() {
      this.haveapt = true;
      console.log("gugun change");
      // 다 넘겨서 spring 에서 앞에 다섯글자만 잘라
      const code2 = this.guguncode;
      this.aptlist = [{ code: "default", name: "아파트 선택" }];
      let now = this;
      http.get("/region/apt/" + code2).then(({ data }) => {
        console.log(data);
        if (data === "") {
          console.log("아파트가 없어요");
          now.haveapt = false;
        }
        Array.from(data).forEach((element) => {
          this.aptlist.push(element);
        });
      });
    },
  },
}; // end of export
</script>

<style lang="scss" scoped>
.seller-form-button {
  border: 0ch;
  background-color: rgb(195, 211, 238);
}
</style>
